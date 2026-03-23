import React from 'react';

const ProgressCircle = ({ percentage }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-circle-container">
      <svg className="progress-circle-svg" width="150" height="150">
        <circle
          className="progress-bg"
          cx="75"
          cy="75"
          r={radius}
        />
        <circle
          className="progress-bar"
          cx="75"
          cy="75"
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <div className="progress-text">{percentage}%</div>
    </div>
  );
};

export default ProgressCircle;
