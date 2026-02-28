import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { useUserStore } from '../../stores/userStore';
import '../../styles/components/score-display.css';

export const ScoreDisplay: React.FC = () => {
  const { sessionScore, globalScore, currentView } = useAppStore();
  const { getTotalScore } = useUserStore();

  // Determine what to show based on current view
  const isInGame = currentView !== 'menu';
  const totalPoints = getTotalScore();

  // Calculate level based on total points
  const level = Math.floor(totalPoints / 100) + 1;
  const levelProgress = (totalPoints % 100) / 100;

  return (
    <div
      className={`score-display-compact ${isInGame ? 'score-display-compact--learning' : 'score-display-compact--menu'}`}
      role="status"
      aria-live="polite"
      aria-label={
        isInGame
          ? `Session score: ${sessionScore.correct} correct, ${sessionScore.incorrect} incorrect, ${sessionScore.accuracy.toFixed(0)}% accuracy`
          : `Global score: ${globalScore.correct} correct, ${globalScore.incorrect} incorrect, ${globalScore.accuracy.toFixed(0)}% accuracy, Level ${level}`
      }
    >
      {/* Adaptive container based on context */}
      <div
        className={`score-display-compact__container ${isInGame ? 'score-display-compact__container--in-game' : 'score-display-compact__container--full'}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isInGame ? (
          // Compact session score with fixed layout
          <div className="score-display-compact__session">
            <div className="score-display-compact__icon" role="img" aria-label="Session score">
              🎯
            </div>
            <div className="score-display-compact__values">
              <span
                className="score-display-compact__correct"
                aria-label={`${sessionScore.correct} correct answers`}
              >
                {sessionScore.correct}
              </span>
              <span className="score-display-compact__separator" aria-hidden="true">
                /
              </span>
              <span
                className="score-display-compact__incorrect"
                aria-label={`${sessionScore.incorrect} incorrect answers`}
              >
                {sessionScore.incorrect}
              </span>
            </div>
            <div
              className="score-display-compact__accuracy min-width-sm"
              aria-label={`${sessionScore.accuracy.toFixed(0)} percent accuracy`}
            >
              {sessionScore.total > 0 ? `${sessionScore.accuracy.toFixed(0)}%` : '0%'}
            </div>
          </div>
        ) : (
          // Compact global score with level indicator
          <div className="score-display-compact__global">
            <div className="score-display-compact__main">
              <div className="score-display-compact__icon" role="img" aria-label="Global score">
                🌍
              </div>
              <div className="score-display-compact__values">
                <span
                  className="score-display-compact__correct"
                  aria-label={`${globalScore.correct} total correct answers`}
                >
                  {globalScore.correct}
                </span>
                <span className="score-display-compact__separator" aria-hidden="true">
                  /
                </span>
                <span
                  className="score-display-compact__incorrect"
                  aria-label={`${globalScore.incorrect} total incorrect answers`}
                >
                  {globalScore.incorrect}
                </span>
              </div>
              <div
                className="score-display-compact__accuracy min-width-sm"
                aria-label={`${globalScore.accuracy.toFixed(0)} percent overall accuracy`}
              >
                {globalScore.total > 0 ? `${globalScore.accuracy.toFixed(0)}%` : '0%'}
              </div>
            </div>

            {/* Level indicator - Compact horizontal layout */}
            <div className="score-display-compact__divider" aria-hidden="true" />
            <div className="score-display-compact__level">
              <div className="score-display-compact__level-badge" aria-label={`Level ${level}`}>
                L{level}
              </div>
              <div
                className="score-display-compact__points"
                aria-label={`${totalPoints} total points`}
              >
                {totalPoints}
              </div>
              {/* Compact progress bar for next level */}
              <div
                className="score-display-compact__progress-bar"
                role="progressbar"
                aria-valuenow={Math.round(levelProgress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${Math.round(levelProgress * 100)}% progress to next level`}
              >
                <div
                  className="score-display-compact__progress-fill"
                  style={{ '--progress-width': `${levelProgress * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
