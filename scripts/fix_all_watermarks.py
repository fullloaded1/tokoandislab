import cv2
import numpy as np
import os

OUTPUT_SIZE = 800

def create_square_canvas(img, target_size=OUTPUT_SIZE, scale_factor=0.88):
    """
    Menempatkan gambar di tengah canvas putih bujur sangkar (target_size x target_size)
    dengan ukuran proporsional (scale_factor).
    """
    h, w = img.shape[:2]
    # Calculate scale to fit within target_size * scale_factor
    max_dim = max(h, w)
    scale = (target_size * scale_factor) / max_dim
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    
    # Create white canvas
    canvas = np.full((target_size, target_size, 3), 255, dtype=np.uint8)
    
    # Center placement
    x_offset = (target_size - new_w) // 2
    y_offset = (target_size - new_h) // 2
    
    canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
    return canvas

def inpaint_precise_text(img, ymin, ymax, xmin, xmax, thresh_val=210):
    """
    Melakukan inpaint yang sangat presisi HANYA pada piksel teks gelap di atas panel,
    sehingga tekstur panel dan bodi mesin tidak rusak atau tertutup kotak putih.
    """
    result = img.copy()
    roi = result[ymin:ymax, xmin:xmax]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # Masking only dark text pixels
    mask_roi = np.zeros(roi.shape[:2], dtype=np.uint8)
    mask_roi[gray < thresh_val] = 255
    
    # Slight dilation (1px radius kernel) to cover anti-aliased font edges cleanly
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask_roi = cv2.dilate(mask_roi, kernel, iterations=1)
    
    full_mask = np.zeros(img.shape[:2], dtype=np.uint8)
    full_mask[ymin:ymax, xmin:xmax] = mask_roi
    
    # Inpaint using Telea algorithm
    inpainted = cv2.inpaint(result, full_mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
    return inpainted

# 1. Process BSC 1100 II A2 Custom
print("Processing BSC 1100 II A2...")
bsc_1100_src = cv2.imread("public/new 30 image produk/BSC 1100 II A2 Custom.jpg")
# Text "Batavialab" at y=36..85, x=135..260
bsc_1100_clean = inpaint_precise_text(bsc_1100_src, ymin=35, ymax=86, xmin=134, xmax=262, thresh_val=210)
bsc_1100_canvas = create_square_canvas(bsc_1100_clean, OUTPUT_SIZE, scale_factor=0.88)
cv2.imwrite("public/images/products/bsc-1100-ii-a2-andislab.jpg", bsc_1100_canvas, [cv2.IMWRITE_JPEG_QUALITY, 95])
print("Saved public/images/products/bsc-1100-ii-a2-andislab.jpg")

# 2. Process BSC mini II A2 Prime Custom
print("Processing BSC mini II A2...")
bsc_mini_src = cv2.imread("public/new 30 image produk/BSC mini II A2 Prime Custom.jpg")
# Text "Batavialab" at y=40..85, x=110..260
bsc_mini_clean = inpaint_precise_text(bsc_mini_src, ymin=40, ymax=86, xmin=108, xmax=262, thresh_val=215)
# No white boxes on the machine body or legs! Machine stays intact.
bsc_mini_canvas = create_square_canvas(bsc_mini_clean, OUTPUT_SIZE, scale_factor=0.88)
cv2.imwrite("public/images/products/bsc-mini-ii-a2-andislab.jpg", bsc_mini_canvas, [cv2.IMWRITE_JPEG_QUALITY, 95])
print("Saved public/images/products/bsc-mini-ii-a2-andislab.jpg")

# 3. Process LAF 1000 V Custom
print("Processing LAF 1000 V...")
laf_1000_src = cv2.imread("public/new 30 image produk/LAF 1000 V Custom.jpg")
# Text "Batavialab" at y=16..65, x=130..260
laf_1000_clean = inpaint_precise_text(laf_1000_src, ymin=15, ymax=66, xmin=130, xmax=262, thresh_val=220)
laf_1000_canvas = create_square_canvas(laf_1000_clean, OUTPUT_SIZE, scale_factor=0.88)
cv2.imwrite("public/images/products/laf-1000-vertikal-andislab.jpg", laf_1000_canvas, [cv2.IMWRITE_JPEG_QUALITY, 95])
print("Saved public/images/products/laf-1000-vertikal-andislab.jpg")

# 4. Check and process biosafety_cabinet_custom & laminar_air_flow_custom in custom-lab-pdf
print("Processing custom-lab-pdf webp files...")
pdf_bsc = cv2.imread("public/images/custom-lab-pdf/biosafety_cabinet_custom.webp")
if pdf_bsc is not None:
    # Text is top left
    h, w = pdf_bsc.shape[:2]
    pdf_bsc_clean = inpaint_precise_text(pdf_bsc, ymin=20, ymax=275, xmin=20, xmax=420, thresh_val=130)
    pdf_bsc_canvas = create_square_canvas(pdf_bsc_clean, OUTPUT_SIZE, scale_factor=0.88)
    cv2.imwrite("public/images/custom-lab-pdf/biosafety_cabinet_custom_v2.webp", pdf_bsc_canvas, [cv2.IMWRITE_WEBP_QUALITY, 95])
    print("Saved public/images/custom-lab-pdf/biosafety_cabinet_custom_v2.webp")

pdf_laf = cv2.imread("public/images/custom-lab-pdf/laminar_air_flow_custom.webp")
if pdf_laf is not None:
    h, w = pdf_laf.shape[:2]
    pdf_laf_clean = inpaint_precise_text(pdf_laf, ymin=10, ymax=240, xmin=10, xmax=350, thresh_val=130)
    pdf_laf_canvas = create_square_canvas(pdf_laf_clean, OUTPUT_SIZE, scale_factor=0.88)
    cv2.imwrite("public/images/custom-lab-pdf/laminar_air_flow_custom_v2.webp", pdf_laf_canvas, [cv2.IMWRITE_WEBP_QUALITY, 95])
    print("Saved public/images/custom-lab-pdf/laminar_air_flow_custom_v2.webp")

print("All watermark fixes and uniform square canvasing complete!")

