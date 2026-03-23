import React from 'react';
import '../../styles/iqac_editor.css';

const ReportPreview = ({ report, headerData }) => {
  if (!report) return (
    <div className="paper-doc empty">
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📝</div>
        <h3>Interactive Document Builder</h3>
        <p>Your AI-drafted academic report will appear here. Start filling out the details on the left to begin.</p>
    </div>
  );

  // Helper to parse the AI report string into rich JSX
  const parseReportContent = (text) => {
    if (!text) return null;
    
    // Split into paragraphs by double newlines
    const sections = text.split(/\n\n+/);
    
    return sections.map((section, idx) => {
      // Check if section is a list (starts with bullet points)
      if (section.includes('\n* ') || section.startsWith('* ') || section.includes('\n- ') || section.startsWith('- ')) {
        const items = section.split(/\n[*|-]\s+/).filter(i => i.trim());
        return (
          <ul key={idx} className="doc-list">
            {items.map((item, i) => <li key={i} className="doc-list-item">{item.trim()}</li>)}
          </ul>
        );
      }
      
      // Normal paragraph
      return <p key={idx} className="doc-p">{section.trim()}</p>;
    });
  };

  return (
    <div className="paper-doc anim-fade-in">
        <div className="doc-title">IQAC EVENT REPORT</div>
        
        <div className="doc-meta-row">
            <div className="doc-meta-item">
                <strong>Department:</strong> {headerData.department}
            </div>
            <div className="doc-meta-item">
                <strong>Date:</strong> {headerData.date ? new Date(headerData.date).toLocaleDateString() : 'TBD'}
            </div>
        </div>

        <div className="doc-section">
            <h3 className="doc-heading">1. EVENT OVERVIEW</h3>
            <div className="doc-p">
                The academic event titled "<strong>{headerData.title}</strong>" was successfully conducted at <strong>{headerData.venue || 'TBD'}</strong> on {headerData.date || 'TBD'}. 
                The session lasted for a total duration of {headerData.duration || 'N/A'}. 
            </div>
        </div>

        <div className="doc-section">
            <h3 className="doc-heading">2. DETAILED REPORT</h3>
            <div className="doc-content-body">
                {parseReportContent(report)}
            </div>
        </div>

        <div className="doc-section">
            <h3 className="doc-heading">3. RESOURCE PERSON DETAILS</h3>
            <div className="doc-p">
                <strong>Primary Resource Person:</strong> {headerData.rpName}<br />
                <strong>Designation:</strong> {headerData.rpDesignation}<br />
                <strong>Qualification:</strong> {headerData.rpQualification}<br />
                <strong>Relevant Experience:</strong> {headerData.rpExperience}
            </div>
        </div>

        <div className="doc-footer">
            <span>Official IQAC Document</span>
            <span>Digital Draft V1.0</span>
            <span>Page 1 of 1</span>
        </div>
    </div>
  );
};

export default ReportPreview;
