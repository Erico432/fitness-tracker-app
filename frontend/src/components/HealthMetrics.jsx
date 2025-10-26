import React, { useState, useEffect } from 'react';
import { getHealthMetrics, createHealthMetric, deleteHealthMetric } from '../services/api';

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    steps: '',
    sleepHours: '',
    waterIntake: '',
    weight: '',
    heartRate: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await getHealthMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHealthMetric(formData);
      setMessage('Health metrics added successfully!');
      setShowForm(false);
      setFormData({
        steps: '',
        sleepHours: '',
        waterIntake: '',
        weight: '',
        heartRate: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchMetrics();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding health metrics');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteHealthMetric(id);
        setMessage('Record deleted successfully!');
        fetchMetrics();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting record');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading health metrics...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Health Metrics</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Metrics'}
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {showForm && (
        <div className="form-card">
          <h3>Record Today's Health Metrics</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Steps</label>
                <input
                  type="number"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  min="0"
                  placeholder="10000"
                />
              </div>
              <div className="form-group">
                <label>Sleep (hours)</label>
                <input
                  type="number"
                  name="sleepHours"
                  value={formData.sleepHours}
                  onChange={handleChange}
                  min="0"
                  max="24"
                  step="0.5"
                  placeholder="7.5"
                />
              </div>
              <div className="form-group">
                <label>Water (liters)</label>
                <input
                  type="number"
                  name="waterIntake"
                  value={formData.waterIntake}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="2.5"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="70.5"
                />
              </div>
              <div className="form-group">
                <label>Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  min="30"
                  max="250"
                  placeholder="72"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">Save Metrics</button>
          </form>
        </div>
      )}

      <div className="metrics-grid">
        {metrics.length > 0 ? (
          metrics.map((metric) => (
            <div key={metric._id} className="metric-card">
              <div className="metric-card-header">
                <h3>{new Date(metric.date).toLocaleDateString()}</h3>
                <button onClick={() => handleDelete(metric._id)} className="btn-delete-small">
                  ×
                </button>
              </div>
              <div className="metric-items">
                {metric.steps > 0 && (
                  <div className="metric-item">
                    <span className="metric-icon">👣</span>
                    <div>
                      <p className="metric-label">Steps</p>
                      <p className="metric-value">{metric.steps.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {metric.sleepHours > 0 && (
                  <div className="metric-item">
                    <span className="metric-icon">😴</span>
                    <div>
                      <p className="metric-label">Sleep</p>
                      <p className="metric-value">{metric.sleepHours} hrs</p>
                    </div>
                  </div>
                )}
                {metric.waterIntake > 0 && (
                  <div className="metric-item">
                    <span className="metric-icon">💧</span>
                    <div>
                      <p className="metric-label">Water</p>
                      <p className="metric-value">{metric.waterIntake} L</p>
                    </div>
                  </div>
                )}
                {metric.weight > 0 && (
                  <div className="metric-item">
                    <span className="metric-icon">⚖️</span>
                    <div>
                      <p className="metric-label">Weight</p>
                      <p className="metric-value">{metric.weight} kg</p>
                    </div>
                  </div>
                )}
                {metric.heartRate > 0 && (
                  <div className="metric-item">
                    <span className="metric-icon">❤️</span>
                    <div>
                      <p className="metric-label">Heart Rate</p>
                      <p className="metric-value">{metric.heartRate} bpm</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-card">
            <p>No health metrics recorded yet. Start tracking your health data!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMetrics;
