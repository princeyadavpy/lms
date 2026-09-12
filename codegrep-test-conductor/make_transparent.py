import sys
from PIL import Image

def remove_bg(input_path, output_path):
    try:
        from rembg import remove
        with open(input_path, 'rb') as i:
            with open(output_path, 'wb') as o:
                input_data = i.read()
                output_data = remove(input_data)
                o.write(output_data)
        print("Success using rembg")
    except ImportError:
        print("rembg not found, using PIL color removal")
        img = Image.open(input_path).convert("RGBA")
        
        # We need a slightly better background removal that handles white fringes
        # Convert to numpy array if possible for faster, or just fallback to basic PIL
        datas = img.getdata()
        newData = []
        for item in datas:
            # Calculate distance to white
            dist = (255 - item[0]) + (255 - item[1]) + (255 - item[2])
            if dist < 45: # Very close to white
                newData.append((255, 255, 255, 0))
            elif dist < 90: # Edge pixels, make semi-transparent
                alpha = int((dist - 45) / 45 * 255)
                newData.append((item[0], item[1], item[2], alpha))
            else:
                newData.append(item)
        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Success using PIL")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <input> <output>")
        sys.exit(1)
    remove_bg(sys.argv[1], sys.argv[2])
