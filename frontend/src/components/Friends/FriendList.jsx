import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await API.get('/friends/list');
        setFriends(res.data?.friends || []);
      } catch (err) {
        setError('Failed to load friends.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <p>Loading friends...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Friends</h2>

      {friends.length === 0 ? (
        <p>You have no friends yet.</p>
      ) : (
        <ul>
          {friends.map((f) => (
            <li key={f.id}>
              {f.first_name} {f.last_name} (@{f.username}){' '}
              <Link to={`/messages/${f.id}`}>Message</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}