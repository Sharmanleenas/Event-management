import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../utils/useFetch';
import staffApi from '../../api/staffApi';
import Loader from '../../components/Loader';
import EventCard from '../../components/staff/EventCard';
import '../../styles/dashboard.css';

const StaffEvents = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const { data: events, loading, execute: fetchEvents } = useFetch(() => staffApi.getAssignedEvents());

  if (loading) return <Loader />;

  const filteredEvents = events?.filter(evt => {
    if (filter === 'ALL') return true;
    return evt.staffStatus === filter; // PENDING, IN_PROGRESS, COMPLETED
  }) || [];

  return (
    <div className="dashboard-content anim-fade-in">
      <div className="dash-header-flex">
        <h2 className="dash-title">My Assigned Events</h2>
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              onClick={() => navigate(`/staff/workspace/${event._id}`)} 
            />
          ))
        ) : (
          <div className="card glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p>No events found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffEvents;
