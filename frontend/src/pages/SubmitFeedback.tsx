import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, CheckCircle2 } from 'lucide-react';

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', 
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];

const SubmitFeedback = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{name: string, message: string, color: string} | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:4000`;
    const newSocket = io(backendUrl);

    newSocket.on('connect', () => {
      console.log('Connected to backend for submission');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !socket) return;

    setIsSubmitting(true);

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    socket.emit('send_message', {
      name: name.trim(),
      message: message.trim(),
      color: randomColor
    });

    setSubmittedData({
      name: name.trim(),
      message: message.trim(),
      color: randomColor
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName('');
      setMessage('');
    }, 500); // Small delay to simulate network request and show loading state
  };

  if (isSuccess && submittedData) {
    return (
      <div className="submit-container">
        <div className="submit-card success-message">
          <div className="success-icon">
            <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
          </div>
          <h3>Thank You!</h3>
          <p>Your feedback was successfully broadcasted.</p>



          <button 
            className="new-feedback-btn"
            onClick={() => {
              setIsSuccess(false);
              setSubmittedData(null);
            }}
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-container">
      <div className="submit-card">
        <h2>Share Your Thoughts</h2>
        <p>Send a message to the live cloud!</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              className="form-control"
              placeholder="What did you think of the event?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={150}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || !name.trim() || !message.trim()}
          >
            {isSubmitting ? 'Sending...' : (
              <>
                Send to Screen <Send size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitFeedback;
