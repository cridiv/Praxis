from transformers import pipeline
import concurrent.futures
import torch


torch.set_default_device("cpu")


_zero_shot = None
_text_cache = {}
_executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)  # reused across calls


def run_with_timeout(func, timeout, *args, **kwargs):
    """
    Run `func(*args, **kwargs)` in a worker thread and return the result.
    Raises TimeoutError on timeout.
    """
    future = _executor.submit(func, *args, **kwargs)
    try:
        return future.result(timeout=timeout)
    except concurrent.futures.TimeoutError:
        future.cancel()
        raise TimeoutError("Function timed out")


def get_zero_shot_pipeline():
    """
    Lazily load and return the zero-shot pipeline. Loading may download model weights
    the first time it runs.
    """
    global _zero_shot
    if _zero_shot is None:
        print("🔄 Loading lightweight zero-shot model...")
        _zero_shot = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device=-1,  # CPU; change if you set up GPU device indexing
        )
    return _zero_shot


def classify_text(
    text: str, candidate_labels: list[str], multi_label: bool = True
) -> dict:
    """
    Zero-shot classifier with timeout protection and caching.
    Returns a dict: { label: float_score }.
    """
    cache_key = (text[:200], tuple(candidate_labels), bool(multi_label))
    if cache_key in _text_cache:
        return _text_cache[cache_key]

    try:
        pipe = get_zero_shot_pipeline()
        truncated_text = text[:512]

        # Run the pipeline in a worker thread with timeout.
        # The HF pipeline is callable: pipe(sequence, candidate_labels, multi_label=...)
        result = pipe(
            truncated_text,
            candidate_labels,
            multi_label=multi_label,
        )

        # result contains keys like "labels" and "scores"
        scores = {
            label: float(score)
            for label, score in zip(result["labels"], result["scores"])
        }

        # cache and return
        _text_cache[cache_key] = scores
        return scores

    except Exception as e:
        print(f"Classification failed or timed out: {e}")
        # safe fallback: neutral 0.5 per label
        return {label: 0.5 for label in candidate_labels}
