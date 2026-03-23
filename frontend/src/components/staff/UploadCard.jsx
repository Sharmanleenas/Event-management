import React, { useState } from 'react';
import { toast } from 'react-toastify';
import staffApi from '../../api/staffApi';

const UploadCard = ({ eventId, docType, label, accept, isUploaded, onUploadSuccess, multiple = false }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple && files.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    const formData = new FormData();
    if (multiple) {
      Array.from(files).forEach(file => formData.append('documents', file));
    } else {
      formData.append('document', files[0]);
    }

    setUploading(true);
    try {
      await staffApi.uploadDocument(eventId, docType, formData);
      toast.success(`${label} uploaded successfully`);
      onUploadSuccess(); // Refresh event details
    } catch (error) {
      toast.error(`Failed to upload ${label}`);
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  return (
    <div 
      className="upload-card" 
      style={{ 
        border: '1px dashed rgba(255,255,255,0.2)', 
        borderRadius: '8px', 
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isUploaded ? 'rgba(46, 213, 115, 0.05)' : 'transparent'
      }}
    >
      <div>
        <h5 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>{label}</h5>
        <span style={{ fontSize: '0.8rem', color: isUploaded ? 'var(--success-color)' : 'var(--warning-color)' }}>
          {isUploaded ? '✔ Uploaded' : '❌ Pending'}
        </span>
      </div>
      <div>
        <label className="btn-secondary btn-sm" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'inline-block' }}>
          {uploading ? 'Uploading...' : 'Choose File'}
          <input 
            type="file" 
            accept={accept} 
            multiple={multiple}
            onChange={handleFileChange} 
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};

export default UploadCard;
