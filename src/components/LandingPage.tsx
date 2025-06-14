import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Zap, Globe, Github, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';

export default function LandingPage() {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { theme, setTheme, isDark } = useTheme();
  const { actions, state } = useApp();

  const handleCreateRoom = () => {
    const name = roomName.trim() || 'Untitled Room';
    actions.createRoom(name);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      actions.joinRoom(roomId.trim());
    }
  };

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Real-time Collaboration',
      description: 'Code together with multiple cursors and instant synchronization'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Assistant',
      description: 'Get code suggestions, explanations, and improvements from Gemini AI'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Communication',
      description: 'Built-in chat with typing indicators and user presence'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi-language Support',
      description: 'Support for Python, JavaScript, C++, and more with real-time execution'
    }
  ];

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-500">
      {/* Header */}
      <header className="relative z-50 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-medium">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ChatShare
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 shadow-soft border border-gray-200/50 dark:border-gray-700/50">
              {themeOptions.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value as any)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    theme === value
                      ? 'bg-primary-500 text-white shadow-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <a
              href="https://github.com"
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-soft border border-gray-200/50 dark:border-gray-700/50"
            >
              <Github className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Code Together
            </span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">
              In Real-Time
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            The ultimate collaborative coding platform with AI assistance, real-time chat, 
            and multi-language support. Perfect for pair programming, interviews, and team projects.
          </motion.p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Create Room Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-strong border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Create New Room
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start a new collaborative session and invite your team
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Room name (optional)"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateRoom}
                  disabled={state.isLoading}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-medium hover:shadow-strong disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? 'Creating...' : 'Create Room'}
                </motion.button>
              </div>
            </motion.div>

            {/* Join Room Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-strong border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-success-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Join Existing Room
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter a room ID to join an ongoing session
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoinRoom}
                  disabled={!roomId.trim() || state.isLoading}
                  className="w-full bg-gradient-to-r from-accent-500 to-success-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-accent-600 hover:to-success-600 transition-all duration-200 shadow-medium hover:shadow-strong disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? 'Joining...' : 'Join Room'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 shadow-soft hover:shadow-medium"
            >
              <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}