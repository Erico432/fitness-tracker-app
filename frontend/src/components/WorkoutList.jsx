import React, { useState, useEffect } from 'react';
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout, updateStreak, checkAchievements } from '../services/api'; // Add updateStreak and checkAchievements
import WorkoutForm from './WorkoutForm';
import SearchFilter from './SearchFilter';
import ConfirmModal from './ConfirmModal';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [editModal, setEditModal] = useState({ isOpen: false, workout: null });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, workoutId: null });

  const categories = [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workouts, searchTerm, filterCategory]);

  const fetchWorkouts = async () => {
    try {
      const response = await getWorkouts();
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Error loading workouts');
    } finally {
      setLoading(false);
    }
  };

  const filterWorkouts = () => {
    let filtered = [...workouts];

    if (searchTerm) {
      filtered = filtered.filter(workout =>
        workout.exerciseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(workout => workout.category === filterCategory);
    }

    setFilteredWorkouts(filtered);
  };

  const handleCreateWorkout = async (workoutData) => {
    try {
      await createWorkout(workoutData);
      
      // Update streak after workout
      await updateStreak();
      
      // Check for new achievements
      await checkAchievements();
      
      toast.success('🎉 Workout added successfully!');
      setShowForm(false);
      fetchWorkouts();
    } catch (error) {
      toast.error('Error creating workout');
    }
  };

  const handleUpdateWorkout = async (workoutData) => {
    try {
      await updateWorkout(editModal.workout._id, workoutData);
      toast.success('✅ Workout updated successfully!');
      fetchWorkouts();
    } catch (error) {
      toast.error('Error updating workout');
    }
  };

  const handleDeleteWorkout = async () => {
    try {
      await deleteWorkout(deleteModal.workoutId);
      toast.success('🗑️ Workout deleted successfully!');
      setDeleteModal({ isOpen: false, workoutId: null });
      fetchWorkouts();
    } catch (error) {
      toast.error('Error deleting workout');
    }
  };

  const handleEditClick = (workout) => {
    setEditModal({
      isOpen: true,
      workout: {
        ...workout,
        date: new Date(workout.date).toISOString().split('T')[0],
      }
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>💪 My Workouts</h1>
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
        <h1>💪 My Workouts</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Workout'}
        </button>
      </div>

      {showForm && (
        <motion.div 
          className="form-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h3>Add New Workout</h3>
          <WorkoutForm
            onSubmit={handleCreateWorkout}
            onCancel={() => setShowForm(false)}
          />
        </motion.div>
      )}

      {editModal.isOpen && (
        <div className="modal-overlay" onClick={() => setEditModal({ isOpen: false, workout: null })}>
          <motion.div
            className="modal-content workout-form-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Workout</h3>
            <WorkoutForm
              onSubmit={(workoutData) => {
                handleUpdateWorkout(workoutData);
                setEditModal({ isOpen: false, workout: null });
              }}
              initialData={editModal.workout}
              onCancel={() => setEditModal({ isOpen: false, workout: null })}
            />
          </motion.div>
        </div>
      )}

      {workouts.length > 0 && (
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
        />
      )}

      {filteredWorkouts.length > 0 ? (
        <div className="workout-grid">
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout._id}
              className="workout-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="workout-card-header">
                <h3>{workout.exerciseName}</h3>
                <span className={`intensity-badge ${workout.intensity}`}>
                  {workout.intensity}
                </span>
              </div>
              <div className="workout-card-body">
                <p><strong>Category:</strong> {workout.category}</p>
                <p><strong>Duration:</strong> {workout.duration} minutes</p>
                <p><strong>Calories:</strong> {workout.caloriesBurned} cal</p>
                <p><strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}</p>
                {workout.notes && <p><strong>Notes:</strong> {workout.notes}</p>}
              </div>
              <div className="workout-card-actions">
                <button onClick={() => handleEditClick(workout)} className="btn-edit">
                  Edit
                </button>
                <button 
                  onClick={() => setDeleteModal({ isOpen: true, workoutId: workout._id })} 
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : workouts.length === 0 ? (
        <EmptyState
          icon="🏃"
          title="No Workouts Yet"
          message="Start your fitness journey by adding your first workout!"
          actionText="Add Your First Workout"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <EmptyState
          icon="🔍"
          title="No Results Found"
          message="Try adjusting your search or filter criteria."
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, workoutId: null })}
        onConfirm={handleDeleteWorkout}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
      />
    </motion.div>
  );
};

export default WorkoutList;
