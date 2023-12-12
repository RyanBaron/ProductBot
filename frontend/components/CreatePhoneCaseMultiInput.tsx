import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CreatePhoneCase = () => {
    const [inputText, setInputText] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const options = ['cartoon', 'svg', 'realistic']; // Static options for the second field

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleOptionClick = (option: string) => {
        setSelectedOptions(prevSelectedOptions =>
            prevSelectedOptions.includes(option)
                ? prevSelectedOptions.filter(opt => opt !== option)
                : [...prevSelectedOptions, option]
        );
    };

    const handleSubmit = async () => {
        if (!inputText || selectedOptions.length === 0) {
            alert("Please fill in the first field and select at least one option");
            return;
        }

        const jobId = uuidv4(); // Generate a unique ID

        try {
            const res = await axios.post('http://localhost:5000/generate_prompt', {
                topic: inputText,
                styles: selectedOptions,
                jobId: jobId // Pass the unique ID along with other data
            });
            // Handle the response as needed
        } catch (error) {
            console.error('Error calling the API', error);
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

            <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={`px-4 py-1 text-sm ${selectedOptions.includes(option) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-full`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Submit
            </button>
        </div>
    );
};

export default CreatePhoneCase;
