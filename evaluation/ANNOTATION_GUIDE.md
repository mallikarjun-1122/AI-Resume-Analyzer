# Human Annotation Protocol & Standardization Guide

**Project**: AI Resume Analyzer (Empirical Evaluation Baseline)  
**Document Status**: Official Research Annotation Manual  

This document defines the standardized protocol and operational criteria for human evaluators creating ground-truth annotations for the empirical research paper.

---

## 1. Ethical, Blinding & Qualification Standards

1. **Strict Double Blinding**:
   - Evaluators must annotate resumes, job descriptions, matching pairs, relevance scores, and candidate rankings **completely blinded to system outputs, ATS scores, match percentages, strengths, and automated suggestions**.
   - Annotators must never view algorithm outputs prior to finalizing gold annotations.
2. **Subject Matter Qualification**:
   - All evaluators must meet defined qualification tiers: Senior Software Engineer, Technical Recruiter, Engineering Manager, or Computer Science Faculty/Researcher.
   - Evaluator demographic metadata must be recorded in accordance with `evaluator_metadata.schema.json` without storing personal identifying information (PII).
3. **Multi-Annotator Standard**:
   - Each resume and resume-JD pair must be independently annotated by **at least two qualified raters**.
   - Disagreements are reconciled through a formal adjudication workflow (Section 6).

---

## 2. Core Annotation Targets

Evaluators record ground-truth annotations across eight core targets:

### Target 1: Resume Skills Extraction (`skills`)
- Map detected skills into the standard category dictionary (`backend/app/database/skills.json`):
  `Programming Languages`, `Frontend`, `Backend`, `Database`, `Cloud & DevOps`, `AI & ML`, `BI & Analytics`, `Tools & IDEs`, `Testing & Quality`, `Soft Skills`.
- Each skill name is recorded using its canonical form in the category list.

### Target 2: Education Extraction (`education`)
Record the atomic educational facts:
- `degree`: Highest credential level explicitly stated (e.g. `"B.Tech"`, `"Bachelor of Science"`, `"MCA"`).
- `institution`: Awarding university, college, institute, or school.
- `cgpa`: Stated numerical grade point average (e.g. `"8.9"`, `"3.75"`). Record `null` if unstated.
- `duration`: Year span of enrollment (e.g. `"2018 - 2022"`). Record `null` if unstated.

### Target 3: Professional Experience (`experience`)
Extract every distinct employment or internship entry as an object:
- `job_title`: Stated job role or position title.
- `company`: Employing organization.
- `duration`: Time period stated (e.g. `"Jan 2022 - Present"`).
- `technologies`: Array of technical tools, frameworks, and languages used in this specific role.
- `description`: Array of individual achievement bullet points.

### Target 4: Projects (`projects`)
Extract each project entry:
- `title`: Distinct project headline name.
- `technologies`: Array of technologies applied in the project.
- `description`: Array of project bullet points.

### Target 5: Certifications (`certifications`)
- Array of accredited professional credentials (e.g. `"AWS Certified Solutions Architect"`).

### Target 6: Resume-JD Relevant, Matched & Missing Skills (`matching`)
When evaluating a resume against a target Job Description:
- `gold_relevant_skills`: Every explicit technical skill required or strongly preferred by the JD.
- `gold_matched_skills`: Subset of `gold_relevant_skills` demonstrably possessed by the candidate.
- `gold_missing_skills`: Subset of `gold_relevant_skills` required by the JD but missing from the resume.
- Standard identity: $\text{gold\_relevant\_skills} = \text{gold\_matched\_skills} \cup \text{gold\_missing\_skills}$.

### Target 7: Expert Relevance Score (0–100)
A holistic, continuous evaluation of role fit based on human domain judgment:
- **90 – 100 (Exceptional Fit)**: Satisfies all required and preferred criteria; strong direct experience.
- **70 – 89 (Qualified Fit)**: Meets all core criteria; minor gaps easily addressed on the job.
- **50 – 69 (Marginal / Weak Fit)**: Meets foundational criteria, but lacks primary stack experience.
- **25 – 49 (Poor Fit)**: Major domain or seniority mismatch.
- **0 – 24 (Irrelevant / Reject)**: Completely unrelated background.

### Target 8: Candidate Cohort Ranking
Within a cohort of 2 or more candidates evaluated against the **same job description**:
- Assign rank integers starting at `1` (best candidate), `2` (second best), etc.
- In cases of identical qualification, tied ranks are permitted (e.g. two candidates assigned `2.5`).

---

## 3. Operational Rules for Ambiguous Cases

To ensure strict inter-rater reliability, evaluators must adhere to the following decision rules:

### Case 1: Skill Mentioned Only Inside a Project
- **Rule**: If a technical skill is explicitly mentioned in a project title or description (e.g. *"Engineered REST API with FastAPI and PostgreSQL"*), but does NOT appear in the dedicated Skills section:
  1. Add `FastAPI` and `PostgreSQL` to the project's `technologies` array.
  2. ALSO add `FastAPI` and `PostgreSQL` to the resume's top-level `skills` mapping.
  - *Rationale*: Production system merges project skills into overall resume skills via `merge_resume_skills`.

### Case 2: Skill in JD But Not Actually Used by Candidate
- **Rule**: If the JD requires a skill (e.g. *"Kubernetes"*), and the candidate lists Docker but never mentions Kubernetes, or only mentions it in an aspirational summary (e.g. *"Interested in learning Kubernetes"*):
  - Classify under `gold_missing_skills`.
  - Do NOT classify as a match. Aspirational or unverified mentions do not constitute competency.

### Case 3: Multiple Names for the Same Technology (Lexical Aliases)
- **Rule**: Standardize to the canonical name present in `backend/app/database/skills.json`:
  - `Postgres` / `PostgreSQL DB` $\to$ `"PostgreSQL"`
  - `Golang` $\to$ `"Go"`
  - `ReactJS` / `React.js` $\to$ `"React"`
  - `Node` / `NodeJS` / `Node js` $\to$ `"Node.js"`
  - `K8s` $\to$ `"Kubernetes"`
  - `AWS Cloud` $\to$ `"AWS"`
  - `CI-CD` / `Continuous Integration` $\to$ `"CI/CD"`
  - `Scikit Learn` / `sklearn` $\to$ `"Scikit-learn"`
  - If a technology has no representation in the dictionary (e.g. `Svelte`, `GraphQL`), note it in `notes`, but do not alias it to an unrelated dictionary skill.

### Case 4: Internship vs Full-Time Experience
- **Rule**: All structured professional and industrial employment experiences (including full-time, part-time, internships, and co-ops) are recorded under `experience`.
  - Preserve `"Intern"` or `"Internship"` in `job_title` (e.g. `"Data Science Intern"`).
  - Academic coursework projects, hackathons, or student club activities without formal employment belong under `projects`, NOT `experience`.

### Case 5: Certification vs Course / Certificate of Completion
- **Rule**: Record as `certifications` ONLY formal, third-party proctored or vendor-accredited credentials:
  - Valid: `"AWS Certified Solutions Architect"`, `"Certified Kubernetes Administrator"`, `"PMP"`, `"CISSP"`.
  - Invalid: Single-course certificates of completion from Udemy, Coursera, or YouTube (e.g. *"Complete Web Development Bootcamp"*). Place course descriptions under `education` notes or ignore.

### Case 6: Degree vs Institution
- **Rule**: Strict separation of educational entities:
  - `degree`: Academic qualification level only (e.g. `"B.Tech"`, `"Bachelor of Science"`, `"M.S."`, `"Diploma"`).
  - `institution`: Awarding university, college, or institute name only (e.g. `"National Institute of Technology"`).
  - If a resume line combines both (e.g. *"B.Tech in Computer Science from Stanford University"*), extract `"B.Tech"` as degree and `"Stanford University"` as institution.

### Case 7: Duplicate Skills Across Multiple Sections
- **Rule**: Category skill sets use strict mathematical set semantics:
  - If `Python` appears in the Skills section, in 3 Experience bullets, and in 2 Projects, record `Python` **exactly once** in the top-level `"Programming Languages"` array.
  - In individual experience and project records, list `Python` in each relevant item's `technologies` array.

### Case 8: Skills Implied But Not Explicitly Stated
- **Rule**: **NEVER annotate an unmentioned skill based on inference or assumption**.
  - If a resume says *"Built dynamic user interfaces and styled pages"* without explicitly naming `HTML`, `CSS`, or `React`, do NOT annotate `HTML` or `CSS`.
  - If a resume says *"Queried customer database tables"* without explicitly naming `SQL`, do NOT annotate `SQL`.
  - Ground truth reflects explicit textual evidence only.

---

## 4. Evaluator Metadata Format (Zero PII)

To preserve researcher blinding and candidate privacy, evaluators record qualifications conforming to `evaluator_metadata.schema.json`.

```json
{
  "evaluator_id": "evaluator_sr_dev_01",
  "qualification_tier": "Senior Software Engineer",
  "years_of_experience": 8.5,
  "primary_domain": "Full-Stack Web Development",
  "highest_degree": "Bachelors",
  "recruitment_experience": true,
  "anonymization_verified": true
}
```

**Strict Prohibition**: No real names, email addresses, phone numbers, location data, or current employer names may be recorded in evaluator metadata.

---

## 5. Multi-Annotator Annotation Workflow

```
[Raw Anonymized Resume / JD]
         │
         ├───────────────────────────────┐
         ▼                               ▼
[Annotator 1 (Blinded)]         [Annotator 2 (Blinded)]
  - Extracts entities             - Extracts entities
  - Annotates matched/missing     - Annotates matched/missing
  - Rates relevance (0-100)       - Rates relevance (0-100)
  - Ranks candidate cohort        - Ranks candidate cohort
         │                               │
         └───────────────┬───────────────┘
                         ▼
       [Inter-Annotator Agreement Check]
         - Cohen's Kappa (Extraction)
         - ICC(2,1) (Relevance Scores)
         - Kendall's W (Rankings)
                         │
        ┌────────────────┴────────────────┐
        ▼ (Agreement >= 0.70)             ▼ (Disagreement / Outlier)
[Consensus Ground Truth]        [Adjudication by 3rd Expert]
```

---

## 6. Disagreement Resolution & Adjudication

1. **Agreement Threshold**:
   - For categorical skill extraction, pairwise agreement $\ge 85\%$ is expected.
   - For 0–100 relevance scores, absolute score differences $> 15$ points trigger formal review.
   - For cohort rankings, inversion of candidate rank order triggers review.
2. **Adjudication Procedure**:
   - A designated third senior reviewer (e.g. Lead Researcher) examines the two blinded annotations alongside the raw resume and JD.
   - The adjudicator produces a final consolidated record marked `"adjudicated": true`.
   - Both original independent annotations are retained for inter-rater agreement reporting.

---

## 7. Tooling & Validation Commands

### Validate an annotation file against schema:
```powershell
python evaluation/annotate.py validate evaluation/dataset/annotations/resume_annotations.jsonl
python evaluation/annotate.py validate evaluation/dataset/annotations/match_annotations.jsonl
```

### Validate evaluator metadata:
```powershell
python evaluation/annotate.py validate evaluation/dataset/annotations/evaluator_metadata.jsonl --schema evaluation/dataset/annotations/evaluator_metadata.schema.json
```

### Calculate Inter-Annotator Agreement:
```powershell
python evaluation/inter_annotator_agreement.py --scores path/to/expert_scores_multi.jsonl --rankings path/to/expert_rankings_multi.jsonl
```
