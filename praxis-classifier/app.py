from google import genai
import os
from dotenv import load_dotenv


load_dotenv()
print("API key loaded:", os.getenv("GEMINI_API_KEY")[:10])
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
models = client.models.list()
print([m.name for m in models])
