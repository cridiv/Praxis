import re
import langcodes
from textblob import TextBlob
from transformers import pipeline

_toxicity_pipeline = None
_text_cache = {}


def get_toxicity_pipeline():
    """Lazy load the Hugging Face pipeline only once."""
    global _toxicity_pipeline
    if _toxicity_pipeline is None:
        _toxicity_pipeline = pipeline("text-classification", model="unitary/toxic-bert")
    return _toxicity_pipeline


def evaluate_text(text: str, rules: list[dict]) -> dict:
    """
    Evaluate text against normalized rules.
    Supports: language, min_length, toxicity.
    Uses Hugging Face model for toxicity with caching.
    """
    results = {}
    total_score = 0.0

    for rule in rules:
        name = rule["name"]
        value = rule["value"]
        weight = rule["weight"]

        passed = False
        score = 0.0

        if name == "language":
            try:
                blob = TextBlob(text)
                detected_code = blob.detect_language()

                # Normalize the expected language using langcodes
                if value in ["English", "French", "Spanish"]:
                    lang_map = {"English": "en", "French": "fr", "Spanish": "es"}
                    expected_code = lang_map[value]
                else:
                    # Use langcodes to standardize the input
                    expected_lang = langcodes.find(value)
                    expected_code = (
                        str(expected_lang) if expected_lang else value.lower()
                    )

                passed = detected_code == expected_code
                score = 1.0 if passed else 0.0
            except:
                passed = False

        elif name == "min_length":
            word_count = len(re.findall(r"\w+", text))
            passed = word_count >= int(value)
            score = 1.0 if passed else 0.0

        elif name == "toxicity":
            cache_key = f"{text[:512]}_{value}"
            if cache_key in _text_cache:
                prediction = _text_cache[cache_key]
            else:
                pipeline = get_toxicity_pipeline()
                prediction = pipeline(text[:512])[0]
                _text_cache[cache_key] = prediction

            label = prediction["label"].lower()
            toxic_score = prediction["score"]

            if value == "low":
                passed = label != "toxic" or toxic_score < 0.5
            elif value == "medium":
                passed = toxic_score < 0.7
            elif value == "high":
                passed = True
            score = 1.0 if passed else 0.0

            results["toxicity_raw"] = {
                "label": label,
                "model_score": round(toxic_score, 3),
            }

        results[name] = {"passed": passed, "score": score, "weight": weight}
        total_score += score * weight

    results["weighted_score"] = round(total_score, 2)
    return results


if __name__ == "__main__":
    rules = [
        {"name": "language", "value": "English", "weight": 0.4},
        {"name": "min_length", "value": 10, "weight": 0.3},
        {"name": "toxicity", "value": "low", "weight": 0.3},
    ]

    sample_text = "My name is Aderemi Ademola, i'm a backend developer, i speak english and i'm  very well-versed in it, "
    print(evaluate_text(sample_text, rules))
