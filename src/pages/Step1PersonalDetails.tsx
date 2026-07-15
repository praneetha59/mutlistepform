import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useToast } from '../components/Toast';
import { useFocusOnMount } from '../hooks/useFocusOnMount';

export const Step1PersonalDetails: React.FC = () => {
  const navigate = useNavigate();
  const { 
    values, 
    errors, 
    updateValues, 
    validateStep1, 
    checkEmailUniqueness, 
    isValidatingEmail, 
    setFieldError 
  } = useForm();
  const { showToast } = useToast();
  
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = async (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    validateStep1();

    // Trigger async uniqueness validation on blur if email is syntactically correct
    if (field === 'email' && values.email.trim() && !errors.email) {
      const isUnique = await checkEmailUniqueness(values.email);
      if (!isUnique) {
        showToast('This email is already registered!', 'error');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateValues({ [name]: value });
    
    if (errors[name]) {
      setFieldError(name, null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      dob: true,
      isEmployed: true,
      companyName: true,
    });

    const isSyncValid = validateStep1();
    if (!isSyncValid) {
      showToast('Please correct the errors in the form before proceeding.', 'error');
      // Focus on the first element with an error
      const firstErrorField = Object.keys(validateStep1() ? {} : errors)[0] || 'name';
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.focus();
      }
      return;
    }

    showToast('Checking email availability...', 'info');
    const emailCheckResult = await checkEmailUniqueness(values.email);
    if (emailCheckResult === 'error') {
      showToast('Failed to connect to the server for email verification.', 'error');
      return;
    }
    if (emailCheckResult === 'taken') {
      showToast('This email is already in use.', 'error');
      const emailInput = document.getElementsByName('email')[0];
      if (emailInput) {
        emailInput.focus();
      }
      return;
    }

    showToast('Personal details verified!', 'success');
    navigate('/form/step2');
  };

  const countries = [
    { code: '+1', name: 'US/CA (+1)' },
    { code: '+44', name: 'UK (+44)' },
    { code: '+91', name: 'IN (+91)' },
    { code: '+81', name: 'JP (+81)' },
    { code: '+61', name: 'AU (+61)' },
    { code: '+49', name: 'DE (+49)' },
    { code: '+33', name: 'FR (+33)' },
  ];

  return (
    <div className="step-page">
      <h1 ref={headingRef} className="step-heading">Personal Info</h1>
      <p className="step-subheading">Please provide your name, email address, phone number, and date of birth.</p>

      <form onSubmit={handleSubmit} className="step-form" noValidate>
        {/* Name Field */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="name-input">Name</label>
            {touched.name && errors.name && (
              <span className="field-error" id="name-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>
          <input
            type="text"
            id="name-input"
            name="name"
            placeholder="e.g. Stephen King"
            value={values.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            aria-required="true"
            aria-invalid={!!(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
            className={touched.name && errors.name ? 'input-error' : ''}
            disabled={isValidatingEmail}
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="email-input">Email Address</label>
            {touched.email && errors.email && (
              <span className="field-error" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          <div className="input-with-loader">
            <input
              type="email"
              id="email-input"
              name="email"
              placeholder="e.g. stephenking@lorem.com"
              value={values.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              aria-required="true"
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
              className={touched.email && errors.email ? 'input-error' : ''}
              disabled={isValidatingEmail}
            />
            {isValidatingEmail && (
              <span className="input-spinner" aria-label="Checking email uniqueness" role="status"></span>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="phone-input">Phone Number</label>
            {touched.phone && errors.phone && (
              <span className="field-error" id="phone-error" role="alert">
                {errors.phone}
              </span>
            )}
          </div>
          <div className="phone-input-row">
            <label htmlFor="country-code-select" className="sr-only">Country Code</label>
            <select
              id="country-code-select"
              name="countryCode"
              value={values.countryCode}
              onChange={handleChange}
              aria-label="Country Code"
              disabled={isValidatingEmail}
              className="country-select"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="tel"
              id="phone-input"
              name="phone"
              placeholder="e.g. 1234567890"
              value={values.phone}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              aria-required="true"
              aria-invalid={!!(touched.phone && errors.phone)}
              aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
              className={`phone-field-input ${touched.phone && errors.phone ? 'input-error' : ''}`}
              disabled={isValidatingEmail}
            />
          </div>
        </div>

        {/* Date of Birth Field */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="dob-input">Date of Birth</label>
            {touched.dob && errors.dob && (
              <span className="field-error" id="dob-error" role="alert">
                {errors.dob}
              </span>
            )}
          </div>
          <input
            type="date"
            id="dob-input"
            name="dob"
            value={values.dob}
            onChange={handleChange}
            onBlur={() => handleBlur('dob')}
            aria-required="true"
            aria-invalid={!!(touched.dob && errors.dob)}
            aria-describedby={touched.dob && errors.dob ? 'dob-error' : undefined}
            className={touched.dob && errors.dob ? 'input-error' : ''}
            disabled={isValidatingEmail}
          />
          <small className="form-help-text">You must be at least 18 years old to register.</small>
        </div>

        {/* Employment Status */}
        <div className="form-group" role="radiogroup" aria-labelledby="employment-legend">
          <div className="label-row">
            <span id="employment-legend" className="field-legend">Are you employed?</span>
            {touched.isEmployed && errors.isEmployed && (
              <span className="field-error" id="isEmployed-error" role="alert">
                {errors.isEmployed}
              </span>
            )}
          </div>
          <div className="employment-radio-row">
            <label className="radio-option">
              <input
                type="radio"
                name="isEmployed"
                value="yes"
                checked={values.isEmployed === 'yes'}
                onChange={handleChange}
                onBlur={() => handleBlur('isEmployed')}
                aria-invalid={!!(touched.isEmployed && errors.isEmployed)}
                aria-describedby={touched.isEmployed && errors.isEmployed ? 'isEmployed-error' : undefined}
                className="radio-input"
              />
              Yes
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="isEmployed"
                value="no"
                checked={values.isEmployed === 'no'}
                onChange={handleChange}
                onBlur={() => handleBlur('isEmployed')}
                aria-invalid={!!(touched.isEmployed && errors.isEmployed)}
                aria-describedby={touched.isEmployed && errors.isEmployed ? 'isEmployed-error' : undefined}
                className="radio-input"
              />
              No
            </label>
          </div>
        </div>

        {/* Conditional Company Name Field */}
        {values.isEmployed === 'yes' && (
          <div className="form-group conditional-field">
            <div className="label-row">
              <label htmlFor="company-input">Company Name</label>
              {touched.companyName && errors.companyName && (
                <span className="field-error" id="companyName-error" role="alert">
                  {errors.companyName}
                </span>
              )}
            </div>
            <input
              type="text"
              id="company-input"
              name="companyName"
              placeholder="e.g. Acme Corp"
              value={values.companyName}
              onChange={handleChange}
              onBlur={() => handleBlur('companyName')}
              aria-required="true"
              aria-invalid={!!(touched.companyName && errors.companyName)}
              aria-describedby={touched.companyName && errors.companyName ? 'companyName-error' : undefined}
              className={touched.companyName && errors.companyName ? 'input-error' : ''}
              disabled={isValidatingEmail}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-footer">
          <div></div> {/* Empty spacer to align next button to the right */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isValidatingEmail}
          >
            {isValidatingEmail ? 'Validating...' : 'Next Step'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1PersonalDetails;
