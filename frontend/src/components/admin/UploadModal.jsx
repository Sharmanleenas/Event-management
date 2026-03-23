import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageCropper from './ImageCropper';
import sliderApi from '../../api/sliderApi';
import { toast } from 'react-toastify';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const STEPS = { SELECT: 'select', CROP: 'crop', CONFIRM: 'confirm' };

const UploadModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(STEPS.SELECT);
  const [rawSrc, setRawSrc] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file. Use JPG/PNG under 5MB.');
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawSrc(e.target.result);
      setStep(STEPS.CROP);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const handleCropDone = (blob) => {
    setCroppedBlob(blob);
    setCroppedPreview(URL.createObjectURL(blob));
    setStep(STEPS.CONFIRM);
  };

  const handleUpload = async () => {
    if (!croppedBlob) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('slider', croppedBlob, 'slider.jpg');
      formData.append('title', title);
      await sliderApi.upload(formData);
      toast.success('Slider uploaded successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay glass-morphism" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="upload-modal-card">
        {/* Header */}
        <div className="um-header">
          <div>
            <h3>Add New Slider</h3>
            <p className="um-sub">
              {step === STEPS.SELECT && 'Upload a banner image (JPG/PNG, max 5MB)'}
              {step === STEPS.CROP && 'Crop to 16:9 ratio · Drag & zoom to adjust'}
              {step === STEPS.CONFIRM && 'Preview & confirm upload'}
            </p>
          </div>
          <button className="close-fab" onClick={onClose}>✕</button>
        </div>

        {/* Step: SELECT */}
        {step === STEPS.SELECT && (
          <div className="um-body">
            <div {...getRootProps()} className={`um-dropzone ${isDragActive ? 'dz-active' : ''}`}>
              <input {...getInputProps()} />
              <div className="dz-icon">🖼️</div>
              {isDragActive
                ? <p>Drop image here…</p>
                : <p>Drag & drop an image or <span className="dz-link">click to browse</span></p>
              }
              <small>Supported: JPG, PNG, WebP · Max 5MB</small>
            </div>
          </div>
        )}

        {/* Step: CROP */}
        {step === STEPS.CROP && rawSrc && (
          <div className="um-body um-crop-body">
            <ImageCropper
              imageSrc={rawSrc}
              onCropDone={handleCropDone}
              onCancel={() => setStep(STEPS.SELECT)}
            />
          </div>
        )}

        {/* Step: CONFIRM */}
        {step === STEPS.CONFIRM && croppedPreview && (
          <div className="um-body">
            <img src={croppedPreview} alt="Preview" className="um-preview-img" />
            <div className="um-title-group">
              <label>Slider Title (optional)</label>
              <input
                type="text"
                className="inline-input"
                placeholder="e.g. Annual Tech Fest 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="um-confirm-btns">
              <button className="btn-secondary" onClick={() => setStep(STEPS.CROP)}>← Recrop</button>
              <button className="btn-primary" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading…' : '🚀 Upload Slider'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
