import os
import json

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
        return ai_review_unavailable("Gemini is not configured or could not be initialized.")

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

    return ai_review_unavailable("Gemini did not return a valid review.")


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
            print("Gemini bullet enhancement failed:", e)

    raise RuntimeError("Gemini bullet enhancement is unavailable. No replacement text was generated.")


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
            print("Gemini cover letter generation failed:", e)

    raise RuntimeError("Gemini cover letter generation is unavailable. No replacement letter was generated.")


def ai_review_unavailable(reason: str) -> dict:
    """Describe an unavailable optional review without inventing candidate feedback."""
    return {
        "available": False,
        "status": "unavailable",
        "message": reason,
    }
