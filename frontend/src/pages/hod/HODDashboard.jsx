import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import EventReport from './EventReport';
import SESReport from './SESReport';
import CreateLeader from './CreateLeader';
import useFetch from '../../utils/useFetch';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import '../../styles/dashboard.css';

const HODOverview = () => {
  const { data: myEvents, loading, execute: fetchMyEvents } = useFetch(() => axiosInstance.get('/api/events/my-events').then(res => res.data));

  const handleToggleRegistration = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/api/events/toggle-registration/${id}`);
      toast.success(data.message);
      fetchMyEvents(); // Refresh list
    } catch (error) {
      toast.error("Failed to update registration status");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-content anim-fade-in">
      <div className="dash-header-flex">
        <h2 className="dash-title">My Department Events</h2>
      </div>
      
      <div className="events-list-table card glass-card">
        <table>
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Reg. Status</th>
              <th>Participants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myEvents?.length > 0 ? (
              myEvents.map(event => (
                <tr key={event._id}>
                  <td><strong>{event.title}</strong></td>
                  <td>{event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}</td>
                  <td>
                    <span className={`badge badge-${event.status.toLowerCase()}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${event.isRegistrationOpen ? 'pill-success' : 'pill-error'}`}>
                      {event.isRegistrationOpen ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td>{event.participantCount || 0}</td>
                  <td className="actions-cell">
                    {event.status === 'APPROVED' && (
                      <button 
                        className={`btn-sm ${event.isRegistrationOpen ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleToggleRegistration(event._id)}
                      >
                        {event.isRegistrationOpen ? 'Stop Reg.' : 'Start Reg.'}
                      </button>
                    )}
                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => navigate(`edit-event/${event._id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-primary btn-sm"
                      onClick={() => navigate(`event-report/${event._id}`)}
                    >
                      Report
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No events created yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HODDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Routes>
          <Route index element={<HODOverview />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="create-leader" element={<CreateLeader />} />
          <Route path="ses-report" element={<SESReport />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="event-report/:id" element={<EventReport />} />
        </Routes>
      </main>
    </div>
  );
};

export default HODDashboard;
