import express from 'express';
import { connectDatabase } from './config/database';
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

const registerCollectionRoutes = (
  path: string,
  listHandler: () => Promise<unknown>,
  createHandler: (req: express.Request, res: express.Response) => Promise<void>,
) => {
  app.get([path, `${path}/`], async (_req, res) => {
    await createCollectionRouter(listHandler, res);
  });

  app.post([path, `${path}/`], async (req, res) => {
    await createHandler(req, res);
  });
};

registerCollectionRoutes(
  '/api/users',
  () => User.find({}).lean(),
  async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

registerCollectionRoutes(
  '/api/teams',
  () => Team.find({}).populate('members').populate('captain').lean(),
  async (req, res) => {
    try {
      const team = await Team.create(req.body);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

registerCollectionRoutes(
  '/api/activities',
  () => Activity.find({}).populate('user').lean(),
  async (req, res) => {
    try {
      const activity = await Activity.create(req.body);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

registerCollectionRoutes(
  '/api/leaderboard',
  () => Leaderboard.find({}).populate('user').lean(),
  async (req, res) => {
    try {
      const entry = await Leaderboard.create(req.body);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

registerCollectionRoutes(
  '/api/workouts',
  () => Workout.find({}).populate('assignedTo').lean(),
  async (req, res) => {
    try {
      const workout = await Workout.create(req.body);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

connectDatabase()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.warn('MongoDB connection failed, continuing without a database connection:', error);
  });

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
