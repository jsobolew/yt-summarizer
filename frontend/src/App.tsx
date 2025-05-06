import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import AnalyzerPage from './pages/AnalyzerPage';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <AnalyzerPage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;