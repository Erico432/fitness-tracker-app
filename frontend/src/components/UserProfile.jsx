import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { toast } from 'react-toastify';
import { FaWeight, FaRuler, FaBirthdayCake, FaFlag, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    gender: user?.gender || 'male',
    fitnessGoal: user?.fitnessGoal || 'maintain_health',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const getBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return 'N/A';
  };

  const getBMICategory = (bmi) => {
    if (bmi === 'N/A') return { text: 'N/A', color: '#95a5a6' };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: 'Underweight', color: '#3498db' };
    if (bmiValue < 25) return { text: 'Normal', color: '#27ae60' };
    if (bmiValue < 30) return { text: 'Overweight', color: '#f39c12' };
    return { text: 'Obese', color: '#e74c3c' };
  };

  const bmi = getBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="page-container">
      <motion.div
        className="profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="profile-stat-item">
            <FaWeight className="profile-stat-icon" />
            <div>
              <p className="profile-stat-label">Weight</p>
              <p className="profile-stat-value">{formData.weight || 'N/A'} kg</p>
            </div>
          </div>
          <div className="profile-stat-item">
            <FaRuler className="profile-stat-icon" />
            <div>
              <p className="profile-stat-label">Height</p>
              <p className="profile-stat-value">{formData.height || 'N/A'} cm</p>
            </div>
          </div>
          <div className="profile-stat-item">
            <FaBirthdayCake className="profile-stat-icon" />
            <div>
              <p className="profile-stat-label">Age</p>
              <p className="profile-stat-value">{formData.age || 'N/A'} years</p>
            </div>
          </div>
          <div className="profile-stat-item">
            <FaFlag className="profile-stat-icon" />
            <div>
              <p className="profile-stat-label">BMI</p>
              <p className="profile-stat-value">
                {bmi}
                {bmi !== 'N/A' && (
                  <span className="bmi-category" style={{ color: bmiCategory.color }}>
                    {' '}({bmiCategory.text})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="profile-details-card">
          {!isEditing ? (
            <>
              <div className="profile-detail-row">
                <span className="profile-label">Gender:</span>
                <span className="profile-value">{formData.gender}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-label">Fitness Goal:</span>
                <span className="profile-value">
                  {formData.fitnessGoal?.replace('_', ' ')}
                </span>
              </div>
              <div className="profile-actions">
                <button onClick={() => setIsEditing(true)} className="btn-primary">
                  <FaEdit /> Edit Profile
                </button>
                <button onClick={handleLogout} className="btn-logout-profile">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fitness Goal</label>
                  <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintain_health">Maintain Health</option>
                    <option value="improve_endurance">Improve Endurance</option>
                  </select>
                </div>
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Information */}
        <div className="profile-account-info">
          <h3>Account Information</h3>
          <div className="account-info-grid">
            <div className="account-info-item">
              <span className="account-label">Email:</span>
              <span className="account-value">{user?.email}</span>
            </div>
            <div className="account-info-item">
              <span className="account-label">Member Since:</span>
              <span className="account-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
