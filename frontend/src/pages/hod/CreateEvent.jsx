import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createEvent } from '../../api/eventsApi';
import '../../styles/dashboard.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    instructions: '',
    date: '',
    venue: '',
    department: '',
    internalPrice: '',
    externalPrice: '',
    upiId: '',
    maxGamesPerParticipant: 3,
    games: [
      { name: '', rules: '', participantLimit: 50, category: 'Technical' }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleGameChange = (index, field, value) => {
    const newGames = [...eventData.games];
    newGames[index][field] = value;
    setEventData(prev => ({ ...prev, games: newGames }));
  };

  const addGame = () => {
    setEventData(prev => ({
      ...prev,
      games: [...prev.games, { name: '', rules: '', participantLimit: 50, category: 'Technical' }]
    }));
  };

  const removeGame = (index) => {
    if (eventData.games.length === 1) return;
    setEventData(prev => ({
      ...prev,
      games: prev.games.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent(eventData);
      toast.success('Event Created Successfully! Awaiting Admin Approval.');
      navigate('/hod');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <h2 className="dash-title">Create New Event</h2>
      
      <form className="create-event-form card" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Event Title</label>
            <input name="title" value={eventData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={eventData.description} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Event Date & Time</label>
              <input type="datetime-local" name="date" value={eventData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Venue</label>
              <input name="venue" value={eventData.venue} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Payment & Coordination</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Internal Fee (₹) — SHC Students</label>
              <input type="number" name="internalPrice" value={eventData.internalPrice} onChange={handleChange} min="0" required />
            </div>
            <div className="form-group">
              <label>External Fee (₹) — Other Colleges</label>
              <input type="number" name="externalPrice" value={eventData.externalPrice} onChange={handleChange} min="0" required />
            </div>
          </div>
          <div className="form-group">
            <label>UPI ID (to receive payments)</label>
            <input name="upiId" value={eventData.upiId} onChange={handleChange} placeholder="college@upi" required />
          </div>
          <div className="form-group">
            <label>Max Games Per Participant</label>
            <input type="number" name="maxGamesPerParticipant" value={eventData.maxGamesPerParticipant} onChange={handleChange} min="1" max="5" />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Games & Rules</h3>
            <button type="button" onClick={addGame} className="btn-secondary btn-sm">Add Another Game +</button>
          </div>
          
          <div className="dynamic-games-list">
            {eventData.games.map((game, index) => (
              <div key={index} className="game-form-item card">
                <div className="game-form-header">
                  <h4>Game #{index + 1}</h4>
                  {eventData.games.length > 1 && (
                    <button type="button" onClick={() => removeGame(index)} className="remove-btn">✕ Remove</button>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Game Name</label>
                  <input value={game.name} onChange={(e) => handleGameChange(index, 'name', e.target.value)} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select value={game.category} onChange={(e) => handleGameChange(index, 'category', e.target.value)}>
                      <option value="Technical">Technical</option>
                      <option value="Non-Technical">Non-Technical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Participant Limit</label>
                    <input type="number" value={game.participantLimit} onChange={(e) => handleGameChange(index, 'participantLimit', e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Game Rules</label>
                  <textarea value={game.rules} onChange={(e) => handleGameChange(index, 'rules', e.target.value)} placeholder="Enter point system, time limits, etc." required />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>General Instructions</h3>
          <textarea name="instructions" value={eventData.instructions} onChange={handleChange} placeholder="One instruction per line" />
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Event...' : 'Submit for Approval →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
