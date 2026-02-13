
import React, { useState, useEffect } from 'react';
import { AppState, CVData } from './types';
import { parseCV } from './services/geminiService';
import Uploader from './components/Uploader';
import ProfileEditor from './components/ProfileEditor';
import SyncHelper from './components/SyncHelper';

const LOADING_MESSAGES = [
  "Initializing deep structural analysis...",
  "Scanning document for research & publications...",
  "Mapping career milestones and achievements...",
  "Synthesizing professional value proposition...",
  "Extracting technical and soft skills...",
  "Verifying project links and details...",
  "Finalizing comprehensive LinkedIn profile...",
  "Running thoroughness checks..."
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    let progressInterval: any;
    
    if (state === AppState.PARSING) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);

      // Slower simulated progress for thoroughness perception
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 95) return prev + (95 - prev) * 0.05; // Slower growth
          return prev;
        });
      }, 800);
    } else {
      setProgress(0);
      setLoadingMessageIdx(0);
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [state]);

  const handleUpload = async (content: string | { data: string; mimeType: string }) => {
    setLoading(true);
    setError(null);
    setState(AppState.PARSING);
    
    try {
      const parsedData = await parseCV(content);
      setCvData(parsedData);
      setState(AppState.REVIEW);
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError("Thorough analysis encountered a bottleneck. Please try again with the plain text for maximum accuracy.");
      setState(AppState.IDLE);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setCvData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleReset}
          >
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <i className="fa-brands fa-linkedin-in text-white text-2xl"></i>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">SyncPro</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-500 hidden sm:block">Deep CV Analysis Mode</span>
            {cvData && (
              <button 
                onClick={handleReset}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <i className="fa-solid fa-rotate-left mr-1"></i> Start Over
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {state === AppState.IDLE && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Thoroughly update <span className="text-blue-600">LinkedIn.</span>
              </h1>
              <p className="text-xl text-gray-600">
                Using Gemini 3 Flash deep analysis to ensure every publication and project is captured with precision.
              </p>
            </div>
            <Uploader onUpload={handleUpload} loading={loading} />
            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                <i className="fa-solid fa-circle-exclamation mr-3"></i> {error}
              </div>
            )}
          </div>
        )}

        {state === AppState.PARSING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 min-h-[50vh]">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-brain text-blue-600 text-2xl animate-pulse"></i>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{LOADING_MESSAGES[loadingMessageIdx]}</h2>
              <p className="text-gray-500">Performing exhaustive extraction of your CV...</p>
            </div>
            <div className="max-w-xs w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-1000 ease-linear" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 font-medium tracking-widest">DEEP ANALYSIS IN PROGRESS</div>
          </div>
        )}

        {state === AppState.REVIEW && cvData && (
          <ProfileEditor 
            data={cvData} 
            onChange={setCvData} 
            onConfirm={() => setState(AppState.SYNC)} 
          />
        )}

        {state === AppState.SYNC && cvData && (
          <SyncHelper data={cvData} />
        )}
      </main>

      <div className="fixed bottom-8 right-8 pointer-events-none opacity-20 hidden lg:block">
        <i className="fa-solid fa-briefcase text-blue-900 text-[120px]"></i>
      </div>
    </div>
  );
};

export default App;
