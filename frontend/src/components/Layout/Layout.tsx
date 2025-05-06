import React, { ReactNode } from 'react';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-background' : 'bg-neutral-100'}`}>
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-neutral-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-neutral-400 text-sm">
          <p>YouTube Video Analysis Tool &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;