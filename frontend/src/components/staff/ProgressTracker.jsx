import React from 'react';

const ProgressTracker = ({ documents }) => {
  const total = documents.length;
  // +1 for Venue being required, handled in parent, but let's just count documents here
  const completed = documents.filter(doc => doc.isUploaded).length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div style={{ minWidth: '250px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Task Completion</span>
        <span style={{ fontSize: '0.9rem', color: percentage === 100 ? 'var(--success-color)' : 'var(--info-color)' }}>
          {percentage}%
        </span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: percentage === 100 ? 'var(--success-color)' : 'var(--info-color)',
            transition: 'width 0.3s ease'
          }} 
        />
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
        {documents.map(doc => (
          <li key={doc.key} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', color: doc.isUploaded ? 'var(--success-color)' : 'var(--text-secondary)' }}>
            <span style={{ marginRight: '8px', fontSize: '1rem' }}>{doc.isUploaded ? '✔' : '○'}</span>
            {doc.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;
