import React, { useState, useMemo } from 'react';
import ExportButton from './ExportButton';

const ParticipantsTable = ({ participants, eventName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.registerNumber && p.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'ALL' || p.paymentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [participants, searchTerm, statusFilter]);

  return (
    <div className="participants-analytics-section card fade-in">
      <div className="section-header">
        <h3>Registration Records</h3>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search Name or Reg No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <ExportButton data={filteredParticipants} fileName={eventName} />
        </div>
      </div>

      <div className="table-responsive">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reg No</th>
              <th>Dept / College</th>
              <th>Event / Games</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="p-name">{p.name}</div>
                    <div className="p-email">{p.email}</div>
                  </td>
                  <td><code className="reg-no">{p.registerNumber || 'N/A'}</code></td>
                  <td>
                    <div className="p-dept">{p.department || 'N/A'}</div>
                    <div className="p-college text-xs">{p.college || 'Sacred Heart College'}</div>
                  </td>
                  <td>
                    <div className="p-event">{p.eventId?.title || 'Unknown'}</div>
                    <div className="p-games">
                      {p.selectedGames?.map((g, i) => (
                        <span key={i} className="badge badge-brass text-xs">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${p.paymentStatus.toLowerCase()}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No registration data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantsTable;
