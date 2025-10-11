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
    rule_score = rule_results.get("weighted_score", 0.0)
    ml_score = (
        sum(
            v if isinstance(v, (int, float)) else v.get("score", 0.0)
            for v in ml_results.values()
        )
        / len(ml_results)
        if ml_results
        else 0.0
    )

    combined_raw = (rule_score + ml_score) / 2
    normalized = normalize_score(combined_raw)
    qualitative = label_score(normalized)

    return {
        "rule_results": rule_results,
        "ml_results": ml_results,
        "combined_score": normalized,
        "label": qualitative,
    }
