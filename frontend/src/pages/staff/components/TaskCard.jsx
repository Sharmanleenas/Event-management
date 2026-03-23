import React, { useState } from 'react';
import staffApi from '../../../api/staffApi';
import { toast } from 'react-toastify';

const TaskCard = ({ eventId, docType, label, accept, isUploaded, onUploadSuccess, multiple = false }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    if (multiple) {
      for (let i = 0; i < files.length; i++) {
        formData.append('documents', files[i]);
      }
    } else {
      formData.append('documents', files[0]);
    }

    try {
      await staffApi.uploadDocument(eventId, docType, formData);
      toast.success(`${label} uploaded!`);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error('Upload failed. Try again.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'invitation': return '✉️';
      case 'profile': return '👤';
      case 'attendance': return '📝';
      case 'feedback': return '💬';
      case 'photos': return '📸';
      default: return '📄';
    }
  };

  return (
    <div className={`task-card ${isUploaded ? 'completed' : ''}`}>
      <div className="task-info">
        <div className="task-icon-box">
          {isUploaded ? '✅' : getIcon(docType)}
        </div>
        <div className="task-details">
          <h4>{label}</h4>
          <div className={`task-status-row ${isUploaded ? 'status-done' : 'status-pending'}`}>
            <div className="status-dot"></div>
            {isUploaded ? 'Done' : 'Pending'}
          </div>
        </div>
      </div>
      
      <div className="task-action">
        <label className="upload-task-btn" style={{ cursor: 'pointer' }}>
          {uploading ? '...' : isUploaded ? 'Replace' : 'Upload'}
          <input 
            type="file" 
            accept={accept} 
            onChange={handleFileChange} 
            multiple={multiple}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};

export default TaskCard;
