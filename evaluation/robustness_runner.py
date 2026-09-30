"""Robustness Experiment Framework for AI Resume Analyzer.

Evaluates system stability across:
  A. File formats (PDF vs DOCX vs Plain Text)
  B. Resume section heading variations
  C. Skill wording and surface form variations
  D. Incomplete resumes (section ablation)
  E. Job description skill density variations
"""

from __future__ import annotations

import argparse
import copy
import json
import sys
from pathlib import Path

EVALUATION_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = EVALUATION_DIR.parent
sys.path.insert(0, str(REPOSITORY_ROOT / "backend"))

from app.ats.scorer import calculate_ats_score
from app.extractors.skills import extract_skills
from app.jd.matcher import match_resume_with_jd
from app.jd.parser import parse_job_description
from app.parser.docx_parser import extract_text_from_docx
from app.parser.pdf_parser import extract_text_from_pdf
from app.parser.resume_parser import parse_resume
from app.parser.section_detector import detect_sections
try:
    from metrics import flatten_skills, precision_recall_f1
except ImportError:
    from evaluation.metrics import flatten_skills, precision_recall_f1


def experiment_a_file_formats(dataset_dir: Path) -> dict:
    """Experiment A: Compare extraction stability across TXT, PDF, and DOCX."""
    resumes_dir = dataset_dir / "resumes"
    test_cases = ["resume_01_fullstack_standard", "resume_02_backend_alt_headings"]
    results = {}

    for case_id in test_cases:
        txt_path = resumes_dir / f"{case_id}.txt"
        pdf_path = resumes_dir / f"{case_id}.pdf"
        docx_path = resumes_dir / f"{case_id}.docx"

        if not (txt_path.is_file() and pdf_path.is_file() and docx_path.is_file()):
            continue

        raw_txt = txt_path.read_text(encoding="utf-8")
        raw_pdf = extract_text_from_pdf(str(pdf_path))
        raw_docx = extract_text_from_docx(str(docx_path))

        parsed_txt = parse_resume(raw_txt)
        parsed_pdf = parse_resume(raw_pdf)
        parsed_docx = parse_resume(raw_docx)

        skills_txt = flatten_skills(parsed_txt.get("skills", {}))
        skills_pdf = flatten_skills(parsed_pdf.get("skills", {}))
        skills_docx = flatten_skills(parsed_docx.get("skills", {}))

        results[case_id] = {
            "text_length": {
                "txt": len(raw_txt),
                "pdf": len(raw_pdf),
                "docx": len(raw_docx),
            },
            "skills_extracted_count": {
                "txt": len(skills_txt),
                "pdf": len(skills_pdf),
                "docx": len(skills_docx),
            },
            "pdf_vs_txt_skill_overlap": precision_recall_f1(skills_pdf, skills_txt),
            "docx_vs_txt_skill_overlap": precision_recall_f1(skills_docx, skills_txt),
            "education_extracted": {
                "txt": parsed_txt.get("education", {}).get("degree"),
                "pdf": parsed_pdf.get("education", {}).get("degree"),
                "docx": parsed_docx.get("education", {}).get("degree"),
            },
            "experience_count": {
                "txt": len(parsed_txt.get("experience", [])),
                "pdf": len(parsed_pdf.get("experience", [])),
                "docx": len(parsed_docx.get("experience", [])),
            },
        }

    return results


def experiment_b_resume_structure(dataset_dir: Path) -> dict:
    """Experiment B: Sensitivity to section headings."""
    base_resume_path = dataset_dir / "resumes" / "resume_01_fullstack_standard.txt"
    if not base_resume_path.is_file():
        return {"error": "Base resume not found"}

    content = base_resume_path.read_text(encoding="utf-8")

    heading_variants = {
        "standard": {
            "SKILLS": "SKILLS",
            "EXPERIENCE": "EXPERIENCE",
            "EDUCATION": "EDUCATION",
            "PROJECTS": "PROJECTS",
            "CERTIFICATIONS": "CERTIFICATIONS",
        },
        "alternative_supported": {
            "SKILLS": "TECHNICAL EXPERTISE",
            "EXPERIENCE": "WORK EXPERIENCE",
            "EDUCATION": "ACADEMIC BACKGROUND",
            "PROJECTS": "KEY PROJECTS",
            "CERTIFICATIONS": "COURSES",
        },
        "unsupported_synonyms": {
            "SKILLS": "CORE TALENTS & TECH",
            "EXPERIENCE": "CAREER TRAJECTORY",
            "EDUCATION": "HIGHER SCHOOLING",
            "PROJECTS": "THINGS I CREATED",
            "CERTIFICATIONS": "OFFICIAL PAPERS",
        },
    }

    results = {}
    for variant_name, mapping in heading_variants.items():
        modified_content = content
        for orig, replacement in mapping.items():
            modified_content = modified_content.replace(orig, replacement)

        sections = detect_sections(modified_content)
        parsed = parse_resume(modified_content)
        extracted_skills = flatten_skills(parsed.get("skills", {}))

        results[variant_name] = {
            "detected_sections": [k for k, v in sections.items() if v.strip()],
            "skills_count": len(extracted_skills),
            "education_found": bool(parsed.get("education", {}).get("degree")),
            "experience_count": len(parsed.get("experience", [])),
            "projects_count": len(parsed.get("projects", [])),
            "certifications_count": len(parsed.get("certifications", [])),
        }

    return results


def experiment_c_skill_wording() -> dict:
    """Experiment C: Sensitivity to skill naming variants."""
    canonical_skills = ["Python", "FastAPI", "PostgreSQL", "Docker", "Node.js", "React"]

    test_suites = {
        "canonical": "Technical Skills: Python, FastAPI, PostgreSQL, Docker, Node.js, React",
        "lowercase": "Technical Skills: python, fastapi, postgresql, docker, node.js, react",
        "uppercase": "Technical Skills: PYTHON, FASTAPI, POSTGRESQL, DOCKER, NODE.JS, REACT",
        "punctuation_variants": "Technical Skills: Python, FastAPI, Postgresql, Docker, Node js, React",
        "informal_synonyms": "Technical Skills: Python, FastAPI, Postgres, Docker, Node, ReactJS, Golang",
    }

    results = {}
    expected_flat = {s.casefold() for s in canonical_skills}

    for suite_name, text in test_suites.items():
        extracted = extract_skills(text)
        found_flat = {s.casefold() for vals in extracted.values() for s in vals}
        results[suite_name] = {
            "raw_text": text,
            "skills_detected": sorted(list(found_flat)),
            "precision_vs_canonical": len(found_flat & expected_flat) / len(found_flat) if found_flat else 0.0,
            "recall_vs_canonical": len(found_flat & expected_flat) / len(expected_flat),
        }

    return results


def experiment_d_incomplete_resumes(dataset_dir: Path) -> dict:
    """Experiment D: Ablation study on missing sections."""
    base_resume_path = dataset_dir / "resumes" / "resume_01_fullstack_standard.txt"
    base_jd_path = dataset_dir / "job_descriptions" / "jd_01_senior_fullstack.txt"
    if not (base_resume_path.is_file() and base_jd_path.is_file()):
        return {"error": "Base files not found"}

    parsed_resume = parse_resume(base_resume_path.read_text(encoding="utf-8"))
    parsed_jd = parse_job_description(base_jd_path.read_text(encoding="utf-8"))

    ablations = {
        "full_resume": parsed_resume,
        "no_skills": {**copy.deepcopy(parsed_resume), "skills": {}},
        "no_education": {**copy.deepcopy(parsed_resume), "education": {}},
        "no_experience": {**copy.deepcopy(parsed_resume), "experience": []},
        "no_projects": {**copy.deepcopy(parsed_resume), "projects": []},
        "no_certifications": {**copy.deepcopy(parsed_resume), "certifications": []},
    }

    results = {}
    full_match = match_resume_with_jd(parsed_resume, parsed_jd)
    full_ats = calculate_ats_score(parsed_resume, parsed_jd, full_match)
    full_overall = full_ats["overall_score"]

    for name, r_obj in ablations.items():
        m_res = match_resume_with_jd(r_obj, parsed_jd)
        ats = calculate_ats_score(r_obj, parsed_jd, m_res)
        results[name] = {
            "overall_score": ats["overall_score"],
            "delta_from_full": round(ats["overall_score"] - full_overall, 2),
            "breakdown": ats["breakdown"],
        }

    return results


def experiment_e_jd_skill_density(dataset_dir: Path) -> dict:
    """Experiment E: Robustness across JDs with high, low, and zero recognized skills."""
    resume_path = dataset_dir / "resumes" / "resume_01_fullstack_standard.txt"
    jds_dir = dataset_dir / "job_descriptions"
    if not resume_path.is_file():
        return {"error": "Base resume not found"}

    parsed_resume = parse_resume(resume_path.read_text(encoding="utf-8"))

    jd_cases = {
        "high_density": "jd_01_senior_fullstack.txt",
        "low_density": "jd_02_junior_analyst.txt",
        "zero_dictionary_skills": "jd_03_office_manager_no_skills.txt",
    }

    results = {}
    for case_name, filename in jd_cases.items():
        jd_file = jds_dir / filename
        if not jd_file.is_file():
            continue
        parsed_jd = parse_job_description(jd_file.read_text(encoding="utf-8"))
        jd_skills_count = sum(len(v) for v in parsed_jd.get("skills", {}).values())

        match_res = match_resume_with_jd(parsed_resume, parsed_jd)
        ats = calculate_ats_score(parsed_resume, parsed_jd, match_res)

        results[case_name] = {
            "jd_recognized_skills_count": jd_skills_count,
            "match_percentage": match_res["match_percentage"],
            "skills_score_component": ats["breakdown"]["skills"],
            "overall_score": ats["overall_score"],
            "note": "When required skills == 0, system assigns 40/40 skill points by design." if jd_skills_count == 0 else "Normal calculation",
        }

    return results


def run_all_robustness_experiments(dataset_dir: Path) -> dict:
    return {
        "metadata": {
            "framework": "AI Resume Analyzer Robustness Suite",
            "notice": "DEMO DATA — NOT FOR RESEARCH RESULTS",
        },
        "experiment_a_file_formats": experiment_a_file_formats(dataset_dir),
        "experiment_b_resume_structure": experiment_b_resume_structure(dataset_dir),
        "experiment_c_skill_wording": experiment_c_skill_wording(),
        "experiment_d_incomplete_resumes": experiment_d_incomplete_resumes(dataset_dir),
        "experiment_e_jd_skill_density": experiment_e_jd_skill_density(dataset_dir),
    }


def main():
    parser = argparse.ArgumentParser(description="Robustness Experiment Suite")
    parser.add_argument("--dataset", default=str(EVALUATION_DIR / "dataset"), help="Path to evaluation dataset")
    parser.add_argument("--experiment", choices=["A", "B", "C", "D", "E", "all"], default="all")
    parser.add_argument("--output", default="results/robustness_report.json", help="Path to export results JSON")
    args = parser.parse_args()

    dataset_path = Path(args.dataset)
    if not dataset_path.is_absolute():
        dataset_path = (Path.cwd() / dataset_path).resolve()

    if args.experiment == "all":
        results = run_all_robustness_experiments(dataset_path)
    elif args.experiment == "A":
        results = {"experiment_a_file_formats": experiment_a_file_formats(dataset_path)}
    elif args.experiment == "B":
        results = {"experiment_b_resume_structure": experiment_b_resume_structure(dataset_path)}
    elif args.experiment == "C":
        results = {"experiment_c_skill_wording": experiment_c_skill_wording()}
    elif args.experiment == "D":
        results = {"experiment_d_incomplete_resumes": experiment_d_incomplete_resumes(dataset_path)}
    elif args.experiment == "E":
        results = {"experiment_e_jd_skill_density": experiment_e_jd_skill_density(dataset_path)}

    out_p = Path(args.output)
    if not out_p.is_absolute():
        out_p = EVALUATION_DIR / out_p
    out_p.parent.mkdir(parents=True, exist_ok=True)
    out_p.write_text(json.dumps(results, indent=2), encoding="utf-8")

    print("\n" + "=" * 65)
    print("ROBUSTNESS EXPERIMENT SUITE COMPLETED")
    print("=" * 65)
    print(f"Results exported to: {out_p}")
    print(json.dumps(results, indent=2))
    print("=" * 65)


if __name__ == "__main__":
    main()
