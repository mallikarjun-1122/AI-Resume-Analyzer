import unittest
from pathlib import Path

from evaluation.annotate import validate_file, SCHEMAS_DIR, BASE_DIR

SYNTHETIC_DIR = BASE_DIR / "synthetic" / "data"


class SyntheticSchemaValidationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Verify synthetic directory exists
        if not (SYNTHETIC_DIR / "annotations" / "resume_annotations.jsonl").is_file():
            from evaluation.synthetic.generator import generate_dataset
            generate_dataset(SYNTHETIC_DIR, seed=42)

    def test_synthetic_resume_annotations_schema(self):
        file_path = SYNTHETIC_DIR / "annotations" / "resume_annotations.jsonl"
        schema_path = SCHEMAS_DIR / "resume_annotation.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))

    def test_synthetic_match_annotations_schema(self):
        file_path = SYNTHETIC_DIR / "annotations" / "match_annotations.jsonl"
        schema_path = SCHEMAS_DIR / "match_annotation.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))

    def test_synthetic_score_validity_schema(self):
        file_path = SYNTHETIC_DIR / "expert_scores" / "expert_scores.jsonl"
        schema_path = BASE_DIR / "dataset" / "expert_scores" / "score_validity.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))

    def test_synthetic_ranking_schema(self):
        file_path = SYNTHETIC_DIR / "expert_rankings" / "expert_rankings.jsonl"
        schema_path = BASE_DIR / "dataset" / "expert_rankings" / "ranking.schema.json"
        self.assertTrue(validate_file(file_path, schema_path))

    def test_synthetic_counts(self):
        resumes = list((SYNTHETIC_DIR / "resumes").glob("*.txt"))
        jds = list((SYNTHETIC_DIR / "job_descriptions").glob("*.txt"))
        pdfs = list((SYNTHETIC_DIR / "resumes").glob("*.pdf"))
        docxs = list((SYNTHETIC_DIR / "resumes").glob("*.docx"))

        self.assertEqual(len(resumes), 100)
        self.assertEqual(len(jds), 20)
        self.assertGreaterEqual(len(pdfs), 20)
        self.assertGreaterEqual(len(docxs), 20)


if __name__ == "__main__":
    unittest.main()
