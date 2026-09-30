# Real Research Dataset Staging Directory

This directory is designated **EXCLUSIVELY FOR GENUINE HUMAN-ANNOTATED RESEARCH DATA**.

---

## Directory Organization

```
evaluation/real_data/
├── resumes/                      # Authentic anonymized candidate resumes (.pdf, .docx, .txt)
├── job_descriptions/             # Real target job descriptions (.txt)
├── annotations/                  # Independent & adjudicated gold annotations
│   ├── resume_annotations_eval1.jsonl
│   ├── resume_annotations_eval2.jsonl
│   ├── resume_annotations_gold.jsonl
│   ├── match_annotations_gold.jsonl
│   └── evaluator_metadata.jsonl
├── expert_scores/                # Blinded human relevance scores (0-100)
│   ├── expert_scores_eval1.csv (or .jsonl)
│   ├── expert_scores_eval2.csv (or .jsonl)
│   └── expert_scores_adjudicated.csv (or .jsonl)
├── expert_rankings/              # Human candidate cohort rankings
│   ├── expert_rankings_eval1.csv (or .jsonl)
│   └── expert_rankings_adjudicated.csv (or .jsonl)
└── README.md
```

---

## Data Collection Protocol
Before adding data to this directory:
1. Verify Safe Harbor PII de-identification (names, emails, phones scrubbed).
2. Confirm contributor informed consent has been obtained.
3. Validate all files using:
   ```powershell
   python evaluation/annotate.py validate evaluation/real_data/annotations/resume_annotations_gold.jsonl --strict-real
   ```
4. Run inter-annotator agreement calculations before freezing the gold standard:
   ```powershell
   python evaluation/inter_annotator_agreement.py --scores evaluation/real_data/expert_scores/expert_scores_raw.jsonl
   ```
