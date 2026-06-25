import { useState } from 'react';
import API from '../../services/api';

export default function SendRequest() {
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!receiverId.trim()) {
      setMessage('Please enter a user ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await API.post(`/friends/request_send/${receiverId}`);

      setMessage('Friend request sent successfully!');
      setReceiverId('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Send Friend Request</h2>

      <input
        type="number"
        placeholder="User ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />

      <button onClick={send} disabled={loading}>
        {loading ? 'Sending...' : 'Send Request'}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}