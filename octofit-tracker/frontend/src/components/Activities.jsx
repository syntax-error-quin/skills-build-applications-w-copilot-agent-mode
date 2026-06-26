import { useEffect, useState } from 'react';
import { buildApiUrl, fetchJson, normalizeCollection } from './api';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
};

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      try {
        const payload = await fetchJson(buildApiUrl('activities'));
        if (isMounted) {
          setActivities(normalizeCollection(payload));
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

    loadActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Activities</h2>
      <p className="text-muted">Recent activity entries from the OctoFit backend.</p>

      {loading && <div className="alert alert-info">Loading activities…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id || activity.id}>
                  <td>{activity.user?.name || 'Unknown user'}</td>
                  <td>{activity.type}</td>
                  <td>{activity.durationMinutes} min</td>
                  <td>{activity.calories}</td>
                  <td>{formatDate(activity.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
