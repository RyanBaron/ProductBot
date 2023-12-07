interface ErrorResponseData {
  status?: string;
}

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

const DataBasePreConnect: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000/status_db');
        setConnectionStatus(response.data.status);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponseData>; // Use the interface for the response data type
        if (axiosError.response && axiosError.response.data && axiosError.response.data.status) {
          setConnectionStatus(axiosError.response.data.status);
        } else {
          setConnectionStatus('Failure: Could not connect to the database.');
        }
      }
    };

    testConnection();
  }, []);

  return (
    <span className="mx-2">{connectionStatus}</span>
  );
};

export default DataBasePreConnect;
