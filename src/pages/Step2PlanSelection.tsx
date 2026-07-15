import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useToast } from '../components/Toast';
import { useFocusOnMount } from '../hooks/useFocusOnMount';

export const Step2PlanSelection: React.FC = () => {
  const navigate = useNavigate();
  const { values, updateValues } = useForm();
  const { showToast } = useToast();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  const handlePlanChange = (plan: 'arcade' | 'advanced' | 'pro') => {
    updateValues({ plan });
  };

  const handleBillingToggle = () => {
    const nextCycle = values.billingCycle === 'monthly' ? 'yearly' : 'monthly';
    updateValues({ billingCycle: nextCycle });
    showToast(`Switched billing to ${nextCycle}!`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.plan) {
      showToast('Please select a plan to proceed.', 'error');
      return;
    }
    navigate('/form/step3');
  };

  const plans = [
    {
      id: 'arcade' as const,
      name: 'Arcade',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#FF8F9F"/>
          <path d="M12.5 17.5C12.5 14.7386 14.7386 12.5 17.5 12.5H22.5C25.2614 12.5 27.5 14.7386 27.5 17.5V22.5C27.5 25.2614 25.2614 27.5 22.5 27.5H17.5C14.7386 27.5 12.5 25.2614 12.5 22.5V17.5Z" fill="white"/>
          <path d="M16 22H24V24H16V22ZM18 16H22V20H18V16Z" fill="#FF8F9F"/>
        </svg>
      ),
      priceMonthly: 9,
      priceYearly: 90,
    },
    {
      id: 'advanced' as const,
      name: 'Advanced',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#F9815C"/>
          <path d="M12.5 17.5C12.5 14.7386 14.7386 12.5 17.5 12.5H22.5C25.2614 12.5 27.5 14.7386 27.5 17.5V22.5C27.5 25.2614 25.2614 27.5 22.5 27.5H17.5C14.7386 27.5 12.5 25.2614 12.5 22.5V17.5Z" fill="white"/>
          <path d="M15 16H18V24H15V16ZM22 16H25V24H22V16ZM18 19H22V21H18V19Z" fill="#F9815C"/>
        </svg>
      ),
      priceMonthly: 12,
      priceYearly: 120,
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#473DFF"/>
          <path d="M12.5 17.5C12.5 14.7386 14.7386 12.5 17.5 12.5H22.5C25.2614 12.5 27.5 14.7386 27.5 17.5V22.5C27.5 25.2614 25.2614 27.5 22.5 27.5H17.5C14.7386 27.5 12.5 25.2614 12.5 22.5V17.5Z" fill="white"/>
          <path d="M15 16H25V18H15V16ZM15 22H25V24H15V22ZM17 19H23V21H17V19Z" fill="#473DFF"/>
        </svg>
      ),
      priceMonthly: 15,
      priceYearly: 150,
    },
  ];

  const isYearly = values.billingCycle === 'yearly';

  return (
    <div className="step-page">
      <h1 ref={headingRef} className="step-heading">Select Plan</h1>
      <p className="step-subheading">You have the option of monthly or yearly billing.</p>

      <form onSubmit={handleSubmit} className="step-form">
        {/* Plans Container */}
        <div className="plans-grid" role="radiogroup" aria-label="Subscription Plans">
          {plans.map((plan) => {
            const planChecked = values.plan === plan.id;
            const price = isYearly ? `$${plan.priceYearly}/yr` : `$${plan.priceMonthly}/mo`;

            return (
              <div key={plan.id} className="plan-card-wrapper">
                <input
                  type="radio"
                  id={`plan-${plan.id}`}
                  name="plan"
                  value={plan.id}
                  checked={planChecked}
                  onChange={() => handlePlanChange(plan.id)}
                  className="sr-only plan-radio"
                  aria-label={`${plan.name} plan - ${price}`}
                />
                <label 
                  htmlFor={`plan-${plan.id}`} 
                  className={`plan-card ${planChecked ? 'plan-card-selected' : ''}`}
                >
                  <span className="plan-icon">{plan.icon}</span>
                  <span className="plan-card-details">
                    <span className="plan-name">{plan.name}</span>
                    <span className="plan-price">{price}</span>
                    {isYearly && <span className="plan-promo">2 months free</span>}
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Toggle Switch Container */}
        <div className="toggle-container">
          <span 
            className={`toggle-label ${!isYearly ? 'active-cycle' : ''}`} 
            onClick={() => updateValues({ billingCycle: 'monthly' })}
          >
            Monthly
          </span>
          <button
            type="button"
            className="toggle-switch"
            role="switch"
            aria-checked={isYearly}
            aria-label="Billing cycle yearly"
            onClick={handleBillingToggle}
          >
            <span className={`toggle-slider ${isYearly ? 'toggle-slider-yearly' : ''}`}></span>
          </button>
          <span 
            className={`toggle-label ${isYearly ? 'active-cycle' : ''}`} 
            onClick={() => updateValues({ billingCycle: 'yearly' })}
          >
            Yearly
          </span>
        </div>

        {/* Footer Navigation */}
        <div className="form-footer">
          <button 
            type="button" 
            onClick={() => navigate('/form/step1')} 
            className="btn btn-secondary"
          >
            Go Back
          </button>
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2PlanSelection;
