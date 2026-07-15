import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Stepper from './Stepper';
import { useForm } from '../context/FormContext';
import ErrorBoundary from './ErrorBoundary';
import { ToastContainer } from './Toast';

export const MainLayout: React.FC = () => {
  const { theme, toggleTheme } = useForm();
  const location = useLocation();

  // Check if current route is part of the multi-step form wizard
  const isFormRoute = location.pathname.startsWith('/form');

  return (
    <ErrorBoundary>
      <div className={`app-container ${theme}`}>
        {/* Global Navigation Header */}
        <header className="global-navbar">
          <nav className="nav-container" aria-label="Global Navigation">
            <Link to="/" className="nav-logo">
              <span>🎮 Lorem Gaming</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}>
                Home
              </Link>
              <Link to="/form/step1" className={`nav-link ${isFormRoute ? 'nav-active' : ''}`}>
                Register
              </Link>
              <button 
                onClick={toggleTheme} 
                className="theme-toggle-nav-btn"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </nav>
        </header>

        {/* Page Content Layout */}
        <div className="main-content-wrapper">
          {isFormRoute ? (
            // Form wizard container
            <main className="form-card">
              <Stepper />
              <div className="step-content-container">
                <div className="outlet-scroll-wrapper">
                  <Outlet />
                </div>
              </div>
            </main>
          ) : (
            // Simple landing / 404 container
            <main className="landing-card">
              <Outlet />
            </main>
          )}
        </div>
        
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
