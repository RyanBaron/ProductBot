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
    const [conversationHistory, setConversationHistory] = useState<JSX.Element[]>([]);
    const conversationEndRef = useRef(null);
    const [showGenerateImageButton, setShowGenerateImageButton] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleShowImage = async () => {
        // Fetch the image URL or set it here
        const fetchedImageUrl = ''; // Replace with actual logic to fetch or set the image URL
        if( fetchedImageUrl )
            setImageUrl(fetchedImageUrl);
    };

    const scrollToBottom = () => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }


    // Define an async function for the image generation API call
    const generateImage = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/generate_image`, {
                conversationId: conversationId,
                prompt: inputText
            });

            if (response.data.imageUrl) {
                setImageUrl(response.data.imageUrl);
            }
        } catch (error) {
            console.error('Error generating image', error);
        }
    };



    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleUserResponse = async (userResponse) => {
        if (!conversationId) return;

        try {
            const response = await axios.post(`http://localhost:5000/handle_response/${conversationId}`, {
                response: userResponse
            });

            // Append API response to conversation history
            setConversationHistory(prevHistory => [
                ...prevHistory,
                <div key={`bot-${new Date().getTime()}`} className="text-bot text-left">
                    {response.data.botResponse}
                </div>
            ]);

            // Additional state updates based on the response
        } catch (error) {
            console.error('Error handling response', error);
        } finally {
            setConversationInProgress(false);
        }
    };

    const handleConversation = async (userResponse) => {
        try {
            setConversationInProgress(true);

            // setShowGenerateImageButton(false); // Hide the image on new form submissions

            // Append user input to conversation history
            const newUserElement = (
                <div key={`user-${new Date().getTime()}`} className="text-user text-right">
                    {userResponse}
                </div>
            );
            const loadingElement = (
                <div key={`loading-${new Date().getTime()}`} className="text-bot text-left">
                    ...
                </div>
            );
            setConversationHistory(prevHistory => [...prevHistory, newUserElement, loadingElement]);

            // Clear the input field immediately after updating the history
            setInputText('');

            // Prepare the payload for the POST request
            const payload = { response: userResponse };
            if (conversationId) {
                // Include the conversation ID for ongoing conversations
                payload.conversationId = conversationId;
            }

            // Make the POST request to the server
            const response = await axios.post('http://localhost:5000/conversation', payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Update the conversation ID for new conversations
            if (!conversationId && response.data.conversationId) {
                setConversationId(response.data.conversationId);
            }

            // Replace the loading element with the bot's response
            if (response.data.botResponse) {

                const newBotElement = (
                    <div key={`bot-${new Date().getTime()}`} className="text-bot text-left">
                        {response.data.botResponse}
                    </div>
                );
                setConversationHistory(prevHistory => {
                    // Remove the last element (loading) and add the new bot response
                    return [...prevHistory.slice(0, -1), newBotElement];
                });

                setShowGenerateImageButton(true);  // Show the 'Show me the image' button after initial response

            }

        } catch (error) {
            console.error('Error in conversation', error);
        } finally {
            setConversationInProgress(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputText) {
            alert("Please fill in the field");
            return;
        }

        await handleConversation(inputText, conversationId);

        // Call the async function
        await generateImage();
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

    useEffect(() => {
        scrollToBottom();
    }, [conversationHistory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTypingEffect(false);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="wrap-conversation flex flex-wrap justify-center items-start h-full">
            <div className="w-full lg:w-2/3">
                <div className="conversation-history">
                    <div className="text-bot text-left">
                        Tell me about the design you would like to create...
                    </div>
                    {conversationHistory.map((item, index) => (
                        <div key={index} className={`text-conversation ${item.props.className}`}>
                            {item}
                        </div>
                    ))}
                    <div ref={conversationEndRef} /> {/* Invisible element at the bottom */}
                </div>

                {imageUrl && (
                    <div className="image-container my-4">
                        <img src={imageUrl} alt="Generated Image" />
                    </div>
                )}

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
                                {showGenerateImageButton && (
                                    <button
                                        onClick={handleShowImage}
                                        className="bg-green-500 text-white p-2 rounded mt-2"
                                    >
                                        Show me the image
                                    </button>
                                )}

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
