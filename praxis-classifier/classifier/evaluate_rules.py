def evaluate_rules(rules, description: str):
    """
    Given normalized rules and the description, produce a weighted score.
    """
    total_weight = sum(r["weight"] for r in rules)
    total_score = 0.0

    for rule in rules:
        name, value, weight = rule["name"], rule["value"], rule["weight"]

        # simple examples for now
        if name == "language":
            score = 1.0 if value.lower() in description.lower() else 0.5
        elif name == "min_length":
            score = 1.0 if len(description.split()) >= value else 0.4
        elif name == "toxicity":
            score = 1.0 if value == "low" else 0.3
        else:
            score = 0.5  # neutral

        total_score += score * weight

    weighted_score = round(total_score / (total_weight or 1.0), 2)
    return {"rules": rules, "weighted_score": weighted_score}
