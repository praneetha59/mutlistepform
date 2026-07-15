import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Home from '../pages/Home';
import Step1PersonalDetails from '../pages/Step1PersonalDetails';
import Step2PlanSelection from '../pages/Step2PlanSelection';
import Step3AddOns from '../pages/Step3AddOns';
import Step4Summary from '../pages/Step4Summary';
import Step5Success from '../pages/Step5Success';
import NotFound from '../pages/NotFound';
import RouteGuard from '../components/RouteGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'form',
        children: [
          {
            index: true,
            element: <Navigate to="/form/step1" replace />,
          },
          {
            path: 'step1',
            element: (
              <RouteGuard step={1}>
                <Step1PersonalDetails />
              </RouteGuard>
            ),
          },
          {
            path: 'step2',
            element: (
              <RouteGuard step={2}>
                <Step2PlanSelection />
              </RouteGuard>
            ),
          },
          {
            path: 'step3',
            element: (
              <RouteGuard step={3}>
                <Step3AddOns />
              </RouteGuard>
            ),
          },
          {
            path: 'step4',
            element: (
              <RouteGuard step={4}>
                <Step4Summary />
              </RouteGuard>
            ),
          },
          {
            path: 'success',
            element: (
              <RouteGuard step={4}>
                <Step5Success />
              </RouteGuard>
            ),
          },
        ],
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);

export default router;
