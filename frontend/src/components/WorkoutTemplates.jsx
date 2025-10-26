import React, { useState, useEffect } from 'react';
import { getTemplates, markTemplateAsUsed } from '../services/api'; // Changed useTemplate to markTemplateAsUsed
import { createWorkout } from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingSkeleton from './LoadingSkeleton';
import { FaDumbbell, FaFire, FaClock, FaChartLine } from 'react-icons/fa';

const WorkoutTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTemplate, setExpandedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDifficulty, selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const params = {};
      if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const response = await getTemplates(params);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      // Mark template as used
      await markTemplateAsUsed(template._id); // Changed from useTemplate

      // Create workout from template
      const workoutData = {
        exerciseName: template.name,
        category: template.category,
        duration: template.duration,
        caloriesBurned: template.estimatedCalories,
        intensity: template.difficulty === 'beginner' ? 'low' : template.difficulty === 'intermediate' ? 'moderate' : 'high',
        notes: `From template: ${template.description}`,
        date: new Date(),
      };

      await createWorkout(workoutData);
      toast.success(`🎯 Workout "${template.name}" added successfully!`);
    } catch (error) {
      toast.error('Failed to use template');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#27ae60',
      intermediate: '#f39c12',
      advanced: '#e74c3c',
    };
    return colors[difficulty] || colors.beginner;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      cardio: '🏃',
      strength: '💪',
      flexibility: '🧘',
      sports: '⚽',
      mixed: '🔀',
    };
    return icons[category] || '🏋️';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>📋 Workout Templates</h1>
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
        <h1>📋 Workout Templates</h1>
      </div>

      <p className="page-subtitle">
        Choose from pre-designed workout programs or use them as inspiration for your fitness journey
      </p>

      {/* Filters */}
      <div className="template-filters">
        <div className="filter-group">
          <label>Difficulty:</label>
          <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {templates.map((template, index) => (
          <motion.div
            key={template._id}
            className="template-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="template-header">
              <div className="template-title-section">
                <span className="template-category-icon">
                  {getCategoryIcon(template.category)}
                </span>
                <h3>{template.name}</h3>
              </div>
              <span
                className="template-difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(template.difficulty) }}
              >
                {template.difficulty}
              </span>
            </div>

            <p className="template-description">{template.description}</p>

            <div className="template-stats">
              <div className="template-stat">
                <FaClock />
                <span>{template.duration} min</span>
              </div>
              <div className="template-stat">
                <FaFire />
                <span>~{template.estimatedCalories} cal</span>
              </div>
              <div className="template-stat">
                <FaChartLine />
                <span>{template.usageCount} uses</span>
              </div>
            </div>

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <div className="template-tags">
                {template.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="template-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Exercises Preview */}
            {expandedTemplate === template._id && template.exercises && (
              <motion.div
                className="template-exercises"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <h4>Exercises:</h4>
                <ul>
                  {template.exercises.map((exercise, idx) => (
                    <li key={idx}>
                      <strong>{exercise.name}</strong>
                      {exercise.sets && ` - ${exercise.sets} sets`}
                      {exercise.reps && ` × ${exercise.reps}`}
                      {exercise.duration && ` - ${exercise.duration}s`}
                      {exercise.notes && <span className="exercise-note"> ({exercise.notes})</span>}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <div className="template-actions">
              <button
                onClick={() =>
                  setExpandedTemplate(expandedTemplate === template._id ? null : template._id)
                }
                className="btn-secondary"
              >
                {expandedTemplate === template._id ? 'Hide Details' : 'View Details'}
              </button>
              <button onClick={() => handleUseTemplate(template)} className="btn-primary">
                <FaDumbbell /> Use Template
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No Templates Found</h3>
          <p>Try adjusting your filters to see more workout templates</p>
        </div>
      )}
    </motion.div>
  );
};

export default WorkoutTemplates;
