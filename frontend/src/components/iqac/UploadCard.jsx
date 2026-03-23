import React from 'react';
import { useDropzone } from 'react-dropzone';

const UploadCard = ({ title, icon, onDrop, file }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] }
  });

  return (
    <div {...getRootProps()} className="upload-card-new">
      <input {...getInputProps()} />
      <div className="upload-card-icon">{icon}</div>
      <div className="upload-card-title">{title}</div>
      {file && <span className="file-status">✓ Added</span>}
    </div>
  );
};

export default UploadCard;
