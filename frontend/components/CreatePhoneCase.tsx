import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CreatePhoneCaseConversation = () => {
    const [inputText, setInputText] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [nextPrompt, setNextPrompt] = useState('');
    const [responseText, setResponseText] = useState('');
    const [isConversationInProgress, setConversationInProgress] = useState(false);
    const [typingEffect, setTypingEffect] = useState(true);
    const [questionText, setQuestionText] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const conversationEndRef = useRef(null);

    const scrollToBottom = () => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [conversationHistory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTypingEffect(false);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const startConversation = async (topic) => {
        try {
            setConversationInProgress(true);
            const response = await axios.post('http://localhost:5000/start_conversation', { topic }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setConversationId(response.data.conversationId);

            if (response.data.message === "Conversation started") {
                setQuestionText(response.data.question);
            }

            handleUserResponse(topic);
        } catch (error) {
            console.error('Error starting conversation', error);
            setConversationInProgress(false);
        }
    };

    const handleUserResponse = async (userResponse) => {
        if (!conversationId) return;

        try {
            const response = await axios.post(`http://localhost:5000/handle_response/${conversationId}`, {
                response: userResponse
            });

            // Append API response to conversation history
            setConversationHistory([...conversationHistory,
                { text: userResponse, type: 'user' }, // User input
                { text: response.data.botResponse, type: 'bot' } // API response
            ]);
            setNextPrompt(response.data.nextPrompt);
            setResponseText(response.data.botResponse);
        } catch (error) {
            console.error('Error handling response', error);
        } finally {
            setConversationInProgress(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputText) {
            alert("Please fill in the field");
            return;
        }

        // Append user input to conversation history and start conversation
        setConversationHistory([...conversationHistory, { text: inputText, type: 'user' }]);
        startConversation(inputText);
        setInputText('');
    };

    const handleEndConversation = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/end_conversation/${conversationId}`);
            alert(response.data.result);
            setConversationId(null);
            setNextPrompt('');
            setResponseText('');
        } catch (error) {
            console.error('Error ending conversation', error);
        }
    };

    return (
        <div className="wrap-conversation flex flex-wrap justify-center items-start h-full">
            <div className="w-full lg:w-2/3">
                <div className="conversation-part conversation-initial text-left">
                    <p className={typingEffect ? "typing-effect" : "typing-effect-final"}>
                        Tell me about the design you would like to create...
                    </p>
                </div>
                <div className="conversation-part conversation-continued">
                    {questionText && <div className="conversation-response text-left">{questionText}</div>}
                    {conversationHistory.map((item, index) => (
                        <div key={index} className={`text-left ${item.type === 'user' ? 'user-text' : 'bot-text'}`}>
                            {item.text}
                        </div>
                    ))}
                    <div ref={conversationEndRef} /> {/* Invisible element at the bottom */}
                </div>
                <div className="conversation-part conversation-current mt-4">
                    <div className="flex flex-col w-full">
                        <form onSubmit={handleSubmit} className="w-full">
                            <div>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    placeholder="Enter topic"
                                    disabled={isConversationInProgress}
                                />
                            </div>
                            <div className="buttons text-left flex w-full justify-end">
                                <button
                                    type="submit"
                                    className={`bg-blue-500 text-white p-2 rounded mt-2 ${isConversationInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isConversationInProgress}
                                >
                                    {isConversationInProgress ? 'Thinking...' : 'Submit'}
                                </button>
                            </div>
                        </form>

                        {nextPrompt && (
                            <div className="mt-4">
                                <p>{nextPrompt}</p>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    placeholder="Your response"
                                    disabled={isConversationInProgress}
                                />
                                <button
                                    onClick={() => handleUserResponse(inputText)}
                                    className={`bg-blue-500 text-white p-2 rounded mt-2 ${isConversationInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isConversationInProgress}
                                >
                                    {isConversationInProgress ? 'Thinking...' : 'Respond'}
                                </button>
                                <button
                                    onClick={handleEndConversation}
                                    className={`bg-red-500 text-white p-2 rounded mt-2 ${isConversationInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                </div>
            </div>
        </div>
    );
};

export default CreatePhoneCaseConversation;
