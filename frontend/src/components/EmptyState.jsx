import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, message, actionText, onAction }) => {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
