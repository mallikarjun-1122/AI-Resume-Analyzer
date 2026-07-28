def compare_category(resume_skills, jd_skills):
    """
    Compare one category of skills.
    """

    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched = sorted(list(resume_set & jd_set))
    missing = sorted(list(jd_set - resume_set))
    extra = sorted(list(resume_set - jd_set))

    return matched, missing, extra


def calculate_match_score(total_required, matched):
    """
    Calculate percentage match.
    """

    if total_required == 0:
        return 100.0

    return round((matched / total_required) * 100, 2)


def get_recommendation(score):
    """
    Generate hiring recommendation based on Job Match score.
    """

    if score >= 70:
        return "Fit"
    elif score >= 50:
        return "Weak Fit"
    else:
        return "Reject"


def match_resume_with_jd(resume, jd):
    """
    Compare Resume against Job Description.
    """

    resume_skills = resume.get("skills", {})
    jd_skills = jd.get("skills", {})

    matched_skills = {}
    missing_skills = {}
    extra_skills = {}

    total_required = 0
    total_matched = 0

    categories = set(resume_skills.keys()) | set(jd_skills.keys())

    for category in categories:

        resume_category = resume_skills.get(category, [])
        jd_category = jd_skills.get(category, [])

        matched, missing, extra = compare_category(
            resume_category,
            jd_category
        )

        if matched:
            matched_skills[category] = matched

        if missing:
            missing_skills[category] = missing

        if extra:
            extra_skills[category] = extra

        total_required += len(jd_category)
        total_matched += len(matched)

    score = calculate_match_score(
        total_required,
        total_matched
    )

    recommendation = get_recommendation(score)

    return {
        "match_percentage": score,
        "recommendation": recommendation,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "extra_skills": extra_skills
    }