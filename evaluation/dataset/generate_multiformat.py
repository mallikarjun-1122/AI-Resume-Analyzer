"""Generate PDF and DOCX formats of demo resumes for multi-format evaluation."""

from pathlib import Path
import docx
import fitz  # PyMuPDF

RESUMES_DIR = Path(__file__).resolve().parent / "resumes"


def create_docx(text: str, out_path: Path):
    doc = docx.Document()
    for line in text.split("\n"):
        doc.add_paragraph(line)
    doc.save(str(out_path))


def create_pdf(text: str, out_path: Path):
    doc = fitz.open()
    page = doc.new_page()
    # Simple top-to-bottom text insertion
    rect = fitz.Rect(50, 50, 550, 800)
    page.insert_textbox(rect, text, fontsize=10, fontname="helv")
    doc.save(str(out_path))
    doc.close()


def main():
    targets = [
        "resume_01_fullstack_standard",
        "resume_02_backend_alt_headings"
    ]
    for target in targets:
        txt_path = RESUMES_DIR / f"{target}.txt"
        if not txt_path.is_file():
            continue
        content = txt_path.read_text(encoding="utf-8")
        
        docx_path = RESUMES_DIR / f"{target}.docx"
        create_docx(content, docx_path)
        print(f"Generated DOCX: {docx_path.name}")
        
        pdf_path = RESUMES_DIR / f"{target}.pdf"
        create_pdf(content, pdf_path)
        print(f"Generated PDF: {pdf_path.name}")


if __name__ == "__main__":
    main()
