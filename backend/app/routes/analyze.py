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


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        print(f"1. Saving file: {file.filename}...")
        extension = Path(file.filename).suffix.lower()

        if extension not in {".pdf", ".docx"}:
            return {
                "success": False,
                "error": "Only PDF and DOCX files are supported."
            }

        file_path = UPLOAD_DIR / file.filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"2. Extracting text for {extension}...")
        if extension == ".pdf":
            resume_text = extract_text_from_pdf(str(file_path))
        else:
            resume_text = extract_text_from_docx(str(file_path))

        print("3. Parsing Resume...")
        resume = parse_resume(resume_text)

        print("4. Parsing JD...")
        jd = parse_job_description(job_description)

        print("5. Matching Resume...")
        matching = match_resume_with_jd(
            resume,
            jd
        )

        print("6. Calculating ATS...")
        ats = calculate_ats_score(
            resume=resume,
            jd=jd,
            match_result=matching
        )

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

    except Exception as e:
        print("ANALYSIS ERROR:", e)
        return {
            "success": False,
            "error": f"Error analyzing resume: {str(e)}"
        }


@router.post("/batch-analyze")
async def batch_analyze_resumes(
    files: List[UploadFile] = File(...),
    job_description: str = Form(...)
):
    """
    Recruiter Mode: Process multiple candidate resumes and return a ranked leaderboard.
    """
    try:
        results = []
        jd = parse_job_description(job_description)

        for file in files:
            ext = Path(file.filename).suffix.lower()
            if ext not in {".pdf", ".docx"}:
                continue

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

            results.append({
                "filename": file.filename,
                "name": resume.get("personal_info", {}).get("name") or file.filename,
                "email": resume.get("personal_info", {}).get("email") or "N/A",
                "ats_score": ats.get("overall_score", 0),
                "match_percentage": matching.get("match_percentage", 0),
                "recommendation": matching.get("recommendation", "Consider"),
                "matched_skills": ats.get("matched_skills", []),
            })

        # Sort leaderboard by ATS score descending
        results.sort(key=lambda x: x["ats_score"], reverse=True)

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