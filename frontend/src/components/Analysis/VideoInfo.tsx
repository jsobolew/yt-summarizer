import React from 'react';
import { Calendar, Clock, User, BarChart2, Globe } from 'lucide-react';
import { VideoInfo as VideoInfoType } from '../../types/video';
import { formatDate, formatDuration, formatNumber } from '../../utils/formatting';

interface VideoInfoProps {
  videoInfo: VideoInfoType;
  availableLanguages: string[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  videoInfo,
  availableLanguages,
  selectedLanguage,
  onLanguageChange
}) => {
  const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
  
  // Fallbacks for missing/empty fields
  const thumbnail = videoInfo.thumbnailUrl || 'https://via.placeholder.com/320x180?text=No+Thumbnail';
  const title = videoInfo.title || 'Unknown Title';
  const channelTitle = videoInfo.channelTitle || 'Unknown Channel';
  const publishedAt = videoInfo.publishedAt || '-';
  const duration = videoInfo.duration || 0;
  const viewCount = videoInfo.viewCount || 0;
  const description = videoInfo.description || 'No description available.';

  return (
    <div className="card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Thumbnail */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img 
              src={thumbnail} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <a 
                href={`https://www.youtube.com/watch?v=${videoInfo.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-light text-white rounded-full p-3 transition-colors duration-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Video Info */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{channelTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{publishedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{formatDuration(duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart2 size={16} />
              <span>{formatNumber(viewCount)} views</span>
            </div>
          </div>
          
          <p className="text-neutral-300 mb-4 line-clamp-3">
            {description}
          </p>
          
          {/* Language Selector */}
          {availableLanguages.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-neutral-400">
                <Globe size={16} />
                <span>Caption Language:</span>
              </div>
              
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-card border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {availableLanguages.map((lang) => {
                  const languageName = (() => {
                    try {
                      return languageNames.of(lang);
                    } catch {
                      return lang.toUpperCase();
                    }
                  })();
                  
                  return (
                    <option key={lang} value={lang}>
                      {languageName}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;