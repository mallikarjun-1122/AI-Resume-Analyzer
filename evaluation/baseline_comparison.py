"""Baseline Comparison Experiment for AI Resume Analyzer.

Compares three transparent, reproducible, rule-based matching strategies:
  - Baseline A: Exact dictionary matching (strict case-sensitive).
  - Baseline B: Case-insensitive normalized matching (current production system).
  - Baseline C: Synonym-normalized rule-based matching (deterministic mapping table).

NOTE: No embeddings, ML classifiers, or neural models are used, in order to rigorously
benchmark rule-based representations before introducing non-deterministic methods.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Set

EVALUATION_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = EVALUATION_DIR.parent
sys.path.insert(0, str(REPOSITORY_ROOT / "backend"))

from app.extractors.skills import SKILL_DATABASE, extract_skills as extract_skills_prod
try:
    from metrics import precision_recall_f1, normalise
except ImportError:
    from evaluation.metrics import precision_recall_f1, normalise

SYNONYMS_FILE = EVALUATION_DIR / "baselines" / "synonyms.json"


def load_synonyms() -> dict[str, str]:
    if not SYNONYMS_FILE.is_file():
        return {}
    data = json.loads(SYNONYMS_FILE.read_text(encoding="utf-8"))
    return {k.casefold(): v for k, v in data.get("mappings", {}).items()}


# -------------------------------------------------------------
# Baseline A: Exact Dictionary Matching (Strict Case-Sensitive)
# -------------------------------------------------------------
def extract_skills_baseline_a(text: str) -> dict[str, list[str]]:
    extracted: dict[str, list[str]] = {}
    for category, skills in SKILL_DATABASE.items():
        found = []
        for skill in skills:
            # Strict case-sensitive match with word boundaries
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, text):
                found.append(skill)
        if found:
            extracted[category] = sorted(list(set(found)))
    return extracted


# -------------------------------------------------------------
# Baseline B: Case-Insensitive Normalized Matching (Production)
# -------------------------------------------------------------
def extract_skills_baseline_b(text: str) -> dict[str, list[str]]:
    return extract_skills_prod(text)


# -------------------------------------------------------------
# Baseline C: Synonym-Normalized Rule-Based Matching
# -------------------------------------------------------------
def extract_skills_baseline_c(text: str, synonyms: dict[str, str]) -> dict[str, list[str]]:
    # Start with production extraction
    extracted = extract_skills_prod(text)

    # Invert skill database to find category for canonical skill
    skill_to_cat: dict[str, str] = {}
    for category, skills in SKILL_DATABASE.items():
        for skill in skills:
            skill_to_cat[skill.casefold()] = category

    # Check for known synonyms in text
    for synonym, canonical in synonyms.items():
        pattern = r"\b" + re.escape(synonym) + r"\b"
        if re.search(pattern, text, re.IGNORECASE):
            cat = skill_to_cat.get(canonical.casefold(), "Tools & IDEs")
            if cat not in extracted:
                extracted[cat] = []
            if canonical not in extracted[cat]:
                extracted[cat].append(canonical)
                extracted[cat].sort()

    return extracted


def flatten_to_skill_names(skill_dict: dict[str, list[str]]) -> set[str]:
    return {normalise(s) for vals in skill_dict.values() for s in vals}


def run_baseline_comparison(dataset_dir: Path) -> dict:
    synonyms = load_synonyms()
    anno_file = dataset_dir / "annotations" / "resume_annotations.jsonl"
    resumes_dir = dataset_dir / "resumes"

    if not anno_file.is_file():
        raise FileNotFoundError(f"Annotations file not found: {anno_file}")

    records = []
    with anno_file.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                records.append(json.loads(line))

    preds_a = []
    preds_b = []
    preds_c = []
    golds = []

    per_resume_results = []

    for rec in records:
        rid = rec["resume_id"]
        txt_path = resumes_dir / f"{rid}.txt"
        if not txt_path.is_file():
            continue
        text = txt_path.read_text(encoding="utf-8")

        gold_set = flatten_to_skill_names(rec.get("skills", {}))

        res_a = flatten_to_skill_names(extract_skills_baseline_a(text))
        res_b = flatten_to_skill_names(extract_skills_baseline_b(text))
        res_c = flatten_to_skill_names(extract_skills_baseline_c(text, synonyms))

        preds_a.extend(f"{rid}::{s}" for s in res_a)
        preds_b.extend(f"{rid}::{s}" for s in res_b)
        preds_c.extend(f"{rid}::{s}" for s in res_c)
        golds.extend(f"{rid}::{s}" for s in gold_set)

        per_resume_results.append({
            "resume_id": rid,
            "gold_skills_count": len(gold_set),
            "baseline_a": {"extracted_count": len(res_a), "metrics": precision_recall_f1(res_a, gold_set)},
            "baseline_b": {"extracted_count": len(res_b), "metrics": precision_recall_f1(res_b, gold_set)},
            "baseline_c": {"extracted_count": len(res_c), "metrics": precision_recall_f1(res_c, gold_set)},
        })

    overall_metrics = {
        "Baseline_A_Exact_Dictionary": precision_recall_f1(preds_a, golds),
        "Baseline_B_Normalized_Case_Insensitive": precision_recall_f1(preds_b, golds),
        "Baseline_C_Synonym_Normalized": precision_recall_f1(preds_c, golds),
    }

    # Controlled variation sentence test
    variation_texts = [
        "Core proficiencies: python, fastapi, postgresql, docker, node.js",
        "Experience building with Golang, Postgres, K8s, ReactJS, and AWS Cloud.",
        "Skills include PYTHON, JAVASCRIPT, SQL, and DOCKER.",
    ]
    controlled_tests = []
    for vt in variation_texts:
        controlled_tests.append({
            "text": vt,
            "baseline_a_exact": sorted(list(flatten_to_skill_names(extract_skills_baseline_a(vt)))),
            "baseline_b_normalized": sorted(list(flatten_to_skill_names(extract_skills_baseline_b(vt)))),
            "baseline_c_synonyms": sorted(list(flatten_to_skill_names(extract_skills_baseline_c(vt, synonyms)))),
        })

    return {
        "metadata": {
            "experiment": "Rule-Based Baseline Comparison",
            "baselines": {
                "Baseline_A": "Exact Dictionary Matching (case-sensitive)",
                "Baseline_B": "Normalized Case-Insensitive Rule Matching (current production)",
                "Baseline_C": "Synonym-Normalized Rule Matching (canonical mapping table)",
            },
            "dataset_label": "DEMO DATA — NOT FOR RESEARCH RESULTS",
        },
        "overall_metrics": overall_metrics,
        "per_resume_evaluation": per_resume_results,
        "controlled_variation_tests": controlled_tests,
    }


def main():
    parser = argparse.ArgumentParser(description="Baseline Comparison Runner")
    parser.add_argument("--dataset", default=str(EVALUATION_DIR / "dataset"), help="Path to evaluation dataset")
    parser.add_argument("--output", default="results/baseline_comparison.json", help="Export path for comparison JSON")
    args = parser.parse_args()

    dataset_path = Path(args.dataset)
    if not dataset_path.is_absolute():
        dataset_path = (Path.cwd() / dataset_path).resolve()

    results = run_baseline_comparison(dataset_path)

    out_p = Path(args.output)
    if not out_p.is_absolute():
        out_p = EVALUATION_DIR / out_p
    out_p.parent.mkdir(parents=True, exist_ok=True)
    out_p.write_text(json.dumps(results, indent=2), encoding="utf-8")

    print("\n" + "=" * 70)
    print("BASELINE COMPARISON RESULTS (Rule-Based Approaches)")
    print("=" * 70)
    print(f"{'Baseline Strategy':<42} | {'Precision':<9} | {'Recall':<9} | {'F1':<9}")
    print("-" * 70)
    for b_name, m in results["overall_metrics"].items():
        print(f"{b_name:<42} | {m['precision']:<9.3f} | {m['recall']:<9.3f} | {m['f1']:<9.3f}")
    print("=" * 70)
    print(f"Results exported to: {out_p}\n")


if __name__ == "__main__":
    main()
