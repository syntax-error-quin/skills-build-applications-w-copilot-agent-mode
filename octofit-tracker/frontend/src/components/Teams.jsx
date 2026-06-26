import { useEffect, useState } from 'react';
import { buildApiUrl, fetchJson, normalizeCollection } from './api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTeams = async () => {
      try {
        const payload = await fetchJson(buildApiUrl('teams'));
        if (isMounted) {
          setTeams(normalizeCollection(payload));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load teams');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTeams();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Teams</h2>
      <p className="text-muted">Competition squads and their current goals.</p>

      {loading && <div className="alert alert-info">Loading teams…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-3">
          {teams.map((team) => (
            <div className="col-md-6" key={team._id || team.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="text-muted mb-2">{team.sport}</p>
                  <p className="card-text">{team.goal}</p>
                  <p className="mb-0">
                    Captain: {team.captain?.name || 'TBD'}
                  </p>
                  <p className="mb-0">Members: {team.members?.length || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
