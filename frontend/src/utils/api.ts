import { VideoAnalysisData, VideoInfo, TranscriptSegment, VideoInsights } from '../types/video';
import { extractVideoId } from './validation';

const API_BASE_URL = 'http://localhost:8000';

export async function analyzeVideo(url: string, language = 'en'): Promise<VideoAnalysisData> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Could not extract video ID from URL');
  }

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, language }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAvailableLanguages(url: string): Promise<string[]> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Could not extract video ID from URL');
  }

  const response = await fetch(`${API_BASE_URL}/languages/${videoId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.statusText}`);
  }

  return response.json();
}