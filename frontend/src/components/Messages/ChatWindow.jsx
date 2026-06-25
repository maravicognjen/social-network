import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ChatWindow() {
  const { userId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  const bottomRef = useRef(null);

  const receiverId = parseInt(userId);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/messages/${receiverId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      setError('Failed to load messages.');
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      await API.post('/messages/send', {
        receiver_id: receiverId,
        content: newMessage,
      });

      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  return (
    <div>
      <h2>Chat</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {messages.map((m) => {
          const isMine = m.sender_id === user?.id;

          return (
            <div
              key={m.id}
              style={{
                textAlign: isMine ? 'right' : 'left',
                margin: '5px',
              }}
            >
              <strong>{isMine ? 'Me' : 'Them'}:</strong> {m.content}
              <br />
              <small>
                {new Date(m.created_at).toLocaleString()}
              </small>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
        />

        <button type="submit">
          Send
        </button>
      </form>
    </div>
  );
}