import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
];

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
const apiMode = codespaceName ? `Codespaces (${codespaceName})` : 'localhost';

function Home() {
  return (
    <section className="container py-4">
      <h1 className="display-5 mb-3">OctoFit Tracker</h1>
      <p className="lead">
        Explore users, teams, activities, leaderboard results, and workout plans from the multi-tier backend.
      </p>
      <p className="text-muted">
        Create a .env.local file with VITE_CODESPACE_NAME=your-codespace-name when running in GitHub Codespaces so the app targets the public API URL automatically. If VITE_CODESPACE_NAME is unset, the app falls back to the local Vite proxy. Current mode: {apiMode}.
      </p>
    </section>
  );
}

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">OctoFit</span>
          <div className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <NavLink key={item.to} className="nav-link" to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </>
  );
}

export default App;
