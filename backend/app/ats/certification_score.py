def calculate_certification_score(resume):
    certifications = resume.get("certifications", [])

    if len(certifications) >= 3:
        return 10

    if len(certifications) == 2:
        return 7

    if len(certifications) == 1:
        return 4

    return 0