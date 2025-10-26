import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getWorkoutStats, getWorkouts, getHealthMetrics } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'; // Removed BarChart and Bar
import { motion } from 'framer-motion';
import LoadingSkeleton from './LoadingSkeleton';
import MotivationalQuote from './MotivationalQuote';
import ProgressCard from './ProgressCard';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [recentMetrics, setRecentMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, workoutsRes, metricsRes] = await Promise.all([
        getWorkoutStats(),
        getWorkouts(),
        getHealthMetrics(),
      ]);
      setStats(statsRes.data);
      setRecentWorkouts(workoutsRes.data.slice(0, 5));
      setRecentMetrics(metricsRes.data.slice(0, 7));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  const categoryData = stats ? Object.keys(stats.categoryStats).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: stats.categoryStats[key],
  })) : [];

  const stepsData = recentMetrics.map((metric) => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    steps: metric.steps || 0,
  })).reverse();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Loading your fitness journey... 🏃</h1>
        </div>
        <LoadingSkeleton type="stats" count={4} />
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  // Calculate weekly goals
  const weeklyWorkoutGoal = 5;
  const weeklyStepsGoal = 70000;
  const weeklyCaloriesGoal = 2000;

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p className="dashboard-subtitle">Your fitness journey towards SDG 3: Good Health and Well-being</p>
        </motion.div>
      </div>

      <MotivationalQuote />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="section-title">📊 Weekly Goals</h2>
        <div className="progress-grid">
          <ProgressCard
            title="Workouts"
            current={stats?.totalWorkouts || 0}
            goal={weeklyWorkoutGoal}
            unit="sessions"
            icon="🏋️"
            color="#667eea"
          />
          <ProgressCard
            title="Steps"
            current={recentMetrics.reduce((acc, m) => acc + (m.steps || 0), 0)}
            goal={weeklyStepsGoal}
            unit="steps"
            icon="👣"
            color="#43e97b"
          />
          <ProgressCard
            title="Calories"
            current={stats?.totalCalories || 0}
            goal={weeklyCaloriesGoal}
            unit="cal"
            icon="🔥"
            color="#f093fb"
          />
        </div>
      </motion.div>

      <motion.div
        className="stats-grid"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">🏃</div>
          <div className="stat-content">
            <h3>{stats?.totalWorkouts || 0}</h3>
            <p>Total Workouts</p>
          </div>
        </motion.div>
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{stats?.totalDuration || 0}</h3>
            <p>Minutes Exercised</p>
          </div>
        </motion.div>
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats?.totalCalories || 0}</h3>
            <p>Calories Burned</p>
          </div>
        </motion.div>
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{user?.fitnessGoal?.replace('_', ' ')}</h3>
            <p>Fitness Goal</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="charts-grid">
        {categoryData.length > 0 && (
          <motion.div 
            className="chart-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Workout Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {stepsData.length > 0 && (
          <motion.div 
            className="chart-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Daily Steps (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stepsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke="#667eea" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      <motion.div 
        className="recent-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3>Recent Workouts</h3>
        {recentWorkouts.length > 0 ? (
          <div className="workout-list-simple">
            {recentWorkouts.map((workout, index) => (
              <motion.div
                key={workout._id}
                className="workout-item-simple"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="workout-info">
                  <h4>{workout.exerciseName}</h4>
                  <p>{workout.category} • {workout.duration} min • {workout.caloriesBurned} cal</p>
                </div>
                <div className="workout-date">
                  {new Date(workout.date).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-data">No workouts yet. Start tracking your fitness journey!</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
