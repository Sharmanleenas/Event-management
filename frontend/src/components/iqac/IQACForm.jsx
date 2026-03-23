import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import SectionBlock from './SectionBlock';
import UploadCard from './UploadCard';
import ImageGridUploader from './ImageGridUploader';
import '../../styles/iqac_editor.css';

const IQACForm = ({ selectedEvent, onGenerate }) => {
  const [formData, setFormData] = useState({
    title: selectedEvent?.title || '',
    description: selectedEvent?.description || '',
    rpName: '',
    rpDesignation: '',
    rpExperience: '',
    rpQualification: '',
    duration: '',
    date: selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString() : '',
    time: '',
    venue: selectedEvent?.venue || '',
    department: selectedEvent?.department || '',
  });

  const [invitationImage, setInvitationImage] = useState(null);
  const [resourcePersonProfile, setResourcePersonProfile] = useState(null);
  const [attendanceImage, setAttendanceImage] = useState(null);
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (invitationImage) data.append('invitationImage', invitationImage);
    if (resourcePersonProfile) data.append('resourcePersonProfile', resourcePersonProfile);
    if (attendanceImage) data.append('attendanceImage', attendanceImage);
    if (feedbackImage) data.append('feedbackImage', feedbackImage);
    eventImages.forEach(img => data.append('eventImages', img));

    try {
      const response = await axiosInstance.post('/api/iqac/generate', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onGenerate(response.data.report, { 
        ...formData, 
        invitationImage, 
        resourcePersonProfile,
        attendanceImage,
        feedbackImage,
        eventImages 
      });
      toast.success('Document Crafted Authentically!');
    } catch (err) {
      toast.error('AI Generation encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImg = (idx) => {
    const list = [...eventImages];
    list.splice(idx, 1);
    setEventImages(list);
  };

  return (
    <div className="smart-input-panel">
      <header className="editor-header">
        <h1>Smart Document Builder</h1>
        <p>Compose your academic report with AI assistance. Your inputs will update the draft in real-time.</p>
      </header>

      <SectionBlock label="1. Core Event Information">
        <div className="input-minimal-group">
          <input 
            type="text" 
            className="input-minimal"
            value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })} 
            placeholder="Untitled Event"
          />
        </div>
        <div className="inline-grid">
           <input className="input-minimal" placeholder="Event Venue" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
           <input className="input-minimal" placeholder="Duration (e.g. 2 Days)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
        </div>
      </SectionBlock>

      <SectionBlock label="2. Event Narrative">
        <textarea 
          className="textarea-notion"
          rows="1"
          placeholder="Start typing your event description, key activities, and academic outcomes here..."
          value={formData.description} 
          onChange={e => setFormData({ ...formData, description: e.target.value })} 
        />
      </SectionBlock>

      <SectionBlock label="3. Expert / Resource Person">
        <div className="input-minimal-group">
          <input className="input-minimal" placeholder="Name of Resource Person" value={formData.rpName} onChange={e => setFormData({...formData, rpName: e.target.value})} />
        </div>
        <div className="inline-grid">
           <input className="input-minimal" placeholder="Designation" value={formData.rpDesignation} onChange={e => setFormData({...formData, rpDesignation: e.target.value})} />
           <input className="input-minimal" placeholder="Qualification" value={formData.rpQualification} onChange={e => setFormData({...formData, rpQualification: e.target.value})} />
           <input className="input-minimal" placeholder="Experience" value={formData.rpExperience} onChange={e => setFormData({...formData, rpExperience: e.target.value})} />
        </div>
      </SectionBlock>

      <SectionBlock label="4. Supporting Artifacts">
        <div className="upload-grid-minimal">
          <UploadCard 
            title="Invitation" 
            icon="📄" 
            onDrop={(files) => setInvitationImage(files[0])} 
            file={invitationImage}
          />
          <UploadCard 
            title="RP Profile" 
            icon="👤" 
            onDrop={(files) => setResourcePersonProfile(files[0])} 
            file={resourcePersonProfile}
          />
          <UploadCard 
            title="Attendance" 
            icon="📊" 
            onDrop={(files) => setAttendanceImage(files[0])} 
            file={attendanceImage}
          />
          <UploadCard 
            title="Feedback" 
            icon="💬" 
            onDrop={(files) => setFeedbackImage(files[0])} 
            file={feedbackImage}
          />
        </div>
      </SectionBlock>

      <SectionBlock label="5. Event Visuals (Max 5)">
        <ImageGridUploader 
          images={eventImages} 
          onDrop={(files) => setEventImages([...eventImages, ...files].slice(0, 5))}
          onRemove={handleRemoveImg}
        />
      </SectionBlock>

      <button 
        className="floating-gen-btn" 
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <><div className="loading-spinner"></div> Drafting...</>
        ) : (
          <>✨ Generate IQAC Report</>
        )}
      </button>

      <div style={{ height: '100px' }}></div> {/* Spacer for FAB */}
    </div>
  );
};

export default IQACForm;
