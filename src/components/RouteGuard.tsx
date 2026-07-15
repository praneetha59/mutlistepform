import React from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';

interface RouteGuardProps {
  children: React.ReactNode;
  step: number;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, step }) => {
  const { isStepComplete } = useForm();

  // Step 1 is always accessible
  if (step === 1) {
    return <>{children}</>;
  }

  // Find the first incomplete step that precedes the target step
  for (let i = 1; i < step; i++) {
    if (!isStepComplete(i)) {
      return <Navigate to={`/form/step${i}`} replace />;
    }
  }

  return <>{children}</>;
};
export default RouteGuard;
