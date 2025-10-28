import json
import re
from google import genai

client = genai.Client(
    api_key="GEMINI_API_KEY",
)

ALLOWED_RULES = {
    "language": {"type": "string", "examples": ["English", "German", "French"]},
    "excluded_language": {"type": "string", "examples": ["French", "German"]},
    "min_length": {"type": "integer", "examples": [50, 100]},
    "max_length": {"type": "integer", "examples": [500, 1000]},
    "toxicity": {"type": "string", "examples": ["low", "medium", "high"]},
    "prohibited_keywords": {"type": "list[string]", "examples": [["hate", "violence"]]},
}

SYSTEM_PROMPT = f"""
You are a rule normalization system.
Your task is to map messy or inconsistent rules into standardized JSON format.

Each rule must have:
- name: one of {list(ALLOWED_RULES.keys())}
- value: correct type (string, integer, or list of strings)
- weight: float between 0.0 and 1.0

Skip any rule you cannot confidently map.
Return only valid JSON (array of objects).

Example Input:
[{{"name": "no french allowed", "value": "", "weight": 1.0}}, {{"name": "min words 100", "value": "100", "weight": 1.0}}]

Example Output:
[
  {{"name": "excluded_language", "value": "French", "weight": 0.5}},
  {{"name": "min_length", "value": 100, "weight": 0.5}}
]
"""


def normalize_rules(rules: list[dict]) -> list[dict]:
    """
    Normalize extracted rules using Gemini for robust mapping.
    Falls back to local logic if Gemini fails or returns invalid JSON.
    """
    try:
        response = client.models.generate.content(
            model="models/gemini-2.5-flash",
            messages=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": SYSTEM_PROMPT
                            + "\n\n"
                            + json.dumps(rules, ensure_ascii=False)
                        }
                    ],
                }
            ],
            temperature=0.0,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message["content"]
        parsed = json.loads(content)

        if isinstance(parsed, dict) and "rules" in parsed:
            parsed = parsed["rules"]

        total_weight = sum(r.get("weight", 0.0) for r in parsed)
        if total_weight > 0:
            for r in parsed:
                r["weight"] = round(r["weight"] / total_weight, 2)

        return parsed

    except Exception as e:
        print(f"⚠️ Gemini normalization failed, falling back to local logic: {e}")

        # --- Step 3: Fallback to local normalization logic ---
        name_map = {
            "language": "language",
            "english text": "language",
            "lang": "language",
            "wordcount": "min_length",
            "word count": "min_length",
            "min_words": "min_length",
            "length": "min_length",
            "min_length": "min_length",
            "excluded_language": "excluded_language",
            "disallowed_language": "excluded_language",
            "toxicity": "toxicity",
            "toxic": "toxicity",
        }

        normalized = []
        for rule in rules:
            name = str(rule.get("name", "")).lower().strip()
            value = rule.get("value")
            weight = rule.get("weight", None)

            if name not in name_map:
                continue
            name = name_map[name]

            if name == "language":
                value = str(value).capitalize()
            elif name == "min_length":
                value = int(re.findall(r"\d+", str(value))[0]) if value else 0
            elif name == "excluded_language":
                value = str(value).capitalize()
            elif name == "toxicity":
                val = str(value).lower()
                if "no" in val or "low" in val:
                    value = "low"
                elif "medium" in val:
                    value = "medium"
                elif "high" in val:
                    value = "high"
                else:
                    value = "low"

            if weight is None or weight <= 0:
                weight = 0.0

            normalized.append({"name": name, "value": value, "weight": float(weight)})

        if not normalized:
            return []

        total_weight = sum(r["weight"] for r in normalized)
        if total_weight == 0:
            equal_weight = 1.0 / len(normalized)
            for r in normalized:
                r["weight"] = round(equal_weight, 2)
        else:
            for r in normalized:
                r["weight"] = round(r["weight"] / total_weight, 2)

        return normalized
