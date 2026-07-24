import fitz # PyMuPDF

pdf_path = r"C:\Users\Ancimmm\Documents\ANDISLABSWEB\andislab\public\Andislabkatalog.pdf"

doc = fitz.open(pdf_path)

page = doc.load_page(4) # index 4 is page 5
print("Page 5 Full text:")
print(page.get_text())
