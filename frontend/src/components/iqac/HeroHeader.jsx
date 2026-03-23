import React from 'react';
import '../../styles/iqac_dashboard.css';

const HeroHeader = () => {
  return (
    <div className="hero-header anim-fade-in-up">
      <div className="hero-content">
        <h1 className="hero-title">IQAC Report Dashboard</h1>
        <p className="hero-subtitle">
          Generate structured academic reports for institutional compliance. 
          Streamline your documentation with our high-end report engine.
        </p>
      </div>
      <div className="hero-illustration">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#800020' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default HeroHeader;
