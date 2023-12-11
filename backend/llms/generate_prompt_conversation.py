import os
import sys
from dotenv import load_dotenv
from openai import OpenAI
print('Running OpenAI Assistant')

# Load environment variables
load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set in environment variables")

# Create an OpenAI client instance
client = OpenAI(api_key=openai_api_key)

# Define your topic here
topic = sys.argv[1]
# topic = "Futuristic Cityscape"

# Define the messages for the assistant
messages = [
    {
        "role": "assistant",
        "content": "To write effective Midjourney prompts, follow these guidelines: Use Correct Grammar: Midjourney requires precise grammar for accurate image generation. Choose synonyms for concise expression, like 'exhausted' instead of 'very tired.' Be Specific: Detail your ideas clearly. For example, use 'tyreless cycle' instead of 'bicycle with no tires.' Use Simple Language: Opt for straightforward language, keeping prompts neither too short nor too long. Give Reference: Reference styles, eras, or artists to guide the AI. Include Text Inputs: Specify location, subject, style, lighting, and emotions for detailed images. Use Parameters: Utilize technical inputs like aspect ratio (--aspect or --ar), exclude objects (--no), chaos (--chaos), and tile (--tile) for specific image traits."
    },
    {
        "role": "system",
        "content": "Your initial job will be to gather additional information that will help you write an effective midjourney prompt for the topic submitted by the user. You will do this through a series of simple questions that can be presented to the user giving them a choice between 2 options. Your 2nd task will be to generate a concise and effective midjourney prompt on the topic at hand based on the information you gathered from the user and you knowledge of midjourney prompting and best practices. You will generate a prompt in the format of '/imagine prompt:[prompt text goes here] --ar 5:8' any time the user says 'show me the prompt', otherwise you will contine to gather information to improve the prompt."
    },
    {
        "role": "user",
        "content": f"{topic}"
    }
]

# Make the API call using the client instance
try:
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo"  # Specify the model
    )

    # Check if response is not empty and extract generated text
    if chat_completion.choices:
        generated_text = chat_completion.choices[0].message.content.strip()
        print(generated_text)

        # Save the response to a file
        with open("assistant_response.txt", "w") as f:
            f.write(generated_text)
    else:
        print("No response received from the API.")

except Exception as e:
    print(f"An error occurred: {e}")
