def calculate_skills_score(resume, jd):
    """
    Calculate skills score out of 40.
    """

    resume_skills = []

    for category in resume.get("skills", {}).values():
        resume_skills.extend(category)

    resume_skills = {
        skill.lower()
        for skill in resume_skills
    }

    jd_skills = []

    for category in jd.get("skills", {}).values():
        jd_skills.extend(category)

    jd_skills = {
        skill.lower()
        for skill in jd_skills
    }

    if not jd_skills:
        return 40, [], []

    matched = sorted(resume_skills & jd_skills)

    missing = sorted(jd_skills - resume_skills)

    score = int(
        (len(matched) / len(jd_skills)) * 40
    )

    return score, matched, missing