import React, { useState } from 'react';
import axios from 'axios';

const CreatePhoneCaseConversation = () => {
    const [inputText, setInputText] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [nextPrompt, setNextPrompt] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const startConversation = async (topic) => {
        try {
            const response = await axios.post('http://localhost:5000/start_conversation');
            setConversationId(response.data.conversationId);
            handleUserResponse(topic);
        } catch (error) {
            console.error('Error starting conversation', error);
        }
    };

    const handleUserResponse = async (userResponse) => {
        if (!conversationId) return;

        try {
            const response = await axios.post(`http://localhost:5000/handle_response/${conversationId}`, {
                response: userResponse
            });
            setNextPrompt(response.data.nextPrompt);
        } catch (error) {
            console.error('Error handling response', error);
        }
    };

    const handleSubmit = () => {
        if (!inputText) {
            alert("Please fill in the field");
            return;
        }
        startConversation(inputText);
    };

    const handleEndConversation = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/end_conversation/${conversationId}`);
            alert(response.data.result);
            setConversationId(null);
            setNextPrompt('');
        } catch (error) {
            console.error('Error ending conversation', error);
        }
    };

    return (
        <div className="flex flex-col space-y-4 p-4">
            <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
                placeholder="Enter topic"
            />

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Submit
            </button>

            {nextPrompt && (
                <div>
                    <p>{nextPrompt}</p>
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Your response"
                    />
                    <button
                        onClick={() => handleUserResponse(inputText)}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Respond
                    </button>
                    <button
                        onClick={handleEndConversation}
                        className="bg-red-500 text-white p-2 rounded"
                    >
                        End Conversation
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreatePhoneCaseConversation;
