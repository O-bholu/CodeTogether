import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Mic, MicOff, Video, VideoOff, MoreHorizontal } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function UsersList() {
  const { state } = useApp();

  // Mock additional users for demonstration
  const mockUsers = [
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      color: '#10b981',
      isTyping: false,
      isHost: false,
      isOnline: true,
      micEnabled: true,
      videoEnabled: false,
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      color: '#f59e0b',
      isTyping: true,
      isHost: false,
      isOnline: true,
      micEnabled: false,
      videoEnabled: true,
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      color: '#8b5cf6',
      isTyping: false,
      isHost: false,
      isOnline: false,
      micEnabled: true,
      videoEnabled: true,
    },
  ];

  const allUsers = [
    ...(state.currentUser ? [{
      ...state.currentUser,
      isHost: true,
      isOnline: true,
      micEnabled: true,
      videoEnabled: false,
    }] : []),
    ...mockUsers,
  ];

  return (
    <div className="h-full p-4">
      <div className="space-y-3">
        {allUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all shadow-soft ${
              user.isOnline 
                ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
                : 'bg-gray-100 dark:bg-gray-800/50 opacity-60 border border-gray-200/50 dark:border-gray-700/50'
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full shadow-medium"
              />
              {/* Online status */}
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                user.isOnline ? 'bg-success-500' : 'bg-gray-400'
              }`} />
              {/* Typing indicator */}
              {user.isTyping && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"
                />
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </span>
                {user.isHost && (
                  <Crown className="w-4 h-4 text-warning-500" />
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                <span>{user.isOnline ? 'Online' : 'Offline'}</span>
                {user.isTyping && (
                  <span className="text-primary-500">• Typing...</span>
                )}
              </div>
            </div>

            {/* Controls */}
            {user.isOnline && (
              <div className="flex items-center space-x-1">
                <button
                  className={`p-1 rounded transition-colors ${
                    user.micEnabled 
                      ? 'text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20' 
                      : 'text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20'
                  }`}
                >
                  {user.micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  className={`p-1 rounded transition-colors ${
                    user.videoEnabled 
                      ? 'text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20' 
                      : 'text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20'
                  }`}
                >
                  {user.videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Room stats */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <div className="flex justify-between">
            <span>Total users:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{allUsers.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Online:</span>
            <span className="font-medium text-success-600 dark:text-success-400">
              {allUsers.filter(u => u.isOnline).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Typing:</span>
            <span className="font-medium text-primary-600 dark:text-primary-400">
              {allUsers.filter(u => u.isTyping).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}