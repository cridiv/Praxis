from fastapi import APIRouter, UploadFile, File
from services.read_files import process_zip_file
from rules.extract_rule import extract_rules
from rules.normalize_rules import normalize_rules

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


@router.post("/description")
async def process_description(description: str):
    print("Processing description:", description)
    extracted_rules = extract_rules(description)
    normalized_rules = normalize_rules(extracted_rules)
    return {"extracted_rules": extracted_rules, "normalized_rules": normalized_rules}
