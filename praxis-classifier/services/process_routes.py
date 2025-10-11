from services.read_files import process_zip_file
from rules.extract_rule import extract_rules
from rules.normalize_rules import normalize_rules
from classifier.evaluate_rules import evaluate_rules
from classifier.ml_classifier import classify_text as ml_classifier
from classifier.final_score import fuse_results
from pydantic import BaseModel
from starlette.responses import JSONResponse


class DescriptionInput(BaseModel):
    description: str


def classify_zip(file_bytes: bytes):
    print("Classifying ZIP file...")
    rules = [
        {"name": "language", "value": "English", "weight": 0.4},
        {"name": "min_length", "value": 100, "weight": 0.3},
        {"name": "toxicity", "value": "low", "weight": 0.3},
    ]

    result = process_zip_file(file_bytes, rules)
    print("Classified Results:", result)

    return result


def process_description(data: DescriptionInput):
    description = data.description
    print("Processing description:", description)

    extracted_rules = extract_rules(description)
    normalized_rules = normalize_rules(extracted_rules)
    print("Extracted Rules:", extracted_rules)
    rule_results = evaluate_rules(normalized_rules, description)

    candidate_labels = [
        "toxic",
        "non-toxic",
        "english",
        "french",
        "german",
        "short",
        "long",
    ]

    ml_results = ml_classifier(description, candidate_labels)
    print("Ml_Results: ", ml_results)

    final = fuse_results(rule_results, ml_results, labels=candidate_labels)

    return JSONResponse({"final_result": final})
