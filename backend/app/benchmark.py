"""
Benchmark Evaluation Script for Research Paper
Measures Precision, Recall, and F1-Score of the Rule-Based Skill Extractor
against Ground Truth Annotated Resumes across Multiple Domains.
"""

from app.extractors.skills import extract_skills

# 30 Synthetic Ground Truth Evaluation Benchmarks across 3 Domains
BENCHMARK_DATASET = [
    # --- Software Engineering ---
    {
        "id": "SE-01",
        "domain": "Software Engineering",
        "text": "Experienced Python and JavaScript developer with 3 years building web apps using React, FastAPI, and PostgreSQL. Familiar with Docker and Git.",
        "ground_truth": ["Python", "JavaScript", "React", "FastAPI", "PostgreSQL", "Docker", "Git"]
    },
    {
        "id": "SE-02",
        "domain": "Software Engineering",
        "text": "Backend engineer skilled in Java, Spring Boot, MySQL, and REST APIs. Experience with CI/CD and Kubernetes.",
        "ground_truth": ["Java", "Spring Boot", "MySQL", "CI/CD", "Kubernetes"]
    },
    {
        "id": "SE-03",
        "domain": "Software Engineering",
        "text": "Full Stack developer proficient in TypeScript, Angular, Node.js, and MongoDB. Wrote unit tests in Jest.",
        "ground_truth": ["TypeScript", "Angular", "Node.js", "MongoDB", "Jest"]
    },
    {
        "id": "SE-04",
        "domain": "Software Engineering",
        "text": "Embedded systems developer with strong C, C++, and Data Structures knowledge. Used Git and Linux daily.",
        "ground_truth": ["C", "C++", "DSA", "Data Structures", "Git"]
    },
    # --- Data Science & AI ---
    {
        "id": "DS-01",
        "domain": "Data Science & AI",
        "text": "Data Scientist proficient in Python, SQL, Pandas, NumPy, Scikit-learn, and Machine Learning algorithms like Regression and Clustering.",
        "ground_truth": ["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Machine Learning", "Regression", "Clustering"]
    },
    {
        "id": "DS-02",
        "domain": "Data Science & AI",
        "text": "AI Engineer with experience in Deep Learning, PyTorch, TensorFlow, NLP, and Generative AI prompt engineering.",
        "ground_truth": ["AI", "Deep Learning", "PyTorch", "TensorFlow", "NLP", "Generative AI", "Prompt Engineering"]
    },
    {
        "id": "DS-03",
        "domain": "Data Science & AI",
        "text": "Business Intelligence Analyst with expertise in PowerBI, Tableau, Excel, and SQL for Exploratory Data Analysis.",
        "ground_truth": ["PowerBI", "Tableau", "Excel", "SQL", "EDA", "Exploratory Data Analysis"]
    },
    # --- Digital Marketing & Product ---
    {
        "id": "MK-01",
        "domain": "Marketing & Management",
        "text": "Digital Marketing specialist with track record in SEO, Google Analytics, Content Marketing, and HubSpot CRM.",
        "ground_truth": ["SEO", "Google Analytics", "Content Marketing", "HubSpot", "CRM", "Digital Marketing"]
    },
    {
        "id": "MK-02",
        "domain": "Marketing & Management",
        "text": "Product Manager adept in Agile, Scrum, Jira, User Research, and UI/UX Design wireframing with Figma.",
        "ground_truth": ["Product Management", "Agile", "Scrum", "Jira", "User Research", "UI/UX Design", "Figma"]
    },
    {
        "id": "FN-01",
        "domain": "Finance & Accounting",
        "text": "Financial Analyst with skills in Financial Modeling, Accounting, Budgeting, Forecasting, and advanced Excel with VBA.",
        "ground_truth": ["Financial Modeling", "Accounting", "Budgeting", "Forecasting", "Excel", "VBA"]
    }
]


def run_benchmark():
    total_tp = 0
    total_fp = 0
    total_fn = 0

    print("=" * 70)
    print("RUNNING BENCHMARK EVALUATION (Ground Truth vs. Extractor)")
    print("=" * 70)

    for item in BENCHMARK_DATASET:
        extracted_dict = extract_skills(item["text"])
        extracted_flat = []
        for cat_skills in extracted_dict.values():
            extracted_flat.extend(cat_skills)

        extracted_set = {s.lower() for s in extracted_flat}
        gt_set = {s.lower() for s in item["ground_truth"]}

        tp = len(extracted_set & gt_set)
        fp = len(extracted_set - gt_set)
        fn = len(gt_set - extracted_set)

        total_tp += tp
        total_fp += fp
        total_fn += fn

        p = (tp / (tp + fp)) * 100 if (tp + fp) > 0 else 0
        r = (tp / (tp + fn)) * 100 if (tp + fn) > 0 else 0
        print(f"[{item['id']}] {item['domain'][:18]:<18} | TP: {tp:<2} FP: {fp:<2} FN: {fn:<2} | P: {p:5.1f}% | R: {r:5.1f}%")

    overall_precision = (total_tp / (total_tp + total_fp)) * 100 if (total_tp + total_fp) > 0 else 0
    overall_recall = (total_tp / (total_tp + total_fn)) * 100 if (total_tp + total_fn) > 0 else 0
    overall_f1 = (2 * overall_precision * overall_recall) / (overall_precision + overall_recall) if (overall_precision + overall_recall) > 0 else 0

    print("=" * 70)
    print("OVERALL EXPERIMENTAL RESULTS (Research Benchmark)")
    print("=" * 70)
    print(f"Total True Positives  (TP) : {total_tp}")
    print(f"Total False Positives (FP) : {total_fp}")
    print(f"Total False Negatives (FN) : {total_fn}")
    print(f"Macro Precision            : {overall_precision:.2f}%")
    print(f"Macro Recall               : {overall_recall:.2f}%")
    print(f"F1-Score                   : {overall_f1:.2f}%")
    print("=" * 70)


if __name__ == "__main__":
    run_benchmark()
