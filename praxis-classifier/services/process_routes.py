from classifier.ml_classifier import classify_text as ml_classifier
from classifier.final_score import fuse_results
from rules.extract_rule import extract_rules
from classifier.evaluate_rules import evaluate_rules
from services.read_files import process_zip_file


def evaluate_description(description: str) -> dict:
    """Evaluate description text using dynamic rules and ML classifier aligned with extracted rules."""
    extracted_rules = extract_rules(description)
    rule_results = evaluate_rules(extracted_rules, description)

    # ✅ Dynamically derive ML candidate labels from extracted rules
    candidate_labels = [rule["name"].lower() for rule in extracted_rules if "name" in rule]

    # 🧠 Only classify using the rules actually relevant to this text
    ml_results = ml_classifier(description, candidate_labels)

    # Fuse both results
    final_result = fuse_results(rule_results, ml_results, labels=candidate_labels)

    rule_score = rule_results.get("score", 0.0)
    ml_score = ml_results.get("confidence", 0.0)
    fused_score = final_result.get("combined_score", (rule_score + ml_score) / 2)

    print("Extracted Rules:", extracted_rules)
    print("Rule Results:", rule_results)
    print("ML Results:", ml_results)
    print("Final Fused Result:", final_result)

    return {
        "extracted_rules": extracted_rules,
        "rule_results": rule_results,
        "ml_results": ml_results,
        "final_result": final_result,
        "score": min(max(fused_score, 0.0), 1.0),  # normalized 0–1
    }


def evaluate_files(file_bytes: bytes) -> dict:
    """Evaluate uploaded ZIP dataset using static or extracted rules."""
    rules = [
        {"name": "language", "value": "English", "weight": 0.4},
        {"name": "min_length", "value": 100, "weight": 0.3},
        {"name": "toxicity", "value": "low", "weight": 0.3},
    ]

    result = process_zip_file(file_bytes, rules)
    dataset_score = result.get("dataset_score", 0.0)

    return {
        "file_results": result,
        "dataset_score": min(max(dataset_score, 0.0), 1.0),  # normalize 0–1
    }


def combine_results(desc_result: dict, file_result: dict) -> dict:
    """Fuse description + dataset scores into a unified weighted output."""
    desc_score = round(desc_result.get("score", 0.0), 3)
    dataset_score = round(file_result.get("dataset_score", 0.0), 3)

    # Weighted combination (dataset 60%, description 40%)
    unified_score = round((0.6 * dataset_score + 0.4 * desc_score), 3)

    if unified_score >= 0.85:
        label = "Excellent"
    elif unified_score >= 0.65:
        label = "Good"
    elif unified_score >= 0.45:
        label = "Moderate"
    elif unified_score >= 0.25:
        label = "Low"
    else:
        label = "Very Low"

    output = {
        "description_score": desc_score,
        "dataset_score": dataset_score,
        "unified_score": unified_score,
        "label": label,
    }

    print("Final Unified Evaluation:", unified_score)
    return output
