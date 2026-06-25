import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get('/messages/conversations');

        setConversations(res.data?.conversations || []);
      } catch (err) {
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <p>Loading conversations...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Conversations</h2>

      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {conversations.map((c) => (
            <li key={c.user_id}>
              <Link to={`/messages/${c.user_id}`}>
                {c.first_name} {c.last_name} (@{c.username}) - last message:{' '}
                {c.last_message_time}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}