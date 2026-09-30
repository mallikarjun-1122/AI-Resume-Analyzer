import unittest
import math

from evaluation.metrics import (
    average_ranks,
    flatten_skill_names,
    pearson_correlation,
    precision_recall_f1,
    score_summary,
)


class PrecisionRecallF1Tests(unittest.TestCase):
    def test_exact_overlap(self):
        result = precision_recall_f1({"skill-a"}, {"skill-a"})
        self.assertEqual(result["precision"], 1.0)
        self.assertEqual(result["recall"], 1.0)
        self.assertEqual(result["f1"], 1.0)

    def test_empty_prediction_has_zero_recall(self):
        result = precision_recall_f1(set(), {"skill-a"})
        self.assertEqual(result["precision"], 0.0)
        self.assertEqual(result["recall"], 0.0)
        self.assertEqual(result["f1"], 0.0)

    def test_empty_both_returns_zero(self):
        result = precision_recall_f1(set(), set())
        self.assertEqual(result["precision"], 0.0)
        self.assertEqual(result["recall"], 0.0)
        self.assertEqual(result["f1"], 0.0)

    def test_partial_overlap(self):
        result = precision_recall_f1({"a", "b"}, {"b", "c"})
        self.assertAlmostEqual(result["precision"], 0.5)
        self.assertAlmostEqual(result["recall"], 0.5)
        self.assertAlmostEqual(result["f1"], 0.5)


class MetricCorrelationTests(unittest.TestCase):
    def test_perfect_linear_correlation(self):
        pairs = [(10.0, 10.0), (20.0, 20.0), (30.0, 30.0), (40.0, 40.0)]
        r = pearson_correlation(pairs)
        self.assertIsNotNone(r)
        self.assertAlmostEqual(r, 1.0, places=4)

    def test_negative_linear_correlation(self):
        pairs = [(10.0, 40.0), (20.0, 30.0), (30.0, 20.0), (40.0, 10.0)]
        r = pearson_correlation(pairs)
        self.assertIsNotNone(r)
        self.assertAlmostEqual(r, -1.0, places=4)

    def test_constant_values_return_none(self):
        pairs = [(50.0, 10.0), (50.0, 20.0), (50.0, 30.0)]
        self.assertIsNone(pearson_correlation(pairs))

    def test_single_pair_returns_none(self):
        self.assertIsNone(pearson_correlation([(50.0, 50.0)]))

    def test_average_ranks_with_ties(self):
        values = [10.0, 20.0, 20.0, 30.0]
        ranks = average_ranks(values)
        self.assertEqual(ranks, [1.0, 2.5, 2.5, 4.0])

    def test_score_summary_computations(self):
        pairs = [(80.0, 90.0), (60.0, 50.0)]
        summary = score_summary(pairs)
        self.assertEqual(summary["count"], 2)
        self.assertAlmostEqual(summary["mae"], 10.0)
        self.assertAlmostEqual(summary["rmse"], 10.0)
        self.assertAlmostEqual(summary["pearson_r"], 1.0)
        self.assertAlmostEqual(summary["spearman_rho"], 1.0)


class SkillFlattenTests(unittest.TestCase):
    def test_flatten_skill_names_dict(self):
        d = {"Languages": ["Python", "JavaScript"], "Frontend": ["React"]}
        flat = flatten_skill_names(d)
        self.assertEqual(flat, {"python", "javascript", "react"})

    def test_flatten_skill_names_list(self):
        l = ["Python", "SQL", "Docker"]
        flat = flatten_skill_names(l)
        self.assertEqual(flat, {"python", "sql", "docker"})


if __name__ == "__main__":
    unittest.main()
