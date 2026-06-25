import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/friends/pending_requests');
      setRequests(res.data?.pending_requests || []);
    } catch (err) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const accept = async (requestId) => {
    try {
      setActionLoading(requestId);
      await API.post(`/friends/accept_request/${requestId}`);
      fetchRequests();
    } catch (err) {
      setError('Failed to accept request.');
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (requestId) => {
    try {
      setActionLoading(requestId);
      await API.post(`/friends/reject_request/${requestId}`);
      fetchRequests();
    } catch (err) {
      setError('Failed to reject request.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p>Loading requests...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Friend Requests</h2>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r.request_id}>
              {r.sender_first_name} {r.sender_last_name} (@{r.sender_username}){' '}

              <button
                onClick={() => accept(r.request_id)}
                disabled={actionLoading === r.request_id}
              >
                Accept
              </button>

              <button
                onClick={() => reject(r.request_id)}
                disabled={actionLoading === r.request_id}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}