import React, { useState } from 'react';
import { 
  BarChart2, 
  MessageSquare, 
  Clock, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown 
} from 'lucide-react';
import { VideoInsights, Topic, SentimentAnalysis, KeyPoint } from '../../types/video';
import { formatTimestamp } from '../../utils/formatting';
import ReactMarkdown from 'react-markdown';

interface InsightsPanelProps {
  insights: VideoInsights;
  onTimestampClick: (timestamp: number) => void;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  insights,
  onTimestampClick
}) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    topics: true,
    sentiment: true,
    keyPoints: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="lg:col-span-12 space-y-6">
      {/* Summary Section */}
      <div className="card">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('summary')}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/20 text-primary">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-xl font-semibold">Summary</h3>
          </div>
          <div>
            {expandedSections.summary ? (
              <ChevronUp size={20} className="text-neutral-400" />
            ) : (
              <ChevronDown size={20} className="text-neutral-400" />
            )}
          </div>
        </div>
        
        {expandedSections.summary && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="prose prose-invert max-w-none text-neutral-300">
              <ReactMarkdown>{insights.summary}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
      
      {/* Topics Section */}
      <div className="card">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('topics')}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-secondary/20 text-secondary">
              <Tag size={20} />
            </div>
            <h3 className="text-xl font-semibold">Main Topics</h3>
          </div>
          <div>
            {expandedSections.topics ? (
              <ChevronUp size={20} className="text-neutral-400" />
            ) : (
              <ChevronDown size={20} className="text-neutral-400" />
            )}
          </div>
        </div>
        
        {expandedSections.topics && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {insights.topics.map((topic, index) => (
              <TopicItem 
                key={index}
                topic={topic}
                index={index}
                onTimestampClick={onTimestampClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Sentiment Analysis */}
      <div className="card">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('sentiment')}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-accent/20 text-accent">
              <BarChart2 size={20} />
            </div>
            <h3 className="text-xl font-semibold">Sentiment Analysis</h3>
          </div>
          <div>
            {expandedSections.sentiment ? (
              <ChevronUp size={20} className="text-neutral-400" />
            ) : (
              <ChevronDown size={20} className="text-neutral-400" />
            )}
          </div>
        </div>
        
        {expandedSections.sentiment && (
          <div className="mt-6 animate-fadeIn">
            <SentimentSection sentiment={insights.sentiment} />
          </div>
        )}
      </div>
      
      {/* Key Points */}
      <div className="card">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('keyPoints')}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/20 text-primary">
              <Clock size={20} />
            </div>
            <h3 className="text-xl font-semibold">Key Moments</h3>
          </div>
          <div>
            {expandedSections.keyPoints ? (
              <ChevronUp size={20} className="text-neutral-400" />
            ) : (
              <ChevronDown size={20} className="text-neutral-400" />
            )}
          </div>
        </div>
        
        {expandedSections.keyPoints && (
          <div className="mt-6 space-y-4 animate-fadeIn">
            {insights.keyPoints.map((point, index) => (
              <KeyPointItem 
                key={index} 
                point={point} 
                onTimestampClick={onTimestampClick} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Quotes Section */}
      {insights.quotes && insights.quotes.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={20} />
            <h3 className="text-xl font-semibold">Quotes</h3>
          </div>
          <ul className="list-disc pl-6 text-neutral-300">
            {insights.quotes.map((quote, idx) => (
              <li key={idx} className="mb-2">"{quote}"</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface TopicItemProps {
  topic: Topic;
  index: number;
  onTimestampClick: (timestamp: number) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, index, onTimestampClick }) => {
  const [expanded, setExpanded] = useState(false);
  
  const colors = [
    'from-primary to-secondary',
    'from-secondary to-accent',
    'from-accent to-primary',
  ];
  
  const color = colors[index % colors.length];
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{topic.name}</h4>
        <span className="text-sm text-neutral-400">{topic.relevance}% relevance</span>
      </div>
      
      <div className="relative h-3 bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color} rounded-full`}
          style={{ width: `${topic.relevance}%` }}
        />
      </div>
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-neutral-400 hover:text-neutral-300 flex items-center gap-1"
      >
        {expanded ? (
          <>
            <ChevronUp size={16} />
            <span>Show less</span>
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            <span>Show mentions ({topic.mentions.length})</span>
          </>
        )}
      </button>
      
      {expanded && (
        <div className="mt-2 pl-4 border-l border-neutral-800 space-y-2">
          {topic.mentions.map((mention, i) => (
            <div 
              key={i}
              className="p-2 rounded bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer"
              onClick={() => onTimestampClick(mention.timestamp)}
            >
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                <Clock size={14} />
                <span>{formatTimestamp(mention.timestamp)}</span>
              </div>
              <p className="text-sm text-neutral-300">{mention.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SentimentSectionProps {
  sentiment: SentimentAnalysis;
}

const SentimentSection: React.FC<SentimentSectionProps> = ({ sentiment }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-neutral-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ThumbsUp size={18} className="text-success" />
              <h4 className="font-medium">Positive Sentiment</h4>
            </div>
            <span className="text-success font-bold">{sentiment.positive}%</span>
          </div>
          <div className="relative h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-success rounded-full"
              style={{ width: `${sentiment.positive}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-neutral-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ThumbsDown size={18} className="text-error" />
              <h4 className="font-medium">Negative Sentiment</h4>
            </div>
            <span className="text-error font-bold">{sentiment.negative}%</span>
          </div>
          <div className="relative h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-error rounded-full"
              style={{ width: `${sentiment.negative}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium">Emotional Tones</h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {sentiment.emotions.map((emotion) => (
            <div 
              key={emotion.name}
              className="p-3 rounded-lg bg-neutral-800/50 text-center"
            >
              <div className="text-xl mb-1">
                {getEmotionEmoji(emotion.name)}
              </div>
              <div className="font-medium text-sm">{emotion.name}</div>
              <div className="text-xs text-neutral-400">{emotion.strength}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get emoji for emotion
function getEmotionEmoji(emotion: string): string {
  const emotions: Record<string, string> = {
    'joy': '😊',
    'surprise': '😲',
    'sadness': '😢',
    'fear': '😨',
    'anger': '😠',
    'disgust': '🤢',
    'trust': '🤝',
    'anticipation': '🤔',
    'neutral': '😐',
    'excitement': '🤩',
    'confusion': '😕',
    'curiosity': '🧐',
  };
  
  return emotions[emotion.toLowerCase()] || '😐';
}

interface KeyPointItemProps {
  point: KeyPoint;
  onTimestampClick: (timestamp: number) => void;
}

const KeyPointItem: React.FC<KeyPointItemProps> = ({ point, onTimestampClick }) => {
  return (
    <div 
      className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer transition-colors duration-300"
      onClick={() => onTimestampClick(point.timestamp)}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{point.title}</h4>
        <div 
          className="text-xs px-2 py-1 rounded-full"
          style={{
            backgroundColor: getTypeColor(point.type).bg,
            color: getTypeColor(point.type).text
          }}
        >
          {point.type}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
        <Clock size={14} />
        <span>{formatTimestamp(point.timestamp)}</span>
      </div>
      
      <p className="text-neutral-300 text-sm">{point.description}</p>
    </div>
  );
};

// Helper function to get color for point type
function getTypeColor(type: string): {bg: string, text: string} {
  switch (type.toLowerCase()) {
    case 'key concept':
      return { bg: 'rgba(79, 70, 229, 0.2)', text: 'rgb(139, 92, 246)' };
    case 'example':
      return { bg: 'rgba(16, 185, 129, 0.2)', text: 'rgb(16, 185, 129)' };
    case 'insight':
      return { bg: 'rgba(236, 72, 153, 0.2)', text: 'rgb(236, 72, 153)' };
    case 'quote':
      return { bg: 'rgba(245, 158, 11, 0.2)', text: 'rgb(245, 158, 11)' };
    default:
      return { bg: 'rgba(107, 114, 128, 0.2)', text: 'rgb(156, 163, 175)' };
  }
}

export default InsightsPanel;