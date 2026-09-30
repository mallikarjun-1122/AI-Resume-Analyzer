# Synthetic Controlled Dataset & Benchmark

> **CRITICAL DISCLAIMER**  
> **ALL DATA IN THIS DIRECTORY IS SYNTHETIC — NOT REAL RESEARCH DATA.**  
> This dataset was generated deterministically using pseudo-random seeds (`random.seed(42)`) for the sole purpose of validating the automated evaluation harness, benchmark scripts, and multi-format parsers before deploying real human annotators.  
> **No personal information, real people's resumes, or confidential materials were used or simulated.**  
> Metrics reported from this dataset represent internal pipeline sanity benchmarks and must **NEVER** be cited as real-world production accuracy or hiring efficacy.

---

## 1. Objectives of Synthetic Validation

Before collecting human-annotated resumes and real recruiter rankings, the synthetic pipeline validates:
1. **End-to-End Harness Integrity**: Verifies that the evaluation scripts (`run_evaluation.py`, `baseline_comparison.py`, `robustness_runner.py`) parse and evaluate large cohorts without crashes, memory leaks, or formatting mismatches.
2. **Deterministic Baseline Benchmarking**: Establishes controlled ground-truth performance across:
   - **Baseline A**: Strict case-sensitive dictionary matching.
   - **Baseline B**: Normalized case-insensitive matching (production baseline).
   - **Baseline C**: Synonym-normalized dictionary mapping.
3. **Multi-Format Extraction Consistency**: Compares text, PDF (`pymupdf`), and DOCX (`python-docx`) parsing fidelity.
4. **Boundary Condition & Failure Mode Analysis**: Isolates known structural limitations:
   - Line-binding dependency in experience extraction (`job_title` + `duration` on same line).
   - Unrecognized section headings causing section detection collapse.
   - Punctuation variants (e.g. `Node js` vs `Node.js`) and informal tech aliases (`Postgres`, `K8s`).
   - Zero-skill job description scoring behavior (40/40 fallback heuristic).

---

## 2. Dataset Architecture & Breakdown

The synthetic dataset resides under `evaluation/synthetic/data/`:

```text
evaluation/synthetic/
├── generator.py                  # Deterministic synthetic data generator (seed=42)
├── run_synthetic_evaluation.py   # Comprehensive synthetic benchmark runner
├── README.md                     # This documentation
├── data/
│   ├── resumes/                  # 100 resumes (.txt), plus 25 (.pdf) and 25 (.docx)
│   ├── job_descriptions/         # 20 job descriptions (.txt)
│   ├── annotations/
│   │   ├── resume_annotations.jsonl  # 100 gold resume extractions
│   │   └── match_annotations.jsonl   # 320 gold match pairs
│   ├── expert_scores/
│   │   ├── expert_scores.jsonl       # 320 synthetic rubric scores (0-100)
│   │   └── expert_scores.csv         # CSV format
│   └── expert_rankings/
│       ├── expert_rankings.jsonl     # 20 cohort rankings
│       └── expert_rankings.csv       # CSV format
└── results/
    ├── synthetic_evaluation.json     # Full pipeline metrics
    ├── baseline_comparison.json      # Baselines A, B, C metrics
    ├── format_consistency.json       # TXT vs PDF vs DOCX stability
    ├── failure_cases.json            # Error categorization and ablation stats
    └── summary_report.json           # Master summary metrics
```

### Resume Stratification (100 Total)
- **Roles (8 disciplines, ~12-13 each)**:
  1. Backend Developer
  2. Frontend Developer
  3. Full Stack Developer
  4. Data Analyst
  5. Data Scientist
  6. DevOps Engineer
  7. QA Automation Engineer
  8. Software Engineer
- **Seniority Levels (4 tiers, 25 each)**:
  - `Student/intern` (0–1 years)
  - `Junior` (1–3 years)
  - `Mid-level` (3–6 years)
  - `Senior` (6–12 years)
- **Structural Heading Variations (5 types, 20 each)**:
  - `standard`: `SUMMARY`, `SKILLS`, `EXPERIENCE`, `EDUCATION`, `PROJECTS`, `CERTIFICATIONS`
  - `alt_supported`: `PROFESSIONAL SUMMARY`, `TECHNICAL EXPERTISE`, `WORK EXPERIENCE`, `ACADEMIC BACKGROUND`, `KEY PROJECTS`, `COURSES`
  - `unsupported`: `MY PHILOSOPHY`, `CORE COMPETENCIES & TOOLKIT`, `CAREER TRAJECTORY`, `SCHOOLING AND DEGREES`, `CREATIVE ENDEAVORS`, `BADGES AND PAPERS`
  - `missing_sections`: Resumes omitting education, experience, or projects.
  - `scrambled`: Sections ordered non-standardly (e.g., Education $\rightarrow$ Projects $\rightarrow$ Skills $\rightarrow$ Experience $\rightarrow$ Certifications $\rightarrow$ Summary).

### Job Descriptions (20 Total)
- **6 High-Density (10+ skills)**: Roles spanning Fullstack Cloud, Lead Data Scientist, Principal Backend, Senior DevOps SRE, Senior Data Platform, Full Stack API Specialist.
- **8 Medium-Density (5–9 skills)**: Roles spanning Python Backend, React Frontend, Business Analyst, QA Automation, Junior Software Engineer, Cloud Infrastructure, ML Engineer, Web Developer.
- **4 Low-Density (1–4 skills)**: IT Support, Python Scripting Assistant, SQL Reporter, Web Content Assistant.
- **2 Zero-Skill Density (0 dictionary skills)**: Facilities & Procurement Director, Strategic Public Relations Diplomat.

### Evaluated Resume-JD Pairs (320 Total)
- Each of the 20 JDs is paired with 16 candidates across 4 distinct fit tiers:
  - **High Fit** (4 candidates): Target role match with strong technical overlap.
  - **Partial Fit** (5 candidates): Adjacent discipline or junior subset.
  - **Low Fit** (4 candidates): Different discipline with only incidental/generic skills overlap.
  - **Disjoint / Zero Fit** (3 candidates): Zero overlapping skills or completely non-technical.

---

## 3. Ground-Truth Derivation Principle

Gold annotations are **derived directly and deterministically from generator specifications BEFORE production code executes**:
- **Gold Skills**: Exact canonical set placed in the candidate's profile.
- **Gold Matched Skills**: Set intersection $\text{CandidateSkills} \cap \text{JDSkills}$.
- **Gold Missing Skills**: Set difference $\text{JDSkills} \setminus \text{CandidateSkills}$.
- **Gold Expert Relevance Score**: Computed using a deterministic 0–100 rubric incorporating skill coverage (50%), seniority fit (25%), discipline affinity (15%), and education/credentials (10%).
- **Gold Cohort Rankings**: Sorted rank orders within each JD's 16-candidate cohort.

---

## 4. How to Reproduce

### Step 1: Generate Dataset
```bash
python evaluation/synthetic/generator.py --seed 42
```

### Step 2: Run Full Benchmark Suite
```bash
python evaluation/synthetic/run_synthetic_evaluation.py
```

### Step 3: Run Baseline Comparison Separately (Optional)
```bash
python evaluation/baseline_comparison.py --dataset evaluation/synthetic/data
```
