const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializeAchievements } = require('./controllers/achievementController');
const { initializeTemplates } = require('./controllers/templateController');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/health-metrics', require('./routes/healthMetrics'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/streak', require('./routes/streak'));

// Initialize achievements and templates on server start
connectDB().then(async () => {
  await initializeAchievements();
  await initializeTemplates();
  console.log('Default achievements and templates initialized');
});
// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Fitness Tracker API - Aligned with SDG 3' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
