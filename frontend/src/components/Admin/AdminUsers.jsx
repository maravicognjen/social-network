import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async (query = '') => {
    try {
      setLoading(true);

      const res = await API.get(`/admin/users?search=${query}`);
      setUsers(res.data?.users || []);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers(search);
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [search]);

  const toggleBlock = async (userId) => {
    try {
      await API.post(`/admin/block/${userId}`);
      fetchUsers(search);
    } catch (err) {
      alert('Action failed.');
    }
  };

  if (loading) return <p>Loading users...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>User Management</h2>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                <td>
                  {u.first_name} {u.last_name} (@{u.username})
                </td>

                <td>{u.email}</td>

                <td>
                  {u.is_blocked ? 'Blocked' : 'Active'}
                </td>

                <td>
                  <button onClick={() => toggleBlock(u.id)}>
                    {u.is_blocked ? 'Unblock' : 'Block'}
                  </button>

                  {' '}

                  <Link to={`/admin/users/${u.id}/posts`}>
                    Posts
                  </Link>

                  {' | '}

                  <Link to={`/admin/users/${u.id}/photos`}>
                    Photos
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}