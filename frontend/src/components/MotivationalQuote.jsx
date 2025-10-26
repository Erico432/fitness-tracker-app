import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Take care of your body. It's the only place you have to live.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The groundwork of all happiness is health.",
  "A healthy outside starts from the inside.",
  "Health is wealth. Peace of mind is happiness. Yoga shows the way.",
  "Exercise is a celebration of what your body can do, not a punishment for what you ate.",
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <motion.div
      className="motivational-quote"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p>💡 "{quote}"</p>
    </motion.div>
  );
};

export default MotivationalQuote;
