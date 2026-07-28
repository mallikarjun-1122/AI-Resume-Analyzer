from app.parser.text_cleaner import clean_text
from app.parser.section_detector import detect_sections

from app.extractors.personal_info import extract_personal_info
from app.extractors.skills import extract_skills
from app.extractors.education import extract_education
from app.extractors.experience import extract_experience
from app.extractors.projects import extract_projects
from app.extractors.certification import extract_certifications

from app.services.skill_merger import merge_resume_skills


def parse_resume(text: str):
    """
    Main Resume Parsing Pipeline
    """

    # -----------------------------
    # Step 1: Clean Text
    # -----------------------------
    cleaned_text = clean_text(text)

    # -----------------------------
    # Step 2: Detect Sections
    # -----------------------------
    sections = detect_sections(cleaned_text)

    # -----------------------------
    # Debug: Print detected sections
    # -----------------------------
    print("\n" + "=" * 60)
    print("DETECTED RESUME SECTIONS")
    print("=" * 60)

    for section, content in sections.items():
        print(f"\n[{section.upper()}]")
        print("-" * 40)

        if content:
            preview = content[:300]
            print(preview)

            if len(content) > 300:
                print("...")
        else:
            print("No content found")

    print("=" * 60)

    # -----------------------------
    # Step 3: Extract Personal Info
    # -----------------------------
    personal_info = extract_personal_info(cleaned_text)

    # -----------------------------
    # Step 4: Extract Skills
    # -----------------------------
    skills = extract_skills(
        sections.get("skills", "")
    )

    # -----------------------------
    # Step 5: Extract Education
    # -----------------------------
    education = extract_education(
        sections.get("education", "")
    )

    # -----------------------------
    # Step 6: Extract Experience
    # -----------------------------
    experience = extract_experience(
        sections.get("experience", "")
    )

    # -----------------------------
    # Step 7: Extract Projects
    # -----------------------------
    projects = extract_projects(
        sections.get("projects", "")
    )

    # -----------------------------
    # Step 8: Extract Certifications
    # -----------------------------
    certifications = extract_certifications(
        sections.get("certifications", "")
    )

    # -----------------------------
    # Step 9: Build Resume Object
    # -----------------------------
    resume = {
        "personal_info": personal_info,
        "summary": sections.get("summary", ""),
        "skills": skills,
        "education": education,
        "experience": experience,
        "projects": projects,
        "certifications": certifications,
    }

    # -----------------------------
    # Step 10: Merge Skills from
    # Skills + Experience + Projects
    # -----------------------------
    resume["skills"] = merge_resume_skills(resume)

    # -----------------------------
    # Return Final Resume
    # -----------------------------
    return resume