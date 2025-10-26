import React, { useState } from 'react';

const WorkoutForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      exerciseName: '',
      category: 'cardio',
      duration: '',
      caloriesBurned: '',
      intensity: 'moderate',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <div className="form-row">
        <div className="form-group">
          <label>Exercise Name *</label>
          <input
            type="text"
            name="exerciseName"
            value={formData.exerciseName}
            onChange={handleChange}
            required
            placeholder="e.g., Morning Run"
          />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Duration (minutes) *</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
            placeholder="30"
          />
        </div>
        <div className="form-group">
          <label>Calories Burned *</label>
          <input
            type="number"
            name="caloriesBurned"
            value={formData.caloriesBurned}
            onChange={handleChange}
            required
            min="0"
            placeholder="200"
          />
        </div>
        <div className="form-group">
          <label>Intensity *</label>
          <select name="intensity" value={formData.intensity} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Date *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="How did you feel during this workout?"
          rows="3"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn-primary">
          {initialData ? 'Update Workout' : 'Add Workout'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default WorkoutForm;
