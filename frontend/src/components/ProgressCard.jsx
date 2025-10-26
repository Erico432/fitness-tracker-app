import React from 'react';
import { motion } from 'framer-motion';

const ProgressCard = ({ title, current, goal, unit, icon, color }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <motion.div 
      className="progress-card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="progress-header">
        <span className="progress-icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      <div className="progress-stats">
        <span className="progress-current">{current}</span>
        <span className="progress-goal">/ {goal} {unit}</span>
      </div>
      <div className="progress-bar-container">
        <motion.div
          className="progress-bar"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="progress-percentage">{percentage.toFixed(0)}% Complete</p>
    </motion.div>
  );
};

export default ProgressCard;
