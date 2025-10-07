from transformers import pipeline
import signal
from contextlib import contextmanager

_zero_shot = None
_text_cache = {}


@contextmanager
def timeout(duration):
    def timeout_handler(signum, frame):
        raise TimeoutError(f"Operation timed out after {duration} seconds")

    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(duration)
    try:
        yield
    finally:
        signal.alarm(0)


def get_zero_shot_pipeline():
    global _zero_shot
    if _zero_shot is None:
        print("🔄 Loading lightweight zero-shot model...")
        # Use a smaller, faster model
        _zero_shot = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
        )
    return _zero_shot


def classify_text(
    text: str, candidate_labels: list[str], multi_label: bool = True
) -> dict:
    """
    Zero-shot classifier with timeout protection.
    Returns a dictionary of {label: score}.
    """
    cache_key = (text[:200], tuple(candidate_labels), multi_label)  # Shorter cache key
    if cache_key in _text_cache:
        return _text_cache[cache_key]

    try:
        with timeout(10):  # 10 second timeout
            pipe = get_zero_shot_pipeline()
            # Truncate text to speed up processing
            truncated_text = text[:512]
            result = pipe(truncated_text, candidate_labels, multi_label=multi_label)

            scores = {
                label: float(score)
                for label, score in zip(result["labels"], result["scores"])
            }
            _text_cache[cache_key] = scores
            return scores

    except (TimeoutError, Exception) as e:
        print(f"Classification failed or timed out: {e}")
        # Return default scores if classification fails
        return {label: 0.5 for label in candidate_labels}
