import json
import re
from pathlib import Path

DATABASE_PATH = Path(__file__).parent.parent / "database" / "skills.json"

with open(DATABASE_PATH, "r", encoding="utf-8") as file:
    SKILL_DATABASE = json.load(file)


def extract_skills(text: str):
    """
    Extract categorized skills from resume with anti-keyword-stuffing guard.
    Prevents adversarial keyword flooding by checking keyword density.
    """
    if not text:
        return {}

    total_words = max(1, len(text.split()))
    extracted = {}

    for category, skills in SKILL_DATABASE.items():
        found = []

        for skill in skills:
            pattern = r"\b" + re.escape(skill) + r"\b"
            matches = re.findall(pattern, text, re.IGNORECASE)
            match_count = len(matches)

            if match_count > 0:
                # Anti-Stuffing Guard: A single keyword cannot naturally appear > 4 times and exceed 12% in full resumes
                density = match_count / total_words
                if total_words > 40 and match_count > 3 and density > 0.12:
                    print(f"Warning: Keyword stuffing detected for '{skill}' ({match_count} times, {density:.1%}). Filtered.")
                else:
                    found.append(skill)

        if found:
            extracted[category] = sorted(list(set(found)))

    return extracted