# Evaluation Data

This directory intentionally contains no resumes, job descriptions, annotations, scores, or results.

Create `annotations.jsonl` using the schema in `annotations.schema.json`. Store the corresponding plain-text resume and job-description files in a controlled location beneath this directory, then reference them through `resume_text_path` and `job_description_text_path`.

Annotations must be produced by qualified human annotators from approved, anonymized, or consented material. Do not use model output as the gold annotation.
