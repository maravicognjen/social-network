import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';

export default function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPhotos = async () => {
    try {
      const res = await API.get(`/admin/users/${userId}/photos`);
      setPhotos(res.data?.photos || []);
    } catch (err) {
      setError('Failed to load photos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const deletePhoto = async (photoId) => {
    const reason = prompt('Enter reason for deletion:');
    if (!reason) return;

    try {
      await API.delete(`/admin/delete-photo/${photoId}`, {
        data: { reason },
      });

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      alert('Failed to delete photo.');
    }
  };

  if (loading) return <p>Loading photos...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>User Photos #{userId}</h2>

      {photos.length === 0 ? (
        <p>No photos found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                margin: '10px',
                border: '1px solid #ccc',
                padding: '10px',
              }}
            >
              <img
                src={p.image || '/placeholder.png'}
                width="150"
                alt="photo"
              />

              <p>{p.description}</p>

              <button onClick={() => deletePhoto(p.id)}>
                Delete (Admin)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}