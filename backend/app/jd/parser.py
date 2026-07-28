import re

from app.extractors.skills import extract_skills


def clean_jd(text: str):
    """
    Clean Job Description text.
    """

    text = re.sub(r"\r", "", text)
    text = re.sub(r"\n{2,}", "\n", text)

    return text.strip()


def parse_job_description(text: str):
    """
    Parse Job Description into structured JSON.
    """

    cleaned = clean_jd(text)

    skills = extract_skills(cleaned)

    return {
        "raw_text": cleaned,
        "skills": skills
    }