import os
import re
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def extract_rules(description: str):
    system_prompt = """
    You are a rule extraction engine for Sage (a data quality evaluator).
    Given a description, you must extract structured JSON rules.

    Each rule should have:
    - name (string, e.g. "language", "min_length", "toxicity")
    - value (string or number depending on rule)
    - weight (float between 0 and 1, all weights should sum ≈ 1.0)

    Return ONLY a JSON array of rules. No text outside JSON.
    Example:
    [
      { "name": "language", "value": "English", "weight": 0.4 },
      { "name": "min_length", "value": 100, "weight": 0.3 },
      { "name": "toxicity", "value": "low", "weight": 0.3 }
    ]
    """

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=[
            {"role": "user", "parts": [{"text": system_prompt + "\n\n" + description}]}
        ],
    )

    content = response.text.strip()

    content = re.sub(
        r"^```(?:json)?|```$", "", content.strip(), flags=re.MULTILINE
    ).strip()

    try:
        rules = json.loads(content)
        if not isinstance(rules, list):
            raise ValueError("Output was not a list of rules")
    except Exception as e:
        raise ValueError(f"Invalid JSON returned: {e}\nContent: {content}")

    return rules
