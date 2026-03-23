import React from 'react';
import { useDropzone } from 'react-dropzone';

const ImageGridUploader = ({ images, onDrop, onRemove }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] }
  });

  return (
    <div className="image-grid-uploader">
      {images.map((img, idx) => (
        <div key={idx} className="image-thumb-preview">
          <img src={URL.createObjectURL(img)} alt={`Event ${idx}`} />
          <button className="remove-img-btn" onClick={(e) => {
            e.stopPropagation();
            onRemove(idx);
          }}>×</button>
        </div>
      ))}
      {images.length < 5 && (
        <div {...getRootProps()} className="add-img-btn">
          <input {...getInputProps()} />
          <span>+</span>
        </div>
      )}
    </div>
  );
};

export default ImageGridUploader;
