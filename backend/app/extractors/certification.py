import re


def extract_certifications(text):
    """
    Extract certification names from the Certifications section.
    """

    certifications = []

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    for line in lines:

        if len(line) > 3:
            certifications.append(line)

    return certifications