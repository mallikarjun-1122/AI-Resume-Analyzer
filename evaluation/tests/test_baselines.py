import unittest
from pathlib import Path

from evaluation.baseline_comparison import (
    extract_skills_baseline_a,
    extract_skills_baseline_b,
    extract_skills_baseline_c,
    flatten_to_skill_names,
    load_synonyms,
)


class BaselineComparisonTests(unittest.TestCase):
    def setUp(self):
        self.synonyms = load_synonyms()

    def test_baseline_a_case_sensitivity(self):
        # Baseline A requires exact case
        res_exact = extract_skills_baseline_a("Expert in Python and SQL")
        skills_exact = flatten_to_skill_names(res_exact)
        self.assertIn("python", skills_exact)
        self.assertIn("sql", skills_exact)

        res_lower = extract_skills_baseline_a("Expert in python and sql")
        skills_lower = flatten_to_skill_names(res_lower)
        # "python" is lowercase, dictionary has "Python", so Baseline A misses it
        self.assertNotIn("python", skills_lower)

    def test_baseline_b_case_insensitivity(self):
        # Baseline B ignores case
        res_lower = extract_skills_baseline_b("Expert in python and sql")
        skills_lower = flatten_to_skill_names(res_lower)
        self.assertIn("python", skills_lower)
        self.assertIn("sql", skills_lower)

    def test_baseline_c_synonym_resolution(self):
        # Baseline C maps "postgres" to "PostgreSQL" and "golang" to "Go"
        text = "Experience with Golang and Postgres"
        res_b = flatten_to_skill_names(extract_skills_baseline_b(text))
        self.assertNotIn("go", res_b)
        self.assertNotIn("postgresql", res_b)

        res_c = flatten_to_skill_names(extract_skills_baseline_c(text, self.synonyms))
        self.assertIn("go", res_c)
        self.assertIn("postgresql", res_c)


if __name__ == "__main__":
    unittest.main()
