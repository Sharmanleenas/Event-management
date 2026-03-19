import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axiosInstance.get('/api/contacts');
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load messages");
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return toast.warning("Please enter a reply");

    setSending(true);
    try {
      await axiosInstance.post(`/api/contacts/reply/${selectedMsg._id}`, { replyMessage: replyText });
      toast.success("Reply sent to user!");
      setReplyText("");
      setSelectedMsg(null);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-messages-p-container anim-fade-in">
      <div className="page-header">
        <h2 className="dash-title">User Inquiries</h2>
        <p className="dash-subtitle">Manage queries in a grid view. Click a card to respond.</p>
      </div>

      <div className="messages-grid-layout">
        {messages.length === 0 ? (
          <div className="empty-state-grid card glass-card">
            <p>No new messages found.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id}
              className="message-grid-card card glass-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedMsg(msg)}
            >
              <div className="msg-card-top">
                <div className="mini-avatar">{msg.name[0]}</div>
                <div className="meta">
                  <span className="date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  {msg.status === 'REPLIED' && <span className="replied-tag">Replied</span>}
                </div>
              </div>
              <h4 className="msg-name">{msg.name}</h4>
              <p className="msg-snippet">{msg.message.length > 80 ? msg.message.substring(0, 80) + "..." : msg.message}</p>
              <div className="card-footer-hint">Click to Reply</div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {selectedMsg && (
        <div className="modal-overlay-p" onClick={() => setSelectedMsg(null)}>
          <div className="reply-modal-p anim-pop-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reply to {selectedMsg.name}</h3>
              <button className="close-x" onClick={() => setSelectedMsg(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="orig-message">
                <label>User's Message:</label>
                <p>"{selectedMsg.message}"</p>
              </div>
              <textarea
                placeholder="Write your response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedMsg(null)}>Cancel</button>
              <button
                className="btn-primary"
                disabled={sending}
                onClick={handleSendReply}
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-messages-p-container { padding: 1rem; }
        .messages-grid-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          perspective: 1000px;
        }

        .message-grid-card {
          background: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(20px);
          padding: 1.5rem !important;
          border-radius: 20px !important;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: revealPop 0.5s ease both;
          border: 1px solid rgba(255,255,255,0.3) !important;
        }

        .message-grid-card:hover {
          transform: translateY(-8px) rotateY(2deg);
          background: rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: var(--brass) !important;
        }

        .msg-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .mini-avatar { width: 32px; height: 32px; background: var(--indigo); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.8rem; }
        .meta { display: flex; flex-direction: column; align-items: flex-end; }
        .date { font-size: 0.75rem; color: var(--text-light); }
        .replied-tag { font-size: 0.65rem; background: var(--success-soft); color: var(--success); padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-top: 4px; }
        .msg-name { margin: 0.5rem 0; font-family: var(--font-serif); color: var(--indigo); font-size: 1.1rem; }
        .msg-snippet { font-size: 0.85rem; color: var(--text-mid); line-height: 1.5; height: 3.8em; overflow: hidden; }
        .card-footer-hint { margin-top: 1rem; font-size: 0.75rem; font-weight: 700; color: var(--brass); text-transform: uppercase; letter-spacing: 1px; }

        /* Modal Styles */
        .modal-overlay-p { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .reply-modal-p { background: white; width: 100%; max-width: 550px; border-radius: 28px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); overflow: hidden; border: 1px solid rgba(255,255,255,0.2); }
        .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fafafa; }
        .modal-header h3 { margin: 0; color: var(--indigo); font-family: var(--font-serif); }
        .close-x { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #999; }
        .modal-body { padding: 2rem; }
        .orig-message { margin-bottom: 2rem; padding: 1.2rem; background: #f8f9fa; border-left: 4px solid var(--brass); border-radius: 8px; }
        .orig-message label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #999; display: block; margin-bottom: 5px; }
        .orig-message p { margin: 0; font-size: 0.95rem; color: var(--text-dark); font-style: italic; }
        .modal-body textarea { width: 100%; min-height: 180px; padding: 1.2rem; border-radius: 16px; border: 2px solid #eee; font-family: inherit; font-size: 1rem; transition: all 0.3s; }
        .modal-body textarea:focus { border-color: var(--brass); outline: none; box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1); }
        .modal-footer { padding: 1.5rem 2rem; display: flex; justify-content: flex-end; gap: 1rem; background: #fafafa; border-top: 1px solid #eee; }
        .modal-footer button { border-radius: 30px !important; }
        .btn-secondary { background: #ffffffff !important; color: #c52727ff !important; border: 1px solid #ddd !important; border-radius: 30px !important; padding: 10px 20px !important; }
        .btn-secondary:hover { background: #e9e9e9 !important; }

        @media (max-width: 1100px) { .messages-grid-layout { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 650px) { .messages-grid-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AdminMessages;
