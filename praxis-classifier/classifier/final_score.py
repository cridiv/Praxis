def normalize_score(score: float) -> float:
    score = max(0.0, min(score, 1.0))
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


def fuse_results(rule_results: dict, ml_results: dict, labels: list[str]) -> dict:
    """
    Dynamically combine rule-based and ML-based results into a single unified score and label.
    Uses extracted rule names to determine relevant ML factors.
    """
    # 1️⃣ Extract rule-based score
    rule_score = rule_results.get("weighted_score", 0.0)

    # 2️⃣ Dynamically filter ML results to match the active labels
    filtered_ml_scores = [
        ml_results.get(label.lower(), 0.0) for label in labels
    ]
    ml_score = (
        sum(filtered_ml_scores) / len(filtered_ml_scores)
        if filtered_ml_scores
        else 0.0
    )

    # 3️⃣ Dynamic weighting (e.g., more rules = more rule influence)
    total_rules = len(labels)
    rule_weight = min(0.7, 0.3 + (0.05 * total_rules))  # up to 0.7
    ml_weight = 1.0 - rule_weight

    # 4️⃣ Combine scores
    combined_raw = (rule_score * rule_weight) + (ml_score * ml_weight)

    # 5️⃣ Normalize & label
    normalized = normalize_score(combined_raw)
    qualitative = label_score(normalized)

    return {
        "rule_results": rule_results,
        "ml_results": ml_results,
        "combined_score": normalized,
        "label": qualitative,
        "weights": {"rule_weight": rule_weight, "ml_weight": ml_weight},
    }
