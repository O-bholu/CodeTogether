import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  Save, 
  Download, 
  Settings, 
  Users, 
  MessageSquare, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import ChatPanel from './ChatPanel';
import UsersList from './UsersList';
import AIAssistant from './AIAssistant';
import CodeEditor from './CodeEditor';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'cpp', name: 'C++', extension: 'cpp' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'typescript', name: 'TypeScript', extension: 'ts' },
  { id: 'rust', name: 'Rust', extension: 'rs' },
  { id: 'go', name: 'Go', extension: 'go' },
];

export default function CollaborativeEditor() {
  const { state, actions } = useApp();
  const { isDark } = useTheme();
  const [activePanel, setActivePanel] = useState<'chat' | 'users' | 'ai' | null>('chat');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentLanguage = LANGUAGES.find(lang => lang.id === state.currentRoom?.language) || LANGUAGES[0];

  const handleRunCode = async () => {
    if (!state.currentRoom) return;
    
    setIsRunning(true);
    setOutput('Running code...\n');
    
    try {
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: state.currentRoom.code,
          language: state.currentRoom.language,
        }),
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput(`Error: ${(error as any).message || 'Failed to connect to the execution server.'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    if (!state.currentRoom) return;
    
    const blob = new Blob([state.currentRoom.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${currentLanguage.extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGist = () => {
    // Open GitHub profile in a new tab
    window.open('https://github.com/O-bholu', '_blank');
  };

  const copyRoomId = () => {
    if (state.currentRoom) {
      navigator.clipboard.writeText(state.currentRoom.id);
    }
  };

  if (!state.currentRoom) return null;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-soft">
        <div className="flex items-center space-x-4">
          <button
            onClick={actions.leaveRoom}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {state.currentRoom.name}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Room ID: {state.currentRoom.id}</span>
              <button
                onClick={copyRoomId}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <select
            value={state.currentRoom.language}
            onChange={(e) => actions.updateCode(state.currentRoom!.code, e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>

          {/* Run Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-soft"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm font-medium">{isRunning ? 'Stop' : 'Run'}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveCode}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportGist}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors shadow-soft"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">Gist</span>
          </button>

          {/* Panel Toggles */}
          <div className="flex items-center space-x-1 ml-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActivePanel(activePanel === 'users' ? null : 'users')}
              className={`p-2 rounded-md transition-all ${
                activePanel === 'users' 
                  ? 'bg-primary-500 text-white shadow-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
              className={`p-2 rounded-md transition-all ${
                activePanel === 'chat' 
                  ? 'bg-primary-500 text-white shadow-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'ai' ? null : 'ai')}
              className={`p-2 rounded-md transition-all ${
                activePanel === 'ai' 
                  ? 'bg-primary-500 text-white shadow-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-y-auto">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-h-0 min-w-[700px]">
          <div className="flex-1 w-full overflow-x-auto">
            <CodeEditor
              code={state.currentRoom.code}
              language={state.currentRoom.language}
              onChange={(code) => actions.updateCode(code, state.currentRoom!.language)}
              theme={isDark ? 'vs-dark' : 'vs-light'}
            />
          </div>
          
          {/* Output Panel */}
          {output && (
            <div className="h-48 bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 font-mono text-sm overflow-auto border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-success-400 font-medium">Output</span>
                <button
                  onClick={() => setOutput('')}
                  className="text-gray-400 hover:text-white text-xs transition-colors"
                >
                  Clear
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 450, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[450px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-hidden shadow-medium flex-shrink-0"
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {activePanel === 'chat' && 'Team Chat'}
                      {activePanel === 'users' && 'Active Users'}
                      {activePanel === 'ai' && 'AI Assistant'}
                    </h3>
                    <button
                      onClick={() => setActivePanel(null)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {activePanel === 'chat' && <ChatPanel />}
                  {activePanel === 'users' && <UsersList />}
                  {activePanel === 'ai' && <AIAssistant />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}