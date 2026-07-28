import re
from app.database.skill_loader import get_all_skills

TECHNOLOGY_KEYWORDS = get_all_skills()


# -------------------------------------------------------
# Date Patterns
# -------------------------------------------------------

DATE_PATTERNS = [
    r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[–-]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}",
    r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[–-]\s*Present",
    r"\d{4}\s*[–-]\s*(\d{4}|Present)",
]


# -------------------------------------------------------
# Job Keywords
# -------------------------------------------------------

JOB_KEYWORDS = [
    "intern",
    "developer",
    "engineer",
    "analyst",
    "scientist",
    "consultant",
    "manager",
    "lead",
    "associate",
]


# -------------------------------------------------------
# Helpers
# -------------------------------------------------------

def extract_duration(text):

    for pattern in DATE_PATTERNS:

        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            return match.group()

    return None


def looks_like_job_title(text):

    lower = text.lower()

    return any(keyword in lower for keyword in JOB_KEYWORDS)


def is_bullet(text):

    return text.startswith(("•", "-", "*", "●"))


def extract_technologies(text):

    technologies = []

    for tech in TECHNOLOGY_KEYWORDS:

        if re.search(
            r"\b" + re.escape(tech) + r"\b",
            text,
            re.IGNORECASE,
        ):
            technologies.append(tech)

    return sorted(set(technologies))


# -------------------------------------------------------
# Main Extractor
# -------------------------------------------------------

def extract_experience(text):
    """
    Returns

    [
        {
            company,
            job_title,
            duration,
            technologies,
            description
        }
    ]
    """

    experiences = []

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    current = None

    i = 0

    while i < len(lines):

        line = lines[i]

        duration = extract_duration(line)

        # ---------------------------------------------------
        # Example:
        #
        # Data Science Intern      Jul 2024 – Aug 2024
        # ---------------------------------------------------

        if duration and looks_like_job_title(line):

            if current:
                experiences.append(current)

            job_title = line.replace(duration, "").strip(" -|")

            company = ""

            # Company normally next line

            if i + 1 < len(lines):

                next_line = lines[i + 1]

                if not is_bullet(next_line):

                    company = next_line

                    i += 1

            current = {
                "company": company,
                "job_title": job_title,
                "duration": duration,
                "technologies": [],
                "description": [],
            }

            i += 1
            continue

        # ---------------------------------------------------
        # Bullet
        # ---------------------------------------------------

        if current and is_bullet(line):

            bullet = line.lstrip("•-*● ").strip()

            current["description"].append(bullet)

            technologies = extract_technologies(bullet)

            for tech in technologies:

                if tech not in current["technologies"]:
                    current["technologies"].append(tech)

        i += 1

    if current:
        experiences.append(current)

    return experiences