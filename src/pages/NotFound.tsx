import React from 'react';
import { Link } from 'react-router-dom';
import { useFocusOnMount } from '../hooks/useFocusOnMount';

export const NotFound: React.FC = () => {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className="not-found-content">
      <div className="not-found-card">
        <div className="not-found-badge" aria-hidden="true">404</div>
        <h1 ref={headingRef} className="not-found-heading">Page Not Found</h1>
        <p className="not-found-text">
          Oops! The page you are looking for doesn't exist. It might have been moved or the URL is typed incorrectly.
        </p>
        <Link to="/" className="btn btn-primary not-found-home-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
