import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get('/posts/');
        setPosts(res.data);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  if (error) {
    return (
      <p style={{ color: 'red' }}>
        {error}
      </p>
    );
  }

  return (
    <div>
      <h2>All Posts</h2>

      <Link to="/posts/create">
        Create New Post
      </Link>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
            }}
          >
            <p>{post.text}</p>

            {post.image && (
              <img
                src={post.image}
                width="200"
                alt="Post"
              />
            )}

            <p>
              <Link to={`/posts/${post.id}`}>
                View Details
              </Link>
            </p>
          </div>
        ))
      )}
    </div>
  );
}