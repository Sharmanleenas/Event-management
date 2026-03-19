import React from 'react';

const AnalyticsCards = ({ stats }) => {
  const cards = [
    { title: "Total Participants", value: stats?.totalParticipants || 0, icon: "👥", color: "var(--indigo)" },
    { title: "Verified", value: stats?.verifiedParticipants || 0, icon: "✅", color: "var(--success)" },
    { title: "Pending", value: stats?.pendingVerification || 0, icon: "⏳", color: "var(--warning)" },
    { title: "Total Amount", value: `₹${stats?.totalAmount || 0}`, icon: "💰", color: "var(--burgundy)" },
    { title: "Games Managed", value: stats?.totalGames || 0, icon: "🎮", color: "var(--brass)" }
  ];

  return (
    <div className="stats-grid analytics-cards">
      {cards.map((card, i) => (
        <div key={i} className="card stat-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
          <span className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>{card.icon}</span>
          <div className="stat-info">
            <p>{card.title}</p>
            <h3>{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
