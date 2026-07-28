import json
import re
from pathlib import Path

DATABASE_PATH = Path(__file__).parent.parent / "database" / "skills.json"

with open(DATABASE_PATH, "r", encoding="utf-8") as file:
    SKILL_DATABASE = json.load(file)


def extract_skills(text):
    """
    Extract categorized skills from resume.
    """

    extracted = {}

    for category, skills in SKILL_DATABASE.items():

        found = []

        for skill in skills:

            pattern = r"\b" + re.escape(skill) + r"\b"

            if re.search(pattern, text, re.IGNORECASE):

                found.append(skill)

        if found:
            extracted[category] = sorted(list(set(found)))

    return extracted