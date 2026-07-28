def calculate_experience_score(resume):
    experience = resume.get("experience", [])

    if not experience:
        return 0

    score = 0

    for exp in experience:
        if exp.get("description"):
            score += 10

        if exp.get("technologies"):
            score += 5

        if exp.get("duration"):
            score += 5

    return min(score, 20)