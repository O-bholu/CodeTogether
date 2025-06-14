import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, ChatMessage, Room, AIResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, Part } from '@google/generative-ai';

// Initialize Gemini API
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('Gemini API Key:', geminiApiKey ? 'Loaded' : 'Not Loaded', geminiApiKey ? 'Starts with: ' + geminiApiKey.substring(0, 5) : '');
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }) : null;

interface AppState {
  currentUser: User | null;
  currentRoom: Room | null;
  messages: ChatMessage[];
  aiResponses: AIResponse[];
  isConnected: boolean;
  isLoading: boolean;
  aiChatHistory: { role: "user" | "model"; parts: Part[] }[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ROOM'; payload: Room }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_AI_RESPONSE'; payload: AIResponse }
  | { type: 'UPDATE_CODE'; payload: { code: string; language: string } }
  | { type: 'UPDATE_USER_TYPING'; payload: { userId: string; isTyping: boolean } }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LEAVE_ROOM' }
  | { type: 'ADD_AI_CHAT_ENTRY'; payload: { role: "user" | "model"; parts: Part[] } };

const initialState: AppState = {
  currentUser: null,
  currentRoom: null,
  messages: [],
  aiResponses: [],
  isConnected: false,
  isLoading: false,
  aiChatHistory: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'ADD_AI_RESPONSE':
      return { ...state, aiResponses: [...state.aiResponses, action.payload] };
    case 'ADD_AI_CHAT_ENTRY':
      return { ...state, aiChatHistory: [...state.aiChatHistory, action.payload] };
    case 'UPDATE_CODE':
      return {
        ...state,
        currentRoom: state.currentRoom
          ? {
              ...state.currentRoom,
              code: action.payload.code,
              language: action.payload.language,
              lastActivity: new Date(),
            }
          : null,
      };
    case 'UPDATE_USER_TYPING':
      return {
        ...state,
        currentRoom: state.currentRoom
          ? {
              ...state.currentRoom,
              users: state.currentRoom.users.map(user =>
                user.id === action.payload.userId
                  ? { ...user, isTyping: action.payload.isTyping }
                  : user
              ),
            }
          : null,
      };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LEAVE_ROOM':
      return { ...state, currentRoom: null, messages: [], aiResponses: [], aiChatHistory: [] };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    createRoom: (name: string) => void;
    joinRoom: (roomId: string) => void;
    sendMessage: (message: string) => void;
    updateCode: (code: string, language: string) => void;
    requestAIAssistance: (prompt: string, code: string) => void;
    leaveRoom: () => void;
  };
} | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize current user
  useEffect(() => {
    const savedUser = localStorage.getItem('chatshare-user');
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    } else {
      const newUser: User = {
        id: uuidv4(),
        name: `User ${Math.floor(Math.random() * 1000)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        isTyping: false,
      };
      localStorage.setItem('chatshare-user', JSON.stringify(newUser));
      dispatch({ type: 'SET_USER', payload: newUser });
    }
  }, []);

  const actions = {
    createRoom: (name: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const roomId = uuidv4().substring(0, 8);
      const newRoom: Room = {
        id: roomId,
        name,
        users: state.currentUser ? [state.currentUser] : [],
        code: '// Welcome to ChatShare!\n// Start coding collaboratively...\n\nconsole.log("Hello, World!");',
        language: 'javascript',
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      
      setTimeout(() => {
        dispatch({ type: 'SET_ROOM', payload: newRoom });
        dispatch({ type: 'SET_CONNECTED', payload: true });
        dispatch({ type: 'SET_LOADING', payload: false });
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: uuidv4(),
          userId: 'system',
          userName: 'ChatShare',
          message: `Welcome to room ${roomId}! Share this ID with others to collaborate.`,
          timestamp: new Date(),
          type: 'system',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: welcomeMessage });
      }, 1000);
    },

    joinRoom: (roomId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate joining existing room
      setTimeout(() => {
        const room: Room = {
          id: roomId,
          name: `Room ${roomId}`,
          users: state.currentUser ? [state.currentUser] : [],
          code: '// Welcome to ChatShare!\n// This is a collaborative room.\n\nfunction hello() {\n  return "Hello from the team!";\n}',
          language: 'javascript',
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          lastActivity: new Date(),
        };
        
        dispatch({ type: 'SET_ROOM', payload: room });
        dispatch({ type: 'SET_CONNECTED', payload: true });
        dispatch({ type: 'SET_LOADING', payload: false });
        
        const joinMessage: ChatMessage = {
          id: uuidv4(),
          userId: 'system',
          userName: 'ChatShare',
          message: `${state.currentUser?.name} joined the room`,
          timestamp: new Date(),
          type: 'system',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: joinMessage });
      }, 1000);
    },

    sendMessage: (message: string) => {
      if (!state.currentUser) return;
      
      const newMessage: ChatMessage = {
        id: uuidv4(),
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        message,
        timestamp: new Date(),
        type: 'message',
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    },

    updateCode: (code: string, language: string) => {
      dispatch({ type: 'UPDATE_CODE', payload: { code, language } });
    },

    requestAIAssistance: async (prompt: string, code: string) => {
      if (!model) {
        dispatch({ type: 'ADD_MESSAGE', payload: {
          id: uuidv4(),
          userId: 'system',
          userName: 'ChatShare',
          message: 'Gemini API key is not configured or AI model failed to initialize.',
          timestamp: new Date(),
          type: 'system',
        }});
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Add user prompt to history before sending
        dispatch({ type: 'ADD_AI_CHAT_ENTRY', payload: { role: 'user', parts: [{ text: prompt }] } });

        const chat = model.startChat({
          history: [
            // Existing chat history
            ...state.aiChatHistory,
            // Always provide current code as context for the AI
            {
              role: "user",
              parts: [{
                text: `You are an AI programming assistant. Your goal is to help users with their code. They will provide a prompt and their current code. Respond with explanations, suggestions, or refactorings. When suggesting code, always wrap it in markdown code blocks. If the user asks general questions not related to code, answer them concisely.\n\nCurrent Code:\n\`\`\`\n${code}\n\`\`\`\n`
              }],
            },
          ],
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract code block if present
        const codeMatch = text.match(/```(?:\\w+)?\\n([\\s\\S]*?)\\n```/);
        const aiCode = codeMatch ? codeMatch[1] : undefined;

        const aiResponse: AIResponse = {
          id: uuidv4(),
          type: aiCode ? 'suggestion' : 'explanation', // Infer type based on code presence
          content: text,
          code: aiCode,
        };
        
        dispatch({ type: 'ADD_AI_RESPONSE', payload: aiResponse });

        // Add AI response to history
        dispatch({ type: 'ADD_AI_CHAT_ENTRY', payload: { role: 'model', parts: [{ text: text }] } });
        
        // Add AI message to chat
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          userId: 'ai',
          userName: 'Gemini AI',
          message: aiCode ? 'I\'ve provided a code suggestion in the AI panel. Check it out!' : text.substring(0, 100) + '...', // Shorten for chat
          timestamp: new Date(),
          type: 'ai',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

      } catch (error) {
        console.error('Error in AI assistance:', error);
        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          userId: 'system',
          userName: 'ChatShare',
          message: 'Sorry, there was an error processing your AI request. Please ensure your Gemini API key is correct and try again.',
          timestamp: new Date(),
          type: 'system',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    leaveRoom: () => {
      dispatch({ type: 'LEAVE_ROOM' });
      dispatch({ type: 'SET_CONNECTED', payload: false });
      dispatch({ type: 'ADD_AI_CHAT_ENTRY', payload: { role: "model", parts: [{ text: "Conversation ended." }]}}); // Clear history
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}