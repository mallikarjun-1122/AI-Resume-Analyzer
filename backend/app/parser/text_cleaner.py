import re


def clean_text(text: str) -> str:
    """
    Clean extracted resume text while preserving the original structure.
    """

    if not text:
        return ""

    # Normalize line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Replace tabs with spaces
    text = text.replace("\t", " ")

    # Remove trailing spaces on each line
    lines = [line.rstrip() for line in text.split("\n")]

    # Remove multiple spaces within a line
    lines = [re.sub(r" {2,}", " ", line) for line in lines]

    # Remove excessive blank lines
    cleaned = []
    blank = False

    for line in lines:
        if line.strip() == "":
            if not blank:
                cleaned.append("")
            blank = True
        else:
            cleaned.append(line.strip())
            blank = False

    return "\n".join(cleaned).strip()