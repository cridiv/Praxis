from fastapi import APIRouter, UploadFile, File
from services.read_files import process_zip_file

router = APIRouter()


@router.post("/classify")
async def classify_zip(file: UploadFile = File(...)):
    file_bytes = await file.read()

    rules = [
        {"name": "language", "value": "English", "weight": 0.4},
        {"name": "min_length", "value": 100, "weight": 0.3},
        {"name": "toxicity", "value": "low", "weight": 0.3},
    ]

    result = process_zip_file(file_bytes, rules)
    print("Classified Results:", result)

    return result
