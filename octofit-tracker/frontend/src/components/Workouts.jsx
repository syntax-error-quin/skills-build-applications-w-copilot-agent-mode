import { useEffect, useState } from 'react';
import { buildApiUrl, fetchJson, normalizeCollection } from './api';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadWorkouts = async () => {
      try {
        const payload = await fetchJson(buildApiUrl('workouts'));
        if (isMounted) {
          setWorkouts(normalizeCollection(payload));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load workouts');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWorkouts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Workouts</h2>
      <p className="text-muted">Suggested training plans for the community.</p>

      {loading && <div className="alert alert-info">Loading workouts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-3">
          {workouts.map((workout) => (
            <div className="col-md-6" key={workout._id || workout.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{workout.title}</h5>
                  <p className="text-muted mb-2">Focus: {workout.focus}</p>
                  <p className="card-text">Duration: {workout.durationMinutes} min</p>
                  <p className="mb-0">Difficulty: {workout.difficulty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
