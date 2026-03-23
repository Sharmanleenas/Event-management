import React, { useState } from 'react';
import sliderApi from '../../api/sliderApi';
import SliderCard from '../../components/admin/SliderCard';
import UploadModal from '../../components/admin/UploadModal';
import Loader from '../../components/Loader';
import useFetch from '../../utils/useFetch';
import '../../styles/dashboard.css';
import '../../styles/sliders.css';

const SliderManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: sliders, loading, execute: refresh } = useFetch(() => sliderApi.getAll());

  if (loading) return <Loader />;

  const active = sliders?.filter(s => s.isActive).length || 0;
  const total = sliders?.length || 0;

  return (
    <div className="dashboard-content anim-fade-in sliders-page">
      {/* Page Header */}
      <div className="sliders-hero">
        <div>
          <h2 className="dash-title" style={{ marginBottom: '0.25rem' }}>Landing Page Sliders</h2>
          <p className="sliders-sub">Manage banner images shown on the homepage carousel</p>
        </div>
        <div className="sliders-stats">
          <div className="slider-stat-pill">
            <span>🖼️</span><strong>{total}</strong><span>Total</span>
          </div>
          <div className="slider-stat-pill active-pill">
            <span>✅</span><strong>{active}</strong><span>Active</span>
          </div>
          <button className="btn-primary sliders-add-btn" onClick={() => setShowModal(true)}>
            ＋ Add New Slider
          </button>
        </div>
      </div>

      {/* Slider Grid */}
      {total === 0 ? (
        <div className="sliders-empty card glass-card">
          <div className="empty-icon">🖼️</div>
          <h3>No Sliders Yet</h3>
          <p>Add your first homepage banner image to get started.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Slider</button>
        </div>
      ) : (
        <div className="sliders-grid">
          {sliders.map(slider => (
            <SliderCard key={slider._id} slider={slider} onRefresh={refresh} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
};

export default SliderManagement;
