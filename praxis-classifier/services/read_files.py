import zipfile
import io
from transformers import pipeline
from classifier.evaluate_text import evaluate_text
from classifier.ml_classifier import classify_text
from classifier.final_score import fuse_results as final_scores


def load_lightweight_model():
    return pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli", device=1)

def process_zip_file(zip_bytes: bytes, rules: list[dict]) -> dict:
    results, total_score, file_count = {}, 0.0, 0
    model = load_lightweight_model()

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
        for file_name in z.namelist():
            if not file_name.lower().endswith((".txt", ".md", ".csv", ".json")):
                continue

            content = z.open(file_name).read().decode("utf-8", errors="ignore").strip()
            if not content:
                continue

            rule_result = evaluate_text(content, rules)
            ml_result = classify_text(content, ["english", "non-toxic"])

            rule_score = rule_result.get("weighted_score", 0.0)
            ml_score = sum(ml_result.values()) / len(ml_result)
            combined_score = round((0.7 * rule_score) + (0.3 * ml_score), 3)

            total_score += combined_score
            file_count += 1

    dataset_score = round(total_score / file_count, 3) if file_count else 0.0
    return {"dataset_score": dataset_score}
