import express from 'express';
import mongoose from 'mongoose';
import { User } from './models/user';
import { Team } from './models/team';
import { Activity } from './models/activity';
import { Leaderboard } from './models/leaderboard';
import { Workout } from './models/workout';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-backend' });
});

app.get('/api/config', (_req, res) => {
  res.json({ apiBaseUrl, codespaceName: codespaceName ?? null });
});

const createCollectionRouter = async (handler: () => Promise<unknown>, res: express.Response) => {
  try {
    const data = await handler();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

app.get('/api/users', async (_req, res) => {
  await createCollectionRouter(() => User.find({}).lean(), res);
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/teams', async (_req, res) => {
  await createCollectionRouter(() => Team.find({}).populate('members').populate('captain').lean(), res);
});

app.post('/api/teams', async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/activities', async (_req, res) => {
  await createCollectionRouter(() => Activity.find({}).populate('user').lean(), res);
});

app.post('/api/activities', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/leaderboard', async (_req, res) => {
  await createCollectionRouter(() => Leaderboard.find({}).populate('user').lean(), res);
});

app.post('/api/leaderboard', async (req, res) => {
  try {
    const entry = await Leaderboard.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/workouts', async (_req, res) => {
  await createCollectionRouter(() => Workout.find({}).populate('assignedTo').lean(), res);
});

app.post('/api/workouts', async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.warn('MongoDB connection failed, continuing without a database connection:', error);
  });

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
