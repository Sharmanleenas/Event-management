import React from 'react';

/**
 * Pill-style segmented toggle for Internal / External college type.
 * Shows auto-detect badge when SHC email is detected.
 */
const CollegeTypeToggle = ({ value, onChange, isAutoDetected, internalPrice, externalPrice }) => {
  if (isAutoDetected) {
    return (
      <div className="ct-auto-badge">
        <span className="ct-auto-pill">🎉 SHC Student — Auto Detected</span>
      </div>
    );
  }

  return (
    <div className="ct-toggle-wrap">
      <div className="ct-pill-toggle">
        <button
          type="button"
          className={`ct-pill ${value === 'internal' ? 'ct-active' : ''}`}
          onClick={() => onChange('internal')}
        >
          Internal · ₹{internalPrice}
        </button>
        <button
          type="button"
          className={`ct-pill ${value === 'external' ? 'ct-active' : ''}`}
          onClick={() => onChange('external')}
        >
          External · ₹{externalPrice}
        </button>
      </div>
      <p className="ct-helper">
        {value === 'internal'
          ? 'Internal students get discounted pricing 🎉'
          : 'Standard pricing for other college students'}
      </p>
    </div>
  );
};

export default CollegeTypeToggle;
