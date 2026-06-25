import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, fetchProfile } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', gender: '', is_private: false });
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
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/profile', form);
      await fetchProfile();
      setMessage('Profil ažuriran!');
    } catch (err) {
      setMessage(err.response?.data?.errors?.email || 'Error');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>My profil</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="Ime" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Prezime" value={form.last_name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Chose</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <label>
          <input type="checkbox" name="is_private" checked={form.is_private} onChange={handleChange} />
          Private Profile
        </label>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
      <Link to="/change-password">Change Password</Link>
    </div>
  );
}