import os
import whisper
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"

model = whisper.load_model("small").to(device)
folder_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "toConvert")
files = os.listdir(folder_path)

if files:
    full_file_path = os.path.join(folder_path, files[0])
    result = model.transcribe(full_file_path)
    
    converted_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "converted")
    os.makedirs(converted_path, exist_ok=True)
    
    out_file = os.path.join(converted_path, "transkribed.txt")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(result["text"])

    os.remove(full_file_path)
