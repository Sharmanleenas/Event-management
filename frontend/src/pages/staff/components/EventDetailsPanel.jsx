import React from 'react';

const EventDetailsPanel = ({ details, setDetails, onSave, saving }) => {
  return (
    <div className="panel-card details-form">
      <div className="inline-group">
        <label className="inline-label">📍 Venue / Location</label>
        <input 
          type="text" 
          className="inline-input" 
          value={details.venue} 
          onChange={e => setDetails({...details, venue: e.target.value})}
          placeholder="E.g., Auditorium"
        />
      </div>
      
      <div className="inline-group">
        <label className="inline-label">⏱️ Duration</label>
        <input 
          type="text" 
          className="inline-input" 
          value={details.duration} 
          onChange={e => setDetails({...details, duration: e.target.value})}
          placeholder="E.g., 2 hours"
        />
      </div>
      
      <div className="inline-group">
        <label className="inline-label">📝 Staff Notes (Optional)</label>
        <textarea 
          className="inline-input" 
          rows="5" 
          value={details.notes} 
          onChange={e => setDetails({...details, notes: e.target.value})}
          placeholder="Any notes for HOD..."
          style={{ resize: 'none' }}
        ></textarea>
      </div>

      <button className="btn-primary" onClick={onSave} disabled={saving} style={{ marginTop: '1rem', width: 'fit-content' }}>
        {saving ? 'Saving...' : 'Save Draft'}
      </button>
    </div>
  );
};

export default EventDetailsPanel;
