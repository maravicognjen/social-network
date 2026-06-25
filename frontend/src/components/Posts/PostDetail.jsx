import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError('Post not found.');
        setTimeout(() => navigate('/posts'), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await API.delete(`/posts/delete/${id}`);
      navigate('/posts');
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Post #{post.id}</h2>

      <p>{post.text}</p>

      {post.image && (
        <img
          src={post.image}
          alt="post"
          style={{ maxWidth: '100%' }}
        />
      )}

      <p>User ID: {post.user_id}</p>

      {user?.id === post.user_id && (
        <button onClick={handleDelete}>
          Delete Post
        </button>
      )}
    </div>
  );
}