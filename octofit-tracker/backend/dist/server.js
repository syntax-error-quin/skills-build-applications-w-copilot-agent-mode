"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const user_1 = require("./models/user");
const team_1 = require("./models/team");
const activity_1 = require("./models/activity");
const leaderboard_1 = require("./models/leaderboard");
const workout_1 = require("./models/workout");
const app = (0, express_1.default)();
const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'octofit-backend' });
});
app.get('/api/config', (_req, res) => {
    res.json({ apiBaseUrl, codespaceName: codespaceName ?? null });
});
const createCollectionRouter = async (handler, res) => {
    try {
        const data = await handler();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const registerCollectionRoutes = (path, listHandler, createHandler) => {
    app.get([path, `${path}/`], async (_req, res) => {
        await createCollectionRouter(listHandler, res);
    });
    app.post([path, `${path}/`], async (req, res) => {
        await createHandler(req, res);
    });
};
registerCollectionRoutes('/api/users', () => user_1.User.find({}).lean(), async (req, res) => {
    try {
        const user = await user_1.User.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
registerCollectionRoutes('/api/teams', () => team_1.Team.find({}).populate('members').populate('captain').lean(), async (req, res) => {
    try {
        const team = await team_1.Team.create(req.body);
        res.status(201).json(team);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
registerCollectionRoutes('/api/activities', () => activity_1.Activity.find({}).populate('user').lean(), async (req, res) => {
    try {
        const activity = await activity_1.Activity.create(req.body);
        res.status(201).json(activity);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
registerCollectionRoutes('/api/leaderboard', () => leaderboard_1.Leaderboard.find({}).populate('user').lean(), async (req, res) => {
    try {
        const entry = await leaderboard_1.Leaderboard.create(req.body);
        res.status(201).json(entry);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
registerCollectionRoutes('/api/workouts', () => workout_1.Workout.find({}).populate('assignedTo').lean(), async (req, res) => {
    try {
        const workout = await workout_1.Workout.create(req.body);
        res.status(201).json(workout);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
(0, database_1.connectDatabase)()
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((error) => {
    console.warn('MongoDB connection failed, continuing without a database connection:', error);
});
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
