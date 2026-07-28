from pathlib import Path
import shutil

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.parser.pdf_parser import extract_text_from_pdf
from app.parser.docx_parser import extract_text_from_docx
from app.parser.resume_parser import parse_resume

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a resume, extract text, parse it, and return structured JSON.
    """

    allowed_extensions = {".pdf", ".docx"}

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )

    file_path = UPLOAD_DIR / file.filename

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # -----------------------------
        # Extract Resume Text
        # -----------------------------
        if extension == ".pdf":
            extracted_text = extract_text_from_pdf(str(file_path))

        elif extension == ".docx":
            extracted_text = extract_text_from_docx(str(file_path))

        else:
            extracted_text = ""

        # -----------------------------
        # Parse Resume
        # -----------------------------
        resume = parse_resume(extracted_text)

        return {
            "success": True,
            "message": "Resume uploaded successfully.",
            "filename": file.filename,
            "resume": resume
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )