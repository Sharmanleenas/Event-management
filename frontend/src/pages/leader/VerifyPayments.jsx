import React, { useState } from 'react';
import useFetch from '../../utils/useFetch';
import { getPendingPayments, verifyPayment } from '../../api/participantsApi';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import ImagePreviewModal from '../../components/ImagePreviewModal';

const VerifyPayments = () => {
  const { data: participants, loading, execute: refresh } = useFetch(getPendingPayments);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const handleAction = async (id, status) => {
    try {
      await verifyPayment(id, status);
      toast.success(`Payment ${status} Successfully`);
      refresh();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-content">
      <h2 className="dash-title">Verify Payments</h2>
      
      <div className="participants-table card">
        <table>
          <thead>
            <tr>
              <th>Name / Roll No</th>
              <th>Department</th>
              <th>Selected Games</th>
              <th>Proof</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants?.length > 0 ? (
              participants.map(p => (
                <tr key={p._id}>
                  <td>
                    <div><strong>{p.name}</strong></div>
                    <div className="text-sm">{p.email}</div>
                  </td>
                  <td>{p.eventId?.title || 'Unknown Event'}</td>
                  <td>
                    <div className="games-stack">
                      {p.selectedGames?.length > 0 ? p.selectedGames.map((g, i) => (
                        <span key={i} className="badge badge-brass text-xs">{g}</span>
                      )) : <span className="text-light">N/A</span>}
                    </div>
                  </td>
                  <td>
                    {p.paymentScreenshot ? (
                      <img 
                        src={p.paymentScreenshot} 
                        alt="Proof" 
                        className="screenshot-thumb"
                        onClick={() => setSelectedParticipant(p)}
                      />
                    ) : <span className="text-light">No Proof</span>}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-success btn-sm" style={{fontSize:"14px" , padding:"10px", backgroundColor:"#68ca54ff", borderRadius:"20px", color:"white", border:"#282e2dff solid 2px", hover:"#0e140cff !important" }} onClick={() => handleAction(p._id, 'Approved')}>Approve</button>
                      <button className="btn-error btn-sm" style={{fontSize:"14px" , padding:"10px", backgroundColor:"#e10d0d80", borderRadius:"20px", color:"white", border:"#282e2dff solid 2px", hover:"#40ff00ff !important" }} onClick={() => handleAction(p._id, 'Rejected')}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No pending payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ImagePreviewModal 
        isOpen={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
        imageUrl={selectedParticipant?.paymentScreenshot}
        participantName={selectedParticipant?.name}
        participantEmail={selectedParticipant?.email}
        onApprove={() => handleAction(selectedParticipant?._id, 'Approved')}
        onReject={() => handleAction(selectedParticipant?._id, 'Rejected')}
      />
    </div>
  );
};

export default VerifyPayments;
