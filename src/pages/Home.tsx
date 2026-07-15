import React from 'react';
import { Link } from 'react-router-dom';
import { useFocusOnMount } from '../hooks/useFocusOnMount';

export const Home: React.FC = () => {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className="home-page-content">
      <div className="home-hero-card">
        <h1 ref={headingRef} className="home-title">Welcome to Lorem Gaming</h1>
        <p className="home-description">
          Create your account today and unlock multiplayer access, premium custom profile styling, and 1TB of secure cloud save storage.
        </p>
        <div className="home-cta-wrapper">
          <Link to="/form/step1" className="btn btn-primary home-cta-btn">
            Start Registration Wizard &rarr;
          </Link>
        </div>
      </div>
      
      <div className="features-grid">
        <div className="feature-item">
          <span className="feature-icon" aria-hidden="true">🎮</span>
          <div className="feature-text">
            <h3>Flexible Plans</h3>
            <p>Choose from Arcade, Advanced, or Pro subscription tiers. Opt for yearly billing to save with 2 months free!</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon" aria-hidden="true">⚡</span>
          <div className="feature-text">
            <h3>Custom Add-Ons</h3>
            <p>Customize your gaming package with online play, expanded save storage, and personal profile themes.</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon" aria-hidden="true">♿</span>
          <div className="feature-text">
            <h3>Fully Accessible</h3>
            <p>Built with compliance for screen readers, accessible ARIA attributes, and keyboard navigation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
