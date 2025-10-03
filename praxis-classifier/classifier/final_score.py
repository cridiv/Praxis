# fusion.py
from evaluate_text import evaluate_text
from ml_classifier import classify_text


def normalize_score(score: float) -> float:
    score = max(0.0, min(score, 1.0))  # clamp
    return round(score, 2)


def label_score(score: float) -> str:
    if score <= 0.25:
        return "Very Low"
    elif score <= 0.50:
        return "Low"
    elif score <= 0.75:
        return "Medium"
    else:
        return "High"


def fuse_results(text: str, rules: list[dict], labels: list[str]) -> dict:
    rule_results = evaluate_text(text, rules)
    ml_results = classify_text(text, labels)

    rule_score = rule_results.get("weighted_score", 0.0)
    ml_score = sum(ml_results.values()) / len(ml_results) if ml_results else 0.0

    combined_raw = (rule_score + ml_score) / 2
    normalized = normalize_score(combined_raw)
    qualitative = label_score(normalized)

    return {
        "rule_results": rule_results,
        "ml_results": ml_results,
        "combined_score": normalized,
        "label": qualitative,
    }


if __name__ == "__main__":
    rules = [
        {"name": "language", "value": "English", "weight": 0.4},
        {"name": "min_length", "value": 10, "weight": 0.3},
        {"name": "toxicity", "value": "low", "weight": 0.3},
    ]

    labels = ["toxic", "non-toxic", "short", "long", "english", "french"]

    text = "This is a short English text. Idiot!"
    result = fuse_results(text, rules, labels)
    print(result)
