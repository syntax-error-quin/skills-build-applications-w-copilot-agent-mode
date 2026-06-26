import { useEffect, useState } from 'react';
import { buildApiUrl, fetchJson, normalizeCollection } from './api';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadLeaderboard = async () => {
      try {
        const payload = await fetchJson(buildApiUrl('leaderboard'));
        if (isMounted) {
          setEntries(normalizeCollection(payload));
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

    loadLeaderboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Leaderboard</h2>
      <p className="text-muted">Current rankings from the activity tracker.</p>

      {loading && <div className="alert alert-info">Loading leaderboard…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Points</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id || entry.id}>
                  <td>#{entry.rank}</td>
                  <td>{entry.user?.name || 'Unknown user'}</td>
                  <td>{entry.points}</td>
                  <td>{entry.streak} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
