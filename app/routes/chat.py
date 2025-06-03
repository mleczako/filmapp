import os
from dotenv import load_dotenv
from openai import AzureOpenAI

# wczytuje .env
load_dotenv()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-02-15-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

deployment_name = os.getenv("AZURE_DEPLOYMENT_NAME")

# prompt z pliku
with open("prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()

# zeby pamietal cala romzowe
messages = [{"role": "system", "content": system_prompt}]

print("🎬 Filmowy czat GPT — wpisz 'exit' aby zakończyć")

while True:
    user_input = input("Ty: ")
    if user_input.lower() in ["exit", "quit"]:
        break

    # dodaje odpowiedz
    messages.append({"role": "user", "content": user_input})

    try:
       
        response = client.chat.completions.create(
            model=deployment_name,
            messages=messages
        )
        reply = response.choices[0].message.content

        
        messages.append({"role": "assistant", "content": reply})

        print("🎥 GPT:", reply)

    except Exception as e:
        print("Błąd:", e)
