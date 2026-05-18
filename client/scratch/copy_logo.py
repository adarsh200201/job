import shutil
import os

src = r"C:\Users\Adarsh Sharma\.gemini\antigravity\brain\a55d9248-6f74-4ecd-8249-646f0f741abf\nextjobpost_logo_1779111652669.png"
dst = r"e:\job\job\client\public\logo.png"

try:
    shutil.copy(src, dst)
    print("SUCCESS: Logo copied successfully!")
except Exception as e:
    print(f"ERROR: {e}")
