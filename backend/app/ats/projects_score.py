def calculate_projects_score(resume):
    """
    Score projects out of 20.
    """

    projects = resume.get("projects", [])

    if not projects:
        return 0

    score = 0

    for project in projects:

        if project.get("description"):
            score += 5

        if len(project.get("technologies", [])) >= 3:
            score += 5

    return min(score, 20)