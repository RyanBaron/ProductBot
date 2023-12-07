import os
import sys
from dotenv import load_dotenv
from openai import OpenAI
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)

print('Running OpenAI Assistant')

# Load environment variables
load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set in environment variables")

# Create an OpenAI client instance
client = OpenAI(api_key=openai_api_key)

# Read the topic from the command line argument
if len(sys.argv) != 2:
    logging.error("Usage: python script.py [topic]")
    sys.exit(1)

topic = sys.argv[1]

# Define the messages for the assistant
messages = [
    {
        "role": "system",
        "content": "You are a creative assistant. Generate imaginative and descriptive prompts."
    },
    {
        "role": "user",
        "content": f"Create a visually descriptive Midjourney prompt based on the topic '{topic}'."
    }
]

# Make the API call using the client instance
try:
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo"  # Consider using a more advanced model if available
    )

    # Check if response is not empty and extract generated text
    if chat_completion.choices:
        generated_text = chat_completion.choices[0].message.content.strip()
        formatted_text = f"/imagine prompt: {generated_text} --ar 5:8"
        print(formatted_text)

        # Save the response to a file
        with open("assistant_response.txt", "w") as f:
            f.write(formatted_text)
    else:
        print("No response received from the API.")

except Exception as e:
    logging.error(f"An error occurred: {e}")

