export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isTyping: boolean;
  cursor?: {
    line: number;
    column: number;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'ai';
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  code: string;
  language: string;
  createdAt: Date;
  lastActivity: Date;
}

export interface AIResponse {
  id: string;
  type: 'suggestion' | 'explanation' | 'fix' | 'improvement';
  content: string;
  code?: string;
  position?: {
    line: number;
    column: number;
  };
}

export type Theme = 'light' | 'dark' | 'system';

export interface CompilerResult {
  output: string;
  error?: string;
  executionTime: number;
  memory: number;
}