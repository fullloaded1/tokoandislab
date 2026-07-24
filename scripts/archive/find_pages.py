import fitz

pdf_path = r"C:\Users\Ancimmm\Documents\ANDISLABSWEB\andislab\public\Andislabkatalog.pdf"
doc = fitz.open(pdf_path)

for i in range(len(doc)):
    text = doc.load_page(i).get_text().lower()
    if "biosafety" in text or "bsc" in text:
        print(f"Biosafety found on page {i+1}")
    if "laminar" in text or "laf" in text:
        print(f"Laminar found on page {i+1}")
