import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider } from '../context/FormContext';
import { ToastProvider } from '../components/Toast';
import Step1PersonalDetails from '../pages/Step1PersonalDetails';
import Step2PlanSelection from '../pages/Step2PlanSelection';
import Step4Summary from '../pages/Step4Summary';
import { MemoryRouter } from 'react-router-dom';

describe('MultiStepForm Personal Details Step', () => {
  it('shows error messages on invalid input values', async () => {
    render(
      <ToastProvider>
        <FormProvider>
          <MemoryRouter initialEntries={['/form/step1']}>
            <Step1PersonalDetails />
          </MemoryRouter>
        </FormProvider>
      </ToastProvider>
    );

    // Submit form empty
    const nextBtn = screen.getByText('Next Step');
    fireEvent.click(nextBtn);

    // Errors should appear
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email address is required')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
    expect(screen.getByText('Employment status is required')).toBeInTheDocument();
  });

  it('renders company name field conditionally based on employment status selection', async () => {
    render(
      <ToastProvider>
        <FormProvider>
          <MemoryRouter initialEntries={['/form/step1']}>
            <Step1PersonalDetails />
          </MemoryRouter>
        </FormProvider>
      </ToastProvider>
    );

    // By default, company name should not be in the document
    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument();

    // Select "No" for employed
    const noRadio = screen.getByLabelText('No');
    fireEvent.click(noRadio);
    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument();

    // Select "Yes" for employed
    const yesRadio = screen.getByLabelText('Yes');
    fireEvent.click(yesRadio);

    // Now company name input should appear
    const companyInput = await screen.findByLabelText('Company Name');
    expect(companyInput).toBeInTheDocument();

    // If we submit now without company name, error should appear
    const nextBtn = screen.getByText('Next Step');
    fireEvent.click(nextBtn);
    expect(await screen.findByText('Company name is required')).toBeInTheDocument();

    // Enter company name under 2 chars
    fireEvent.change(companyInput, { target: { value: 'A' } });
    fireEvent.click(nextBtn);
    expect(await screen.findByText('Company name must be at least 2 characters')).toBeInTheDocument();

    // Enter valid company name
    fireEvent.change(companyInput, { target: { value: 'Acme Corp' } });
    fireEvent.click(nextBtn);
    expect(screen.queryByText('Company name must be at least 2 characters')).not.toBeInTheDocument();
  });

  it('validates under 18 years old date of birth', async () => {
    render(
      <ToastProvider>
        <FormProvider>
          <MemoryRouter initialEntries={['/form/step1']}>
            <Step1PersonalDetails />
          </MemoryRouter>
        </FormProvider>
      </ToastProvider>
    );

    // Enter name
    fireEvent.change(screen.getByPlaceholderText('e.g. Stephen King'), { target: { value: 'Stephen' } });
    // Enter email
    fireEvent.change(screen.getByPlaceholderText('e.g. stephenking@lorem.com'), { target: { value: 'valid@example.com' } });
    // Enter phone
    fireEvent.change(screen.getByPlaceholderText('e.g. 1234567890'), { target: { value: '1234567890' } });
    // Enter DoB (under 18)
    const today = new Date();
    const currentYear = today.getFullYear();
    const dobValue = `${currentYear - 10}-01-01`; // 10 years old
    fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: dobValue } });
    // Select No for employed to bypass company name validation
    fireEvent.click(screen.getByLabelText('No'));

    // Click next
    const nextBtn = screen.getByText('Next Step');
    fireEvent.click(nextBtn);

    // Errors should appear
    expect(await screen.findByText('You must be at least 18 years old')).toBeInTheDocument();
  });

  it('validates async email uniqueness via mocked fetch', async () => {
    render(
      <ToastProvider>
        <FormProvider>
          <MemoryRouter initialEntries={['/form/step1']}>
            <Step1PersonalDetails />
          </MemoryRouter>
        </FormProvider>
      </ToastProvider>
    );

    // Fill valid sync info but registered email
    fireEvent.change(screen.getByPlaceholderText('e.g. Stephen King'), { target: { value: 'Stephen' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. stephenking@lorem.com'), { target: { value: 'taken@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 1234567890'), { target: { value: '1234567890' } });
    
    const adultDob = '2000-01-01';
    fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: adultDob } });
    fireEvent.click(screen.getByLabelText('No'));

    // Click next
    const nextBtn = screen.getByText('Next Step');
    fireEvent.click(nextBtn);

    // Wait for async validation error to appear
    await waitFor(() => {
      expect(screen.getByText('This email is already in use')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

describe('MultiStepForm Plan Selection Step', () => {
  it('allows plan selection and cycles toggle', () => {
    render(
      <ToastProvider>
        <FormProvider>
          <MemoryRouter initialEntries={['/form/step2']}>
            <Step2PlanSelection />
          </MemoryRouter>
        </FormProvider>
      </ToastProvider>
    );

    // Arcade is default plan
    const arcadeCard = screen.getByLabelText(/Arcade plan/);
    expect(arcadeCard).toBeChecked();

    // Toggle yearly
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});

describe('MultiStepForm Summary Step', () => {
  it('validates async promo codes', async () => {
    render(
      <ToastProvider>
        <FormProvider>
          <MemoryRouter initialEntries={['/form/step4']}>
            <Step4Summary />
          </MemoryRouter>
        </FormProvider>
      </ToastProvider>
    );

    const promoInput = screen.getByPlaceholderText('Promo code (e.g. SAVE10)');
    const applyBtn = screen.getByText('Apply');

    // Invalid promo
    fireEvent.change(promoInput, { target: { value: 'INVALID' } });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid promo code')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Valid promo
    fireEvent.change(promoInput, { target: { value: 'SAVE10' } });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(screen.queryByText('Invalid promo code')).not.toBeInTheDocument();
      expect(screen.getByText('Remove')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
