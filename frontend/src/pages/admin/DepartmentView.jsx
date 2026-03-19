import React, { useState, useEffect } from 'react';
import useFetch from '../../utils/useFetch';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const DepartmentView = () => {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHODModal, setShowHODModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  
  // Form States
  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  const fetchDepts = async () => {
    try {
      const { data } = await axiosInstance.get('/api/analytics/departments');
      setDepts(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load departments");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/departments', newDept);
      toast.success("Department created successfully");
      setShowAddModal(false);
      setNewDept({ name: '', description: '' });
      fetchDepts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create department");
    }
  };

  const openManageHOD = async (dept) => {
    setSelectedDept(dept);
    setShowHODModal(true);
    setFetchingUsers(true);
    try {
      const { data } = await axiosInstance.get('/api/users');
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setFetchingUsers(false);
    }
  };

  const assignHOD = async (userId) => {
    try {
      await axiosInstance.put(`/api/departments/${selectedDept._id}`, { hod: userId });
      toast.success("HOD assigned successfully");
      setShowHODModal(false);
      fetchDepts();
    } catch (error) {
      toast.error("Failed to assign HOD");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-content anim-fade-in">
      <div className="dash-header-flex">
        <h2 className="dash-title">Department Management</h2>
        <button className="btn-add-circle" onClick={() => setShowAddModal(true)} title="Add Department">
          +
        </button>
      </div>
      
      <div className="dept-grid grid-3">
        {depts?.map(dept => (
          <div key={dept.name} className="card dept-card-premium">
            <div className="dept-card-header">
              <div className="dept-icon">🏛️</div>
              <h3>{dept.name}</h3>
            </div>
            
            <div className="dept-stats-premium">
              <div className="stat-pill">
                <span className="pill-icon">📅</span>
                <div className="pill-content">
                  <span className="pill-value">{dept.eventCount}</span>
                  <span className="pill-label">Events</span>
                </div>
              </div>
              <div className="stat-pill">
                <span className="pill-icon">👥</span>
                <div className="pill-content">
                  <span className="pill-value">{dept.participantCount}</span>
                  <span className="pill-label">Participants</span>
                </div>
              </div>
            </div>

            <div className="dept-footer">
              <button 
                className="btn-outline btn-sm" 
                onClick={() => openManageHOD(dept)}
              >
                Manage HOD
              </button>
              <button 
                className="btn-primary btn-sm"
                onClick={() => { setSelectedDept(dept); setShowAnalyticsModal(true); }}
              >
                Analytics
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="modal-overlay glass-morphism" style={{ backdropFilter: 'blur(15px)', background: 'rgba(26, 42, 68, 0.4)' }} onClick={() => setShowAddModal(false)}>
          <div className="modal-card-premium glass-card" style={{ borderRadius: '32px', background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255,255,255,0.4)' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-caution" style={{ borderBottomColor: 'var(--brass)', background: 'transparent', padding: '2.5rem 2rem 1.5rem' }}>
              <span className="modal-icon" style={{ fontSize: '3rem' }}>🏢</span>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--indigo)' }}>Add New Department</h3>
            </div>
            <form onSubmit={handleCreateDept}>
              <div className="modal-body" style={{ padding: '1rem 3rem 2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '800', color: 'var(--indigo)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Department Name</label>
                  <input 
                    type="text" 
                    className="premium-textarea" 
                    style={{ minHeight: 'auto', borderRadius: '15px', border: '2px solid rgba(0,0,0,0.08)', fontSize: '1.1rem', color: 'var(--indigo)' }}
                    placeholder="e.g. Computer Science" 
                    required
                    value={newDept.name}
                    onChange={e => setNewDept({...newDept, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '800', color: 'var(--indigo)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Description</label>
                  <textarea 
                    className="premium-textarea" 
                    style={{ borderRadius: '15px', border: '2px solid rgba(0,0,0,0.08)', fontSize: '1rem', color: 'var(--indigo)' }}
                    placeholder="Brief description of the academic unit..."
                    value={newDept.description}
                    onChange={e => setNewDept({...newDept, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer-premium" style={{ background: 'transparent', padding: '1.5rem 3rem 3rem' }}>
                <button type="button" className="btn-ghost" style={{ fontWeight: '700', color: 'var(--brass)',border:'var(--brass) solid 2px', borderRadius: '30px', padding: '12px 30px', hover: { color: 'var(--indigo)', border: 'var(--indigo) solid 2px' } }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ borderRadius: '30px', padding: '12px 30px', fontWeight: '700', fontSize: '1rem' }}>Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage HOD Modal */}
      {showHODModal && (selectedDept || fetchingUsers) && (
        <div className="modal-overlay glass-morphism" onClick={() => setShowHODModal(false)}>
          <div className="modal-card-premium" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-caution" style={{ borderBottomColor: 'var(--indigo)', background: '#f0f4f8' }}>
              <span className="modal-icon">👤</span>
              <h3>Assign HOD for {selectedDept?.name}</h3>
            </div>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {fetchingUsers ? <Loader /> : (
                <div className="user-selection-list">
                  {users.length === 0 ? <p>No users found.</p> : users.map(user => (
                    <div key={user._id} className="user-assign-item">
                      <div className="u-info">
                        <strong>{user.name}</strong>
                        <span>({user.email})</span>
                        <div className="u-role-badge">{user.role}</div>
                      </div>
                      <button 
                        className={`btn-sm ${selectedDept?.hod?._id === user._id ? 'btn-disabled' : 'btn-primary'}`}
                        disabled={selectedDept?.hod?._id === user._id}
                        onClick={() => assignHOD(user._id)}
                      >
                        {selectedDept?.hod?._id === user._id ? 'Current HOD' : 'Assign'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer-premium">
              <button className="btn-ghost" onClick={() => setShowHODModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && selectedDept && (
        <div className="modal-overlay glass-morphism" onClick={() => setShowAnalyticsModal(false)}>
          <div className="modal-card-premium" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-caution" style={{ borderBottomColor: 'var(--burgundy)', background: '#fff0f3' }}>
              <span className="modal-icon">📊</span>
              <h3>{selectedDept.name} Analytics</h3>
            </div>
            <div className="modal-body">
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card stat-card" style={{ padding: '1rem' }}>
                  <div className="stat-info">
                    <p>Total Events</p>
                    <h3>{selectedDept.eventCount}</h3>
                  </div>
                </div>
                <div className="card stat-card" style={{ padding: '1rem' }}>
                  <div className="stat-info">
                    <p>Total Participants</p>
                    <h3>{selectedDept.participantCount}</h3>
                  </div>
                </div>
              </div>
              <div className="analytics-placeholder">
                <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                  Detailed event breakdown and growth charts for <strong>{selectedDept.name}</strong> will be displayed here in the next update.
                </p>
              </div>
            </div>
            <div className="modal-footer-premium">
              <button className="btn-primary" style={{ borderRadius: '6px' }} onClick={() => setShowAnalyticsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .user-assign-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          transition: background 0.3s;
        }
        .user-assign-item:hover { background: #f9f9f9; }
        .u-info { display: flex; flex-direction: column; gap: 2px; }
        .u-info strong { font-size: 1rem; color: var(--indigo); }
        .u-info span { font-size: 0.8rem; color: #666; }
        .u-role-badge { font-size: 0.65rem; background: #eee; width: fit-content; padding: 2px 6px; border-radius: 4px; margin-top: 4px; font-weight: 700; color: #555; }
        .btn-disabled { background: #ccc !important; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default DepartmentView;
