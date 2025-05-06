export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface TopicMention {
  timestamp: number;
  text: string;
}

export interface Topic {
  name: string;
  relevance: number;
  mentions: TopicMention[];
}

export interface Emotion {
  name: string;
  strength: number;
}

export interface SentimentAnalysis {
  positive: number;
  negative: number;
  neutral: number;
  emotions: Emotion[];
}

export interface KeyPoint {
  timestamp: number;
  title: string;
  description: string;
  type: string;
}

export interface VideoInsights {
  summary: string;
  topics: Topic[];
  sentiment: SentimentAnalysis;
  keyPoints: KeyPoint[];
  quotes: string[];
}

export interface VideoAnalysisData {
  videoInfo: VideoInfo;
  transcript: TranscriptSegment[];
  insights: VideoInsights;
}