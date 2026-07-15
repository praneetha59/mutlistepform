import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useToast } from '../components/Toast';
import { useFocusOnMount } from '../hooks/useFocusOnMount';

export const Step4Summary: React.FC = () => {
  const navigate = useNavigate();
  const { 
    values, 
    errors, 
    updateValues, 
    applyPromoCode, 
    isValidatingPromo, 
    submitForm, 
    isSubmittingForm 
  } = useForm();
  const { showToast } = useToast();
  
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const [promoInput, setPromoInput] = useState(values.promoCode);

  const isYearly = values.billingCycle === 'yearly';

  // Constants
  const planPrices = {
    arcade: { name: 'Arcade', monthly: 9, yearly: 90 },
    advanced: { name: 'Advanced', monthly: 12, yearly: 120 },
    pro: { name: 'Pro', nameYearly: 'Pro', monthly: 15, yearly: 150 },
  };

  const addOnDetails: Record<string, { name: string; monthly: number; yearly: number }> = {
    online_service: { name: 'Online service', monthly: 1, yearly: 10 },
    larger_storage: { name: 'Larger storage', monthly: 2, yearly: 20 },
    customizable_profile: { name: 'Customizable profile', monthly: 2, yearly: 20 },
  };

  // Calculations
  const activePlan = planPrices[values.plan];
  const planPrice = isYearly ? activePlan.yearly : activePlan.monthly;
  const cycleSuffix = isYearly ? 'yr' : 'mo';
  const cycleFull = isYearly ? 'Yearly' : 'Monthly';

  const addOnsTotal = values.addOns.reduce((sum, id) => {
    const detail = addOnDetails[id];
    if (detail) {
      return sum + (isYearly ? detail.yearly : detail.monthly);
    }
    return sum;
  }, 0);

  const subtotal = planPrice + addOnsTotal;
  const discountAmount = Number((subtotal * values.promoDiscount).toFixed(2));
  const total = subtotal - discountAmount;

  const handleApplyPromo = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) {
      showToast('Please enter a coupon code.', 'error');
      return;
    }

    showToast('Validating coupon code...', 'info');
    const success = await applyPromoCode(promoInput);
    if (success) {
      showToast('Promo code applied successfully!', 'success');
    } else {
      showToast('Invalid promo code.', 'error');
    }
  };

  const handleRemovePromo = (e: React.MouseEvent) => {
    e.preventDefault();
    updateValues({ promoCode: '', promoDiscount: 0 });
    setPromoInput('');
    showToast('Promo code removed.', 'info');
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Submitting your order...', 'info');
    try {
      const result = await submitForm();
      if (result) {
        showToast('Form submitted successfully!', 'success');
        navigate('/success');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred during submission. Please try again.', 'error');
    }
  };

  return (
    <div className="step-page">
      <h1 ref={headingRef} className="step-heading">Finishing Up</h1>
      <p className="step-subheading">Double-check everything looks OK before confirming.</p>

      <form onSubmit={handleConfirm} className="step-form">
        <div className="summary-card">
          {/* Main Plan Row */}
          <div className="summary-plan-row">
            <div className="summary-plan-details">
              <span className="summary-plan-name">
                {activePlan.name} ({cycleFull})
              </span>
              <button 
                type="button" 
                onClick={() => navigate('/step2')} 
                className="summary-change-btn"
                aria-label="Change subscription plan"
              >
                Change
              </button>
            </div>
            <span className="summary-plan-price">
              ${planPrice}/{cycleSuffix}
            </span>
          </div>

          <hr className="summary-divider" />

          {/* Add-ons List */}
          {values.addOns.length === 0 ? (
            <div className="summary-addon-row empty-addons">
              <span>No add-ons selected</span>
            </div>
          ) : (
            <div className="summary-addons-list">
              {values.addOns.map((id) => {
                const detail = addOnDetails[id];
                if (!detail) return null;
                const priceVal = isYearly ? detail.yearly : detail.monthly;

                return (
                  <div key={id} className="summary-addon-row">
                    <span className="summary-addon-name">{detail.name}</span>
                    <span className="summary-addon-price">
                      +${priceVal}/{cycleSuffix}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Promo code line inside card if active */}
          {values.promoCode && (
            <>
              <hr className="summary-divider" />
              <div className="summary-addon-row promo-discount-row">
                <span className="summary-addon-name promo-tag">
                  Promo Code: <strong>{values.promoCode}</strong>
                  <button 
                    onClick={handleRemovePromo} 
                    className="promo-remove-btn"
                    aria-label="Remove promo code"
                  >
                    Remove
                  </button>
                </span>
                <span className="promo-discount-val">
                  -${discountAmount}/{cycleSuffix} (-{values.promoDiscount * 100}%)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Promo Code Input Box */}
        <div className="promo-code-box">
          <div className="promo-input-container">
            <label htmlFor="promo-input" className="sr-only">Promo Code</label>
            <input
              type="text"
              id="promo-input"
              placeholder="Promo code (e.g. SAVE10)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              disabled={isSubmittingForm || isValidatingPromo}
              className={errors.promoCode ? 'input-error' : ''}
              aria-invalid={!!errors.promoCode}
              aria-describedby={errors.promoCode ? 'promo-error' : undefined}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={isSubmittingForm || isValidatingPromo || !promoInput.trim()}
              className="btn btn-secondary promo-apply-btn"
            >
              {isValidatingPromo ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {errors.promoCode && (
            <span className="field-error" id="promo-error" role="alert">
              {errors.promoCode}
            </span>
          )}
          <small className="form-help-text">Try code: <strong>SAVE10</strong> (10% off) or <strong>SAVE20</strong> (20% off).</small>
        </div>

        {/* Total Calculation Row */}
        <div className="total-calculation-row">
          <span className="total-label">
            Total (per {isYearly ? 'year' : 'month'})
          </span>
          <span className="total-price-val">
            ${total}/{cycleSuffix}
          </span>
        </div>

        {/* Navigation Footer */}
        <div className="form-footer">
          <button 
            type="button" 
            onClick={() => navigate('/step3')} 
            className="btn btn-secondary"
            disabled={isSubmittingForm}
          >
            Go Back
          </button>
          <button 
            type="submit" 
            className="btn btn-confirm"
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step4Summary;
