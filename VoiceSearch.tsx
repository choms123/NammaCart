import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { voiceSearchService } from '../utils/voiceSearch';

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(voiceSearchService.isVoiceSearchSupported());

  const startListening = async () => {
    if (!isSupported) {
      onError?.('Voice search is not supported in your browser');
      return;
    }

    setIsListening(true);
    try {
      const transcript = await voiceSearchService.startListening();
      onResult(transcript);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Voice search failed');
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    voiceSearchService.stopListening();
    setIsListening(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-3 rounded-full transition-all duration-200 ${
        isListening
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
          : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice search'}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export default VoiceSearch;