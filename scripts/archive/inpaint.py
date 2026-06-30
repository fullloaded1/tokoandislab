import cv2
import numpy as np

def remove_text(image_path, out_path, roi_x, roi_y, roi_w, roi_h):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Cannot read {image_path}")
        return

    # Create mask
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    
    # Extract ROI
    roi = img[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]
    
    # Convert ROI to grayscale
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # Threshold to find dark text (assuming text is dark on light background)
    # The text "batavialab" is dark. We find pixels < 100.
    _, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY_INV)
    
    # Dilate mask slightly to cover edges of text
    kernel = np.ones((5,5), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=1)
    
    # Place ROI mask back into full mask
    mask[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w] = thresh
    
    # Inpaint
    result = cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)
    
    cv2.imwrite(out_path, result)
    print(f"Processed {image_path}")

# Paths
dir_path = r"C:\Users\Ancimmm\Documents\tokoandis\public\images\custom-lab-pdf"

# BSC
bsc_in = f"{dir_path}\\biosafety_cabinet_custom.webp"
bsc_out = f"{dir_path}\\biosafety_cabinet_custom_clean.webp"
# The text is top left. BSC is 1073x1080.
remove_text(bsc_in, bsc_out, 0, 0, 400, 250)

# LAF
laf_in = f"{dir_path}\\laminar_air_flow_custom.webp"
laf_out = f"{dir_path}\\laminar_air_flow_custom_clean.webp"
# LAF is 800x954.
remove_text(laf_in, laf_out, 0, 0, 300, 200)

