declare global {
  interface Window {
    electronAPI: {
      sendPing: () => void;
      onPong: (callback: (event: any, data: string) => void) => void;
      sendToPython: (data: any) => Promise<any>;
      onPythonResponse: (callback: (event: any, data: any) => void) => void;
      onBackendError: (callback: (event: any, message: string) => void) => void;
    };
  }
}

import { useEffect, useState, useRef } from 'react';
import { useChatStore, Message } from './store';

function App() {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onPythonResponse((event, data) => {
        setIsLoading(false);
        if (data.reply) {
          const aiMessage: Message = {
            id: data.id + '_reply',
            role: 'assistant',
            content: data.reply,
            timestamp: Date.now(),
          };
          addMessage(aiMessage);
        } else if (data.error) {
          const errorMessage: Message = {
            id: data.id + '_error',
            role: 'assistant',
            content: 'Error: ' + data.error,
            timestamp: Date.now(),
          };
          addMessage(errorMessage);
        }
      });
    }
  }, [addMessage]);

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    addMessage(userMessage);
    if (window.electronAPI) {
      window.electronAPI.sendToPython({ id: userMessage.id, message: input });
    }
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800">Electron-Grok Chat</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                <p className="text-sm">Grok is thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
