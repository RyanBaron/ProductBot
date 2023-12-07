from flask import Flask, request, jsonify, make_response
import subprocess
from flask_cors import CORS
import sys
import os
from pymongo import MongoClient
from bson import ObjectId
import uuid  # Import the uuid module

app = Flask(__name__)
CORS(app, origins=["*"], methods=['GET', 'POST', 'OPTIONS'], allow_headers="*")

# Connect to MongoDB
# Uncomment the below line to connect to a local MongoDB instance
# client = MongoClient('mongodb://localhost:27017/')
client = MongoClient('mongodb://mongo:27017/')
db = client.productbot

def options():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/connect', methods=['GET', 'POST'])
def connect():
    return jsonify({"status": "Success: Backend Connection"})

@app.route('/status_db', methods=['GET'])
def mongodb_status():
    try:
        client.admin.command('ismaster')
        return jsonify({"status": "Success: DB Connection", "success": True})
    except Exception as e:
        return jsonify({"status": f"Failure: Cannot connect to DB: {str(e)}", "success": False})

@app.route('/generate_prompt', methods=['POST'])
def generate_prompt():
    data = request.json
    topic = data.get('topic', '')
    styles = data.get('styles', [])
    jobId = data.get('jobId', '')  # Extract jobId

    prompt_result = subprocess.run(
        ['python', 'llms/generate_prompt_llm.py', topic, *styles, jobId],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    print("generate_prompt.js returncode:", prompt_result.returncode)

    # Database update logic (commented out)
    # if jobId:
    #     db.aibot.update_one(
    #         {"_id": ObjectId(jobId)},
    #         {"$set": {"progress": 100, "step": "Done", "jobId": jobId}}
    #     )

    if os.path.exists("assistant_response.txt"):
        with open("assistant_response.txt", "r") as f:
            assistant_response = f.read()
    else:
        assistant_response = "No response generated."

    return jsonify({"message": "Analysis completed", "agentResponse": assistant_response, "jobId": jobId})

# New conversational endpoints
@app.route('/start_conversation', methods=['POST'])
def start_conversation():
    conversation_id = str(uuid.uuid4())
    db.conversations.insert_one({"_id": conversation_id, "steps": []})
    return jsonify({"message": "Conversation started", "conversationId": conversation_id})

@app.route('/handle_response/<conversation_id>', methods=['POST'])
def handle_response(conversation_id):
    data = request.json
    user_response = data.get('response')
    db.conversations.update_one({"_id": conversation_id}, {"$push": {"steps": user_response}})
    next_prompt = "What are your preferences for the design?"  # Dynamic prompt generation logic goes here
    return jsonify({"nextPrompt": next_prompt})

@app.route('/end_conversation/<conversation_id>', methods=['POST'])
def end_conversation(conversation_id):
    conversation = db.conversations.find_one({"_id": conversation_id})
    result = "Your custom design is ready!"  # Process the conversation and generate result
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
