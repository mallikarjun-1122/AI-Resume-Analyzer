def generate_strengths(resume, matching):
    """
    Identify resume strengths.
    """

    strengths = []

    if matching.get("match_percentage", 0) >= 70:
        strengths.append(
            "Strong match with the job description."
        )

    if len(resume.get("projects", [])) >= 2:
        strengths.append(
            "Good number of technical projects."
        )

    if len(resume.get("experience", [])) > 0:
        strengths.append(
            "Relevant internship/work experience found."
        )

    if resume.get("education"):
        strengths.append(
            "Education details are complete."
        )

    return strengths