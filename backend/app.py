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
                ['python', 'llms/generate_prompt_conversation.py', user_response, conversation_id],
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
            generated_prompt = "Your logic to handle ongoing conversation goes here"
            message = "Continuing conversation"

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

@app.route('/handle_response/<conversation_id>', methods=['POST'])
def handle_response(conversation_id):
    data = request.json
    user_response = data.get('response')

    # Retrieve the conversation from the database
    conversation = db.conversations.find_one({"_id": conversation_id})

    if conversation:
        # Add user's response to conversation history
        conversation['steps'].append(user_response)

        # Determine the next question based on the user's choice
        if user_response.lower() == "option a":
            next_question = "You selected Option A. What specific information would you like about Option A?"
        elif user_response.lower() == "option b":
            next_question = "You selected Option B. What specific information would you like about Option B?"
        else:
            next_question = "I'm sorry, I didn't understand your choice. Please select Option A or Option B."

        # Update the conversation with the next question
        db.conversations.update_one({"_id": conversation_id}, {
            "$set": {
                "question": next_question,
                "options": []  # Clear options since the user has made a choice
            }
        })

        return jsonify({"nextQuestion": next_question})

    return jsonify({"message": "Conversation not found"})


@app.route('/end_conversation/<conversation_id>', methods=['POST'])
def end_conversation(conversation_id):
    conversation = db.conversations.find_one({"_id": conversation_id})
    result = "Your custom design is ready!"  # Process the conversation and generate result
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
