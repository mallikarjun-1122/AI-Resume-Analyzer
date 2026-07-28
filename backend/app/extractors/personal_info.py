import re
import spacy

# Load spaCy model once
nlp = spacy.load("en_core_web_sm")


# -----------------------------
# Regex Patterns
# -----------------------------

EMAIL_REGEX = re.compile(
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
)

PHONE_REGEX = re.compile(
    r"(?:\+91[-\s]?)?[6-9]\d{9}"
)

LINKEDIN_REGEX = re.compile(
    r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_-]+",
    re.IGNORECASE,
)

GITHUB_REGEX = re.compile(
    r"(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9_-]+",
    re.IGNORECASE,
)

PORTFOLIO_REGEX = re.compile(
    r"(?:https?://)?(?:www\.)?(?!linkedin|github)[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:/[^\s]*)?",
    re.IGNORECASE,
)


# -----------------------------
# Name
# -----------------------------

def extract_name(text: str):
    """
    Extract candidate name using spaCy.
    Looks at the first few lines of the resume.
    """

    if not text:
        return None

    first_lines = "\n".join(text.split("\n")[:10])

    doc = nlp(first_lines)

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text.strip()

    # Fallback
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    if lines:
        first = lines[0]

        if len(first.split()) <= 5:
            return first

    return None


# -----------------------------
# Email
# -----------------------------

def extract_email(text: str):

    if not text:
        return None

    match = EMAIL_REGEX.search(text)

    return match.group() if match else None


# -----------------------------
# Phone
# -----------------------------

def extract_phone(text: str):

    if not text:
        return None

    match = PHONE_REGEX.search(text)

    if not match:
        return None

    phone = match.group()

    digits = re.sub(r"\D", "", phone)

    if len(digits) == 10:
        return f"+91-{digits}"

    return phone


# -----------------------------
# LinkedIn
# -----------------------------

def extract_linkedin(text: str):

    if not text:
        return None

    match = LINKEDIN_REGEX.search(text)

    if match:
        return match.group()

    return None


# -----------------------------
# GitHub
# -----------------------------

def extract_github(text: str):

    if not text:
        return None

    match = GITHUB_REGEX.search(text)

    if match:
        return match.group()

    return None


# -----------------------------
# Portfolio
# -----------------------------

def extract_portfolio(text: str):

    if not text:
        return None

    websites = PORTFOLIO_REGEX.findall(text)

    for site in websites:

        lower = site.lower()

        if "linkedin" in lower:
            continue

        if "github" in lower:
            continue

        if "gmail" in lower:
            continue

        return site

    return None


# -----------------------------
# Main Extractor
# -----------------------------

def extract_personal_info(text: str):
    """
    Extract all personal information from resume.
    """

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "linkedin": extract_linkedin(text),
        "github": extract_github(text),
        "portfolio": extract_portfolio(text),
    }