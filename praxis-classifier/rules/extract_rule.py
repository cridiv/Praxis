import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


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

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": description},
        ],
        temperature=0,
    )

    content = response.choices[0].message.content.strip()

    try:
        rules = json.loads(content)
        if not isinstance(rules, list):
            raise ValueError("Output was not a list of rules")
    except Exception as e:
        raise ValueError(f"Invalid JSON returned: {e}\nContent: {content}")

    return rules
