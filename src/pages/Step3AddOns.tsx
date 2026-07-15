import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useFocusOnMount } from '../hooks/useFocusOnMount';

export const Step3AddOns: React.FC = () => {
  const navigate = useNavigate();
  const { values, updateValues } = useForm();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  const isYearly = values.billingCycle === 'yearly';

  const addOnsList = [
    {
      id: 'online_service',
      name: 'Online service',
      description: 'Access to multiplayer games',
      priceMonthly: 1,
      priceYearly: 10,
    },
    {
      id: 'larger_storage',
      name: 'Larger storage',
      description: 'Extra 1TB of cloud save',
      priceMonthly: 2,
      priceYearly: 20,
    },
    {
      id: 'customizable_profile',
      name: 'Customizable profile',
      description: 'Custom theme on your profile',
      priceMonthly: 2,
      priceYearly: 20,
    },
  ];

  const handleAddOnToggle = (id: string) => {
    const isSelected = values.addOns.includes(id);
    let nextAddOns = [...values.addOns];
    if (isSelected) {
      nextAddOns = nextAddOns.filter((item) => item !== id);
    } else {
      nextAddOns.push(id);
    }
    updateValues({ addOns: nextAddOns });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/form/step4');
  };

  return (
    <div className="step-page">
      <h1 ref={headingRef} className="step-heading">Pick Add-ons</h1>
      <p className="step-subheading">Add-ons help enhance your gaming experience.</p>

      <form onSubmit={handleSubmit} className="step-form">
        <div className="addons-list" role="group" aria-label="Add-ons Choices">
          {addOnsList.map((addon) => {
            const isChecked = values.addOns.includes(addon.id);
            const price = isYearly ? `+$${addon.priceYearly}/yr` : `+$${addon.priceMonthly}/mo`;

            return (
              <div key={addon.id} className="addon-card-wrapper">
                <input
                  type="checkbox"
                  id={`addon-${addon.id}`}
                  name="addOns"
                  value={addon.id}
                  checked={isChecked}
                  onChange={() => handleAddOnToggle(addon.id)}
                  className="sr-only addon-checkbox"
                  aria-label={`${addon.name} - ${addon.description} - ${price}`}
                />
                <label 
                  htmlFor={`addon-${addon.id}`}
                  className={`addon-card ${isChecked ? 'addon-card-selected' : ''}`}
                >
                  <div className="addon-checkbox-visual" aria-hidden="true">
                    {isChecked && (
                      <svg viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4.5L4.5 8L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="addon-card-details">
                    <span className="addon-name">{addon.name}</span>
                    <span className="addon-description">{addon.description}</span>
                  </div>
                  <span className="addon-price">{price}</span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="form-footer">
          <button 
            type="button" 
            onClick={() => navigate('/form/step2')} 
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

export default Step3AddOns;
