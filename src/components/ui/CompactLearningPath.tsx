import React from 'react';
import { X, CheckCircle, Star, MapPin } from 'lucide-react';
import { useProgression } from '../../hooks/useProgression';
// Note: useProgressStore removed as we consolidated the information
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../utils/i18n';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import '../../styles/components/compact-learning-path.css';
import '../../styles/components/modal-buttons.css';

interface CompactLearningPathProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompactLearningPath: React.FC<CompactLearningPathProps> = ({ isOpen, onClose }) => {
  const progression = useProgression();
  // Note: isModuleCompleted removed as we consolidated the information
  const { language } = useSettingsStore();
  const { t } = useTranslation(language);

  // Handle escape key to close modal
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const { stats } = progression;
  const nextRecommended = progression.getNextRecommendedModule();

  // Note: availableModules removed as we consolidated the information

  const unitInfo = {
    1: { name: 'Foundation', shortName: 'Found', code: 'A1', color: 'emerald' },
    2: { name: 'Elementary', shortName: 'Elem', code: 'A2', color: 'blue' },
    3: { name: 'Intermediate', shortName: 'Inter', code: 'B1', color: 'purple' },
    4: { name: 'Upper-Intermediate', shortName: 'Upper', code: 'B2', color: 'orange' },
    5: { name: 'Advanced', shortName: 'Adv', code: 'C1', color: 'red' },
    6: { name: 'Mastery', shortName: 'Mast', code: 'C2', color: 'indigo' },
  };

  return (
    <div className="compact-learning-path">
      <div className="compact-learning-path__container">
        <div className="compact-learning-path__header">
          <div className="compact-learning-path__title-section">
            <MapPin className="compact-learning-path__icon" />
            <h2 className="compact-learning-path__title">
              {t('modals.learningPath', 'Learning Path')}
            </h2>
          </div>
          <button onClick={onClose} className="modal__close-btn" aria-label={t('common.close')}>
            <X className="modal__close-icon" />
          </button>
        </div>

        <div className="compact-learning-path__content">
          {/* Progress Overview - Simplified */}
          <div className="compact-learning-path__overview">
            {/* Progress Percentage */}
            <div className="compact-learning-path__stat">
              <div className="compact-learning-path__stat-icon compact-learning-path__stat-icon--emoji">
                📊
              </div>
              <span className="compact-learning-path__stat-value">
                {stats.completionPercentage}%
              </span>
              <span className="compact-learning-path__stat-label">
                {t('learningPath.complete', 'Complete')}
              </span>
            </div>

            {/* Completed Ratio */}
            <div className="compact-learning-path__stat">
              <CheckCircle className="compact-learning-path__stat-icon compact-learning-path__stat-icon--completed" />
              <span className="compact-learning-path__stat-value">
                {stats.completedModules} / {stats.totalModules}
              </span>
              <span className="compact-learning-path__stat-label">
                {t('learningPath.completed', 'Completed')}
              </span>
            </div>
          </div>

          {/* Next Recommended Module - Consolidated */}
          {nextRecommended && (
            <div className="compact-learning-path__next-module">
              <h3 className="compact-learning-path__section-title">
                <Star className="compact-learning-path__section-icon" />
                {t('learningPath.nextRecommended', 'Siguiente Recomendado')}
              </h3>
              <div className="compact-learning-path__recommended-card">
                <div className="compact-learning-path__module-priority">
                  <Star className="compact-learning-path__module-priority-icon" />
                  <span className="compact-learning-path__module-priority-text">
                    {t('learningPath.recommended', 'Recomendado')}
                  </span>
                </div>
                <div className="compact-learning-path__module-info">
                  <div className="compact-learning-path__module-header">
                    <span
                      className={`compact-learning-path__module-level compact-learning-path__module-level--${unitInfo[nextRecommended.unit as keyof typeof unitInfo]?.color}`}
                    >
                      {unitInfo[nextRecommended.unit as keyof typeof unitInfo]?.code}
                    </span>
                    <span className="compact-learning-path__module-type">
                      {nextRecommended.learningMode}
                    </span>
                  </div>
                  <h4 className="compact-learning-path__module-name">{nextRecommended.name}</h4>
                </div>
              </div>
            </div>
          )}

          {/* Unit Progress Summary - Circular Design */}
          <div className="compact-learning-path__units">
            <h3 className="compact-learning-path__section-title">
              {t('learningPath.unitProgress', 'Progreso por Nivel')}
            </h3>
            <div className="compact-learning-path__unit-grid">
              {stats.unitStats.map(unitStat => {
                const info = unitInfo[unitStat.unit as keyof typeof unitInfo];

                return (
                  <div key={unitStat.unit} className="compact-learning-path__unit-item">
                    <div className="compact-learning-path__unit-circle">
                      <svg className="compact-learning-path__unit-circle-svg" viewBox="0 0 36 36">
                        <path
                          className="compact-learning-path__unit-circle-bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={`compact-learning-path__unit-circle-fill compact-learning-path__unit-circle-fill--${info?.color}`}
                          strokeDasharray={`${unitStat.percentage}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="compact-learning-path__unit-circle-content">
                        <span
                          className={`compact-learning-path__unit-circle-badge compact-learning-path__unit-circle-badge--${info?.color}`}
                        >
                          {info?.code}
                        </span>
                        <span className="compact-learning-path__unit-circle-percentage">
                          {unitStat.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="compact-learning-path__unit-circle-info">
                      <span className="compact-learning-path__unit-circle-name" title={info?.name}>
                        {info?.shortName}
                      </span>
                      <span className="compact-learning-path__unit-circle-stats">
                        {unitStat.completed}/{unitStat.total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="modal__actions modal__actions--single">
            <button onClick={onClose} className="modal__btn modal__btn--primary">
              {t('common.continue', 'Continuar Aprendiendo')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
