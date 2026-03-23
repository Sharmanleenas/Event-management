import React from 'react';

const SectionBlock = ({ label, children }) => (
  <div className="section-block anim-fade-in">
    <label className="section-label">{label}</label>
    <div className="section-content">
      {children}
    </div>
  </div>
);

export default SectionBlock;
