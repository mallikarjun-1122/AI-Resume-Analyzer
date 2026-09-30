"""Contamination Guard to prevent mixing synthetic DEMO DATA with REAL RESEARCH DATA."""

from __future__ import annotations

import re
from pathlib import Path
from typing import List, Tuple

DEMO_MARKERS = [
    "demo data",
    "not for research results",
    "resume_01_fullstack_standard",
    "resume_02_backend_alt_headings",
    "resume_03_junior_data_analyst",
    "resume_04_missing_sections",
    "resume_05_no_recognized_skills",
    "jd_01_senior_fullstack",
    "jd_02_junior_analyst",
    "jd_03_office_manager_no_skills",
    "evaluator_demo",
    "alex morgan",
    "jordan lee",
    "taylor sam",
    "riley green",
    "morgan bailey",
]


def check_content_for_demo_markers(text: str) -> List[str]:
    """Returns any demo markers found within text."""
    lower_text = text.lower()
    found = []
    for marker in DEMO_MARKERS:
        if marker in lower_text:
            found.append(marker)
    return found


def scan_file_for_contamination(file_path: Path) -> List[str]:
    """Scans a file name and content for synthetic demo markers."""
    issues = []
    # Check filename
    filename_lower = file_path.name.lower()
    for marker in DEMO_MARKERS:
        if marker in filename_lower:
            issues.append(f"Filename contains demo marker '{marker}'")

    # Check content if text file
    if file_path.suffix.lower() in (".txt", ".json", ".jsonl", ".csv", ".md"):
        try:
            content = file_path.read_text(encoding="utf-8", errors="ignore")
            found = check_content_for_demo_markers(content)
            for m in found:
                issues.append(f"Content contains demo marker '{m}'")
        except Exception:
            pass
    return issues


def scan_directory_for_contamination(directory: Path) -> List[Tuple[Path, List[str]]]:
    """Recursively scans a directory for demo data contamination."""
    contaminated_files = []
    for f in directory.rglob("*"):
        if f.is_file() and not f.name.endswith((".py", ".pyc", ".schema.json")):
            issues = scan_file_for_contamination(f)
            if issues:
                contaminated_files.append((f, issues))
    return contaminated_files


def assert_clean_real_dataset(directory: Path) -> None:
    """Raises ValueError if any synthetic demo markers are found in the dataset."""
    contamination = scan_directory_for_contamination(directory)
    if contamination:
        details = "\n".join(
            f"  - {path.name}: {', '.join(issues)}"
            for path, issues in contamination[:10]
        )
        raise ValueError(
            f"RESEARCH CONTAMINATION ERROR!\n"
            f"The directory '{directory}' contains synthetic demo data markers and cannot be evaluated as a real research dataset.\n"
            f"Found contaminated files:\n{details}"
        )
