import os
import base64
from PIL import Image

src_path = r'C:\Users\IshaanSatapathy\.gemini\antigravity-ide\brain\b0b090bc-f38b-44f0-af99-d6d1a28c359c\.user_uploaded\media_1789068746051.png'
im = Image.open(src_path)

if im.mode != 'RGBA':
    im = im.convert('RGBA')

bbox = im.getbbox()
print('Original bbox:', bbox)
cropped = im.crop(bbox)

# Keep nice square aspect with subtle breathing room
max_side = max(cropped.width, cropped.height)
pad = int(max_side * 0.04)
square_size = max_side + pad * 2
square_im = Image.new('RGBA', (square_size, square_size), (0, 0, 0, 0))
offset_x = (square_size - cropped.width) // 2
offset_y = (square_size - cropped.height) // 2
square_im.paste(cropped, (offset_x, offset_y), cropped)

os.makedirs('public/brand', exist_ok=True)
square_im.save('public/brand/logo.png', 'PNG')
square_im.save('public/evolvex-logo.png', 'PNG')
square_im.resize((512, 512), Image.Resampling.LANCZOS).save('public/icon.png', 'PNG')
square_im.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-icon.png', 'PNG')
square_im.resize((64, 64), Image.Resampling.LANCZOS).save('public/favicon-64.png', 'PNG')
square_im.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon.png', 'PNG')

# Save standard ICO
square_im.resize((64, 64), Image.Resampling.LANCZOS).save(
    'public/favicon.ico', 
    format='ICO', 
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)

# SVG with embedded high-def raster
b64_fav = base64.b64encode(open('public/favicon-64.png', 'rb').read()).decode('utf-8')
svg_32 = f'''<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,{b64_fav}" width="32" height="32" />
</svg>'''

b64_high = base64.b64encode(open('public/icon.png', 'rb').read()).decode('utf-8')
svg_logo = f'''<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,{b64_high}" width="128" height="128" />
</svg>'''

with open('public/brand/default-favicon-dark.svg', 'w', encoding='utf-8') as f:
    f.write(svg_32)
with open('public/brand/default-favicon-light.svg', 'w', encoding='utf-8') as f:
    f.write(svg_32)
with open('public/icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_32)

with open('public/brand/default-logo-dark.svg', 'w', encoding='utf-8') as f:
    f.write(svg_logo)
with open('public/brand/default-logo-light.svg', 'w', encoding='utf-8') as f:
    f.write(svg_logo)

print('Successfully generated all logo and favicon assets!')
