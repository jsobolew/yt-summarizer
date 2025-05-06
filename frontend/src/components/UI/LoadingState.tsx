import React, { useEffect, useState } from 'react';
import { ClipboardList, Info, Languages, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  stage: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ stage }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const calculatedProgress = Math.min((stage / 4) * 100, 100);
    setProgress(calculatedProgress);
  }, [stage]);

  const stages = [
    { 
      icon: <Info size={24} />, 
      title: 'Fetching video information',
      description: 'Getting basic metadata about the video'
    },
    { 
      icon: <Languages size={24} />, 
      title: 'Checking available languages',
      description: 'Finding all available caption tracks'
    },
    { 
      icon: <ClipboardList size={24} />, 
      title: 'Analyzing content',
      description: 'Processing video transcript and extracting insights'
    },
    { 
      icon: <Sparkles size={24} />, 
      title: 'Generating results',
      description: 'Creating visualizations and organizing findings'
    }
  ];

  return (
    <div className="card max-w-2xl mx-auto fade-in">
      <div className="mb-6">
        <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-sm text-neutral-400">
          {Math.round(progress)}% complete
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((item, index) => (
          <div key={index} className={`
            flex items-start gap-4 p-4 rounded-lg transition-all duration-300
            ${index < stage ? 'bg-neutral-800/50' : index === stage ? 'bg-primary/10 border border-primary/20' : 'opacity-50'}
          `}>
            <div className={`
              p-2 rounded-full
              ${index < stage ? 'bg-success/20 text-success' : 
                index === stage ? 'bg-primary/20 text-primary animate-pulse' : 
                'bg-neutral-800 text-neutral-400'}
            `}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-neutral-400">{item.description}</p>
            </div>
            {index < stage && (
              <div className="ml-auto text-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="loading-bar mx-auto" />
        <p className="mt-4 text-neutral-400">This may take a few moments...</p>
      </div>
    </div>
  );
};

export default LoadingState;