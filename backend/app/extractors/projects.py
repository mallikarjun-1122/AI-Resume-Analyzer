import re
from app.database.skill_loader import get_all_skills


TECHNOLOGY_KEYWORDS = get_all_skills()

END_SECTION_HEADERS = {
    "coding profiles",
    "coding profile",
    "profiles",
    "certifications",
    "certification",
    "achievements",
    "awards",
    "education",
    "experience",
    "skills",
    "technical skills",
    "languages",
    "interests",
    "hobbies",
    "publications",
    "volunteer",
}


def normalize(text):
    text = text.lower()
    text = re.sub(r"[^a-z ]", "", text)
    return text.strip()


def is_bullet(line):
    return line.startswith(("•", "-", "*", "●"))


def extract_technologies(text):
    found = []

    for tech in TECHNOLOGY_KEYWORDS:
        if re.search(r"\b" + re.escape(tech) + r"\b", text, re.IGNORECASE):
            found.append(tech)

    return sorted(set(found))


def looks_like_project_title(line):
    """
    A project title is usually:
    - Short
    - Not a bullet
    - Doesn't end with punctuation
    - Starts with a capital letter
    """

    line = line.strip()

    if not line:
        return False

    if is_bullet(line):
        return False

    # Too long
    if len(line.split()) > 12:
        return False

    # Bullet continuation
    if line.endswith((".", ",", ";", ":")):
        return False

    # Starts with lowercase
    if line[0].islower():
        return False

    return True


def extract_projects(text):

    projects = []
    current_project = None

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    for line in lines:

        normalized = normalize(line)

        # Stop when another section begins
        if normalized in END_SECTION_HEADERS:
            break

        # -------------------------
        # New Project
        # -------------------------
        if looks_like_project_title(line):

            if current_project:
                projects.append(current_project)

            current_project = {
                "title": line,
                "technologies": extract_technologies(line),
                "description": [],
            }

            continue

        # -------------------------
        # Description
        # -------------------------
        if current_project:

            description = line.lstrip("•-*● ").strip()

            if description:
                current_project["description"].append(description)

                technologies = extract_technologies(description)

                for tech in technologies:
                    if tech not in current_project["technologies"]:
                        current_project["technologies"].append(tech)

    if current_project:
        projects.append(current_project)

    return projects