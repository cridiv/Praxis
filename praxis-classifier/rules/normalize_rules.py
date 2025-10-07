import re
import json
from extract_rule import extract_rules


def normalize_rules(rules):
    """
    Normalize extracted rules so they are clean and consistent for Sage.
    - Fixes names (maps synonyms to standard rule names).
    - Converts values to the right type (int, string, etc).
    - Normalizes weights so they sum to 1.0.
    """

    name_map = {
        "language": "language",
        "english text": "language",
        "lang": "language",
        "wordcount": "min_length",
        "word count": "min_length",
        "min_words": "min_length",
        "length": "min_length",
        "min_length": "min_length",
        "toxicity": "toxicity",
        "toxic": "toxicity",
    }

    normalized = []

    for rule in rules:
        name = str(rule.get("name", "")).lower().strip()
        value = rule.get("value")
        weight = rule.get("weight", None)

        if name in name_map:
            name = name_map[name]
        else:
            continue

        if name == "language":
            value = str(value).capitalize()
        elif name == "min_length":
            value = int(re.findall(r"\d+", str(value))[0]) if value else 0
        elif name == "toxicity":
            val = str(value).lower()
            if "no" in val or "low" in val:
                value = "low"
            elif "medium" in val:
                value = "medium"
            elif "high" in val:
                value = "high"
            else:
                value = "low"  # default

        if weight is None or weight <= 0:
            weight = 0.0

        normalized.append({"name": name, "value": value, "weight": float(weight)})

    total_weight = sum(r["weight"] for r in normalized)
    if total_weight == 0:
        # Assign equal weights if all missing/invalid
        equal_weight = 1.0 / len(normalized)
        for r in normalized:
            r["weight"] = round(equal_weight, 2)
    else:
        for r in normalized:
            r["weight"] = round(r["weight"] / total_weight, 2)

    return normalized
