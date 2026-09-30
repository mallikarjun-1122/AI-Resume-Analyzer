import unittest
import math

from evaluation.inter_annotator_agreement import (
    calculate_cohens_kappa,
    calculate_icc_2_1,
    calculate_kendalls_w,
)


class InterAnnotatorAgreementTests(unittest.TestCase):
    def test_cohens_kappa_perfect_agreement(self):
        r1 = [1, 0, 1, 1, 0, 0, 1, 0]
        r2 = [1, 0, 1, 1, 0, 0, 1, 0]
        kappa = calculate_cohens_kappa(r1, r2)
        self.assertAlmostEqual(kappa, 1.0, places=4)

    def test_cohens_kappa_complete_disagreement(self):
        r1 = [1, 1, 1, 1, 0, 0, 0, 0]
        r2 = [0, 0, 0, 0, 1, 1, 1, 1]
        kappa = calculate_cohens_kappa(r1, r2)
        self.assertAlmostEqual(kappa, -1.0, places=4)

    def test_icc_2_1_perfect_agreement(self):
        # 4 items rated by 2 raters with exact identical scores
        matrix = [
            [80.0, 80.0],
            [90.0, 90.0],
            [40.0, 40.0],
            [20.0, 20.0],
        ]
        icc = calculate_icc_2_1(matrix)
        self.assertIsNotNone(icc)
        self.assertAlmostEqual(icc, 1.0, places=4)

    def test_icc_2_1_known_variance(self):
        # Moderate agreement
        matrix = [
            [80.0, 85.0],
            [70.0, 65.0],
            [40.0, 50.0],
            [30.0, 35.0],
        ]
        icc = calculate_icc_2_1(matrix)
        self.assertIsNotNone(icc)
        self.assertTrue(0.7 < icc < 1.0)

    def test_kendalls_w_perfect_concordance(self):
        # 3 raters ranking 4 candidates identically: ranks 1, 2, 3, 4
        matrix = [
            [1.0, 2.0, 3.0, 4.0],
            [1.0, 2.0, 3.0, 4.0],
            [1.0, 2.0, 3.0, 4.0],
        ]
        w = calculate_kendalls_w(matrix)
        self.assertAlmostEqual(w, 1.0, places=4)

    def test_kendalls_w_complete_discordance(self):
        # 2 raters with inverted ranks
        matrix = [
            [1.0, 2.0, 3.0],
            [3.0, 2.0, 1.0],
        ]
        w = calculate_kendalls_w(matrix)
        self.assertAlmostEqual(w, 0.0, places=4)


if __name__ == "__main__":
    unittest.main()
