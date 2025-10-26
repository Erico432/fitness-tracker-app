import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FaDumbbell, FaChartLine, FaHeartbeat, FaUser, FaTrophy, FaBullseye, FaClipboardList, FaCalendarAlt, FaFire } from 'react-icons/fa';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaDumbbell className="logo-icon" />
          <span className="logo-text">FitTracker</span>
        </Link>
        
        {user ? (
          <>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <FaChartLine className="nav-icon" />
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/workouts" className="nav-link">
                  <FaDumbbell className="nav-icon" />
                  <span className="nav-text">Workouts</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/templates" className="nav-link">
                  <FaClipboardList className="nav-icon" />
                  <span className="nav-text">Templates</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/calendar" className="nav-link">
                  <FaCalendarAlt className="nav-icon" />
                  <span className="nav-text">Calendar</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/goals" className="nav-link">
                  <FaBullseye className="nav-icon" />
                  <span className="nav-text">Goals</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/achievements" className="nav-link">
                  <FaTrophy className="nav-icon" />
                  <span className="nav-text">Achievements</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/streak" className="nav-link">
                  <FaFire className="nav-icon" />
                  <span className="nav-text">Streak</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/health-metrics" className="nav-link">
                  <FaHeartbeat className="nav-icon" />
                  <span className="nav-text">Health</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <FaUser className="nav-icon" />
                  <span className="nav-text">Profile</span>
                </Link>
              </li>
            </ul>
            
            <div className="nav-right">
              <ThemeToggle />
            </div>
          </>
        ) : (
          <>
            <div className="nav-spacer"></div>
            <div className="nav-right">
              <ThemeToggle />
              <Link to="/login" className="nav-link-login">Login</Link>
              <Link to="/register" className="nav-btn">Register</Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
