import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';

export default function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔥 modal state
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [reason, setReason] = useState('');

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

  // 🔥 open modal
  const openDeleteModal = (photoId) => {
    setSelectedPhoto(photoId);
    setReason('');
  };

  // 🔥 confirm delete
  const confirmDelete = async () => {
    if (!reason.trim()) {
      alert('Reason is required!');
      return;
    }

    try {
      await API.delete(`/admin/delete-photo/${selectedPhoto}`, {
        data: { reason: reason.trim() },
      });

      setPhotos((prev) =>
        prev.filter((p) => p.id !== selectedPhoto)
      );

      setSelectedPhoto(null);
      setReason('');
    } catch (err) {
      console.log(err.response?.data);
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

              <button onClick={() => openDeleteModal(p.id)}>
                Delete (Admin)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 MODAL */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h3>Delete Photo</h3>

            <textarea
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', height: '80px' }}
            />

            <br /><br />

            <button onClick={confirmDelete} style={{ marginRight: '10px' }}>
              Confirm
            </button>

            <button onClick={() => setSelectedPhoto(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}