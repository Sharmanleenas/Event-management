import React from 'react';
import '../../styles/iqac_dashboard.css';

const EventCard = ({ event, onClick }) => {
  const { title, department, date, _id } = event;
  const firstLetter = title?.charAt(0) || 'E';
  
  // Format the date if it's available
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'No Date Set';

  return (
    <div className="event-card-new anim-fade-in-up" onClick={onClick}>
      <div className="card-top-accent"></div>
      <div className="event-card-body">
        <div className="card-meta">
          <span className="dept-badge-new">{department || 'CSE'}</span>
          <span className="event-date-new">📅 {formattedDate}</span>
        </div>
        <h3 className="event-card-title">{title}</h3>
        <div className="card-footer-new">
          <div className="event-avatar">{firstLetter}</div>
          <button className="btn-generate-premium" onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
