"""Local annotation helper tool for researchers to create, inspect, and validate gold annotations."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import jsonschema

try:
    from contamination_guard import scan_file_for_contamination
except ImportError:
    from evaluation.contamination_guard import scan_file_for_contamination

BASE_DIR = Path(__file__).resolve().parent
SCHEMAS_DIR = BASE_DIR / "dataset" / "annotations"
TEMPLATES_DIR = BASE_DIR / "templates"


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def validate_file(file_path: Path, schema_path: Path) -> bool:
    schema = load_json(schema_path)
    records = []
    if file_path.suffix == ".jsonl":
        with file_path.open(encoding="utf-8") as f:
            for line_no, line in enumerate(f, start=1):
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                try:
                    records.append((line_no, json.loads(line)))
                except json.JSONDecodeError as e:
                    print(f"ERROR: Line {line_no} of {file_path} is invalid JSON: {e}")
                    return False
    else:
        records.append((1, load_json(file_path)))

    errors = 0
    validator = jsonschema.Draft202012Validator(schema)
    for line_no, record in records:
        record_errors = sorted(validator.iter_errors(record), key=lambda e: e.path)
        if record_errors:
            errors += 1
            print(f"\n[Validation Error] Record at line {line_no} in {file_path.name}:")
            for err in record_errors:
                field = ".".join(str(p) for p in err.path) or "(root)"
                print(f"  - Field '{field}': {err.message}")

    if errors == 0:
        print(f"SUCCESS: {len(records)} records in {file_path.name} valid against {schema_path.name}")
        return True
    else:
        print(f"FAILED: Found errors in {errors} of {len(records)} records.")
        return False


def create_new_template(template_type: str, output_path: Path | None, item_id: str) -> None:
    if template_type == "resume":
        template_file = TEMPLATES_DIR / "resume_annotation_template.json"
        data = load_json(template_file)
        data["resume_id"] = item_id
        data["file_path"] = f"resumes/{item_id}.txt"
    elif template_type == "match":
        template_file = TEMPLATES_DIR / "match_annotation_template.json"
        data = load_json(template_file)
        data["match_id"] = item_id
    else:
        raise ValueError(f"Unknown template type: {template_type}")

    out_content = json.dumps(data, indent=2)
    if output_path:
        output_path.write_text(out_content, encoding="utf-8")
        print(f"Template saved to: {output_path}")
    else:
        print(out_content)


def inspect_dataset(dataset_dir: Path) -> None:
    resumes_dir = dataset_dir / "resumes"
    jds_dir = dataset_dir / "job_descriptions"
    resume_anno = dataset_dir / "annotations" / "resume_annotations.jsonl"
    match_anno = dataset_dir / "annotations" / "match_annotations.jsonl"

    print("\n" + "=" * 60)
    print("EVALUATION DATASET INSPECTION")
    print("=" * 60)

    resumes = list(resumes_dir.glob("*.*")) if resumes_dir.is_dir() else []
    print(f"Total raw resumes found: {len(resumes)}")
    for r in resumes:
        print(f"  - {r.name} ({r.stat().st_size} bytes)")

    jds = list(jds_dir.glob("*.txt")) if jds_dir.is_dir() else []
    print(f"\nTotal raw job descriptions found: {len(jds)}")
    for j in jds:
        print(f"  - {j.name} ({j.stat().st_size} bytes)")

    if resume_anno.is_file():
        count = sum(1 for line in resume_anno.open(encoding="utf-8") if line.strip() and not line.startswith("#"))
        print(f"\nGold resume extraction annotations: {count} entries")

    if match_anno.is_file():
        count = sum(1 for line in match_anno.open(encoding="utf-8") if line.strip() and not line.startswith("#"))
        print(f"Gold resume-JD match annotations: {count} entries")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Annotation Tooling & Validation Utility")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Validate
    val_parser = subparsers.add_parser("validate", help="Validate an annotation file against its schema")
    val_parser.add_argument("file", help="Path to JSON or JSONL annotation file")
    val_parser.add_argument("--schema", help="Explicit path to JSON schema. If omitted, guessed automatically.")
    val_parser.add_argument("--strict-real", action="store_true", help="Reject file if any synthetic demo markers are present.")

    # New template
    new_parser = subparsers.add_parser("new", help="Generate a blank annotation template")
    new_parser.add_argument("--type", choices=["resume", "match"], default="resume")
    new_parser.add_argument("--id", default="candidate_01", help="ID for candidate or match pair")
    new_parser.add_argument("--output", help="Output file path (prints to stdout if omitted)")

    # Inspect
    insp_parser = subparsers.add_parser("inspect", help="Inspect dataset coverage")
    insp_parser.add_argument("--dir", default=str(BASE_DIR / "dataset"), help="Path to dataset directory")

    args = parser.parse_args()

    if args.command == "validate":
        target = Path(args.file)
        if args.strict_real:
            issues = scan_file_for_contamination(target)
            if issues:
                print(f"CONTAMINATION ERROR: {target.name} contains demo data markers and cannot be used in real research:")
                for iss in issues:
                    print(f"  - {iss}")
                sys.exit(1)

        if args.schema:
            schema_path = Path(args.schema)
        else:
            if "resume" in target.name:
                schema_path = SCHEMAS_DIR / "resume_annotation.schema.json"
            elif "match" in target.name:
                schema_path = SCHEMAS_DIR / "match_annotation.schema.json"
            elif "score" in target.name:
                schema_path = BASE_DIR / "dataset" / "expert_scores" / "score_validity.schema.json"
            elif "ranking" in target.name:
                schema_path = BASE_DIR / "dataset" / "expert_rankings" / "ranking.schema.json"
            elif "evaluator" in target.name:
                schema_path = SCHEMAS_DIR / "evaluator_metadata.schema.json"
            else:
                print("Error: Could not automatically detect schema. Please supply --schema path.")
                sys.exit(1)
        valid = validate_file(target, schema_path)
        sys.exit(0 if valid else 1)

    elif args.command == "new":
        out_p = Path(args.output) if args.output else None
        create_new_template(args.type, out_p, args.id)

    elif args.command == "inspect":
        inspect_dataset(Path(args.dir))


if __name__ == "__main__":
    main()
