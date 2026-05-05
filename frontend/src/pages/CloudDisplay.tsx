import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface Message {
  id: string;
  name: string;
  message: string;
  color: string;
  timestamp: string;
}

import qrCodeImage from '../assets/qr-code.png';

const CloudDisplay = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:4000`;
    const newSocket = io(backendUrl);

    newSocket.on('connect', () => {
      console.log('Connected to backend');
    });

    newSocket.on('initial_messages', (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages((prev) => {
        const updated = [message, ...prev]; // Add new message to the top!
        if (updated.length > 50) return updated.slice(0, 50);
        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="cloud-page">
      <div className="cloud-top-header">
        <h1>Live Feedback Cloud</h1>
        <p>Scan the QR code and share your thoughts instantly with the room</p>
      </div>

      <div className="cloud-layout">
        <div className="qr-sidebar">
          <div className="qr-elegant-card">
            <div className="qr-image-wrapper">
              <img src={qrCodeImage} alt="QR Code" width={300} height={300} />
            </div>
            <div className="qr-text">
              <h3>Join the Conversation</h3>
              <span>Scan to Share</span>
            </div>
          </div>
        </div>

        <div className="messages-grid">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ msg }: { msg: Message }) => {
  return (
    <div className="elegant-bubble" style={{ '--bubble-color': msg.color } as React.CSSProperties}>
      <div className="elegant-bubble-header">
        <div className="elegant-bubble-avatar" style={{ backgroundColor: msg.color }}>
          {msg.name.charAt(0).toUpperCase()}
        </div>
        <div className="elegant-bubble-name">{msg.name}</div>
      </div>
      <div className="elegant-bubble-message">{msg.message}</div>
    </div>
  );
};

export default CloudDisplay;
