import os
import sqlite3
import requests
from PIL import Image

# Configuration
API_KEY = 'hdX8mFtk3rnnRf5C4SA3WMg8'
SOURCE_DIR = r'public\gambarproduk'
OUTPUT_DIR = r'public\images\products'
DB_PATH = r'prisma\dev.db'

# Mappings
IMAGE_MAPPINGS = [
    {
        'slug': 'vortex-mixer-servicebio-smv-4500b',
        'filename': 'Vortex Mixer Servicebio SMV-4500B.png'
    },
    {
        'slug': 'mikroskop-olympus-cx-23',
        'filename': 'Mikroskop Olympus CX-23.webp'
    },
    {
        'slug': 'autoklaf-labtech-lac-50455p',
        'filename': 'Autoklaf Labtech LAC-50455P.jpg'
    },
    {
        'slug': 'water-purificator-puris-mirae-st',
        'filename': 'Water Purificator Puris Mirae ST Expe-CB Ele 10-M.jpg'
    }
]

def remove_background(image_path):
    print(f"  -> Removing background for {os.path.basename(image_path)} using remove.bg...")
    try:
        with open(image_path, 'rb') as f:
            response = requests.post(
                'https://api.remove.bg/v1.0/removebg',
                files={'image_file': f},
                data={'size': 'auto'},
                headers={'X-Api-Key': API_KEY},
            )
        if response.status_code == 200:
            return response.content
        else:
            print(f"  -> remove.bg error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"  -> remove.bg request failed: {e}")
        return None

def process_images():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for mapping in IMAGE_MAPPINGS:
        input_path = os.path.join(SOURCE_DIR, mapping['filename'])
        output_filename = f"{mapping['slug']}.png"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        db_image_path = f"/images/products/{output_filename}"

        if not os.path.exists(input_path):
            print(f"Warning: Source image not found: {input_path}")
            continue

        print(f"\nProcessing: {mapping['filename']} -> {output_filename}")

        # 1. Remove background
        bg_removed_data = remove_background(input_path)
        temp_no_bg_path = "temp_nobg.png"
        
        if bg_removed_data:
            with open(temp_no_bg_path, 'wb') as f:
                f.write(bg_removed_data)
            product_img_path = temp_no_bg_path
            print("  -> Background removed successfully.")
        else:
            product_img_path = input_path
            print("  -> Using original image (no bg removal).")

        try:
            # 2. Save final image without template
            prod_img = Image.open(product_img_path)
            
            # Create a transparent background for the product if not already RGBA
            if prod_img.mode != 'RGBA':
                prod_img = prod_img.convert('RGBA')

            prod_img.save(output_path, "PNG")
            print(f"  -> Final image saved: {output_path}")

            # 3. Clean up temp file
            if os.path.exists(temp_no_bg_path):
                os.remove(temp_no_bg_path)

            # 4. Update SQLite Database
            if os.path.exists(DB_PATH):
                conn = sqlite3.connect(DB_PATH)
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE Product SET image = ? WHERE slug = ?",
                    (db_image_path, mapping['slug'])
                )
                conn.commit()
                if cursor.rowcount > 0:
                    print(f"  -> DB updated for {mapping['slug']} -> {db_image_path}")
                else:
                    print(f"  -> DB warning: Product {mapping['slug']} not found in DB.")
                conn.close()
            else:
                print(f"Error: Database not found at {DB_PATH}")

        except Exception as err:
            print(f"  -> Error processing {mapping['filename']}: {err}")
            if os.path.exists(temp_no_bg_path):
                os.remove(temp_no_bg_path)

    print("\nAll images processed successfully!")

if __name__ == '__main__':
    process_images()
