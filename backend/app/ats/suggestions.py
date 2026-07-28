def generate_suggestions(resume, jd, matching):
    """
    Generate improvement suggestions for the resume.
    """

    suggestions = []

    missing_skills = matching.get("missing_skills", [])

    if missing_skills:
        suggestions.append(
            f"Consider adding these skills if you have experience: {', '.join(missing_skills)}."
        )

    if len(resume.get("projects", [])) < 3:
        suggestions.append(
            "Add more technical projects to strengthen your profile."
        )

    if len(resume.get("experience", [])) == 0:
        suggestions.append(
            "Add internship or work experience to improve your ATS score."
        )

    if len(resume.get("certifications", [])) == 0:
        suggestions.append(
            "Include relevant certifications to improve credibility."
        )

    summary = resume.get("summary", "")

    if len(summary.split()) < 40:
        suggestions.append(
            "Expand your professional summary with skills and achievements."
        )

    return suggestions