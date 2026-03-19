import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../utils/useFetch';
import { getEventDetails } from '../api/eventsApi';
import GameCard from '../components/GameCard';
import Loader from '../components/Loader';
import '../styles/eventdetails.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, loading } = useFetch(() => getEventDetails(id), true, [id]);

  if (loading) return <Loader />;
  if (!event) return <div className="container">Event not found.</div>;

  const handleRegister = () => {
    if (event.status?.toUpperCase() !== 'APPROVED' || !event.isRegistrationOpen) return;
    navigate(`/register/${id}`);
  };

  return (
    <div className="event-details-page container">
      <div className="event-details-grid">
        <div className="event-main-content">
          <div className="event-hero">
            <img 
              src={event.poster || "https://via.placeholder.com/800x400?text=Event+Poster"} 
              alt={event.title} 
              className="hero-image"
            />
          </div>
          
          <h1 className="event-title">{event.title}</h1>
          
          <div className="event-meta-tags">
            <span className="meta-tag">📅 {new Date(event.date).toLocaleDateString()}</span>
            <span className="meta-tag">📍 {event.venue}</span>
            <span className="meta-tag">🏢 {event.department}</span>
          </div>

          <div className="event-section">
            <h3>Description</h3>
            <p className="description-text">{event.description}</p>
          </div>

          <div className="event-section">
            <h3>General Instructions</h3>
            <div className="instructions-list">
              {event.instructions ? (
                event.instructions.split('\n').map((line, i) => (
                  <div key={i} className="instruction-item">
                    <span className="instruction-number">{i + 1}</span>
                    <p>{line}</p>
                  </div>
                ))
              ) : (
                <p>No specific instructions provided.</p>
              )}
            </div>
          </div>
        </div>

        <div className="event-sidebar">
          <div className="sidebar-section card">
            <h3>Games & Competitions</h3>
            <div className="games-list">
              {event.games && event.games.length > 0 ? (
                event.games.map((game, i) => (
                  <GameCard key={i} game={game} />
                ))
              ) : (
                <p>No games listed for this event.</p>
              )}
            </div>
          </div>

          <div className="registration-cta card">
            <div className="fee-info">
              <span>Registration Fee:</span>
              <span className="price">₹{event.feeAmount || 0}</span>
            </div>
            
            <button 
              className={`btn-primary register-btn ${(event.status?.toUpperCase() !== 'APPROVED' || !event.isRegistrationOpen) ? 'disabled' : ''}`}
              onClick={handleRegister}
              disabled={event.status?.toUpperCase() !== 'APPROVED' || !event.isRegistrationOpen}
              title={event.status?.toUpperCase() !== 'APPROVED' ? 'Registration will open once event is approved' : !event.isRegistrationOpen ? 'Registration is temporarily closed' : ''}
            >
              {event.status?.toUpperCase() === 'APPROVED' && event.isRegistrationOpen ? 'Register Now →' : 'Registration Closed'}
            </button>
            
            {event.status?.toUpperCase() !== 'APPROVED' && (
              <p className="status-note">This event is currently awaiting administrative approval.</p>
            )}
            {event.status?.toUpperCase() === 'APPROVED' && !event.isRegistrationOpen && (
              <p className="status-note" style={{ color: 'var(--brass)' }}>Registration has not started yet or is currently paused.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
