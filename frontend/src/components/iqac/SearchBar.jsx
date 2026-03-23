import React from 'react';
import '../../styles/iqac_dashboard.css';

const SearchBar = ({ onSearch, onFilter, selectedDept }) => {
  return (
    <div className="controls-row anim-fade-in-up">
      <div className="search-bar-wrapper">
        <span className="search-icon-new">🔍</span>
        <input 
          type="text" 
          placeholder="Search for event name..." 
          className="search-input-new"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="filter-wrapper">
        <select 
          className="filter-select"
          value={selectedDept}
          onChange={(e) => onFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="CS">Computer Science</option>
          <option value="IT">Information Technology</option>
          <option value="AI-DS">AI & Data Science</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
