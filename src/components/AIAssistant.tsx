import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Code, 
  Bug, 
  Lightbulb, 
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { marked } from 'marked';

export default function AIAssistant() {
  const { state, actions } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async () => {
    if (!prompt.trim() || !state.currentRoom) return;
    
    setIsLoading(true);
    actions.requestAIAssistance(prompt, state.currentRoom.code);
    setPrompt('');
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const quickPrompts = [
    { icon: <Bug className="w-4 h-4" />, text: 'Find bugs in my code', color: 'text-error-500' },
    { icon: <Lightbulb className="w-4 h-4" />, text: 'Suggest improvements', color: 'text-warning-500' },
    { icon: <Code className="w-4 h-4" />, text: 'Explain this code', color: 'text-primary-500' },
    { icon: <RefreshCw className="w-4 h-4" />, text: 'Refactor this function', color: 'text-success-500' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const applyCodeSuggestion = (code: string) => {
    if (state.currentRoom) {
      actions.updateCode(code, state.currentRoom.language);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-medium">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Gemini AI</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Your coding assistant</p>
          </div>
        </div>
        
        {/* Quick prompts */}
        <div className="flex overflow-x-auto space-x-2 p-1 hide-scrollbar">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setPrompt(prompt.text)}
              className="flex-shrink-0 flex items-center space-x-2 p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left border border-gray-200 dark:border-gray-600 shadow-soft"
            >
              <span className={prompt.color}>{prompt.icon}</span>
              <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Responses */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {state.aiChatHistory.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-lg p-4 shadow-soft ${entry.role === 'user' ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800' : 'bg-gradient-to-r from-secondary-50 to-accent-50 dark:from-secondary-950/50 dark:to-accent-950/50 border border-secondary-200 dark:border-secondary-800'}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-medium ${entry.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gradient-to-r from-secondary-500 to-accent-500 text-white'}`}>
                  {entry.role === 'user' ? (
                    <span className="text-sm font-medium">You</span>
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {entry.role === 'user' ? 'You' : 'Gemini AI'}
                    </span>
                  </div>
                  
                  {entry.parts.map((part, partIndex) => (
                    <React.Fragment key={partIndex}>
                      {part.text && (
                        <div
                          className="text-sm text-gray-800 dark:text-gray-200 mb-3 prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: marked.parse(part.text) as string }}
                        />
                      )}
                      {/* Assuming code parts are handled by text with markdown code blocks */}
                    </React.Fragment>
                  ))}
                  
                  {/* Actions for AI responses (if applicable) */}
                  {entry.role === 'model' && (entry.parts.some(p => p.text && p.text.includes('```')) || state.aiResponses.some(ar => ar.code)) && (
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-success-600 dark:hover:text-success-400 text-xs transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-400 text-xs transition-colors">
                        <ThumbsDown className="w-3 h-3" />
                        <span>Not helpful</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs transition-colors">
                        <MessageSquare className="w-3 h-3" />
                        <span>Discuss</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="w-6 h-6 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center animate-pulse shadow-medium">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask AI for help with your code..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendPrompt}
            disabled={!prompt.trim() || isLoading}
            className="p-2 bg-gradient-to-r from-secondary-500 to-accent-500 text-white rounded-lg hover:from-secondary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-medium"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}