import React from 'react';
import '../../styles/staff-dashboard.css';

const getStatusClass = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'IN_PROGRESS': return 'in-progress';
    case 'COMPLETED':   return 'completed';
    case 'SUBMITTED':   return 'submitted';
    default:            return 'pending';
  }
};

const getStatusLabel = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'IN_PROGRESS': return '● In Progress';
    case 'COMPLETED':   return '✓ Completed';
    case 'SUBMITTED':   return '↑ Submitted';
    default:            return '○ Pending';
  }
};

const getDocProgress = (documents = {}) => {
  const docTypes = ['invitation', 'profile', 'attendance', 'feedback', 'photos'];
  const uploaded = docTypes.filter(d => documents[d]).length;
  return { uploaded, total: docTypes.length, pct: Math.round((uploaded / docTypes.length) * 100) };
};

const EventCard = ({ event, onClick }) => {
  const { uploaded, total, pct } = getDocProgress(event.documents);

  return (
    <div className="sev-card" onClick={onClick}>
      {/* Top Row */}
      <div className="sev-card-top">
        <h4 className="sev-title">{event.title}</h4>
        <span className={`sev-status ${getStatusClass(event.staffStatus)}`}>
          {getStatusLabel(event.staffStatus)}
        </span>
      </div>

      {/* Meta */}
      <div className="sev-meta">
        <div className="sev-meta-item">
          <span>📅</span>
          <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'}</span>
        </div>
        <div className="sev-meta-item">
          <span>📍</span>
          <span>{event.venue || 'Venue not set'}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sev-progress-section">
        <div className="sev-progress-header">
          <span>Documents uploaded</span>
          <strong>{pct}% · {uploaded}/{total}</strong>
        </div>
        <div className="sev-progress-track">
          <div className="sev-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Action */}
      <div className="sev-action">
        <button className="sev-open-btn">
          Open Workspace <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
