import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import { ToastProvider } from './components/Toast';
import { router } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <FormProvider>
        <RouterProvider router={router} />
      </FormProvider>
    </ToastProvider>
  );
};

export default App;
