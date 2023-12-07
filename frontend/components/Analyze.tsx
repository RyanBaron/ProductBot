import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ObjectID from 'bson-objectid';
import { useWallet } from '@meshsdk/react';
import { useTokenCheck } from '../hooks/TokenCheck';

// Mapping of Policy IDs to human-readable names.
const POLICY_ID_NAMES: { [key: string]: string } = {
  "xxxxx": "NFT",
};

const Analyze: React.FC = () => {
  // Wallet states and functions.
  const { connected, wallet } = useWallet();

  // Local states.
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [formattedAgentResponse, setFormattedAgentResponse] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isAnalysisButtonEnabled, setIsAnalysisButtonEnabled] = useState(false);

  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [jobId, setjobId] = useState<string | null>(null);
  const [buttonBorderColor, setButtonBorderColor] = useState('border-green-300');

  useEffect(() => {
    if (connected) {
      // Set border color to green when the wallet is connected
      setButtonBorderColor('border-green-300');
    } else {
      // Set border color to red when the wallet is not connected
      setButtonBorderColor('border-red-600');
    }
  }, [connected]); // This effect runs whenever the 'connected' state changes.

  // Check for minimum required tokens using the custom hook.
  const { hasMinRequiredTokens } = useTokenCheck();

  // Predefined list of projects.
  const projects = ['What collection do you want to analyze?', 'testing'];

  // Check if selected project is valid.
  const isProjectValid = selectedProject !== 'What collection do you want to analyze?' && projects.includes(selectedProject);

  // Function to initiate the NFT analysis.
  const startAnalysis = async () => {
    try {
      setIsLoading(true);
      setButtonClicked(true);

      const job_id = ObjectID().toString();
      setjobId(job_id); // Save the generated job_id in state

      const response = await axios.post('http://localhost:5000/start_analysis', { project: selectedProject, job_id: job_id });

      if (response.data.agentResponse && response.data.job_id) {
        setAgentResponse(response.data.agentResponse);
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //let progressInterval: ReturnType<typeof setInterval> | null = null;
    let progressInterval: number | null = null;


    if (buttonClicked && jobId) {
      progressInterval = window.setInterval(async () => {
        try {
          const progressResponse = await axios.get(`http://localhost:5000/job_status/${jobId}`);
          if (progressResponse.data && progressResponse.data.progress !== undefined) {
            setProgress(progressResponse.data.progress);
            setProgressStep(progressResponse.data.step);
            if (progressResponse.data.progress >= 100) {
              if (progressInterval !== null) {
                window.clearInterval(progressInterval);
                progressInterval = null;
              }
            }
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
          if (progressInterval !== null) {
            window.clearInterval(progressInterval);
            progressInterval = null;
          }
        }
      }, 5000);
    }

    return () => {
      if (progressInterval !== null) {
        window.clearInterval(progressInterval);
      }
    };
  }, [buttonClicked, jobId]);

  useEffect(() => {
    setIsAnalysisButtonEnabled(hasMinRequiredTokens && isProjectValid);
  }, [selectedProject, hasMinRequiredTokens, isProjectValid]);

  useEffect(() => {
    if (agentResponse) {
      const formatted = agentResponse.replace(/>/g, '<br>').replace(/ADA/g, ' ADA').replace(/\b\d+\.\s/g, '').replace(/https:\/\/www\.jpg\.store\/asset\/[a-zA-Z0-9]+/g, match => `<div class="mb-4"><a href="${match}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 inline-block" target="_blank">View on JPG Store</a></div>`).replace('These are the most undervalued NFTs:', '<h3 class="font-bold mb-2">These are the most undervalued NFTs:</h3>');
      setFormattedAgentResponse(formatted);
      setIsLoading(false);
    }
  }, [agentResponse, isProjectValid]);

  if (!connected) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-gray-200 p-4 min-h-400">
      <h2 className="text-xl font-bold mb-4">Use AI To Create A One Of A Kind Phone Case</h2>
      <div className="mb-4 text-black">
        <select onChange={(e) => setSelectedProject(e.target.value)} className="select-button w-full p-1 border appearance-none">
          {projects.map((project, index) => (
            <option key={index} value={project}>{project}</option>
          ))}
        </select>
      </div>
      <div className="button-container mb-4 text-center flex justify-center items-center">
        {isLoading && <Image src="/images/logo-icon.png" className='object-contain animate-spin mx-auto' alt="Loading..." width={80} height={80} />}
        {!buttonClicked && (
          <button onClick={startAnalysis} disabled={!isAnalysisButtonEnabled} className={`loading-button w-full p-1 border ${buttonBorderColor} text-white ${!isAnalysisButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isLoading ? (
              <Image src="/images/logo-icon.png" className='object-contain animate-spin mx-auto' alt="Loading..." width={80} height={80} />
            ) : (
              <span className="font-semibold">Find Undervalued Collection Items</span>
            )}
          </button>
        )}
      </div>
      {isLoading && (
        <div className="wrap-progress-bar">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              {progress > 0 ? `${Math.round(progress)}% complete` : "0% Complete"}
            </div>
            <div>
              {progressStep != 0 ? progressStep : "Initializing..."}
            </div>
          </div>
        </div>
      )}
      {formattedAgentResponse && !isLoading && (
        <div className="analysis-result mt-4">
          <h2 className="analysis-title text-xl mb-2 font-bold border-b">{selectedProject}</h2>
          <div dangerouslySetInnerHTML={{ __html: formattedAgentResponse }}></div>
        </div>
      )}
      {!formattedAgentResponse && !isLoading && buttonClicked && (
        <div className="analysis-result mt-4">
          <h2 className="analysis-title text-xl mb-2 font-bold border-b">{selectedProject}</h2>
          <p>No results found for this project. Please try again later or select a different project.</p>
        </div>
      )}
      {buttonClicked && !isLoading && !formattedAgentResponse && (
        <div className="empty-result mt-4">
          <p>Unfortunately, we could not gather enough data for a comprehensive analysis. Please select a different project or try again later.</p>
        </div>
      )}
    </div>
  );
};

export default Analyze;
