import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CreatePhoneCaseConversation = () => {
    const [inputText, setInputText] = useState('');
    const [responseReceived, setResponseReceived] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleSubmit = async () => {
        if (!inputText) {
            alert("Please fill in the field");
            return;
        }

        const jobId = uuidv4(); // Generate a unique ID

        try {
            await axios.post('http://localhost:5000/generate_prompt', {
                topic: inputText,
                jobId: jobId // Pass the unique ID along with other data
            });
            setResponseReceived(true); // Set response status to true on successful API call
        } catch (error) {
            console.error('Error calling the API', error);
            setResponseReceived(false);
        }
    };

    const handleResponseChoice = (choice: string) => {
        console.log(choice); // Handle the yes/no response as needed
        setResponseReceived(false); // Optionally reset the response status
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

            {responseReceived && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleResponseChoice('yes')}
                        className="px-4 py-1 text-sm bg-green-500 text-white rounded-full"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleResponseChoice('no')}
                        className="px-4 py-1 text-sm bg-red-500 text-white rounded-full"
                    >
                        No
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreatePhoneCaseConversation;
