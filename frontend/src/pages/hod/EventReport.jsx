import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../utils/useFetch';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import '../../styles/dashboard.css';

const EventReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch event details
  const { data: event, loading: eventLoading } = useFetch(() => axiosInstance.get(`/api/events/details/${id}`).then(res => res.data));
  
  // Fetch participants (assuming standard endpoint or we'll need to create one)
  const { data: participants, loading: partLoading } = useFetch(() => axiosInstance.get(`/api/participants/event/${id}`).then(res => res.data), true, [id]);

  if (eventLoading || partLoading) return <Loader />;
  if (!event) return <div className="container">Event not found.</div>;

  return (
    <div className="dashboard-content anim-fade-in">
      <div className="dash-header-flex">
        <h2 className="dash-title">Event Report: {event.title}</h2>
        <div className="header-actions">
          <button onClick={() => window.print()} className="btn-secondary btn-sm">Print Report 🖨️</button>
          <button onClick={() => navigate('/hod')} className="btn-ghost">Back</button>
        </div>
      </div>

      <div className="report-stats-grid">
        <div className="stat-card card glass-card">
          <h4>Total Registered</h4>
          <p className="stat-val">{participants?.length || 0}</p>
        </div>
        <div className="stat-card card glass-card">
          <h4>Total Revenue</h4>
          <p className="stat-val">₹{(participants?.length || 0) * (event.feeAmount || 0)}</p>
        </div>
        <div className="stat-card card glass-card">
          <h4>Status</h4>
          <p className={`stat-val badge badge-${event.status?.toLowerCase()}`}>{event.status}</p>
        </div>
      </div>

      <div className="participants-table-section card glass-card">
        <h3>Registered Participants</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>College</th>
              <th>Games</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {participants?.length > 0 ? (
              participants.map(p => (
                <tr key={p._id}>
                  <td>{p.participantId || 'PENDING'}</td>
                  <td>{p.name}</td>
                  <td>{p.college}</td>
                  <td>{p.games?.join(', ')}</td>
                  <td>
                    <span className={`badge badge-${p.paymentStatus?.toLowerCase()}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No participants registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventReport;
