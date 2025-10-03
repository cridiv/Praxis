from transformers import pipeline

_zero_shot = None
_text_cache = {}


def get_zero_shot_pipeline():
    global _zero_shot
    if _zero_shot is None:
        print("🔄 Loading multilingual zero-shot model...")
        _zero_shot = pipeline(
            "zero-shot-classification",
            model="MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7",
        )
    return _zero_shot


def classify_text(
    text: str, candidate_labels: list[str], multi_label: bool = True
) -> dict:
    """
    Multilingual zero-shot classifier for Sage.
    Uses DeBERTa-v3 trained on XNLI, supports 100+ languages.
    Returns a dictionary of {label: score}.
    """
    cache_key = (text, tuple(candidate_labels), multi_label)
    if cache_key in _text_cache:
        return _text_cache[cache_key]

    pipe = get_zero_shot_pipeline()
    result = pipe(text, candidate_labels, multi_label=multi_label)

    scores = {
        label: float(score) for label, score in zip(result["labels"], result["scores"])
    }
    _text_cache[cache_key] = scores
    return scores


# --- Quick test ---
if __name__ == "__main__":
    sample_text = "Ceci est un texte en français, très court et pas toxique."
    labels = ["toxic", "non-toxic", "short", "long", "english", "french"]

    scores = classify_text(sample_text, labels)
    print(scores)
