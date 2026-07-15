import React from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from '../context/FormContext';

interface StepItem {
  number: number;
  label: string;
  title: string;
}

const steps: StepItem[] = [
  { number: 1, label: 'STEP 1', title: 'YOUR INFO' },
  { number: 2, label: 'STEP 2', title: 'SELECT PLAN' },
  { number: 3, label: 'STEP 3', title: 'ADD-ONS' },
  { number: 4, label: 'STEP 4', title: 'SUMMARY' },
];

export const Stepper: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme, isStepComplete } = useForm();
  
  // Determine current active step based on pathname
  let currentStep = 1;
  const path = location.pathname;
  if (path.includes('step2')) currentStep = 2;
  else if (path.includes('step3')) currentStep = 3;
  else if (path.includes('step4')) currentStep = 4;
  else if (path.includes('success')) currentStep = 4; // Maintain step 4 highlight

  return (
    <nav className="stepper-sidebar" aria-label="Form Progress">
      <ol className="stepper-list">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = isStepComplete(step.number) && currentStep > step.number;

          return (
            <li 
              key={step.number} 
              className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div 
                className="step-number" 
                aria-hidden="true"
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <div className="step-details">
                <span className="step-label">{step.label}</span>
                <span className="step-title">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="sidebar-footer">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn desktop-theme-toggle"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Stepper;
