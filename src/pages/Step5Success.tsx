import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useFocusOnMount } from '../hooks/useFocusOnMount';

export const Step5Success: React.FC = () => {
  const navigate = useNavigate();
  const { resetForm } = useForm();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  // Clear data on mount
  useEffect(() => {
    resetForm();
  }, []);

  const handleRestart = () => {
    navigate('/form/step1');
  };

  return (
    <div className="step-page success-page-content">
      <div className="success-icon-wrapper" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="40" fill="#FFEAEB" />
          <circle cx="40" cy="40" r="32" fill="#FF8F9F" />
          <path 
            d="M28 40L36 48L52 32" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="checkmark-path"
          />
        </svg>
      </div>

      <h1 ref={headingRef} className="step-heading success-heading">Thank you!</h1>
      
      <p className="success-text">
        Thanks for confirming your subscription! We hope you have fun using our platform. If you ever need support, 
        please feel free to email us at <a href="mailto:support@loremgaming.com" className="support-link">support@loremgaming.com</a>.
      </p>

      <button 
        onClick={handleRestart}
        className="btn btn-primary restart-btn"
      >
        Restart Demo
      </button>
    </div>
  );
};

export default Step5Success;
