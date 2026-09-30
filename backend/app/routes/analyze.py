from pathlib import Path
import shutil
from typing import List

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.parser.pdf_parser import extract_text_from_pdf
from app.parser.docx_parser import extract_text_from_docx
from app.parser.resume_parser import parse_resume

from app.jd.parser import parse_job_description
from app.jd.matcher import match_resume_with_jd

from app.ats.scorer import calculate_ats_score
from app.ai.gemini_service import (
    generate_ai_review,
    enhance_bullet_point,
    generate_cover_letter_text,
)


router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    file_path = None
    try:
        # ── 1. Validate file type ──
        extension = Path(file.filename).suffix.lower()
        if extension not in {".pdf", ".docx"}:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

        # ── 2. Validate file size ──
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail="File too large. Maximum allowed size is 5MB.")
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # ── 3. Validate JD ──
        if len(job_description.strip()) < 50:
            raise HTTPException(status_code=400, detail="Job description is too short. Please paste the full job description.")

        # ── 4. Save file ──
        print(f"1. Saving file: {file.filename}...")
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        # ── 5. Extract text ──
        print(f"2. Extracting text for {extension}...")
        if extension == ".pdf":
            resume_text = extract_text_from_pdf(str(file_path))
        else:
            resume_text = extract_text_from_docx(str(file_path))

        # ── 6. Guard against blank/scanned PDFs ──
        if not resume_text or len(resume_text.strip()) < 100:
            raise HTTPException(
                status_code=422,
                detail="Could not extract readable text from your resume. "
                       "This usually happens with scanned or image-based PDFs. "
                       "Please use a text-based PDF or DOCX file."
            )

        print("3. Parsing Resume...")
        resume = parse_resume(resume_text)

        print("4. Parsing JD...")
        jd = parse_job_description(job_description)

        print("5. Matching Resume...")
        matching = match_resume_with_jd(resume, jd)

        print("6. Calculating ATS...")
        ats = calculate_ats_score(resume=resume, jd=jd, match_result=matching)

        print("7. Generating AI Review with Gemini...")
        ai_review = generate_ai_review(resume, jd)
        print("8. Analysis Complete!")

        return {
            "success": True,
            "resume": resume,
            "job_description": jd,
            "matching": matching,
            "ats": ats,
            "ai_review": ai_review
        }

    except HTTPException:
        raise
    except Exception as e:
        print("ANALYSIS ERROR:", e)
        return {"success": False, "error": f"Error analyzing resume: {str(e)}"}

    finally:
        # ── Always delete file from server after processing ──
        if file_path and Path(file_path).exists():
            try:
                Path(file_path).unlink()
            except Exception:
                pass


@router.post("/batch-analyze")
async def batch_analyze_resumes(
    files: List[UploadFile] = File(...),
    job_description: str = Form(...)
):
    """
    Recruiter Mode: Process multiple candidate resumes and return a ranked leaderboard.
    """
    try:
        invalid_files = [
            file.filename
            for file in files
            if Path(file.filename).suffix.lower() not in {".pdf", ".docx"}
        ]
        if invalid_files:
            return {
                "success": False,
                "error": "Only PDF and DOCX files are supported: " + ", ".join(invalid_files),
            }

        results = []
        jd = parse_job_description(job_description)

        for file in files:
            ext = Path(file.filename).suffix.lower()
            file_path = UPLOAD_DIR / file.filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            if ext == ".pdf":
                resume_text = extract_text_from_pdf(str(file_path))
            else:
                resume_text = extract_text_from_docx(str(file_path))

            resume = parse_resume(resume_text)
            matching = match_resume_with_jd(resume, jd)
            ats = calculate_ats_score(resume=resume, jd=jd, match_result=matching)

            skill_score = ats.get("overall_score", 0)
            breakdown = ats.get("breakdown", {})
            exp_score = breakdown.get("experience", 0)  # max 20
            edu_score = breakdown.get("education", 0)   # max 10

            # Normalized Multi-Criteria Recruiter Ranking Formula:
            # 60% Skill Compatibility + 25% Experience Depth + 15% Educational Background
            exp_norm = (exp_score / 20) * 100 if exp_score else 50
            edu_norm = (edu_score / 10) * 100 if edu_score else 50
            composite_rank_score = round((skill_score * 0.60) + (exp_norm * 0.25) + (edu_norm * 0.15), 1)

            results.append({
                "filename": file.filename,
                "name": resume.get("personal_info", {}).get("name") or file.filename.replace(ext, ""),
                "email": resume.get("personal_info", {}).get("email") or "N/A",
                "ats_score": skill_score,
                "rank_score": composite_rank_score,
                "match_percentage": matching.get("match_percentage", 0),
                "experience_score": exp_score,
                "education_score": edu_score,
                "recommendation": "Strong Hire" if composite_rank_score >= 75 else ("Consider" if composite_rank_score >= 50 else "Reject"),
                "matched_skills": ats.get("matched_skills", []),
                "missing_skills": ats.get("missing_skills", []),
            })

            # Cleanup uploaded file
            if file_path.exists():
                file_path.unlink()

        # Sort leaderboard by multi-factor composite rank score descending
        results.sort(key=lambda x: x["rank_score"], reverse=True)

        return {
            "success": True,
            "count": len(results),
            "leaderboard": results
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/enhance-bullet")
async def enhance_bullet(
    bullet_point: str = Form(...),
    target_role: str = Form("Software Engineer")
):
    """
    AI Bullet Point Enhancer (STAR Method).
    """
    try:
        bullets = enhance_bullet_point(bullet_point, target_role)
        return {"success": True, "enhanced_bullets": bullets}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/generate-cover-letter")
async def generate_cover_letter(
    resume_name: str = Form("Candidate Resume"),
    job_description: str = Form(...)
):
    """
    1-Click AI Cover Letter Generator.
    """
    try:
        cover_letter = generate_cover_letter_text(resume_name, job_description)
        return {"success": True, "cover_letter": cover_letter}
    except Exception as e:
        return {"success": False, "error": str(e)}
