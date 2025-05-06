import React from 'react';
import { Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <header className="border-b border-neutral-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-lg p-2">
            <Play className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold">VideoInsight</h1>
        </div>
        <div>
          <button 
            onClick={toggleTheme}
            className="btn-secondary text-sm"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;