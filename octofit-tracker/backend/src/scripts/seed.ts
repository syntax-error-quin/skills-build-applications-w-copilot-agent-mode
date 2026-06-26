import mongoose from 'mongoose';
import { User } from '../models/user';
import { Team } from '../models/team';
import { Activity } from '../models/activity';
import { Leaderboard } from '../models/leaderboard';
import { Workout } from '../models/workout';

// Seed the octofit_db database with test data
async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB for seeding');

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Leaderboard.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.create([
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
  const team = await Team.create({
    name: 'Nova Striders',
    sport: 'Running',
    members: users.map((user) => user._id),
    captain: captain._id,
    goal: 'Complete a 10K together',
  });

  await Activity.create([
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

  await Leaderboard.create([
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

  await Workout.create([
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
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
