from flask import Flask, request, jsonify, make_response
import subprocess
from flask_cors import CORS
import sys
import os
from pymongo import MongoClient
import uuid
from bson import ObjectId

app = Flask(__name__)
CORS(app, origins=["*"], methods=['GET', 'POST', 'OPTIONS'], allow_headers="*")

# Connect to MongoDB
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
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        return jsonify({"status": "Success: DB Connection", "success": True})
    except Exception as e:
        return jsonify({"status": f"Failure: Cannot connect to DB: {str(e)}", "success": False})


@app.route('/generate_prompt', methods=['GET', 'POST'])
def generate_prompt():
    data = request.json
    topic = data.get('topic', '')
    job_id = data.get('job_id', '')

    prompt_result = subprocess.run(
        ['python', 'llms/generate_prompt_llm.py', topic],
        stdout=sys.stdout,
        stderr=sys.stderr
    )

    print("generate_prompt.js returncode:", prompt_result.returncode)

    # db.aibot.update_one(
    #    {"_id": job_id},
    #    {"$set": {"progress": 100, "step": "Done"}}
    #)

    if os.path.exists("agent_response.txt"):
        with open("agent_response.txt", "r") as f:
            agent_response = f.read()
    else:
        agent_response = "No response generated."

    return jsonify({"message": "Analysis completed", "agentResponse": agent_response, "job_id": job_id})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
