# Experimental Evaluation Protocol & Reproducibility Standard

**Project**: AI Resume Analyzer (Deterministic Engineering Baseline)  
**Document Status**: Official Research Protocol  

---

## 1. Research Scope & Architectural Baseline

The system under evaluation is a **deterministic, rule-based keyword and structural extractor with a heuristic weighted scoring formula**.

### A. Non-Claims (What the System IS NOT)
- The system is **NOT an AI/ML semantic embedding matcher**.
- The 100-point ATS score is **NOT an industry-validated ATS standard**, **NOT a predictive probability of employment**, and **NOT an automated hiring decision**.
- Generative AI (LLM / Gemini API) is an optional assistive feature for rewriting and is **strictly excluded** from the deterministic evaluation protocol.

### B. Core Research Question
To what degree does an interpretable, transparent, fixed-vocabulary keyword matching pipeline and structural heuristic correlate with human expert relevance judgements, and how brittle is it under real-world document, structural, and linguistic variations?

---

## 2. Dataset Requirements

A valid empirical dataset must adhere to the following standards:

1. **Document Corpus**:
   - Machine-readable resumes in `.txt`, `.pdf`, or `.docx` formats.
   - Genuine or realistic job descriptions from target technical domains.
   - Anonymized and privacy-compliant: all personal identifying information (PII) must be synthetic or consented.
2. **Gold Standards**:
   - Pre-annotated ground truth stored in `evaluation/dataset/annotations/` conforming to `resume_annotation.schema.json` and `match_annotation.schema.json`.
   - Independent human expert relevance scores (0–100) stored in `evaluation/dataset/expert_scores/`.
   - Cohort candidate rankings (minimum 2, recommended 5–10 per job description) stored in `evaluation/dataset/expert_rankings/`.
3. **Demo Data Boundary**:
   - The synthetic files bundled under `evaluation/dataset/` are labelled **`DEMO DATA — NOT FOR RESEARCH RESULTS`**.
   - These files exist solely to verify pipeline execution and must **never** be cited or reported as empirical experimental findings.

---

## 3. Human Annotation Procedure

1. **Blinding**:
   - Human annotators must evaluate resumes and JDs **strictly blinded** to system outputs, ATS scores, match percentages, and automated rankings.
2. **Rater Qualifications**:
   - Annotators must be qualified domain specialists (e.g. computer science educators, senior software engineers, or technical talent acquisition professionals).
3. **Multi-Annotator Inter-Rater Reliability**:
   - A minimum of 2 independent annotators must score each resume-JD pair.
   - Report inter-rater agreement using **Cohen's Kappa (\(\kappa\))** for skill categorizations and **Intraclass Correlation (ICC)** for continuous relevance scores.
4. **Tools & Templates**:
   - Annotations must be generated using templates in `evaluation/templates/` and validated using:
     ```powershell
     python evaluation/annotate.py validate <annotation_file.jsonl>
     ```

---

## 4. Experimental Variables & Metrics

### A. Extraction Performance (Information Extraction)
Evaluated across 5 entities: **Skills**, **Education**, **Experience**, **Projects**, and **Certifications**.
$$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad F_1 = \frac{2 \cdot P \cdot R}{P + R}$$
- Micro-averaged across all candidate documents.

### B. Resume-JD Match Performance
Evaluated on **Matched Skills** and **Missing Skills** sets:
- Precision, Recall, and \(F_1\) comparing system detected overlap against gold-annotated overlap.

### C. Heuristic Score Validity
Evaluates correspondence between heuristic 100-point score (\(S_{\text{sys}}\)) and expert relevance score (\(S_{\text{exp}}\)):
- **Mean Absolute Error (MAE)**:
  $$\text{MAE} = \frac{1}{N} \sum_{i=1}^N |S_{\text{sys}, i} - S_{\text{exp}, i}|$$
- **Root Mean Squared Error (RMSE)**:
  $$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N (S_{\text{sys}, i} - S_{\text{exp}, i})^2}$$
- **Pearson Linear Correlation (\(r\))**:
  $$r = \frac{\sum (S_{\text{sys}} - \bar{S}_{\text{sys}})(S_{\text{exp}} - \bar{S}_{\text{exp}})}{\sqrt{\sum (S_{\text{sys}} - \bar{S}_{\text{sys}})^2 \sum (S_{\text{exp}} - \bar{S}_{\text{exp}})^2}}$$
- **Spearman Rank Correlation (\(\rho\))**:
  $$\rho = 1 - \frac{6 \sum d_i^2}{N(N^2 - 1)}$$

### D. Cohort Candidate Ranking Agreement
- Evaluates candidate cohort ordering per job description.
- Evaluated via **Spearman Rank Correlation (\(\rho\))** between the descending system score order and ascending human expert ranking (where Rank 1 is top).
- Mean \(\rho\) reported across all eligible cohorts (\(N \ge 2\)).

### E. Robustness & Ablation Dimensions
- **Format Invariance**: PDF vs DOCX vs TXT extraction fidelity.
- **Section Heading Sensitivity**: Standard vs alternative vs unsupported heading syntax.
- **Lexical Surface Form Robustness**: Exact vs case variants vs punctuation variants vs synonyms.
- **Structural Ablation**: Impact of omitting Skills, Experience, Education, Projects, or Certifications.
- **Skill Density Boundary**: Behavior when JD has high, low, or zero recognized dictionary skills.

### F. Baseline Comparison
Strictly rule-based comparison before introducing learned models:
- **Baseline A**: Strict Case-Sensitive Exact Dictionary Matching.
- **Baseline B**: Normalized Case-Insensitive Rule Matching (production).
- **Baseline C**: Synonym-Normalized Rule Matching (canonical mapping table).

---

## 5. Execution Commands & Workflow

To reproduce all experiments, execute from repository root in a Python 3.10+ environment:

### Step 1: Install Dependencies
```powershell
pip install -r backend/requirements.txt
```

### Step 2: Validate Dataset Annotations
```powershell
python evaluation/annotate.py validate evaluation/dataset/annotations/resume_annotations.jsonl
python evaluation/annotate.py validate evaluation/dataset/annotations/match_annotations.jsonl
python evaluation/annotate.py validate evaluation/dataset/expert_scores/expert_scores.jsonl
python evaluation/annotate.py validate evaluation/dataset/expert_rankings/expert_rankings.jsonl
```

### Step 3: Run Full Evaluation Pipeline
```powershell
python evaluation/run_evaluation.py --dataset evaluation/dataset --output evaluation/results/evaluation.json
```

### Step 4: Run Robustness Experiment Suite
```powershell
python evaluation/robustness_runner.py --dataset evaluation/dataset --output evaluation/results/robustness_report.json
```

### Step 5: Run Baseline Comparison Suite
```powershell
python evaluation/baseline_comparison.py --dataset evaluation/dataset --output evaluation/results/baseline_comparison.json
```

### Step 6: Run Unit & Regression Tests
```powershell
python -m unittest discover -s evaluation/tests
```

---

## 6. Expected Output Files

All experiment runners generate structured JSON outputs under `evaluation/results/`:
1. `evaluation/results/evaluation.json`:
   - Extraction metrics (Precision, Recall, F1 for 5 entities).
   - Matching metrics (Precision, Recall, F1 for matched/missing skills).
   - Score validity metrics (MAE, RMSE, Pearson r, Spearman rho).
   - Cohort ranking metrics (group-wise and mean Spearman rho).
2. `evaluation/results/robustness_report.json`:
   - Multi-format overlap scores (PDF/DOCX vs TXT).
   - Heading variation sensitivity metrics.
   - Skill wording variation metrics.
   - Structural ablation delta scores.
   - JD skill density boundary analysis.
3. `evaluation/results/baseline_comparison.json`:
   - Direct comparison table for Baseline A, Baseline B, and Baseline C.
   - Detailed per-resume extraction differences.
   - Controlled variation sentence diagnostic results.

---

## 7. What Constitutes a Valid vs. Invalid Research Result

### Valid Research Results:
- Results generated from **real human-annotated data** with verified provenance.
- Results reporting confidence intervals and inter-rater agreement statistics.
- Explicit disclosures of rule-based boundary conditions (e.g. 0-skill JDs yielding 40/40 points).
- Measured correlation values reported with exact sample sizes and p-values.

### STRICTLY PROHIBITED (Must NOT be Reported as Results):
- **Fabricated or Simulated Metrics**: Presenting metrics calculated on the synthetic demo dataset as real-world system accuracy.
- **Unverified Claims**: Claiming the ATS score reflects "industry ATS compatibility" or "probability of hiring".
- **Misrepresenting Model Type**: Claiming the system uses "AI deep semantic understanding" or "NLP embedding matching" when it is running deterministic dictionary regexes.
- **Cherry-Picked Test Cases**: Reporting evaluation only on resumes formatted specifically to match regex assumptions while omitting non-standard or alternative resume formats.
