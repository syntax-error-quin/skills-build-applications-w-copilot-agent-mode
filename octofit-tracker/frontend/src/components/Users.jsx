import { useEffect, useState } from 'react';
import { buildApiUrl, fetchJson, normalizeCollection } from './api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const payload = await fetchJson(buildApiUrl('users'));
        if (isMounted) {
          setUsers(normalizeCollection(payload));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Users</h2>
      <p className="text-muted">Community members and their fitness profiles.</p>

      {loading && <div className="alert alert-info">Loading users…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Fitness level</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.fitnessLevel}</td>
                  <td>{user.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
