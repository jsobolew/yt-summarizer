import React, { useState } from 'react';
import { VideoAnalysisData } from '../../types/video';
import VideoInfo from './VideoInfo';
import TranscriptViewer from './TranscriptViewer';
import InsightsPanel from './InsightsPanel';

interface AnalysisDashboardProps {
  data: VideoAnalysisData;
  availableLanguages: string[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  data,
  availableLanguages,
  selectedLanguage,
  onLanguageChange
}) => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'insights'>('transcript');
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);

  const handleTimestampClick = (timestamp: number) => {
    setSelectedTimestamp(timestamp);
    // In a real app, this would trigger scrolling to the timestamp in the transcript
  };

  return (
    <div className="space-y-6 fade-in">
      <VideoInfo 
        videoInfo={data.videoInfo} 
        availableLanguages={availableLanguages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <div className="flex mb-4 border-b border-neutral-800">
        <button 
          className={`px-6 py-3 font-medium text-sm transition-all duration-300 ${
            activeTab === 'transcript' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          onClick={() => setActiveTab('transcript')}
        >
          Transcript
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-all duration-300 ${
            activeTab === 'insights' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          onClick={() => setActiveTab('insights')}
        >
          AI Insights
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {activeTab === 'transcript' ? (
          <TranscriptViewer 
            transcript={data.transcript} 
            selectedTimestamp={selectedTimestamp}
            onTimestampClick={handleTimestampClick}
          />
        ) : (
          <InsightsPanel 
            insights={data.insights}
            onTimestampClick={handleTimestampClick} 
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboard;