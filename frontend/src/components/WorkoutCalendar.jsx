import React, { useState, useEffect } from 'react';
import { getWorkouts } from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const WorkoutCalendar = () => {
  const [workouts, setWorkouts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await getWorkouts();
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getWorkoutsForDate = (date) => {
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getDate() === date.getDate() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = [];
  // Empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayWorkouts = getWorkoutsForDate(date);
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();
    const isSelected =
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();

    days.push(
      <motion.div
        key={day}
        className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${
          dayWorkouts.length > 0 ? 'has-workout' : ''
        }`}
        whileHover={{ scale: 1.05 }}
        onClick={() => setSelectedDate(dayWorkouts.length > 0 ? date : null)}
      >
        <span className="calendar-day-number">{day}</span>
        {dayWorkouts.length > 0 && (
          <div className="calendar-day-indicator">
            <span className="workout-count">{dayWorkouts.length}</span>
          </div>
        )}
      </motion.div>
    );
  }

  const selectedDayWorkouts = selectedDate ? getWorkoutsForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>📅 Workout Calendar</h1>
        </div>
        <p>Loading calendar...</p>
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
        <h1>📅 Workout Calendar</h1>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="calendar-nav-btn">
            <FaChevronLeft />
          </button>
          <h2>{monthName}</h2>
          <button onClick={handleNextMonth} className="calendar-nav-btn">
            <FaChevronRight />
          </button>
        </div>

        <button onClick={handleToday} className="btn-secondary calendar-today-btn">
          Today
        </button>

        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">{days}</div>

        {/* Selected Date Workouts */}
        {selectedDate && selectedDayWorkouts.length > 0 && (
          <motion.div
            className="calendar-selected-day"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>
              Workouts on {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="calendar-workout-list">
              {selectedDayWorkouts.map(workout => (
                <div key={workout._id} className="calendar-workout-item">
                  <div className="calendar-workout-header">
                    <h4>{workout.exerciseName}</h4>
                    <span className={`intensity-badge ${workout.intensity}`}>
                      {workout.intensity}
                    </span>
                  </div>
                  <div className="calendar-workout-details">
                    <span>🏃 {workout.category}</span>
                    <span>⏱️ {workout.duration} min</span>
                    <span>🔥 {workout.caloriesBurned} cal</span>
                  </div>
                  {workout.notes && <p className="calendar-workout-notes">{workout.notes}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="calendar-legend">
          <div className="calendar-legend-item">
            <div className="legend-dot today"></div>
            <span>Today</span>
          </div>
          <div className="calendar-legend-item">
            <div className="legend-dot has-workout"></div>
            <span>Has Workout</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkoutCalendar;
