import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import { TranscriptSegment } from '../../types/video';
import { formatTimestamp } from '../../utils/formatting';

interface TranscriptViewerProps {
  transcript: TranscriptSegment[];
  selectedTimestamp: number | null;
  onTimestampClick: (timestamp: number) => void;
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  selectedTimestamp,
  onTimestampClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTranscript, setFilteredTranscript] = useState<TranscriptSegment[]>(transcript);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
  
  const transcriptRef = useRef<HTMLDivElement>(null);
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = transcript.filter(segment => 
        segment.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTranscript(filtered);
    } else {
      setFilteredTranscript(transcript);
    }
  }, [searchTerm, transcript]);

  useEffect(() => {
    if (selectedTimestamp !== null) {
      const index = transcript.findIndex(
        segment => segment.start <= selectedTimestamp && segment.end >= selectedTimestamp
      );
      
      if (index !== -1) {
        setActiveSegmentIndex(index);
      }
    }
  }, [selectedTimestamp, transcript]);

  useEffect(() => {
    if (activeSegmentIndex !== null && activeSegmentRef.current && transcriptRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeSegmentIndex]);

  return (
    <div className="lg:col-span-12">
      <div className="card mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in transcript..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        {searchTerm && (
          <div className="mt-2 text-sm text-neutral-400">
            Found {filteredTranscript.length} matching segments
          </div>
        )}
      </div>
      
      <div className="card">
        <div 
          ref={transcriptRef}
          className="h-[500px] overflow-y-auto pr-2 space-y-3"
        >
          {filteredTranscript.length > 0 ? (
            filteredTranscript.map((segment, index) => {
              const isActive = index === activeSegmentIndex;
              const segmentRef = isActive ? activeSegmentRef : null;
              
              return (
                <div
                  key={`${segment.start}-${index}`}
                  ref={segmentRef}
                  className={`
                    p-3 rounded-lg transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'hover:bg-neutral-800'
                    }
                  `}
                  onClick={() => onTimestampClick(segment.start)}
                >
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <Clock size={14} className="text-neutral-400" />
                    <span className={`font-mono ${isActive ? 'text-primary' : 'text-neutral-400'}`}>
                      {formatTimestamp(segment.start)}
                    </span>
                  </div>
                  <p className="text-neutral-200">
                    {searchTerm ? (
                      highlightSearchTerm(segment.text, searchTerm)
                    ) : (
                      segment.text
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-neutral-400">
              No transcript segments found matching your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to highlight search terms
function highlightSearchTerm(text: string, searchTerm: string) {
  if (!searchTerm) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className="bg-primary/30 text-white px-1 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default TranscriptViewer;