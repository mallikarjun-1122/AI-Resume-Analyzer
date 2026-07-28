from app.extractors.skills import extract_skills


def merge_resume_skills(resume):
    """
    Merge skills from:
    - Skills section
    - Summary
    - Experience
    - Projects

    Returns categorized skills with duplicates removed.
    """

    combined_text = []

    # -----------------------------
    # Existing Skills Section
    # -----------------------------
    for skills in resume.get("skills", {}).values():
        combined_text.extend(skills)

    # -----------------------------
    # Summary
    # -----------------------------
    summary = resume.get("summary", "")
    if summary:
        combined_text.append(summary)

    # -----------------------------
    # Experience
    # -----------------------------
    for exp in resume.get("experience", []):
        combined_text.extend(exp.get("technologies", []))
        combined_text.extend(exp.get("description", []))

    # -----------------------------
    # Projects
    # -----------------------------
    for project in resume.get("projects", []):
        combined_text.extend(project.get("technologies", []))
        combined_text.extend(project.get("description", []))

    # Convert to single string
    final_text = " ".join(combined_text)

    # Re-extract categorized skills
    merged_skills = extract_skills(final_text)

    # Remove duplicates and sort
    for category in merged_skills:
        merged_skills[category] = sorted(set(merged_skills[category]))

    return merged_skills