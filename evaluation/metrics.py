"""Dependency-free metrics for the rule-based resume analyser evaluation."""

from __future__ import annotations

import math
import re
from collections.abc import Iterable


def normalise(value: object) -> str:
    return re.sub(r"\s+", " ", str(value).strip().casefold())


def precision_recall_f1(predicted: Iterable[str], expected: Iterable[str]) -> dict:
    predicted_set = set(predicted)
    expected_set = set(expected)
    true_positive = len(predicted_set & expected_set)
    false_positive = len(predicted_set - expected_set)
    false_negative = len(expected_set - predicted_set)
    precision = true_positive / (true_positive + false_positive) if true_positive + false_positive else 0.0
    recall = true_positive / (true_positive + false_negative) if true_positive + false_negative else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return {
        "true_positive": true_positive,
        "false_positive": false_positive,
        "false_negative": false_negative,
        "precision": precision,
        "recall": recall,
        "f1": f1,
    }


def flatten_skills(skills: dict) -> set[str]:
    return {
        f"{normalise(category)}::{normalise(skill)}"
        for category, values in (skills or {}).items()
        for skill in (values or [])
    }


def flatten_record_list(records: list[dict], fields: tuple[str, ...]) -> set[str]:
    facts = set()
    for record in records or []:
        for field in fields:
            value = record.get(field)
            if isinstance(value, list):
                facts.update(f"{field}::{normalise(item)}" for item in value if item)
            elif value:
                facts.add(f"{field}::{normalise(value)}")
    return facts


def flatten_education(education: dict) -> set[str]:
    return {
        f"{field}::{normalise(value)}"
        for field, value in (education or {}).items()
        if value not in (None, "")
    }


def flatten_certifications(certifications: list[str]) -> set[str]:
    return {normalise(item) for item in certifications or [] if item}


def flatten_matching(matching: dict) -> set[str]:
    return flatten_skills((matching or {}).get("matched_skills", {}))


def flatten_skill_names(skills: dict | list | set | None) -> set[str]:
    if isinstance(skills, dict):
        return {normalise(s) for vals in skills.values() for s in (vals or []) if s}
    elif isinstance(skills, (list, set, tuple)):
        return {normalise(s) for s in skills if s}
    return set()


def pearson_correlation(pairs: list[tuple[float, float]]) -> float | None:
    if len(pairs) < 2:
        return None
    left, right = zip(*pairs)
    left_mean = sum(left) / len(left)
    right_mean = sum(right) / len(right)
    numerator = sum((x - left_mean) * (y - right_mean) for x, y in pairs)
    left_scale = math.sqrt(sum((x - left_mean) ** 2 for x in left))
    right_scale = math.sqrt(sum((y - right_mean) ** 2 for y in right))
    if left_scale == 0 or right_scale == 0:
        return None
    return numerator / (left_scale * right_scale)


def average_ranks(values: list[float]) -> list[float]:
    ordered = sorted(enumerate(values), key=lambda item: item[1])
    ranks = [0.0] * len(values)
    index = 0
    while index < len(ordered):
        end = index
        while end + 1 < len(ordered) and ordered[end + 1][1] == ordered[index][1]:
            end += 1
        rank = (index + end + 2) / 2
        for tied_index in range(index, end + 1):
            ranks[ordered[tied_index][0]] = rank
        index = end + 1
    return ranks


def score_summary(pairs: list[tuple[float, float]]) -> dict:
    if not pairs:
        return {"count": 0, "mae": None, "rmse": None, "pearson_r": None, "spearman_rho": None}
    errors = [predicted - expert for predicted, expert in pairs]
    mae = sum(abs(error) for error in errors) / len(errors)
    rmse = math.sqrt(sum(error**2 for error in errors) / len(errors))
    predicted, expert = zip(*pairs)
    ranked_pairs = list(zip(average_ranks(list(predicted)), average_ranks(list(expert))))
    return {
        "count": len(pairs),
        "mae": mae,
        "rmse": rmse,
        "pearson_r": pearson_correlation(pairs),
        "spearman_rho": pearson_correlation(ranked_pairs),
    }
