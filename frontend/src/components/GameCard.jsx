import React from 'react';

/**
 * Modern GameCard for EventDetailsPage sidebar
 * Shows game name, category, and available slots
 */
const GameCard = ({ game }) => {
  const slotsRemaining = (game.participantLimit || 0) - (game.currentRegistrations || 0);
  const isFull = slotsRemaining <= 0;

  return (
    <div className={`game-mini-card ${isFull ? 'game-full' : ''}`}>
      <div className="game-info">
        <h4 className="game-name">{game.name}</h4>
        <div className="game-tag-row">
            <span className="game-category-badge">{game.category}</span>
            {isFull ? (
                <span className="slots-badge full">FULL</span>
            ) : (
                <span className="slots-badge">{slotsRemaining} Slots Left</span>
            )}
        </div>
      </div>
      {game.instructions && (
        <div className="game-hint">
          {game.instructions.substring(0, 60)}{game.instructions.length > 60 ? '...' : ''}
        </div>
      )}
    </div>
  );
};

export default GameCard;
