import { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CreatePost() {
  const { user } = useAuth(); 

  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    setError('');
    setLoading(true);

    

    try {
      await API.post('/posts/create', {
        text,
        image,
        user_id: user?.id, 
      });

      navigate('/posts');
    } catch (err) {
      console.error(err);
      setError('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create New Post</h2>

        <textarea
          placeholder="Write something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={5}
          style={{ width: '100%' }}
        />

        <input
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{ width: '100%', marginTop: '10px' }}
        />

        <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Posting...' : 'Post'}
        </button>

        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}