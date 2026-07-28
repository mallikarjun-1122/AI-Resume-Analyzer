from typing import Dict

from app.ats.skills_score import calculate_skills_score
from app.ats.experience_score import calculate_experience_score
from app.ats.projects_score import calculate_projects_score
from app.ats.education_score import calculate_education_score
from app.ats.certification_score import calculate_certification_score

from app.ats.strengths import generate_strengths
from app.ats.suggestions import generate_suggestions


def calculate_ats_score(
    resume: Dict,
    jd: Dict,
    match_result: Dict,
):
    """
    Complete ATS Scoring Engine
    """

    # Skills
    skills_score, matched_skills, missing_skills = calculate_skills_score(
        resume,
        jd
    )

    # Experience
    experience_score = calculate_experience_score(resume)

    # Projects
    projects_score = calculate_projects_score(resume)

    # Education
    education_score = calculate_education_score(resume)

    # Certifications
    certification_score = calculate_certification_score(resume)

    breakdown = {
        "skills": skills_score,
        "experience": experience_score,
        "projects": projects_score,
        "education": education_score,
        "certifications": certification_score,
    }

    overall_score = sum(breakdown.values())

    strengths = generate_strengths(
        resume,
        match_result
    )

    suggestions = generate_suggestions(
        resume,
        jd,
        {
            **match_result,
            "missing_skills": missing_skills,
        },
    )

    return {
        "overall_score": overall_score,
        "breakdown": breakdown,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "strengths": strengths,
        "suggestions": suggestions,
    }