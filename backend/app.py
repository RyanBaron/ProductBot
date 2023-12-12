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

@app.route('/conversation', methods=['POST'])
def handle_conversation():
    try:
        user_response = request.json.get('response', '')
        conversation_id = request.json.get('conversationId')

        if not conversation_id:
            # No conversation ID, start a new conversation
            conversation_id = str(uuid.uuid4())

            # Generate the initial prompt for a new conversation
            prompt_result = subprocess.run(
                ['python', 'llms/phone_case_conversation_start.py', user_response, conversation_id],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if prompt_result.returncode == 0:
                generated_prompt = prompt_result.stdout.strip()
                message = "Conversation started"
            else:
                error_message = prompt_result.stderr
                return jsonify({"error": "Error generating conversation prompt", "details": error_message}), 500

        else:
            # Existing conversation ID, continue the conversation

            # Generate the initial prompt for a new conversation
            prompt_result = subprocess.run(
                ['python', 'llms/phone_case_conversation_continue.py', user_response, conversation_id],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if prompt_result.returncode == 0:
                generated_prompt = prompt_result.stdout.strip()
                message = "Conversation continued"
            else:
                error_message = prompt_result.stderr
                return jsonify({"error": "Error generating conversation prompt", "details": error_message}), 500

        # Update or create a conversation in the database
        db.conversations.update_one(
            {"_id": conversation_id},
            {"$push": {"steps": user_response}},
            upsert=True
        )

        return jsonify({
            "message": message,
            "conversationId": conversation_id,
            "botResponse": generated_prompt,
        })

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500



@app.route('/end_conversation/<conversation_id>', methods=['POST'])
def end_conversation(conversation_id):
    conversation = db.conversations.find_one({"_id": conversation_id})
    result = "Your custom design is ready!"  # Process the conversation and generate result
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
