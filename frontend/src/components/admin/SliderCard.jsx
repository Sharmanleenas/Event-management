import React from 'react';
import sliderApi from '../../api/sliderApi';
import { toast } from 'react-toastify';

const SliderCard = ({ slider, onRefresh }) => {
  const handleToggle = async () => {
    try {
      await sliderApi.update(slider._id, { isActive: !slider.isActive });
      toast.success(`Slider ${!slider.isActive ? 'activated' : 'deactivated'}`);
      onRefresh();
    } catch {
      toast.error('Failed to update slider');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this slider image?')) return;
    try {
      await sliderApi.remove(slider._id);
      toast.success('Slider deleted');
      onRefresh();
    } catch {
      toast.error('Failed to delete slider');
    }
  };

  return (
    <div className={`slider-card ${slider.isActive ? 'sc-active' : 'sc-inactive'}`}>
      <div className="sc-image-wrap">
        <img src={slider.imageUrl} alt={slider.title || 'Slider'} className="sc-image" />
        <span className={`sc-badge ${slider.isActive ? 'badge-active' : 'badge-inactive'}`}>
          {slider.isActive ? '● Active' : '○ Inactive'}
        </span>
      </div>
      <div className="sc-body">
        <p className="sc-title">{slider.title || <em>No title</em>}</p>
        <p className="sc-date">{new Date(slider.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        <div className="sc-actions">
          <button
            className={`sc-btn ${slider.isActive ? 'sc-btn-warn' : 'sc-btn-success'}`}
            onClick={handleToggle}
          >
            {slider.isActive ? '⏸ Deactivate' : '▶ Activate'}
          </button>
          <button className="sc-btn sc-btn-danger" onClick={handleDelete}>🗑 Delete</button>
        </div>
      </div>
    </div>
  );
};

export default SliderCard;
