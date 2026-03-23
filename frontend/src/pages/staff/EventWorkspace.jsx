import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from '../../utils/useFetch';
import staffApi from '../../api/staffApi';
import Loader from '../../components/Loader';
import TaskCard from './components/TaskCard';
import ProgressCircle from './components/ProgressCircle';
import EventDetailsPanel from './components/EventDetailsPanel';
import '../../styles/workspace.css';

const EventWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: event, loading, execute: fetchEvent } = useFetch(() => staffApi.getEventDetails(id));
  
  const [details, setDetails] = useState({ venue: '', duration: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setDetails({
        venue: event.venue || '',
        duration: event.duration || '',
        notes: event.staffNotes || ''
      });
    }
  }, [event]);

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      await staffApi.updateEventDetails(id, details);
      toast.success('Progress saved');
      fetchEvent();
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitToHOD = async () => {
    if (window.confirm("Are you sure you want to submit this event to HOD for review? You may not be able to edit documents until HOD responds.")) {
      try {
        await staffApi.submitEventToHOD(id);
        toast.success('Successfully submitted to HOD');
        navigate('/staff/events');
      } catch (error) {
        toast.error('Submission failed');
      }
    }
  };

  if (loading) return <Loader />;
  if (!event) return <div className="workspace-page"><p>Event not found.</p></div>;

  const docs = event.documents || {};
  const docStatusList = [
    { key: 'invitation', label: 'Invitation Image', icon: '✉️', isUploaded: !!docs.invitation, accept: "image/*" },
    { key: 'profile', label: 'Resource Profile', icon: '👤', isUploaded: !!docs.profile, accept: ".pdf,.doc,.docx" },
    { key: 'attendance', label: 'Attendance Sheet', icon: '📝', isUploaded: !!docs.attendance, accept: ".pdf,.csv,.xlsx,.xls,image/*" },
    { key: 'feedback', label: 'User Feedback', icon: '💬', isUploaded: !!docs.feedback, accept: ".pdf,.csv,.txt" },
    { key: 'photos', label: 'Event Gallery', icon: '📸', isUploaded: !!(docs.photos && docs.photos.length > 0), accept: "image/*", multiple: true }
  ];

  const completedCount = docStatusList.filter(d => d.isUploaded).length + (details.venue ? 1 : 0);
  const totalTasks = docStatusList.length + 1;
  const percentage = Math.round((completedCount / totalTasks) * 100);
  const canSubmit = percentage === 100;

  return (
    <div className="workspace-page anim-fade-in">
      {/* Top Header */}
      <header className="workspace-header">
        <div className="header-main-info">
          <button className="btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>&larr; Back to Dashboard</button>
          <h1>{event.title}</h1>
          <div className="header-subtitle">
            <span>📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className={`status-pill status-${(event.staffStatus || 'PENDING').toLowerCase()}`}>
              {event.staffStatus || 'PENDING'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="workspace-grid">
        {/* Left Column: Details */}
        <section className="workspace-panel">
          <h3 className="panel-title"><span>📋</span> Event Details</h3>
          <EventDetailsPanel 
            details={details} 
            setDetails={setDetails} 
            onSave={handleSaveDetails} 
            saving={saving} 
          />
        </section>

        {/* Center Column: Tasks */}
        <section className="workspace-panel">
          <h3 className="panel-title"><span>📂</span> Upload Checklist</h3>
          <div className="tasks-list">
            {docStatusList.map((task) => (
              <TaskCard 
                key={task.key}
                eventId={id}
                docType={task.key}
                label={task.label}
                accept={task.accept}
                multiple={task.multiple}
                isUploaded={task.isUploaded}
                onUploadSuccess={fetchEvent}
              />
            ))}
          </div>
        </section>

        {/* Right Column: Progress */}
        <section className="workspace-panel">
          <h3 className="panel-title"><span>📈</span> Progress Tracker</h3>
          <div className="panel-card progress-card">
            <ProgressCircle percentage={percentage} />
            
            <div className="checklist-title">Mission Checklist</div>
            <div className="checklist-items">
              <div className={`check-item ${details.venue ? 'done' : 'pending'}`}>
                <span className="check-icon">{details.venue ? '✔' : '○'}</span>
                <span>Define Venue & Location</span>
              </div>
              {docStatusList.map(task => (
                <div key={task.key} className={`check-item ${task.isUploaded ? 'done' : 'pending'}`}>
                  <span className="check-icon">{task.isUploaded ? '✔' : '○'}</span>
                  <span>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Sticky Footer */}
      <footer className="sticky-footer">
        <button 
          className="btn-submit-premium" 
          onClick={handleSubmitToHOD}
          disabled={!canSubmit || event.staffStatus === 'COMPLETED'}
        >
          {event.staffStatus === 'COMPLETED' ? '✓ Submitted to HOD' : '🚀 Submit for Review'}
        </button>
      </footer>
    </div>
  );
};

export default EventWorkspace;
