import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendPreConnect: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await axios.get('http://localhost:5000/connect');
        //await axios.get('http://192.168.128.2:5000/connect');
        //await axios.get('http://backend:5000/connect');
        setConnectionStatus('Success: BE Connection');
      } catch (error) {
        setConnectionStatus('Failure: Could not connect to the BE.');
      }
    };

    testConnection();
  }, []);

  return (
    <span className="mx-2">{connectionStatus}</span>
  );
};

export default BackendPreConnect;
