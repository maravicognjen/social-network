import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';

export default function UserPosts() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await API.get(`/admin/users/${userId}/posts`);
      setPosts(res.data?.posts || []);
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const deletePost = async (postId) => {
    const reason = prompt('Enter reason for deletion:');
    if (!reason) return;

    try {
      await API.delete(`/admin/delete-post/${postId}`, {
        data: { reason },
      });

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  if (loading) return <p>Loading posts...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>User Posts #{userId}</h2>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((p) => (
          <div
            key={p.id}
            style={{
              border: '1px solid gray',
              margin: '10px',
              padding: '10px',
            }}
          >
            <p>{p.text}</p>
            <small>{p.created_at}</small>

            <br />

            <button onClick={() => deletePost(p.id)}>
              Delete Post (Admin)
            </button>
          </div>
        ))
      )}
    </div>
  );
}