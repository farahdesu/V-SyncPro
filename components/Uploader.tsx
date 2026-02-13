
import React, { useState, useRef } from 'react';

interface UploaderProps {
  onUpload: (data: string | { data: string; mimeType: string }) => void;
  loading: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload, loading }) => {
  const [text, setText] = useState('');
  const [tab, setTab] = useState<'file' | 'text'>('file');
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("This file is too large. Please upload a file smaller than 10MB.");
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onUpload({ data: base64, mimeType: file.type });
      } catch (err) {
        console.error("File Read Error:", err);
        alert("Failed to read the file correctly. Try another file or paste text.");
      } finally {
        setIsReading(false);
      }
    };
    reader.onerror = () => {
      setIsReading(false);
      alert("Error reading file.");
    };
    reader.readAsDataURL(file);
  };

  const isProcessing = loading || isReading;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="flex border-b">
        <button
          onClick={() => setTab('file')}
          disabled={isProcessing}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${tab === 'file' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} disabled:opacity-50`}
        >
          <i className="fa-solid fa-file-pdf mr-2"></i> Upload Document
        </button>
        <button
          onClick={() => setTab('text')}
          disabled={isProcessing}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${tab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} disabled:opacity-50`}
        >
          <i className="fa-solid fa-align-left mr-2"></i> Paste CV Text
        </button>
      </div>

      <div className="p-8">
        {tab === 'file' ? (
          <div 
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-12 transition-all group relative ${isProcessing ? 'bg-gray-50 cursor-not-allowed opacity-70' : 'hover:border-blue-400 cursor-pointer hover:bg-blue-50/30'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />
            <div className={`bg-blue-50 p-4 rounded-full text-blue-500 mb-4 transition-transform ${!isProcessing && 'group-hover:scale-110'}`}>
              {isReading ? (
                <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
              ) : (
                <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
              )}
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {isReading ? "Reading file locally..." : "Drop your CV here"}
            </p>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {isReading ? "Preparing data for AI extraction..." : "Support for Images (PNG, JPG) and PDFs"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the plain text of your CV here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
              disabled={isProcessing}
            />
            <button
              onClick={() => onUpload(text)}
              disabled={isProcessing || !text.trim()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-lg active:scale-[0.98]"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Initializing...
                </span>
              ) : "Extract Data"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploader;
