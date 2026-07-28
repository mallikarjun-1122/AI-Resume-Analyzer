import re

SECTION_PATTERNS = {
    "summary": [
        "summary",
        "professional summary",
        "profile",
        "objective",
        "career objective",
        "about me"
    ],

    "skills": [
        "skills",
        "technical skills",
        "technical expertise",
        "core competencies",
        "expertise"
    ],

    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "employment history",
        "internship",
        "internships"
    ],

    "education": [
        "education",
        "academic qualification",
        "academic background",
        "academics",
        "qualification"
    ],

    "projects": [
        "projects",
        "academic projects",
        "personal projects",
        "major projects",
        "key projects"
    ],

    "certifications": [
        "certifications",
        "certificates",
        "licenses",
        "courses"
    ],

    "achievements": [
        "achievements",
        "awards",
        "honors"
    ],

    "languages": [
        "languages"
    ],

    "publications": [
        "publications"
    ],

    "volunteer": [
        "volunteer",
        "volunteering",
        "volunteer experience"
    ],

    "interests": [
        "interests",
        "hobbies"
    ]
}


def normalize_heading(text: str):
    """
    Normalize heading for comparison.
    """
    text = text.lower()
    text = re.sub(r"[^a-z ]", "", text)
    return text.strip()


def detect_sections(text: str):
    """
    Detect resume sections generically.
    """

    lines = text.split("\n")

    sections = {}
    current_section = "header"

    sections[current_section] = []

    for line in lines:

        stripped = line.strip()

        if not stripped:
            continue

        normalized = normalize_heading(stripped)

        matched = False

        for section, headings in SECTION_PATTERNS.items():

            if normalized in headings:

                current_section = section

                if current_section not in sections:
                    sections[current_section] = []

                matched = True
                break

        if not matched:
            sections[current_section].append(stripped)

    return {
        section: "\n".join(content)
        for section, content in sections.items()
    }