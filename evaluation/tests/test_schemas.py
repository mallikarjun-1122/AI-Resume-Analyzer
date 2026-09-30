import unittest
from pathlib import Path

from evaluation.annotate import validate_file, SCHEMAS_DIR, BASE_DIR

DATASET_DIR = BASE_DIR / "dataset"


class SchemaValidationTests(unittest.TestCase):
    def test_resume_annotations_schema(self):
        file_path = DATASET_DIR / "annotations" / "resume_annotations.jsonl"
        schema_path = SCHEMAS_DIR / "resume_annotation.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))

    def test_match_annotations_schema(self):
        file_path = DATASET_DIR / "annotations" / "match_annotations.jsonl"
        schema_path = SCHEMAS_DIR / "match_annotation.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))

    def test_score_validity_schema(self):
        file_path = DATASET_DIR / "expert_scores" / "expert_scores.jsonl"
        schema_path = DATASET_DIR / "expert_scores" / "score_validity.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))

    def test_ranking_schema(self):
        file_path = DATASET_DIR / "expert_rankings" / "expert_rankings.jsonl"
        schema_path = DATASET_DIR / "expert_rankings" / "ranking.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))


if __name__ == "__main__":
    unittest.main()
