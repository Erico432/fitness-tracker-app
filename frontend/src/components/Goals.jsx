import React, { useState, useEffect } from 'react';
import { getGoals, createGoal, updateGoal, updateGoalProgress, deleteGoal } from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingSkeleton from './LoadingSkeleton';
import ConfirmModal from './ConfirmModal';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaFlag } from 'react-icons/fa';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, goalId: null });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workout_frequency',
    targetValue: '',
    unit: 'workouts',
    targetDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await getGoals();
      setGoals(response.data);
      
      // Update progress for all active goals
      for (const goal of response.data) {
        if (goal.status === 'active') {
          await updateGoalProgress(goal._id);
        }
      }
      
      // Refresh after updates
      const updatedResponse = await getGoals();
      setGoals(updatedResponse.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await updateGoal(editingGoal._id, formData);
        toast.success('✅ Goal updated successfully!');
      } else {
        await createGoal(formData);
        toast.success('🎯 Goal created successfully!');
      }
      resetForm();
      fetchGoals();
    } catch (error) {
      toast.error('Failed to save goal');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      type: goal.type,
      targetValue: goal.targetValue,
      unit: goal.unit,
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      priority: goal.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(deleteModal.goalId);
      toast.success('Goal deleted successfully');
      setDeleteModal({ isOpen: false, goalId: null });
      fetchGoals();
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      type: 'workout_frequency',
      targetValue: '',
      unit: 'workouts',
      targetDate: '',
      priority: 'medium',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-set unit based on type
      if (name === 'type') {
        switch (value) {
          case 'workout_frequency':
            updated.unit = 'workouts';
            break;
          case 'weight_loss':
          case 'weight_gain':
            updated.unit = 'kg';
            break;
          case 'calories_burned':
            updated.unit = 'calories';
            break;
          case 'steps':
            updated.unit = 'steps';
            break;
          default:
            updated.unit = 'units';
        }
      }
      
      return updated;
    });
  };

  const getProgressPercent = (goal) => {
    return goal.targetValue > 0 ? Math.min((goal.currentValue / goal.targetValue) * 100, 100) : 0;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#95a5a6',
      medium: '#3498db',
      high: '#e74c3c',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Active', color: '#3498db' },
      completed: { text: 'Completed', color: '#27ae60' },
      failed: { text: 'Failed', color: '#e74c3c' },
      abandoned: { text: 'Abandoned', color: '#95a5a6' },
    };
    return badges[status] || badges.active;
  };

  const getDaysRemaining = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>🎯 My Goals</h1>
        </div>
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>🎯 My Goals</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <FaPlus /> Add Goal
        </button>
      </div>

      {/* Goal Stats */}
      <div className="goal-stats">
        <div className="goal-stat-item">
          <span className="goal-stat-value">{activeGoals.length}</span>
          <span className="goal-stat-label">Active Goals</span>
        </div>
        <div className="goal-stat-item">
          <span className="goal-stat-value">{completedGoals.length}</span>
          <span className="goal-stat-label">Completed</span>
        </div>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
  <>
    <div className="modal-overlay" onClick={resetForm}>
      <motion.div
        className="modal-content goal-form-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Goal Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Lose 5kg by Summer"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about your goal..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Goal Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="workout_frequency">Workout Frequency</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="calories_burned">Calories Burned</option>
                <option value="steps">Steps</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Target Value *</label>
              <input
                type="number"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                required
                min="1"
                placeholder="100"
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                placeholder="workouts, kg, steps, etc."
              />
            </div>

            <div className="form-group">
              <label>Target Date *</label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  </>
)}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="goals-section">
          <h2>Active Goals</h2>
          <div className="goals-grid">
            {activeGoals.map((goal, index) => {
              const progressPercent = getProgressPercent(goal);
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const statusBadge = getStatusBadge(goal.status);

              return (
                <motion.div
                  key={goal._id}
                  className="goal-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="goal-card-header">
                    <div>
                      <h3>{goal.title}</h3>
                      <span
                        className="goal-priority-badge"
                        style={{ backgroundColor: getPriorityColor(goal.priority) }}
                      >
                        {goal.priority} priority
                      </span>
                    </div>
                    <div className="goal-actions">
                      <button onClick={() => handleEdit(goal)} className="icon-btn">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, goalId: goal._id })}
                        className="icon-btn delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="goal-description">{goal.description}</p>
                  )}

                  <div className="goal-progress-section">
                    <div className="goal-progress-header">
                      <span className="goal-progress-text">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="goal-progress-percent">{progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="goal-progress-bar">
                      <motion.div
                        className="goal-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="goal-milestones">
                    {goal.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className={`milestone ${milestone.achieved ? 'achieved' : ''}`}
                        title={`${milestone.value} ${goal.unit}`}
                      >
                        {milestone.achieved ? <FaCheckCircle /> : <FaFlag />}
                      </div>
                    ))}
                  </div>

                  <div className="goal-footer">
                    <span className="goal-date">
                      {daysRemaining > 0
                        ? `${daysRemaining} days remaining`
                        : daysRemaining === 0
                        ? 'Due today'
                        : `${Math.abs(daysRemaining)} days overdue`}
                    </span>
                    <span
                      className="goal-status-badge"
                      style={{ backgroundColor: statusBadge.color }}
                    >
                      {statusBadge.text}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="goals-section">
          <h2>Completed Goals 🎉</h2>
          <div className="goals-grid">
            {completedGoals.map((goal, index) => (
              <motion.div
                key={goal._id}
                className="goal-card completed"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="goal-card-header">
                  <div>
                    <h3>{goal.title}</h3>
                    <span className="goal-completed-badge">✓ Completed</span>
                  </div>
                </div>
                <p className="goal-completed-text">
                  Achieved {goal.targetValue} {goal.unit} on{' '}
                  {new Date(goal.completedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>No Goals Yet</h3>
          <p>Set your first fitness goal and start your journey!</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Create Your First Goal
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, goalId: null })}
        onConfirm={handleDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
      />
    </motion.div>
  );
};

export default Goals;
