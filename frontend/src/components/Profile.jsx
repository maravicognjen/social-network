import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, fetchProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    is_private: false
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        gender: user.gender || '',
        is_private: user.is_private || false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/profile', form);
      await fetchProfile();
      setMessage('Profil update!');
    } catch (err) {
      setMessage(err.response?.data?.errors?.email || 'Error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.log('Logout error', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>My profil</h2>

      <p><strong>Username:</strong> {user.username}</p>

      {user?.profile_image && (
        <div>
          <img
            src={`http://localhost:5050/${user.profile_image}`}
            alt="Profile"
            width="150"
            style={{ borderRadius: "50%" }}
          />
        </div>
      )}

      <button onClick={handleLogout} style={{ marginBottom: '10px' }}>
        Logout
      </button>

      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="Ime"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          name="last_name"
          placeholder="Prezime"
          value={form.last_name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Choose</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="is_private"
            checked={form.is_private}
            onChange={handleChange}
          />
          Private Profile
        </label>

        <button type="submit">Update</button>
      </form>

      {message && <p>{message}</p>}

      <Link to="/change-password">Change Password</Link>
    </div>
  );
}

