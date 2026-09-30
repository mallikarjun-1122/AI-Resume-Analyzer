# Evaluation Dataset Directory

> [!WARNING]
> **DEMO DATA — NOT FOR RESEARCH RESULTS**
> Files located in this directory (including synthetic resumes, simulated job descriptions, sample annotations, sample scores, and sample rankings) exist exclusively to verify software correctness, test test harnesses, and demonstrate the evaluation pipeline.
> **They do not constitute empirical evidence, real candidate data, or scientific findings.**
> In accordance with research standards, any published evaluation must use genuine, independently annotated, blinded human expert evaluations.

---

## Directory Organization

```
evaluation/dataset/
├── resumes/                      # Raw resume files (.txt, .pdf, .docx)
├── job_descriptions/             # Raw job description text files (.txt)
├── annotations/                  # Gold-standard annotations for extraction and matching
│   ├── resume_annotation.schema.json
│   ├── match_annotation.schema.json
│   ├── resume_annotations.jsonl
│   └── match_annotations.jsonl
├── expert_scores/                # Independent expert relevance ratings (0-100)
│   ├── score_validity.schema.json
│   └── expert_scores.jsonl (and .csv)
├── expert_rankings/              # Candidate cohort ranking judgments per JD
│   ├── ranking.schema.json
│   └── expert_rankings.jsonl (and .csv)
└── README.md                     # This document
```

---

## Data Schemas

### 1. Resume Extraction Annotation (`annotations/resume_annotations.jsonl`)
Validates against `annotations/resume_annotation.schema.json`.
Each record specifies ground-truth entities present in the resume:
- `resume_id` (string): Identifies resume file.
- `skills` (object): Map of category names to string arrays of gold skills.
- `education` (object): Dict with keys `degree`, `institution`, `cgpa`, `duration`.
- `experience` (array of objects): Each has `job_title`, `company`, `duration`, `technologies`, `description` (bullets).
- `projects` (array of objects): Each has `title`, `technologies`, `description`.
- `certifications` (array of strings): Recognized certification names.

### 2. Resume-JD Matching Annotation (`annotations/match_annotations.jsonl`)
Validates against `annotations/match_annotation.schema.json`.
- `match_id` (string): e.g. `resume_01__jd_01`
- `resume_id` (string)
- `jd_id` (string)
- `gold_relevant_skills` (array of strings): Skills required/desired by the job description.
- `gold_matched_skills` (array of strings): Skills present in both the resume and JD.
- `gold_missing_skills` (array of strings): Skills required by the JD but missing from the resume.

### 3. Score Validity Annotations (`expert_scores/expert_scores.jsonl` or `.csv`)
Validates against `expert_scores/score_validity.schema.json`.
- `resume_id` (string)
- `jd_id` (string)
- `expert_relevance_score` (float: 0.0 - 100.0): Independent human rating of overall fit.
- `evaluator_id` (string)
- `scoring_rationale` (string)

### 4. Candidate Ranking Annotations (`expert_rankings/expert_rankings.jsonl` or `.csv`)
Validates against `expert_rankings/ranking.schema.json`.
- `jd_id` (string)
- `candidate_ids` (array of strings)
- `expert_rank` (object): Mapping from `resume_id` to rank integer (1 = best fit).
- `group_id` (string)
