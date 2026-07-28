import os
import json
import traceback

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.ai.prompt_builder import build_ai_review_prompt

load_dotenv()


def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        return genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(
                api_version="v1"
            )
        )
    except Exception as e:
        print(f"Error initializing Gemini Client: {e}")
        return None


def generate_ai_review(resume: dict, job_description: dict):
    prompt = build_ai_review_prompt(resume, job_description)
    client = get_gemini_client()

    if not client:
        print("GEMINI_API_KEY not found or client failed to initialize. Using structural fallback review.")
        return generate_structural_fallback(resume, job_description)

    models_to_try = [
        "models/gemini-2.5-flash",
        "gemini-2.5-flash",
        "models/gemini-2.0-flash",
        "models/gemini-1.5-flash",
        "gemini-1.5-flash"
    ]

    for model_name in models_to_try:
        try:
            print(f"Attempting Gemini generation with model: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )

            text = ""
            if getattr(response, "text", None):
                text = response.text
            elif response.candidates and response.candidates[0].content.parts:
                text = response.candidates[0].content.parts[0].text

            text = text.strip()

            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                text = "\n".join(lines).strip()

            parsed = json.loads(text)
            print(f"Successfully generated AI review with model {model_name}")
            return parsed

        except Exception as e:
            print(f"Model {model_name} failed: {e}")
            continue

    return generate_structural_fallback(resume, job_description)


def enhance_bullet_point(bullet_point: str, target_role: str = "Software Engineer") -> list:
    """
    Generate 3 enhanced STAR-method bullet points with quantifiable metrics.
    """
    client = get_gemini_client()
    prompt = f"""You are an elite career coach. Take this original resume bullet point:
"{bullet_point}"

Target Role: {target_role}

Rewrite it into 3 distinct, high-impact STAR method bullet points. Each bullet MUST start with a strong action verb, include specific technology keywords, and contain quantifiable metrics (percentages, speed, efficiency, user scale).

Return JSON array of 3 strings ONLY:
[
  "Enhanced bullet option 1...",
  "Enhanced bullet option 2...",
  "Enhanced bullet option 3..."
]
"""

    if client:
        try:
            response = client.models.generate_content(
                model="models/gemini-2.5-flash",
                contents=prompt,
            )
            text = response.text.strip() if getattr(response, "text", None) else ""
            if text.startswith("```"):
                lines = text.split("\n")[1:-1]
                text = "\n".join(lines).strip()
            res = json.loads(text)
            if isinstance(res, list) and len(res) > 0:
                return res
        except Exception as e:
            print("Gemini bullet enhancement fallback:", e)

    # Fallback response
    bp = bullet_point.strip()
    return [
        f"Engineered and deployed scalable solutions for {bp.lower()}, reducing processing latency by 35% across core workflows.",
        f"Spearheaded key initiatives involving {bp.lower()}, boosting team delivery efficiency and user satisfaction by 25%.",
        f"Designed and optimized robust systems for {bp.lower()}, resulting in a 40% improvement in operational throughput."
    ]


def generate_cover_letter_text(resume_name: str, job_description: str) -> str:
    """
    Generate a 3-paragraph tailored cover letter.
    """
    client = get_gemini_client()
    prompt = f"""Write a compelling, professional 3-paragraph Cover Letter for a candidate applying for the job described below:

Candidate Resume Context: {resume_name}
Target Job Description: {job_description}

Paragraph 1: Enthusiastic introduction and expression of interest in the role.
Paragraph 2: Highlight core technical strengths, relevant achievements, and problem-solving capability aligned with the JD.
Paragraph 3: Confident closing statement, call to action for an interview, and professional sign-off.

Do NOT include placeholder variables like [Your Name] in brackets—use "Applicant" or clean formatting. Return formatted plain text with paragraph breaks.
"""

    if client:
        try:
            response = client.models.generate_content(
                model="models/gemini-2.5-flash",
                contents=prompt,
            )
            text = response.text.strip() if getattr(response, "text", None) else ""
            if text:
                return text
        except Exception as e:
            print("Gemini cover letter fallback:", e)

    # Fallback cover letter text
    return f"""Dear Hiring Team,

I am writing to express my strong interest in the opportunity described in your job posting. With a solid foundation in software development, problem-solving, and continuous learning, I am eager to contribute my skills to your team's ongoing success.

Throughout my technical experience, I have developed expertise in building scalable applications, collaborating across functional teams, and solving complex technical challenges. My background directly aligns with your requirements for key technologies and software engineering best practices. I take pride in writing clean, well-tested code and delivering measurable impact.

I would welcome the opportunity to discuss how my qualifications, technical skills, and enthusiasm make me a strong fit for your team. Thank you for your time and consideration.

Sincerely,
Applicant"""


def generate_structural_fallback(resume: dict, jd: dict) -> dict:
    resume_skills = set()
    skills_data = resume.get("skills", {})
    if isinstance(skills_data, dict):
        for category, s_list in skills_data.items():
            if isinstance(s_list, list):
                for s in s_list:
                    resume_skills.add(str(s).strip().lower())
    elif isinstance(skills_data, list):
        for s in skills_data:
            resume_skills.add(str(s).strip().lower())

    jd_skills = set()
    jd_skills_data = jd.get("skills", {}) if isinstance(jd, dict) else {}
    if isinstance(jd_skills_data, dict):
        for category, s_list in jd_skills_data.items():
            if isinstance(s_list, list):
                for s in s_list:
                    jd_skills.add(str(s).strip().lower())

    matched = resume_skills.intersection(jd_skills)
    missing = jd_skills - resume_skills
    total = len(jd_skills) or 1
    match_pct = min(100, int((len(matched) / total) * 100))

    rating = "Strong Fit" if match_pct >= 80 else ("Moderate Fit" if match_pct >= 50 else "Needs Improvement")
    recommendation = "Hire" if match_pct >= 75 else ("Consider" if match_pct >= 50 else "Reject")

    return {
        "overall_rating": rating,
        "hire_recommendation": recommendation,
        "confidence": 85,
        "experience_assessment": "Evaluated based on extracted resume history and matching skills.",
        "overall_feedback": f"Resume matches {len(matched)} key skills out of {len(jd_skills)} required skills.",
        "strengths": [f"Demonstrated proficiency in {s.title()}" for s in list(matched)[:4]] or ["Clear resume section structure"],
        "weaknesses": [f"Missing required skill: {s.title()}" for s in list(missing)[:3]] or ["Could add quantifiable metrics to project descriptions"],
        "missing_skills": [s.title() for s in list(missing)[:5]],
        "resume_improvements": [
            "Quantify key achievements with measurable impact metrics (e.g., increased performance by 25%).",
            "Tailor bullet points to emphasize required job description keywords.",
            "Add a concise professional summary highlighting your key qualifications."
        ],
        "recommended_projects": [
            "Full-Stack Web Application with modern React/Python stack",
            "Cloud Infrastructure Automation & CI/CD Pipeline project",
            "Data Analytics Dashboard with real-time reporting"
        ],
        "interview_questions": [
            "Can you walk us through the architecture of a major project on your resume?",
            "How do you approach debugging performance bottlenecks in production applications?",
            "Explain how you handle missing skills or technologies when starting a new project."
        ]
    }