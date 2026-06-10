from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

path = r'c:\Users\Ancimmm\Documents\tokoandis\public\images\logos\yuasa battery.jpg'
out_path = r'c:\Users\Ancimmm\Documents\tokoandis\public\images\logos\yuasa_battery_cropped.jpg'

img = Image.open(path)
img = trim(img)
img.save(out_path)
print("Cropped and saved to", out_path)
