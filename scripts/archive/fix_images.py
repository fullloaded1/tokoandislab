import cv2
import numpy as np

# Fix BSC image
bsc_in = r"C:\Users\Ancimmm\.gemini\antigravity-ide\brain\09225b63-abf2-4bbb-a3de-ed46a557c892\media__1781074072100.jpg"
bsc_out = r"C:\Users\Ancimmm\Documents\tokoandis\public\images\custom-lab-pdf\biosafety_cabinet_custom_clean.webp"

img_bsc = cv2.imread(bsc_in)
if img_bsc is not None:
    # The image is of a BSC machine. The text is in the top-left area.
    # Let's paint a white rectangle over the top-left area.
    # Since we don't know the exact bounding box, let's paint x: 0-40%, y: 0-20%
    h, w = img_bsc.shape[:2]
    # Sample the color from the center-top to match the machine's white color
    bg_color = [int(c) for c in img_bsc[int(h*0.05), int(w*0.5)]]
    
    # We don't want to cover the whole top left, just the text.
    # Let's use inpaint again, but this time thresholding the whole top-left quadrant.
    roi_y1, roi_y2 = int(h*0.02), int(h*0.25)
    roi_x1, roi_x2 = int(w*0.02), int(w*0.4)
    
    roi = img_bsc[roi_y1:roi_y2, roi_x1:roi_x2]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    kernel = np.ones((5,5), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=2)
    
    mask = np.zeros(img_bsc.shape[:2], dtype=np.uint8)
    mask[roi_y1:roi_y2, roi_x1:roi_x2] = thresh
    
    result_bsc = cv2.inpaint(img_bsc, mask, 5, cv2.INPAINT_TELEA)
    cv2.imwrite(bsc_out, result_bsc)
    print("Fixed BSC")

# Fix LAF image
laf_in = r"C:\Users\Ancimmm\Documents\tokoandis\public\images\custom-lab-pdf\laminar_air_flow_custom.webp"
laf_out = r"C:\Users\Ancimmm\Documents\tokoandis\public\images\custom-lab-pdf\laminar_air_flow_custom_clean.webp"

img_laf = cv2.imread(laf_in)
if img_laf is not None:
    h, w = img_laf.shape[:2]
    # For LAF, let's just crop the top 15% entirely if the text is at the top edge,
    # or inpaint the whole top half aggressively.
    # The user said the text is still there. Let's do a wider threshold in the top 30%.
    roi_y2 = int(h*0.3)
    roi = img_laf[0:roi_y2, 0:w]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY_INV)
    kernel = np.ones((5,5), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=2)
    
    mask = np.zeros(img_laf.shape[:2], dtype=np.uint8)
    mask[0:roi_y2, 0:w] = thresh
    
    result_laf = cv2.inpaint(img_laf, mask, 5, cv2.INPAINT_TELEA)
    cv2.imwrite(laf_out, result_laf)
    print("Fixed LAF")
