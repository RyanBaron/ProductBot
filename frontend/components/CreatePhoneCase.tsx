import React, { useState } from 'react';
import axios from 'axios';

const CreatePhoneCaseConversation = () => {
    const [inputText, setInputText] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [nextPrompt, setNextPrompt] = useState('');
    const [responseText, setResponseText] = useState(''); // State to store the response text
    const [isConversationInProgress, setConversationInProgress] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const startConversation = async (topic) => {
        try {
            setConversationInProgress(true); // Start the conversation, disable the form
            const response = await axios.post('http://localhost:5000/start_conversation', { topic }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setConversationId(response.data.conversationId);
            handleUserResponse(topic);
        } catch (error) {
            console.error('Error starting conversation', error);
            setConversationInProgress(false); // Enable the form on error
        }
    };

    const handleUserResponse = async (userResponse) => {
        if (!conversationId) return;

        try {
            const response = await axios.post(`http://localhost:5000/handle_response/${conversationId}`, {
                response: userResponse
            });
            setNextPrompt(response.data.nextPrompt);

            // Update the response text
            setResponseText(response.data.botResponse);
        } catch (error) {
            console.error('Error handling response', error);
        } finally {
            setConversationInProgress(false); // Disable loading feedback after handling response
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
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
            setResponseText(''); // Clear the response text
        } catch (error) {
            console.error('Error ending conversation', error);
        }
    };

    return (
        <div className="flex flex-col">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Enter topic"
                    disabled={isConversationInProgress}
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded ${isConversationInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isConversationInProgress}
                >
                    {isConversationInProgress ? 'Thinking...' : 'Submit'}
                </button>
            </form>

            {nextPrompt && (
                <div>
                    <p>{nextPrompt}</p>
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Your response"
                        disabled={isConversationInProgress}
                    />
                    <button
                        onClick={() => handleUserResponse(inputText)}
                        className={`bg-blue-500 text-white p-2 rounded ${isConversationInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isConversationInProgress}
                    >
                        {isConversationInProgress ? 'Thinking...' : 'Respond'}
                    </button>
                    <button
                        onClick={handleEndConversation}
                        className={`bg-red-500 text-white p-2 rounded ${isConversationInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isConversationInProgress}
                    >
                        {isConversationInProgress ? 'Thinking...' : 'End Conversation'}
                    </button>
                </div>
            )}

            {responseText && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Bot Response:</h2>
                    <p>{responseText}</p>
                </div>
            )}
        </div>
    );
};

export default CreatePhoneCaseConversation;
