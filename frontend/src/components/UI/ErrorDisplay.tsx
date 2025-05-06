import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="card border border-error/20 bg-error/5 max-w-2xl mx-auto fade-in">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-error/20 text-error">
          <AlertTriangle size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-error mb-2">Analysis Error</h4>
          <p className="text-neutral-300">{message}</p>
          <div className="mt-4 space-y-2 text-sm text-neutral-400">
            <p>Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check if the YouTube URL is valid</li>
              <li>Make sure the video is publicly accessible</li>
              <li>Try a different video</li>
              <li>Check your internet connection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;