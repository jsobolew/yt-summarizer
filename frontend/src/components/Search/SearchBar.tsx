import React, { useState } from 'react';
import { Search, Youtube } from 'lucide-react';

interface SearchBarProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  url, 
  setUrl, 
  onAnalyze, 
  isAnalyzing 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnalyzing && url.trim() !== '') {
      onAnalyze();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div 
        className={`
          flex items-center bg-card rounded-lg border ${isFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-neutral-700'} 
          overflow-hidden transition-all duration-300 p-1
        `}
      >
        <div className="flex items-center px-3 text-neutral-400">
          <Youtube size={20} />
        </div>
        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste YouTube URL here..."
          className="flex-1 bg-transparent border-none outline-none p-3 text-text-primary placeholder-neutral-500"
          disabled={isAnalyzing}
        />
        
        <button
          type="submit"
          disabled={isAnalyzing || url.trim() === ''}
          className={`
            flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300
            ${isAnalyzing || url.trim() === '' 
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-light text-white'
            }
          `}
        >
          <Search size={18} />
          <span>Analyze</span>
        </button>
      </div>
      
      <p className="mt-2 text-sm text-neutral-400">
        Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
      </p>
    </form>
  );
};

export default SearchBar;