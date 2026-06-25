import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (newPassword !== confirmNew) {
      setError('New passwords do not match');
      return;
    }

    try {
      await API.post('/profile/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNew,
      });

      setSuccess('Password changed successfully!');

      setOldPassword('');
      setNewPassword('');
      setConfirmNew('');

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        setError(errors[Object.keys(errors)[0]]);
      } else {
        setError('An error occurred.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <form onSubmit={handleSubmit}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNew}
          onChange={(e) => setConfirmNew(e.target.value)}
          required
        />

        <button type="submit">
          Change Password
        </button>

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: 'green' }}>
            {success}
          </p>
        )}
      </form>
    </div>
  );
}