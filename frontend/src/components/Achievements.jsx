import React, { useState, useEffect } from 'react';
import { getAchievements, getUserAchievements, checkAchievements } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingSkeleton from './LoadingSkeleton';
import { FaTrophy, FaStar, FaLock } from 'react-icons/fa';

const Achievements = () => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const [allRes, userRes] = await Promise.all([
        getAchievements(),
        getUserAchievements(),
      ]);
      setAllAchievements(allRes.data);
      setUserAchievements(userRes.data);
      
      // Check for new achievements
      const checkRes = await checkAchievements();
      if (checkRes.data.newlyUnlocked.length > 0) {
        checkRes.data.newlyUnlocked.forEach(achievement => {
          toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
            autoClose: 5000,
          });
        });
        // Refresh user achievements
        const updatedUserRes = await getUserAchievements();
        setUserAchievements(updatedUserRes.data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId) => {
    return userAchievements.some(
      ua => ua.achievement._id === achievementId && ua.isUnlocked
    );
  };

  const getProgress = (achievementId) => {
    const userAch = userAchievements.find(ua => ua.achievement._id === achievementId);
    return userAch ? userAch.progress : { current: 0, target: 0 };
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#95a5a6',
      rare: '#3498db',
      epic: '#9b59b6',
      legendary: '#f39c12',
    };
    return colors[rarity] || colors.common;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      workout: '💪',
      streak: '🔥',
      milestone: '🎯',
      goal: '🏆',
      special: '⭐',
    };
    return icons[category] || '🎖️';
  };

  const filteredAchievements = allAchievements.filter(achievement => {
    if (showUnlockedOnly && !isUnlocked(achievement._id)) return false;
    if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) return false;
    return true;
  });

  const unlockedCount = userAchievements.filter(ua => ua.isUnlocked).length;
  const totalPoints = userAchievements
    .filter(ua => ua.isUnlocked)
    .reduce((sum, ua) => sum + ua.achievement.points, 0);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>🏆 Achievements</h1>
        </div>
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>🏆 Achievements</h1>
      </div>

      {/* Stats Overview */}
      <div className="achievement-stats">
        <div className="achievement-stat-card">
          <FaTrophy className="achievement-stat-icon" />
          <div>
            <h3>{unlockedCount}/{allAchievements.length}</h3>
            <p>Achievements Unlocked</p>
          </div>
        </div>
        <div className="achievement-stat-card">
          <FaStar className="achievement-stat-icon" />
          <div>
            <h3>{totalPoints}</h3>
            <p>Total Points Earned</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="achievement-filters">
        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
            />
            Show Unlocked Only
          </label>
        </div>
        <div className="filter-group">
          <label>Rarity:</label>
          <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}>
            <option value="all">All</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => {
            const unlocked = isUnlocked(achievement._id);
            const progress = getProgress(achievement._id);
            const progressPercent = progress.target > 0 
              ? Math.min((progress.current / progress.target) * 100, 100) 
              : 0;

            return (
              <motion.div
                key={achievement._id}
                className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ borderColor: getRarityColor(achievement.rarity) }}
              >
                <div className="achievement-icon-container">
                  {unlocked ? (
                    <span className="achievement-icon">{achievement.icon}</span>
                  ) : (
                    <FaLock className="achievement-lock-icon" />
                  )}
                </div>
                <div className="achievement-content">
                  <div className="achievement-header">
                    <h3>{unlocked ? achievement.name : '???'}</h3>
                    <span 
                      className="achievement-rarity"
                      style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                    >
                      {achievement.rarity}
                    </span>
                  </div>
                  <p className="achievement-description">
                    {unlocked ? achievement.description : 'Complete requirements to unlock'}
                  </p>
                  <div className="achievement-footer">
                    <span className="achievement-category">
                      {getCategoryIcon(achievement.category)} {achievement.category}
                    </span>
                    <span className="achievement-points">+{achievement.points} pts</span>
                  </div>
                  {!unlocked && progress.target > 0 && (
                    <div className="achievement-progress">
                      <div className="achievement-progress-bar">
                        <motion.div
                          className="achievement-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                        />
                      </div>
                      <span className="achievement-progress-text">
                        {progress.current}/{progress.target}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Achievements;
