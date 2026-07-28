import re

# Common degree names
DEGREES = [
    "B.Tech",
    "Bachelor of Technology",
    "B.E",
    "Bachelor of Engineering",
    "BCA",
    "MCA",
    "M.Tech",
    "MBA",
    "B.Sc",
    "M.Sc",
    "PhD",
    "Diploma"
]


def extract_degree(text):
    """
    Extract degree from education section.
    """

    for degree in DEGREES:
        pattern = r"\b" + re.escape(degree) + r"\b"

        if re.search(pattern, text, re.IGNORECASE):
            return degree

    return None


def extract_cgpa(text):
    """
    Extract CGPA / GPA.
    """

    pattern = r"(?:CGPA|GPA)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)"

    match = re.search(pattern, text, re.IGNORECASE)

    if match:
        return match.group(1)

    return None


def extract_duration(text):
    """
    Extract education duration.
    """

    pattern = r"(20\d{2})\s*[-–]\s*(20\d{2})"

    match = re.search(pattern, text)

    if match:
        return f"{match.group(1)} - {match.group(2)}"

    return None


def extract_institution(text):
    """
    Extract university / college.
    """

    keywords = [
        "University",
        "Institute",
        "College",
        "School"
    ]

    for line in text.split("\n"):

        for keyword in keywords:

            if keyword.lower() in line.lower():
                return line.strip()

    return None


def extract_education(text):
    """
    Extract complete education details.
    """

    return {
        "degree": extract_degree(text),
        "institution": extract_institution(text),
        "cgpa": extract_cgpa(text),
        "duration": extract_duration(text),
    }