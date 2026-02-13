
import React, { useState, useEffect } from 'react';
import { AppState, CVData } from './types';
import { parseCV } from './services/geminiService';
import Uploader from './components/Uploader';
import ProfileEditor from './components/ProfileEditor';
import SyncHelper from './components/SyncHelper';

const LOADING_MESSAGES = [
  "Deep analyzing structure...",
  "Scanning publications...",
  "Mapping milestones...",
  "Synthesizing About...",
  "Finalizing sections..."
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
      }, 2500);

      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 95) return prev + (95 - prev) * 0.05;
          return prev;
        });
      }, 700);
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
      setError("AI Analysis encountered an issue. Try pasting plain text for faster results.");
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
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleReset}
          >
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <i className="fa-brands fa-linkedin-in text-white text-lg"></i>
            </div>
            <span className="text-lg font-bold text-gray-800 tracking-tight">SyncPro</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {cvData && (
              <button 
                onClick={handleReset}
                className="text-gray-500 hover:text-red-500 text-xs font-bold transition-colors uppercase tracking-wider"
              >
                <i className="fa-solid fa-rotate-left mr-1"></i> New Scan
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {state === AppState.IDLE && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-lg mx-auto">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                AI LinkedIn <span className="text-blue-600">Booster</span>
              </h1>
              <p className="text-sm text-gray-600">
                Transform any CV into a top-tier LinkedIn profile with Gemini Deep Analysis.
              </p>
            </div>
            <Uploader onUpload={handleUpload} loading={loading} />
            {error && (
              <div className="max-w-md mx-auto p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-center">
                <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
              </div>
            )}
          </div>
        )}

        {state === AppState.PARSING && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-brain text-blue-600 text-xl animate-pulse"></i>
              </div>
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">{LOADING_MESSAGES[loadingMessageIdx]}</h2>
              <p className="text-gray-500 text-xs">Deep analysis of your career history...</p>
            </div>
            <div className="max-w-[200px] w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-1000 ease-linear" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
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

      <div className="fixed bottom-4 right-4 pointer-events-none opacity-5 hidden lg:block">
        <i className="fa-solid fa-briefcase text-blue-900 text-[60px]"></i>
      </div>
    </div>
  );
};

export default App;
