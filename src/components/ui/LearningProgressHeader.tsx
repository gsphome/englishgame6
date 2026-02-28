import React from 'react';
import '../../styles/components/learning-progress-header.css';

export type LearningMode = 'flashcard' | 'quiz' | 'completion' | 'sorting' | 'matching' | 'reading';

interface LearningProgressHeaderProps {
  title: string;
  currentIndex: number;
  totalItems: number;
  mode: LearningMode;
  helpText?: string;
}

const LearningProgressHeader: React.FC<LearningProgressHeaderProps> = ({
  title,
  currentIndex,
  totalItems,
  mode,
  helpText,
}) => {
  const progressPercentage = totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0;

  return (
    <div className="learning-progress-header">
      <div className="learning-progress-header__top">
        <h2 className="learning-progress-header__title">{title}</h2>
        <span className="learning-progress-header__counter">
          {totalItems > 0 ? `${currentIndex + 1}/${totalItems}` : '...'}
        </span>
      </div>
      <div className="learning-progress-header__progress-container">
        <div
          className={`learning-progress-header__progress-fill learning-progress-header__progress-fill--${mode}`}
          style={
            {
              '--progress-width': `${progressPercentage}%`,
            } as React.CSSProperties
          }
        />
      </div>
      {helpText && <p className="learning-progress-header__help-text">{helpText}</p>}
    </div>
  );
};

export default LearningProgressHeader;
