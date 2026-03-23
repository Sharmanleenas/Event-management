import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/iqac_editor.css';

const EditPanel = ({ report, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(report);
  const [aiInstruction, setAiInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualSave = () => {
    onUpdate(editedContent);
    setIsEditing(false);
    toast.success('Manual changes saved!');
  };

  const handleAIRefine = async () => {
    if (!aiInstruction) return toast.warning('What would you like to change?');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/api/iqac/modify', {
        currentReport: report,
        instruction: aiInstruction
      });
      onUpdate(data.report);
      setEditedContent(data.report);
      setAiInstruction('');
      toast.success('AI refinement applied!');
    } catch (err) {
      toast.error('AI failed to refine. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="refinement-card anim-slide-up">
      <h3>✨ Final Refinement</h3>
      
      <button 
        className="btn-manual-edit-new"
        onClick={() => isEditing ? handleManualSave() : setIsEditing(true)}
      >
        {isEditing ? '💾 Save Changes' : '✏️ Manual Edit'}
      </button>

      {isEditing ? (
        <div style={{ marginBottom: '1.5rem' }}>
          <textarea 
            className="refinement-input"
            rows="10"
            style={{ height: '300px', resize: 'vertical' }}
            value={editedContent} 
            onChange={e => setEditedContent(e.target.value)} 
          />
        </div>
      ) : (
        <div className="refinement-status">
          ✅ Report draft is ready. You can manually edit or use AI below to refine.
        </div>
      )}

      <div className="refinement-ai-box">
        <label>🪄 Refine with Gemini AI</label>
        <input 
          type="text" 
          className="refinement-input"
          placeholder="e.g. 'Make it more formal'" 
          value={aiInstruction} 
          onChange={e => setAiInstruction(e.target.value)} 
        />
        <button 
          className="btn-refine-action" 
          onClick={handleAIRefine}
          disabled={loading}
        >
          {loading ? <span className="loading-spinner"></span> : 'Apply AI Magic'}
        </button>
      </div>
    </div>
  );
};

export default EditPanel;
