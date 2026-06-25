import { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');

      const res = await API.get(`/users/search?q=${query}`);
      setUsers(res.data);
    } catch (err) {
      setError('Failed to search users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Users</h2>

      <input
        type="text"
        placeholder="Username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={search}>
        Search
      </button>

      {loading && <p>Loading...</p>}

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} - {u.email}{' '}
            <Link to={`/messages/${u.id}`}>
              Send Message
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}