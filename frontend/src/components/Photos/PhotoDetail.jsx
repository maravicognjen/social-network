import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await API.get(`/photos/${id}`);
        setPhoto(res.data);
      } catch (err) {
        setError('Photo not found.');
        setTimeout(() => navigate('/photos'), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await API.delete(`/photos/delete/${id}`);
      navigate('/photos');
    } catch (err) {
      alert('Failed to delete photo.');
    }
  };

  const setAsProfile = async () => {
    try {
      await API.put('/profile/profile-image', {
        photo_id: Number(id),
      });

      alert('Profile image updated!');
    } catch (err) {
      alert('Failed to update profile image.');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Photo</h2>

      <img
        src={photo.image_url || photo.image}
        alt="full"
        width="400"
      />

      <p>{photo.description}</p>

      {user?.id === photo.user_id && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={setAsProfile}>
            Set as Profile Picture
          </button>

          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}