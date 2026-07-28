import json
from pathlib import Path


SKILLS_FILE = Path(__file__).parent / "skills.json"


def load_skills():
    """
    Load categorized skills from skills.json.

    Returns:
        {
            "Programming Languages": [...],
            "Frontend": [...],
            ...
        }
    """

    with open(SKILLS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_all_skills():
    """
    Returns a flat list of all skills.

    Example:
    [
        "Python",
        "Java",
        "React",
        ...
    ]
    """

    skills = load_skills()

    all_skills = []

    for category in skills.values():
        all_skills.extend(category)

    return sorted(set(all_skills))