declare global {
  interface Window {
    electronAPI: {
      sendPing: () => void;
      onPong: (callback: (event: any, data: string) => void) => void;
      sendToPython: (data: any) => Promise<any>;
      onPythonResponse: (callback: (event: any, data: any) => void) => void;
    };
  }
}

import { useEffect, useState } from 'react';
import { useChatStore, Message } from './store';

function App() {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onPythonResponse((event, data) => {
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
    if (!input.trim()) return;
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Electron-Grok Chat</h1>
      <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '10px' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Grok'}:</strong> {msg.content}
            <br />
            <small style={{ color: '#666' }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          style={{ width: '70%', padding: '8px' }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={{ padding: '8px 16px', marginLeft: '10px' }}>Send</button>
      </div>
    </div>
  );
}

export default App;
