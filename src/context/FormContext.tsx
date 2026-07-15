import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FormValues {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  dob: string;
  isEmployed: 'yes' | 'no' | '';
  companyName: string;
  plan: 'arcade' | 'advanced' | 'pro';
  billingCycle: 'monthly' | 'yearly';
  addOns: string[];
  promoCode: string;
  promoDiscount: number;
}

export interface FormContextType {
  values: FormValues;
  errors: Record<string, string>;
  isValidatingEmail: boolean;
  isValidatingPromo: boolean;
  isSubmittingForm: boolean;
  theme: 'light' | 'dark';
  updateValues: (newValues: Partial<FormValues>) => void;
  setFieldError: (field: keyof FormValues | string, error: string | null) => void;
  validateStep1: () => boolean;
  checkEmailUniqueness: (email: string) => Promise<'available' | 'taken' | 'error'>;
  applyPromoCode: (code: string) => Promise<boolean>;
  submitForm: () => Promise<boolean>;
  toggleTheme: () => void;
  resetForm: () => void;
  isStepComplete: (step: number) => boolean;
}

const defaultValues: FormValues = {
  name: '',
  email: '',
  countryCode: '+1',
  phone: '',
  dob: '',
  isEmployed: '',
  companyName: '',
  plan: 'arcade',
  billingCycle: 'monthly',
  addOns: [],
  promoCode: '',
  promoDiscount: 0,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [values, setValues] = useState<FormValues>(() => {
    const saved = localStorage.getItem('multistep_form_data');
    if (saved) {
      try {
        return { ...defaultValues, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }
    return defaultValues;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('multistep_form_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('multistep_form_data', JSON.stringify(values));
  }, [values]);

  useEffect(() => {
    localStorage.setItem('multistep_form_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const updateValues = (newValues: Partial<FormValues>) => {
    setValues((prev) => {
      const updated = { ...prev, ...newValues };
      
      // If employee status changes from yes to no, clean up the companyName
      if (newValues.isEmployed === 'no') {
        updated.companyName = '';
      }
      return updated;
    });
  };

  const setFieldError = (field: keyof FormValues | string, error: string | null) => {
    setErrors((prev) => {
      const updated = { ...prev };
      if (error === null) {
        delete updated[field as string];
      } else {
        updated[field as string] = error;
      }
      return updated;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const resetForm = () => {
    setValues(defaultValues);
    setErrors({});
    localStorage.removeItem('multistep_form_data');
  };

  // Helper validation utilities
  const validateEmailString = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneString = (phone: string) => {
    const digits = phone.replace(/[\s\-\(\)]/g, '');
    return /^\d{7,15}$/.test(digits);
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateStep1 = (): boolean => {
    const tempErrors: Record<string, string> = {};

    if (!values.name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (values.name.trim().length < 3) {
      tempErrors.name = 'Name must be at least 3 characters';
    }

    if (!values.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!validateEmailString(values.email)) {
      tempErrors.email = 'Invalid email address';
    } else if (errors.email === 'This email is already in use') {
      tempErrors.email = 'This email is already in use';
    }

    if (!values.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!validatePhoneString(values.phone)) {
      tempErrors.phone = 'Phone number must be between 7 and 15 digits';
    }

    if (!values.dob) {
      tempErrors.dob = 'Date of birth is required';
    } else {
      const age = calculateAge(values.dob);
      if (isNaN(age) || age < 18) {
        tempErrors.dob = 'You must be at least 18 years old';
      }
    }

    if (!values.isEmployed) {
      tempErrors.isEmployed = 'Employment status is required';
    }

    if (values.isEmployed === 'yes') {
      if (!values.companyName.trim()) {
        tempErrors.companyName = 'Company name is required';
      } else if (values.companyName.trim().length < 2) {
        tempErrors.companyName = 'Company name must be at least 2 characters';
      }
    }

    setErrors((prev) => {
      const merged = { ...tempErrors };
      if (prev.promoCode) {
        merged.promoCode = prev.promoCode;
      }
      return merged;
    });

    return Object.keys(tempErrors).length === 0;
  };

  // Asynchronous Validation: Check email uniqueness against mock Express API
  const checkEmailUniqueness = async (email: string): Promise<'available' | 'taken' | 'error'> => {
    if (!validateEmailString(email)) return 'error';
    setIsValidatingEmail(true);

    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      setIsValidatingEmail(false);

      if (data.available === false) {
        setErrors((prev) => ({ ...prev, email: 'This email is already in use' }));
        return 'taken';
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          if (updated.email === 'This email is already in use' || updated.email === 'Error checking email availability') {
            delete updated.email;
          }
          return updated;
        });
        return 'available';
      }
    } catch (err) {
      setIsValidatingEmail(false);
      console.error('Failed to validate email uniqueness via API:', err);
      setErrors((prev) => ({ ...prev, email: 'Error checking email availability' }));
      return 'error';
    }
  };

  // Asynchronous Validation: Validate promo code against mock Express API
  const applyPromoCode = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.promoCode;
        return updated;
      });
      updateValues({ promoCode: '', promoDiscount: 0 });
      return true;
    }

    setIsValidatingPromo(true);

    try {
      const response = await fetch('/api/check-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      });

      const data = await response.json();
      setIsValidatingPromo(false);

      if (data.valid) {
        updateValues({ promoCode: cleanCode, promoDiscount: data.discount });
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.promoCode;
          return updated;
        });
        return true;
      } else {
        setErrors((prev) => ({ ...prev, promoCode: data.message || 'Invalid promo code' }));
        updateValues({ promoCode: '', promoDiscount: 0 });
        return false;
      }
    } catch (err) {
      setIsValidatingPromo(false);
      console.error('Failed to validate promo code via API:', err);
      setErrors((prev) => ({ ...prev, promoCode: 'Error validating promo code' }));
      return false;
    }
  };

  // Form Submission: POST to mock Express API
  const submitForm = async (): Promise<boolean> => {
    setIsSubmittingForm(true);
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setIsSubmittingForm(false);

      if (response.ok && data.success) {
        return true;
      } else {
        throw new Error(data.error || 'Server error during submission');
      }
    } catch (err: any) {
      setIsSubmittingForm(false);
      console.error('Failed to submit form to API:', err);
      throw new Error(err.message || 'Network error: Failed to reach submission server');
    }
  };

  // Determine if a step is complete and valid
  const isStepComplete = (step: number): boolean => {
    if (step === 1) {
      const nameOk = values.name.trim().length >= 3;
      const emailOk = validateEmailString(values.email) && 
                      errors.email !== 'This email is already in use' && 
                      errors.email !== 'Error checking email availability';
      const phoneOk = validatePhoneString(values.phone);
      const dobOk = values.dob !== '' && calculateAge(values.dob) >= 18;
      const employmentOk = values.isEmployed === 'no' || 
                           (values.isEmployed === 'yes' && values.companyName.trim().length >= 2);
      
      return nameOk && emailOk && phoneOk && dobOk && !!employmentOk;
    }
    if (step === 2) {
      return ['arcade', 'advanced', 'pro'].includes(values.plan);
    }
    if (step === 3) {
      return isStepComplete(1) && isStepComplete(2);
    }
    if (step === 4) {
      return isStepComplete(1) && isStepComplete(2) && isStepComplete(3);
    }
    return false;
  };

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        isValidatingEmail,
        isValidatingPromo,
        isSubmittingForm,
        theme,
        updateValues,
        setFieldError,
        validateStep1,
        checkEmailUniqueness,
        applyPromoCode,
        submitForm,
        toggleTheme,
        resetForm,
        isStepComplete,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
