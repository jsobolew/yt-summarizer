import React, { useState } from 'react';
import SearchBar from '../components/Search/SearchBar';
import AnalysisDashboard from '../components/Analysis/AnalysisDashboard';
import ErrorDisplay from '../components/UI/ErrorDisplay';
import { validateYouTubeUrl } from '../utils/validation';
import { analyzeVideo, fetchAvailableLanguages } from '../utils/api';
import { VideoAnalysisData } from '../types/video';
import LoadingState from '../components/UI/LoadingState';

// Helper function to validate VideoAnalysisData
function isValidVideoAnalysisData(data: any): data is VideoAnalysisData {
  return (
    data &&
    typeof data === 'object' &&
    data.videoInfo &&
    typeof data.videoInfo === 'object' &&
    typeof data.videoInfo.id === 'string' &&
    typeof data.videoInfo.title === 'string' &&
    Array.isArray(data.transcript) &&
    Array.isArray(data.insights?.topics) &&
    typeof data.insights?.summary === 'string' &&
    typeof data.insights?.sentiment === 'object' &&
    Array.isArray(data.insights?.keyPoints)
  );
}

const AnalyzerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<VideoAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzingStage, setAnalyzingStage] = useState(0);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const analyzeHandler = async () => {
    // Reset states
    setError(null);
    setAnalysisData(null);
    
    // Validate URL
    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Stage 1: Fetch video info
      setAnalyzingStage(1);
      
      // Stage 2: Fetch available languages
      setAnalyzingStage(2);
      const languages = await fetchAvailableLanguages(url);
      setAvailableLanguages(languages);
      
      // Stage 3: Analyze video
      setAnalyzingStage(3);
      const data = await analyzeVideo(url, selectedLanguage);
      
      // Stage 4: Process results
      setAnalyzingStage(4);
      if (!isValidVideoAnalysisData(data)) {
        setError('Analysis failed: Invalid or incomplete data received from server.');
        setAnalysisData(null);
        return;
      }
      setAnalysisData(data);
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (analysisData) {
      // Re-analyze with new language
      analyzeHandler();
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-12 max-w-4xl mx-auto">
        <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          YouTube Video Analysis Tool
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Analyze any YouTube video to get detailed insights, transcripts, and key takeaways
        </p>
        
        <SearchBar 
          url={url} 
          setUrl={setUrl} 
          onAnalyze={analyzeHandler} 
          isAnalyzing={isAnalyzing}
        />
      </section>

      {error && <ErrorDisplay message={error} />}
      
      {isAnalyzing && (
        <LoadingState stage={analyzingStage} />
      )}
      
      {!isAnalyzing && analysisData && (
        <AnalysisDashboard 
          data={analysisData}
          availableLanguages={availableLanguages}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      )}
      
      {!isAnalyzing && !analysisData && !error && (
        <div className="card text-center py-12 fade-in">
          <h3 className="mb-4">Ready to analyze</h3>
          <p className="text-text-secondary mb-6">
            Enter a YouTube URL above to get started with the analysis
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
              className="btn-secondary"
            >
              Try an example
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzerPage;