import React from 'react';
import '../../styles/iqac_dashboard.css';

const StatsCards = ({ totalEvents, reportsGenerated, pendingReports }) => {
  const stats = [
    { label: 'Total Events', value: totalEvents, icon: '📅' },
    { label: 'Reports Generated', value: reportsGenerated, icon: '📄' },
    { label: 'Pending Reports', value: pendingReports, icon: '⏳' },
  ];

  return (
    <div className="stats-overview anim-fade-in-up">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card-new">
          <div className="stat-icon-wrapper">
            <span>{stat.icon}</span>
          </div>
          <div className="stat-info-new">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
