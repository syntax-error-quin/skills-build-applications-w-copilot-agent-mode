"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const user_1 = require("../models/user");
const team_1 = require("../models/team");
const activity_1 = require("../models/activity");
const leaderboard_1 = require("../models/leaderboard");
const workout_1 = require("../models/workout");
// Seed the octofit_db database with test data
async function seed() {
    await (0, database_1.connectDatabase)();
    console.log('Connected to MongoDB for seeding');
    await Promise.all([
        user_1.User.deleteMany({}),
        team_1.Team.deleteMany({}),
        activity_1.Activity.deleteMany({}),
        leaderboard_1.Leaderboard.deleteMany({}),
        workout_1.Workout.deleteMany({}),
    ]);
    const users = await user_1.User.create([
        {
            name: 'Ada Lovelace',
            email: 'ada@example.com',
            role: 'admin',
            fitnessLevel: 'advanced',
            city: 'London',
        },
        {
            name: 'Grace Hopper',
            email: 'grace@example.com',
            role: 'member',
            fitnessLevel: 'intermediate',
            city: 'New York',
        },
        {
            name: 'Katherine Johnson',
            email: 'katherine@example.com',
            role: 'member',
            fitnessLevel: 'beginner',
            city: 'Charlottesville',
        },
    ]);
    const captain = users[0];
    const team = await team_1.Team.create({
        name: 'Nova Striders',
        sport: 'Running',
        members: users.map((user) => user._id),
        captain: captain._id,
        goal: 'Complete a 10K together',
    });
    await activity_1.Activity.create([
        {
            user: users[0]._id,
            type: 'Run',
            durationMinutes: 35,
            calories: 420,
            date: new Date('2026-06-24'),
        },
        {
            user: users[1]._id,
            type: 'Cycling',
            durationMinutes: 50,
            calories: 510,
            date: new Date('2026-06-25'),
        },
    ]);
    await leaderboard_1.Leaderboard.create([
        {
            user: users[0]._id,
            points: 1250,
            streak: 7,
            rank: 1,
        },
        {
            user: users[1]._id,
            points: 1180,
            streak: 4,
            rank: 2,
        },
    ]);
    await workout_1.Workout.create([
        {
            title: 'Morning HIIT',
            focus: 'Cardio',
            durationMinutes: 20,
            difficulty: 'Intermediate',
            assignedTo: [users[0]._id, users[1]._id],
        },
        {
            title: 'Core Stability',
            focus: 'Core',
            durationMinutes: 15,
            difficulty: 'Beginner',
            assignedTo: [users[2]._id],
        },
    ]);
    console.log(`Seeded ${users.length} users, 1 team, activities, leaderboard entries, and workouts`);
    await (await import('mongoose')).default.disconnect();
}
seed().catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
});
