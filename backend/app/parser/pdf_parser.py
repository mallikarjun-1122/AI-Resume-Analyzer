import pdfplumber
from pathlib import Path
from app.parser.text_cleaner import clean_text


def extract_text_from_pdf(pdf_path: str) -> str:

    pdf_file = Path(pdf_path)

    if not pdf_file.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    text = []

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text.append(page_text)

    raw_text = "\n".join(text)

    print("\n========== RAW TEXT ==========\n")
    print(raw_text)

    cleaned_text = clean_text(raw_text)

    print("\n========== CLEANED TEXT ==========\n")
    print(cleaned_text)

    return cleaned_text