import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

export default function PhotoList() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await API.get('/photos/');
        setPhotos(res.data);
      } catch (err) {
        setError('Failed to load photos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <p>Loading photos...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>All Photos</h2>

      <Link to="/photos/upload">
        Upload New Photo
      </Link>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.length === 0 ? (
          <p>No photos found.</p>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} style={{ margin: '10px' }}>
              <img
                src={photo.image || '/placeholder.png'}
                width="150"
                alt="photo"
              />

              <p>
                <Link to={`/photos/${photo.id}`}>
                  Details
                </Link>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}