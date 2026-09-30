# Evaluation Framework

This package measures the existing deterministic backend only. It does not call Gemini, generate labels, create candidate rankings, or substitute missing data.

## Required input

Create `data/annotations.jsonl` as JSON Lines. Each record points to one plain-text resume and one plain-text job description. The `gold` object mirrors the parser output for skills, education, experience, projects, certifications, and `matching.matched_skills`.

Use the exact field names emitted by `backend/app/parser/resume_parser.py`. For `skills` and `matching.matched_skills`, annotate category-to-list mappings. For education, annotate the `degree`, `institution`, `cgpa`, and `duration` fields. For experience and projects, annotate lists of objects using the parser's field names; the evaluator compares their populated atomic fields. For certifications, annotate the complete strings. The full machine-readable contract is `data/annotations.schema.json`.

`gold.expert_relevance_score` is an independently assigned 0-100 expert assessment of role relevance. `ranking_group` and `expert_rank` are required only for batch-ranking agreement. A group must contain at least two annotated candidates against the same job description.

Normalise annotation labels consistently with the application vocabulary in `backend/app/database/skills.json`. The evaluator case-folds text and collapses repeated whitespace; it does not apply synonyms or semantic matching.

## Run

From the repository root, install the backend requirements in a Python 3.10+ environment, then run:

```powershell
python evaluation/run_evaluation.py --config evaluation/config.example.json
```

The script writes JSON to `evaluation/results/evaluation.json`. That directory is ignored by Git so that locally generated research results are not confused with source evidence.

## Reported measures

- Micro precision, recall, and F1 for skills, education facts, experience facts, project facts, certifications, and matched resume-JD skills.
- Mean absolute error, RMSE, Pearson correlation, and Spearman correlation between the weighted rule-based overall score and expert relevance scores.
- Per-batch and mean Spearman ranking agreement, computed from system score versus inverse expert rank.

Do not interpret an empty or incomplete annotation file as a result. The framework is ready; it has no dataset or experimental outcome bundled with it.
