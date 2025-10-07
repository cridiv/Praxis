import zipfile
import io
from classifier.evaluate_text import evaluate_text
from classifier.ml_classifier import classify_text
from classifier.final_score import fuse_results as final_scores


def process_zip_file(zip_bytes: bytes, rules: list[dict]) -> dict:
    """
    Process an uploaded .zip file in-memory.
    Extracts text files, classifies each with rules + ML classifier,
    then fuses scores into a final result.
    """
    results = {}
    overall_scores = []

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
        for file_name in z.namelist():
            if not file_name.lower().endswith((".txt", ".md", ".csv", ".json")):
                continue

            with z.open(file_name) as f:
                try:
                    content = f.read().decode("utf-8", errors="ignore")
                except Exception:
                    content = ""

                if not content.strip():
                    continue

                # 1. Rule-based evaluation
                rule_result = evaluate_text(content, rules)

                # 2. ML classification
                labels = ["toxic", "non-toxic", "short", "long", "english", "french"]
                ml_result = classify_text(content, labels)

                # 3. Fuse results
                fused = final_scores(rule_result, ml_result, labels)

                results[file_name] = {
                    "rule_result": rule_result,
                    "ml_result": ml_result,
                    "fused_score": fused,
                }

                overall_scores.append(fused["rule_results"]["weighted_score"])
                overall_scores.append(
                    sum(fused["ml_results"].values()) / len(fused["ml_results"])
                )
                overall_scores.append(fused["combined_score"])

    final_dataset_score = (
        round(sum(overall_scores) / len(overall_scores), 2) if overall_scores else 0.0
    )
    print(f"Processed {len(results)} files. Dataset score: {final_dataset_score}")
    return {
        "file_results": results,
        "dataset_score": final_dataset_score,
    }
