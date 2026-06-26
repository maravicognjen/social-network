import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';

export default function UserPosts() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔥 delete modal state
  const [selectedPost, setSelectedPost] = useState(null);
  const [reason, setReason] = useState('');

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

  // 🔥 open modal
  const openDeleteModal = (postId) => {
    setSelectedPost(postId);
    setReason('');
  };

  // 🔥 confirm delete
  const confirmDelete = async () => {
    if (!reason.trim()) {
      alert('Reason is required!');
      return;
    }

    try {
      await API.delete(`/admin/delete-post/${selectedPost}`, {
        data: { reason: reason.trim() },
      });

      setPosts((prev) => prev.filter((p) => p.id !== selectedPost));

      setSelectedPost(null);
      setReason('');
    } catch (err) {
      console.log(err.response?.data);
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

            <button onClick={() => openDeleteModal(p.id)}>
              Delete Post (Admin)
            </button>
          </div>
        ))
      )}

      {/* 🔥 MODAL */}
      {selectedPost && (
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
            <h3>Delete Post</h3>

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

            <button onClick={() => setSelectedPost(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}