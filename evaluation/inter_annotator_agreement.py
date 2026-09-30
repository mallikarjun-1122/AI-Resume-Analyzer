"""Inter-Annotator Agreement Engine for AI Resume Analyzer Research.

Calculates:
  1. Cohen's Kappa (kappa) for binary/categorical skill extraction agreement between two raters.
  2. Intraclass Correlation Coefficient (ICC(2,1)) for continuous 0-100 relevance ratings.
  3. Kendall's Coefficient of Concordance (W) and mean Spearman's rho for candidate cohort rankings across multiple raters.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Sequence, Tuple

EVALUATION_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = EVALUATION_DIR.parent
sys.path.insert(0, str(REPOSITORY_ROOT / "backend"))

from app.database.skill_loader import get_all_skills
try:
    from metrics import average_ranks, pearson_correlation
except ImportError:
    from evaluation.metrics import average_ranks, pearson_correlation


# -------------------------------------------------------------
# 1. Cohen's Kappa for Categorical / Extraction Annotations
# -------------------------------------------------------------
def calculate_cohens_kappa(rater1_binary: Sequence[int], rater2_binary: Sequence[int]) -> float:
    """Calculate Cohen's kappa for two raters over binary presence/absence items."""
    if len(rater1_binary) != len(rater2_binary) or len(rater1_binary) == 0:
        return 0.0

    n = len(rater1_binary)
    # Contingency table
    # a: both 1, b: r1=1, r2=0, c: r1=0, r2=1, d: both 0
    a = sum(1 for x, y in zip(rater1_binary, rater2_binary) if x == 1 and y == 1)
    b = sum(1 for x, y in zip(rater1_binary, rater2_binary) if x == 1 and y == 0)
    c = sum(1 for x, y in zip(rater1_binary, rater2_binary) if x == 0 and y == 1)
    d = sum(1 for x, y in zip(rater1_binary, rater2_binary) if x == 0 and y == 0)

    p_observed = (a + d) / n

    # Marginal probabilities
    p_rater1_yes = (a + b) / n
    p_rater1_no = (c + d) / n
    p_rater2_yes = (a + c) / n
    p_rater2_no = (b + d) / n

    p_expected = (p_rater1_yes * p_rater2_yes) + (p_rater1_no * p_rater2_no)

    if math.isclose(p_expected, 1.0):
        return 1.0
    return (p_observed - p_expected) / (1.0 - p_expected)


def evaluate_skills_kappa(
    rater1_annotations: List[dict],
    rater2_annotations: List[dict],
    vocabulary: List[str] | None = None,
) -> dict:
    """Computes mean Cohen's kappa across resumes for extracted skills."""
    if vocabulary is None:
        vocabulary = get_all_skills()

    vocab_set = [s.casefold() for s in vocabulary]
    r1_map = {rec["resume_id"]: rec for rec in rater1_annotations}
    r2_map = {rec["resume_id"]: rec for rec in rater2_annotations}

    shared_resumes = sorted(list(set(r1_map.keys()) & set(r2_map.keys())))
    if not shared_resumes:
        return {"shared_resumes": 0, "mean_kappa": None, "by_resume": {}}

    res_kappas = {}
    for rid in shared_resumes:
        r1_skills = {
            s.casefold()
            for vals in r1_map[rid].get("skills", {}).values()
            for s in vals
        }
        r2_skills = {
            s.casefold()
            for vals in r2_map[rid].get("skills", {}).values()
            for s in vals
        }

        vec1 = [1 if term in r1_skills else 0 for term in vocab_set]
        vec2 = [1 if term in r2_skills else 0 for term in vocab_set]

        res_kappas[rid] = calculate_cohens_kappa(vec1, vec2)

    valid_kappas = [k for k in res_kappas.values() if not math.isnan(k)]
    mean_k = sum(valid_kappas) / len(valid_kappas) if valid_kappas else None

    return {
        "shared_resumes": len(shared_resumes),
        "vocabulary_size": len(vocab_set),
        "mean_kappa": mean_k,
        "by_resume": res_kappas,
    }


# -------------------------------------------------------------
# 2. Intraclass Correlation Coefficient (ICC(2,1)) for 0-100 Scores
# -------------------------------------------------------------
def calculate_icc_2_1(matrix: List[List[float]]) -> float | None:
    """Calculate Two-Way Random Effects, Single Rater, Absolute Agreement: ICC(2,1).
    
    matrix: rows = n targets (resumes), columns = k raters.
    Must have n >= 2 targets, k >= 2 raters without missing values.
    """
    n = len(matrix)
    if n < 2:
        return None
    k = len(matrix[0])
    if k < 2:
        return None

    # Check consistent shape
    if any(len(row) != k for row in matrix):
        raise ValueError("All targets must have identical number of rater scores.")

    # Grand mean
    all_scores = [score for row in matrix for score in row]
    grand_mean = sum(all_scores) / (n * k)

    # Row means (target means)
    row_means = [sum(row) / k for row in matrix]

    # Column means (rater means)
    col_means = [sum(matrix[i][j] for i in range(n)) / n for j in range(k)]

    # Sum of squares
    # Between targets (rows)
    ss_rows = k * sum((rm - grand_mean) ** 2 for rm in row_means)
    ms_rows = ss_rows / (n - 1)

    # Between raters (columns)
    ss_cols = n * sum((cm - grand_mean) ** 2 for cm in col_means)
    ms_cols = ss_cols / (k - 1)

    # Residual sum of squares
    ss_error = sum(
        (matrix[i][j] - row_means[i] - col_means[j] + grand_mean) ** 2
        for i in range(n)
        for j in range(k)
    )
    ms_error = ss_error / ((n - 1) * (k - 1))

    denominator = ms_rows + (k - 1) * ms_error + (k / n) * (ms_cols - ms_error)
    if math.isclose(denominator, 0.0):
        return 0.0

    return (ms_rows - ms_error) / denominator


def evaluate_scores_agreement(score_records: List[dict]) -> dict:
    """Compute ICC(2,1) and pairwise Pearson correlations across multiple raters."""
    # Organize by (resume_id, jd_id) -> {evaluator_id: score}
    pairs_by_item: dict[Tuple[str, str], dict[str, float]] = defaultdict(dict)
    all_raters = set()

    for rec in score_records:
        rid = rec["resume_id"]
        jid = rec["jd_id"]
        eid = rec.get("evaluator_id", "default_evaluator")
        score = float(rec["expert_relevance_score"])
        pairs_by_item[(rid, jid)][eid] = score
        all_raters.add(eid)

    raters = sorted(list(all_raters))
    if len(raters) < 2:
        return {
            "raters_found": len(raters),
            "error": "At least 2 distinct evaluators required to calculate inter-rater agreement.",
        }

    # Keep only items evaluated by ALL raters
    complete_items = [
        item for item, scores in pairs_by_item.items()
        if all(r in scores for r in raters)
    ]

    if len(complete_items) < 2:
        return {
            "raters": raters,
            "complete_items_count": len(complete_items),
            "error": "Insufficient overlapping items rated by all evaluators (need at least 2).",
        }

    matrix = [[pairs_by_item[item][r] for r in raters] for item in complete_items]
    icc = calculate_icc_2_1(matrix)

    # Pairwise correlations
    pairwise_r = {}
    for i in range(len(raters)):
        for j in range(i + 1, len(raters)):
            r1, r2 = raters[i], raters[j]
            pts = [(pairs_by_item[it][r1], pairs_by_item[it][r2]) for it in complete_items]
            pairwise_r[f"{r1}_vs_{r2}"] = pearson_correlation(pts)

    return {
        "raters": raters,
        "eligible_items_evaluated": len(complete_items),
        "icc_2_1": icc,
        "pairwise_pearson_correlations": pairwise_r,
    }


# -------------------------------------------------------------
# 3. Ranking Agreement: Kendall's W & Mean Spearman's Rho
# -------------------------------------------------------------
def calculate_kendalls_w(ranking_matrix: List[List[float]]) -> float:
    """Calculate Kendall's coefficient of concordance (W).
    
    ranking_matrix: rows = m raters, columns = n candidates.
    """
    m = len(ranking_matrix)  # number of raters
    if m < 2:
        return 0.0
    n = len(ranking_matrix[0])  # number of candidates
    if n < 2:
        return 0.0

    # Sum of ranks for each candidate across all raters
    rank_sums = [sum(ranking_matrix[i][j] for i in range(m)) for j in range(n)]
    mean_rank_sum = (m * (n + 1)) / 2.0

    s = sum((r_sum - mean_rank_sum) ** 2 for r_sum in rank_sums)
    denominator = (m ** 2) * (n ** 3 - n)

    if denominator == 0:
        return 0.0

    return (12.0 * s) / denominator


def evaluate_rankings_agreement(ranking_records: List[dict]) -> dict:
    """Compute Kendall's W and mean pairwise Spearman rho per cohort."""
    cohorts_by_group: dict[str, list[dict]] = defaultdict(list)
    for rec in ranking_records:
        gid = rec.get("group_id", rec.get("jd_id", "default_cohort"))
        cohorts_by_group[gid].append(rec)

    results = {}
    valid_ws = []

    for gid, group_entries in cohorts_by_group.items():
        if len(group_entries) < 2:
            results[gid] = {"error": "Less than 2 independent raters for this group"}
            continue

        raters = [entry.get("evaluator_id", f"rater_{i}") for i, entry in enumerate(group_entries)]
        # Check candidate overlap
        candidate_sets = [set(entry["expert_rank"].keys()) for entry in group_entries]
        shared_candidates = sorted(list(set.intersection(*candidate_sets)))

        if len(shared_candidates) < 2:
            results[gid] = {"error": "Less than 2 shared candidates across raters"}
            continue

        ranking_matrix = [
            [float(entry["expert_rank"][cid]) for cid in shared_candidates]
            for entry in group_entries
        ]

        w = calculate_kendalls_w(ranking_matrix)
        valid_ws.append(w)

        # Pairwise Spearman
        pairwise_rhos = {}
        for i in range(len(raters)):
            for j in range(i + 1, len(raters)):
                r1, r2 = raters[i], raters[j]
                vals1 = ranking_matrix[i]
                vals2 = ranking_matrix[j]
                pts = list(zip(average_ranks(vals1), average_ranks(vals2)))
                pairwise_rhos[f"{r1}_vs_{r2}"] = pearson_correlation(pts)

        results[gid] = {
            "raters_count": len(raters),
            "candidates_count": len(shared_candidates),
            "kendalls_w": w,
            "pairwise_spearman_rho": pairwise_rhos,
        }

    return {
        "groups_evaluated": len(results),
        "mean_kendalls_w": sum(valid_ws) / len(valid_ws) if valid_ws else None,
        "by_group": results,
    }


def main():
    parser = argparse.ArgumentParser(description="Inter-Annotator Agreement Calculation Utility")
    parser.add_argument("--annotations1", help="Path to JSONL annotations from Evaluator 1")
    parser.add_argument("--annotations2", help="Path to JSONL annotations from Evaluator 2")
    parser.add_argument("--scores", help="Path to JSONL of expert scores containing multiple evaluator_ids")
    parser.add_argument("--rankings", help="Path to JSONL of expert rankings containing multiple evaluator_ids")
    parser.add_argument("--output", help="Optional path to export agreement results as JSON")
    args = parser.parse_args()

    results: dict[str, Any] = {
        "report": "Inter-Annotator Agreement Analysis",
        "standards": {
            "kappa_interpretation": "0.0-0.2: Slight, 0.21-0.40: Fair, 0.41-0.60: Moderate, 0.61-0.80: Substantial, 0.81-1.0: Almost Perfect (Landis & Koch, 1977)",
            "icc_interpretation": "<0.5: Poor, 0.5-0.75: Moderate, 0.75-0.9: Good, >0.90: Excellent (Koo & Li, 2016)",
            "kendalls_w_interpretation": "0.0: No agreement, 1.0: Complete concordance across all raters",
        }
    }

    if args.annotations1 and args.annotations2:
        p1 = Path(args.annotations1)
        p2 = Path(args.annotations2)
        r1_data = [json.loads(line) for line in p1.read_text(encoding="utf-8").splitlines() if line.strip() and not line.startswith("#")]
        r2_data = [json.loads(line) for line in p2.read_text(encoding="utf-8").splitlines() if line.strip() and not line.startswith("#")]
        results["extraction_cohens_kappa"] = evaluate_skills_kappa(r1_data, r2_data)

    if args.scores:
        sp = Path(args.scores)
        s_data = [json.loads(line) for line in sp.read_text(encoding="utf-8").splitlines() if line.strip() and not line.startswith("#")]
        results["scores_agreement_icc"] = evaluate_scores_agreement(s_data)

    if args.rankings:
        rp = Path(args.rankings)
        r_data = [json.loads(line) for line in rp.read_text(encoding="utf-8").splitlines() if line.strip() and not line.startswith("#")]
        results["rankings_agreement_kendall"] = evaluate_rankings_agreement(r_data)

    print("\n" + "=" * 65)
    print("INTER-ANNOTATOR AGREEMENT REPORT")
    print("=" * 65)
    print(json.dumps(results, indent=2))
    print("=" * 65)

    if args.output:
        out_p = Path(args.output)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        out_p.write_text(json.dumps(results, indent=2), encoding="utf-8")
        print(f"Agreement report saved to: {out_p}")


if __name__ == "__main__":
    main()
