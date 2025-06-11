import os
import re
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-02-15-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

deployment_name = os.getenv("AZURE_DEPLOYMENT_NAME")

with open("prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()


def film_chat(user_input, history=None):
    if history is None:
        history = []

    messages = [{"role": "system", "content": system_prompt}] + history
    messages.append({"role": "user", "content": user_input})

    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=messages
        )
        reply = response.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        return reply, messages[1:]  

    except Exception as e:
        return f"Błąd: {e}", history



def format_movie_response(response):
    """
    Funkcja do formatowania odpowiedzi, aby każde wystąpienie 'X.' zaczynało nową linię.
    """
    formatted_response = re.sub(r"(\d+\.)", r"\n\1", response)

    return formatted_response.strip() 


if __name__ == "__main__":
    print("🎬 Filmowy czat GPT — wpisz 'exit' aby zakończyć\n")
    history = []

    while True:
        user_input = input("Ty: ")
        if user_input.lower() in ["exit", "quit"]:
            break

        reply, history = film_chat(user_input, history)
        print("🎥 GPT:", reply)
