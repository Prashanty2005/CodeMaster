import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Loader2, Sparkles } from 'lucide-react';

const HintPanel = ({ problemTitle, userCode, failedInput, expectedOutput }) => {
  const [hint, setHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHint = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axiosClient.post('/ai/hint', {
        problemTitle,
        userCode,
        failedInput,
        expectedOutput
      });
      
      setHint(response.data.hint);
    } catch (err) {
      setError('Our AI mentor is currently unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-4 flex flex-col items-start gap-4">
      {!hint && !isLoading && (
        <button
          onClick={fetchHint}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 font-medium text-sm"
        >
          <Sparkles size={16} />
          Ask AI for a Hint 🪄
        </button>
      )}

      {isLoading && (
        <div className="w-full p-6 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
          <div className="flex items-center gap-3 text-indigo-400 mb-4">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm font-medium animate-pulse">Generating your hint...</span>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-indigo-900/40 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-indigo-900/40 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-indigo-900/40 rounded animate-pulse w-5/6"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full p-4 rounded-xl bg-red-950/30 border border-red-500/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {hint && !isLoading && (
        <div className="w-full p-6 rounded-xl bg-indigo-950/30 border border-indigo-500/50 shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-sm">
            <Sparkles size={16} />
            AI Mentor Hint
          </div>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {hint}
          </div>
        </div>
      )}
    </div>
  );
};

export default HintPanel;
