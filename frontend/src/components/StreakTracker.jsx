import React, { useState, useEffect } from 'react';
import { getStreak, getLeaderboard } from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaTrophy, FaMedal } from 'react-icons/fa';

const StreakTracker = () => {
  const [streak, setStreak] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [streakRes, leaderboardRes] = await Promise.all([
        getStreak(),
        getLeaderboard(),
      ]);
      setStreak(streakRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (error) {
      console.error('Error fetching streak data:', error);
      toast.error('Failed to load streak data');
    } finally {
      setLoading(false);
    }
  };

  const getStreakMessage = (days) => {
    if (days === 0) return "Start your streak today!";
    if (days === 1) return "Great start! Keep it going!";
    if (days < 7) return "You're building momentum!";
    if (days < 30) return "Impressive dedication!";
    if (days < 100) return "You're a fitness champion!";
    return "Legendary streak! 🔥";
  };

  const getLevelProgress = (level) => {
    const pointsForCurrentLevel = (level - 1) * 100;
    const pointsForNextLevel = level * 100;
    const progress = streak ? streak.totalPoints - pointsForCurrentLevel : 0;
    const progressPercent = (progress / 100) * 100;
    return { progress, progressPercent, pointsForNextLevel };
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>🔥 Streak & Leaderboard</h1>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  const levelInfo = streak ? getLevelProgress(streak.level) : { progress: 0, progressPercent: 0, pointsForNextLevel: 100 };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>🔥 Streak & Leaderboard</h1>
      </div>

      {/* Streak Card */}
      <motion.div
        className="streak-card-large"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="streak-flame-container">
          <motion.div
            className="streak-flame"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            🔥
          </motion.div>
        </div>

        <h2 className="streak-number">{streak?.currentStreak || 0}</h2>
        <p className="streak-label">Day Streak</p>
        <p className="streak-message">{getStreakMessage(streak?.currentStreak || 0)}</p>

        <div className="streak-stats-row">
          <div className="streak-stat">
            <FaTrophy className="streak-stat-icon" />
            <div>
              <span className="streak-stat-value">{streak?.longestStreak || 0}</span>
              <span className="streak-stat-label">Longest Streak</span>
            </div>
          </div>
          <div className="streak-stat">
            <FaMedal className="streak-stat-icon" />
            <div>
              <span className="streak-stat-value">Level {streak?.level || 1}</span>
              <span className="streak-stat-label">{streak?.totalPoints || 0} Points</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="level-progress-section">
          <div className="level-progress-header">
            <span>Level {streak?.level || 1}</span>
            <span>{levelInfo.progress}/100 XP</span>
          </div>
          <div className="level-progress-bar">
            <motion.div
              className="level-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <p className="level-progress-text">
            {100 - levelInfo.progress} XP to Level {(streak?.level || 1) + 1}
          </p>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <div className="leaderboard-section">
        <h2>🏆 Global Leaderboard</h2>
        <p className="leaderboard-subtitle">Top fitness enthusiasts this month</p>

        <div className="leaderboard-list">
          {leaderboard.slice(0, 10).map((entry, index) => (
            <motion.div
              key={entry._id}
              className={`leaderboard-item ${index < 3 ? `top-${index + 1}` : ''}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="leaderboard-rank">
                {index === 0 && <span className="rank-medal">🥇</span>}
                {index === 1 && <span className="rank-medal">🥈</span>}
                {index === 2 && <span className="rank-medal">🥉</span>}
                {index > 2 && <span className="rank-number">#{index + 1}</span>}
              </div>

              <div className="leaderboard-user">
                <div className="leaderboard-avatar">
                  {entry.user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="leaderboard-info">
                  <span className="leaderboard-name">{entry.user?.name || 'Anonymous'}</span>
                  <span className="leaderboard-streak">
                    🔥 {entry.currentStreak} day streak
                  </span>
                </div>
              </div>

              <div className="leaderboard-stats">
                <span className="leaderboard-level">Lvl {entry.level}</span>
                <span className="leaderboard-points">{entry.totalPoints} pts</span>
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <p className="no-data">No leaderboard data yet. Be the first!</p>
        )}
      </div>
    </motion.div>
  );
};

export default StreakTracker;
