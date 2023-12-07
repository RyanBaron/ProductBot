import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
    const [inputText, setInputText] = useState('');
    const [response, setResponse] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:5000/generate_prompt', {
                topic: inputText
            });

            // Assuming you want to display the agentResponse part of your API response
            setResponse(res.data.agentResponse);
        } catch (error) {
            console.error('Error calling the API', error);
            setResponse('Failed to get response');
        }
    };

    return (
        <div>
            <input type="text" value={inputText} onChange={handleInputChange} />
            <button onClick={handleSubmit}>Submit</button>
            <div>
                <p>Response:</p>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default ChatComponent;
