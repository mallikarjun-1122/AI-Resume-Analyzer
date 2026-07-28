def calculate_education_score(resume):
    education = resume.get("education", {})

    if not education:
        return 0

    score = 0

    if education.get("degree"):
        score += 4

    if education.get("institution"):
        score += 3

    if education.get("cgpa"):
        score += 3

    return min(score, 10)