import os
import sys
import requests
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()
go_api_key = os.getenv('GO_API_KEY')
mongodb_uri = os.getenv('MONGODB_URI')  # Ensure this is set in your .env file

if not go_api_key:
    raise ValueError("MJ is not set in environment variables")
if not mongodb_uri:
    raise ValueError("MONGODB_URI is not set in environment variables")

endpoint = "https://api.midjourneyapi.xyz/mj/v2/imagine"

headers = {
    "X-API-KEY": go_api_key
}

data = {
    "prompt": "a cute cat",
    "aspect_ratio": "5:8",
    "process_mode": "mixed",
    "webhook_endpoint": "",
    "webhook_secret": ""
}

response = requests.post(endpoint, headers=headers, json=data)

print(response.status_code)
print(response.json())