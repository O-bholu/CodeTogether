import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import LandingPage from './components/LandingPage';
import CollaborativeEditor from './components/CollaborativeEditor';

function AppContent() {
  const { state } = useApp();

  return (
    <div className="min-h-screen transition-colors duration-300">
      {state.currentRoom ? <CollaborativeEditor /> : <LandingPage />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;