import fitz # PyMuPDF

pdf_path = r"C:\Users\Ancimmm\Documents\ANDISLABSWEB\andislab\public\Andislabkatalog.pdf"

doc = fitz.open(pdf_path)

for page_index in range(len(doc)):
    page = doc.load_page(page_index)
    text = page.get_text()
    
    # Just print the first 200 chars or meaningful words
    words = text.split()
    preview = " ".join(words[:20])
    
    print(f"Page {page_index+1}: {preview}")
