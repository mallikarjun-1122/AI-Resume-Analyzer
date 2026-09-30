"""Run reproducible evaluation of the existing deterministic backend pipeline."""

from __future__ import annotations

import argparse
import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

EVALUATION_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = EVALUATION_DIR.parent
sys.path.insert(0, str(REPOSITORY_ROOT / "backend"))

from app.ats.scorer import calculate_ats_score
from app.jd.matcher import match_resume_with_jd
from app.jd.parser import parse_job_description
from app.parser.docx_parser import extract_text_from_docx
from app.parser.pdf_parser import extract_text_from_pdf
from app.parser.resume_parser import parse_resume
try:
    from contamination_guard import assert_clean_real_dataset, scan_directory_for_contamination
except ImportError:
    from evaluation.contamination_guard import assert_clean_real_dataset, scan_directory_for_contamination
try:
    from metrics import (
        flatten_certifications,
        flatten_education,
        flatten_matching,
        flatten_record_list,
        flatten_skill_names,
        flatten_skills,
        precision_recall_f1,
        score_summary,
    )
except ImportError:
    from evaluation.metrics import (
        flatten_certifications,
        flatten_education,
        flatten_matching,
        flatten_record_list,
        flatten_skill_names,
        flatten_skills,
        precision_recall_f1,
        score_summary,
    )


def read_jsonl(path: Path) -> list[dict]:
    records = []
    with path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as error:
                raise ValueError(f"Invalid JSON on line {line_number} of {path}: {error}") from error
    return records


def read_text(base: Path, relative_path: str) -> str:
    path = (base / relative_path).resolve()
    if not path.is_file():
        raise FileNotFoundError(f"Annotated input file does not exist: {path}")
    return load_document_text(path)


def load_document_text(file_path: Path) -> str:
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        return extract_text_from_pdf(str(file_path))
    elif suffix == ".docx":
        return extract_text_from_docx(str(file_path))
    else:
        return file_path.read_text(encoding="utf-8")


def find_resume_file(resumes_dir: Path, resume_id: str, declared_path: str | None = None) -> Path:
    if declared_path:
        direct = (resumes_dir.parent / declared_path).resolve()
        if direct.is_file():
            return direct
        cand = resumes_dir / Path(declared_path).name
        if cand.is_file():
            return cand
    for ext in (".txt", ".pdf", ".docx"):
        candidate = resumes_dir / f"{resume_id}{ext}"
        if candidate.is_file():
            return candidate
    raise FileNotFoundError(f"Could not find resume file for ID '{resume_id}' in {resumes_dir}")


def find_jd_file(jds_dir: Path, jd_id: str) -> Path:
    cand = jds_dir / f"{jd_id}.txt"
    if cand.is_file():
        return cand
    cand_direct = jds_dir / jd_id
    if cand_direct.is_file():
        return cand_direct
    raise FileNotFoundError(f"Could not find job description file for ID '{jd_id}' in {jds_dir}")


def evaluate_dataset(dataset_dir: Path, mode: str = "auto", strict_real: bool = False) -> dict:
    """Evaluate full dataset directory against ground-truth annotations."""
    if mode == "real" or strict_real:
        assert_clean_real_dataset(dataset_dir)
        dataset_label = "REAL RESEARCH DATA"
    elif mode == "demo":
        dataset_label = "DEMO DATA — NOT FOR RESEARCH RESULTS"
    else:
        contamination = scan_directory_for_contamination(dataset_dir)
        dataset_label = "DEMO DATA — NOT FOR RESEARCH RESULTS" if contamination else "REAL RESEARCH DATA"

    resumes_dir = dataset_dir / "resumes"
    jds_dir = dataset_dir / "job_descriptions"
    resume_anno_path = dataset_dir / "annotations" / "resume_annotations.jsonl"
    match_anno_path = dataset_dir / "annotations" / "match_annotations.jsonl"
    scores_anno_path = dataset_dir / "expert_scores" / "expert_scores.jsonl"
    rankings_anno_path = dataset_dir / "expert_rankings" / "expert_rankings.jsonl"

    parsed_resumes_cache: dict[str, dict] = {}
    parsed_jds_cache: dict[str, dict] = {}

    def get_parsed_resume(rid: str, declared_path: str | None = None) -> dict:
        if rid not in parsed_resumes_cache:
            rfile = find_resume_file(resumes_dir, rid, declared_path)
            rtext = load_document_text(rfile)
            parsed_resumes_cache[rid] = parse_resume(rtext)
        return parsed_resumes_cache[rid]

    def get_parsed_jd(jid: str) -> dict:
        if jid not in parsed_jds_cache:
            jfile = find_jd_file(jds_dir, jid)
            jtext = load_document_text(jfile)
            parsed_jds_cache[jid] = parse_job_description(jtext)
        return parsed_jds_cache[jid]

    # 1. Extraction Evaluation
    extraction_predicted = defaultdict(set)
    extraction_expected = defaultdict(set)
    resume_records = read_jsonl(resume_anno_path) if resume_anno_path.is_file() else []

    for rec in resume_records:
        rid = rec["resume_id"]
        parsed = get_parsed_resume(rid, rec.get("file_path"))
        
        gold_skills = rec.get("skills", {})
        gold_edu = rec.get("education", {})
        gold_exp = rec.get("experience", [])
        gold_proj = rec.get("projects", [])
        gold_certs = rec.get("certifications", [])

        fields = {
            "skills": (flatten_skills(parsed.get("skills", {})), flatten_skills(gold_skills)),
            "education": (flatten_education(parsed.get("education", {})), flatten_education(gold_edu)),
            "experience": (
                flatten_record_list(parsed.get("experience", []), ("job_title", "company", "duration", "technologies", "description")),
                flatten_record_list(gold_exp, ("job_title", "company", "duration", "technologies", "description")),
            ),
            "projects": (
                flatten_record_list(parsed.get("projects", []), ("title", "technologies", "description")),
                flatten_record_list(gold_proj, ("title", "technologies", "description")),
            ),
            "certifications": (
                flatten_certifications(parsed.get("certifications", [])),
                flatten_certifications(gold_certs),
            ),
        }
        for field, (p_set, e_set) in fields.items():
            extraction_predicted[field].update(f"{rid}::{item}" for item in p_set)
            extraction_expected[field].update(f"{rid}::{item}" for item in e_set)

    extraction_metrics = {
        field: precision_recall_f1(extraction_predicted[field], extraction_expected[field])
        for field in ("skills", "education", "experience", "projects", "certifications")
    }

    # 2. Matching Evaluation
    matching_predicted = defaultdict(set)
    matching_expected = defaultdict(set)
    match_records = read_jsonl(match_anno_path) if match_anno_path.is_file() else []

    for m_rec in match_records:
        mid = m_rec.get("match_id", f"{m_rec['resume_id']}__{m_rec['jd_id']}")
        resume = get_parsed_resume(m_rec["resume_id"])
        jd = get_parsed_jd(m_rec["jd_id"])
        match_result = match_resume_with_jd(resume, jd)

        pred_matched = flatten_skill_names(match_result.get("matched_skills", {}))
        gold_matched = flatten_skill_names(m_rec.get("gold_matched_skills", []))
        
        pred_missing = flatten_skill_names(match_result.get("missing_skills", {}))
        gold_missing = flatten_skill_names(m_rec.get("gold_missing_skills", []))

        matching_predicted["matched_skills"].update(f"{mid}::{s}" for s in pred_matched)
        matching_expected["matched_skills"].update(f"{mid}::{s}" for s in gold_matched)
        matching_predicted["missing_skills"].update(f"{mid}::{s}" for s in pred_missing)
        matching_expected["missing_skills"].update(f"{mid}::{s}" for s in gold_missing)

    matching_metrics = {
        "matched_skills": precision_recall_f1(matching_predicted["matched_skills"], matching_expected["matched_skills"]),
        "missing_skills": precision_recall_f1(matching_predicted["missing_skills"], matching_expected["missing_skills"]),
    }

    # 3. Score Validity Evaluation (MAE, RMSE, Pearson r, Spearman rho)
    score_pairs = []
    score_records = read_jsonl(scores_anno_path) if scores_anno_path.is_file() else []
    for s_rec in score_records:
        resume = get_parsed_resume(s_rec["resume_id"])
        jd = get_parsed_jd(s_rec["jd_id"])
        match_res = match_resume_with_jd(resume, jd)
        ats = calculate_ats_score(resume=resume, jd=jd, match_result=match_res)
        system_score = float(ats["overall_score"])
        expert_score = float(s_rec["expert_relevance_score"])
        score_pairs.append((system_score, expert_score))

    score_validity = score_summary(score_pairs)

    # 4. Ranking Evaluation (Spearman rank correlation)
    ranking_records = read_jsonl(rankings_anno_path) if rankings_anno_path.is_file() else []
    group_agreements = {}
    for r_rec in ranking_records:
        gid = r_rec.get("group_id", "default_cohort")
        jid = r_rec["jd_id"]
        jd = get_parsed_jd(jid)
        expert_ranks = r_rec["expert_rank"]

        cohort_pairs = []
        for cid in r_rec["candidate_ids"]:
            if cid in expert_ranks:
                resume = get_parsed_resume(cid)
                match_res = match_resume_with_jd(resume, jd)
                ats = calculate_ats_score(resume=resume, jd=jd, match_result=match_res)
                cohort_pairs.append((float(ats["overall_score"]), float(expert_ranks[cid])))

        if len(cohort_pairs) >= 2:
            # High ATS score corresponds to low numerical rank (rank 1 = best)
            group_agreements[gid] = score_summary([(score, -rank) for score, rank in cohort_pairs])

    ranking_rhos = [res["spearman_rho"] for res in group_agreements.values() if res.get("spearman_rho") is not None]
    ranking_agreement = {
        "eligible_groups": len(group_agreements),
        "mean_spearman_rho": sum(ranking_rhos) / len(ranking_rhos) if ranking_rhos else None,
        "by_group": group_agreements,
    }

    return {
        "metadata": {
            "evaluation_engine": "Deterministic Rule-Based Baseline",
            "score_validity_notice": "ATS score is a heuristic 0-100 metric and does not represent an industry validated ATS score, employment probability, or hiring prediction.",
            "dataset_label": dataset_label,
        },
        "resume_count": len(resume_records),
        "match_count": len(match_records),
        "score_evaluation_count": len(score_pairs),
        "extraction_metrics": extraction_metrics,
        "matching_metrics": matching_metrics,
        "score_validity": score_validity,
        "ranking_agreement": ranking_agreement,
    }


def evaluate(records: list[dict], annotation_dir: Path) -> dict:
    """Legacy evaluation function for single annotations.jsonl file."""
    predicted = defaultdict(set)
    expected = defaultdict(set)
    score_pairs = []
    ranking_groups = defaultdict(list)

    for record in records:
        record_id = record["id"]
        gold = record["gold"]
        resume = parse_resume(read_text(annotation_dir, record["resume_text_path"]))
        jd = parse_job_description(read_text(annotation_dir, record["job_description_text_path"]))
        matching = match_resume_with_jd(resume, jd)
        ats = calculate_ats_score(resume=resume, jd=jd, match_result=matching)

        fields = {
            "skills": (flatten_skills(resume["skills"]), flatten_skills(gold["skills"])),
            "education": (flatten_education(resume["education"]), flatten_education(gold["education"])),
            "experience": (
                flatten_record_list(resume["experience"], ("job_title", "company", "duration", "technologies", "description")),
                flatten_record_list(gold["experience"], ("job_title", "company", "duration", "technologies", "description")),
            ),
            "projects": (
                flatten_record_list(resume["projects"], ("title", "technologies", "description")),
                flatten_record_list(gold["projects"], ("title", "technologies", "description")),
            ),
            "certifications": (flatten_certifications(resume["certifications"]), flatten_certifications(gold["certifications"])),
            "matching": (flatten_matching(matching), flatten_matching(gold["matching"])),
        }
        for field, (field_predicted, field_expected) in fields.items():
            predicted[field].update(f"{record_id}::{item}" for item in field_predicted)
            expected[field].update(f"{record_id}::{item}" for item in field_expected)

        expert_score = gold.get("expert_relevance_score")
        if isinstance(expert_score, (int, float)):
            score_pairs.append((float(ats["overall_score"]), float(expert_score)))

        group = record.get("ranking_group")
        expert_rank = record.get("expert_rank")
        if group and isinstance(expert_rank, (int, float)):
            ranking_groups[group].append((float(ats["overall_score"]), float(expert_rank)))

    extraction_metrics = {
        field: precision_recall_f1(predicted[field], expected[field])
        for field in ("skills", "education", "experience", "projects", "certifications", "matching")
    }
    group_agreement = {
        group: score_summary([(score, -rank) for score, rank in values])
        for group, values in ranking_groups.items()
        if len(values) >= 2
    }
    ranking_rhos = [result["spearman_rho"] for result in group_agreement.values() if result["spearman_rho"] is not None]
    return {
        "record_count": len(records),
        "extraction_metrics": extraction_metrics,
        "overall_score_vs_expert": score_summary(score_pairs),
        "batch_ranking_agreement": {
            "eligible_groups": len(group_agreement),
            "mean_spearman_rho": sum(ranking_rhos) / len(ranking_rhos) if ranking_rhos else None,
            "by_group": group_agreement,
        },
    }


def print_summary(result: dict) -> None:
    print("\n" + "=" * 65)
    print("EVALUATION RESULTS SUMMARY")
    print("=" * 65)
    if "metadata" in result:
        print(f"Notice: {result['metadata']['score_validity_notice']}")
        print(f"Dataset Label: {result['metadata']['dataset_label']}")
        print("-" * 65)

    print("\n--- EXTRACTION METRICS ---")
    for field, metrics in result.get("extraction_metrics", {}).items():
        print(f"{field.capitalize():<16} | P: {metrics['precision']:.3f} | R: {metrics['recall']:.3f} | F1: {metrics['f1']:.3f} (TP:{metrics['true_positive']} FP:{metrics['false_positive']} FN:{metrics['false_negative']})")

    if "matching_metrics" in result:
        print("\n--- MATCHING METRICS ---")
        for field, metrics in result["matching_metrics"].items():
            print(f"{field:<16} | P: {metrics['precision']:.3f} | R: {metrics['recall']:.3f} | F1: {metrics['f1']:.3f}")

    validity = result.get("score_validity") or result.get("overall_score_vs_expert")
    if validity and validity.get("count", 0) > 0:
        print("\n--- SCORE VALIDITY (System ATS Score vs Expert Score) ---")
        print(f"Pairs Evaluated : {validity['count']}")
        print(f"MAE             : {validity['mae']:.2f}")
        print(f"RMSE            : {validity['rmse']:.2f}")
        p_r = f"{validity['pearson_r']:.3f}" if validity['pearson_r'] is not None else "N/A"
        s_rho = f"{validity['spearman_rho']:.3f}" if validity['spearman_rho'] is not None else "N/A"
        print(f"Pearson r       : {p_r}")
        print(f"Spearman rho    : {s_rho}")

    ranking = result.get("ranking_agreement") or result.get("batch_ranking_agreement")
    if ranking and ranking.get("eligible_groups", 0) > 0:
        print("\n--- BATCH RANKING AGREEMENT ---")
        print(f"Eligible Groups : {ranking['eligible_groups']}")
        m_rho = f"{ranking['mean_spearman_rho']:.3f}" if ranking.get('mean_spearman_rho') is not None else "N/A"
        print(f"Mean Spearman rho: {m_rho}")
    print("=" * 65 + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", help="Path to evaluation dataset directory (containing resumes/, annotations/, etc.)")
    parser.add_argument("--config", default=None, help="Path to config.json (for legacy single-file evaluation).")
    parser.add_argument("--mode", choices=["auto", "demo", "real"], default="auto", help="Execution mode (real enforces contamination check).")
    parser.add_argument("--strict-real", action="store_true", help="Halt with an error if any synthetic demo data markers are detected.")
    parser.add_argument("--output", default="results/evaluation.json", help="Output path for evaluation JSON.")
    args = parser.parse_args()

    default_dataset = EVALUATION_DIR / "dataset"
    if args.dataset:
        dataset_path = Path(args.dataset)
        if not dataset_path.is_absolute():
            dataset_path = (Path.cwd() / dataset_path).resolve()
        result = evaluate_dataset(dataset_path, mode=args.mode, strict_real=args.strict_real)
    elif args.config:
        config_path = Path(args.config)
        if not config_path.is_absolute():
            config_path = (Path.cwd() / config_path).resolve()
        config = json.loads(config_path.read_text(encoding="utf-8"))
        annotations = (config_path.parent / config["annotations_file"]).resolve()
        result = evaluate(read_jsonl(annotations), annotations.parent)
    elif default_dataset.is_dir():
        result = evaluate_dataset(default_dataset, mode=args.mode, strict_real=args.strict_real)
    else:
        print("Error: No dataset directory or config file provided.")
        sys.exit(1)

    output_path = Path(args.output)
    if not output_path.is_absolute():
        output_path = EVALUATION_DIR / output_path
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print_summary(result)
    print(f"Evaluation complete. Full JSON exported to: {output_path}")


if __name__ == "__main__":
    main()
