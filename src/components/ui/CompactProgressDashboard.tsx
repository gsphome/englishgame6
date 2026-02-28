import React from 'react';
import { X, Trophy, Target, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { useProgressStore } from '../../stores/progressStore';
import { useUserStore } from '../../stores/userStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../utils/i18n';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import '../../styles/components/compact-progress-dashboard.css';
import '../../styles/components/modal-buttons.css';

interface CompactProgressDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompactProgressDashboard: React.FC<CompactProgressDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const { getProgressData, getWeeklyAverage } = useProgressStore();
  const { userScores, getTotalScore } = useUserStore();

  // Handle escape key to close modal
  useEscapeKey(isOpen, onClose);
  const { language } = useSettingsStore();
  const { t } = useTranslation(language);

  if (!isOpen) return null;

  // Get real progress data from store
  const progressData = getProgressData(7);
  const weeklyAverage = getWeeklyAverage();
  const totalSessions = progressData.reduce((sum, day) => sum + day.sessionsCount, 0);
  const totalTimeSpent = progressData.reduce((sum, day) => sum + day.timeSpent, 0);
  const totalScore = getTotalScore();

  // Calculate average score
  const moduleData = Object.values(userScores);
  const avgScore =
    moduleData.length > 0
      ? Math.round(moduleData.reduce((sum, m) => sum + m.bestScore, 0) / moduleData.length)
      : weeklyAverage || 0;

  return (
    <div className="compact-dashboard">
      <div className="compact-dashboard__container">
        <div className="compact-dashboard__header">
          <div className="compact-dashboard__title-section">
            <BarChart3 className="compact-dashboard__icon" />
            <h2 className="compact-dashboard__title">
              {t('modals.progressDashboard', 'Progress Dashboard')}
            </h2>
          </div>
          <button onClick={onClose} className="modal__close-btn" aria-label={t('common.close')}>
            <X className="modal__close-icon" />
          </button>
        </div>

        <div className="compact-dashboard__content">
          {/* Compact Stats Grid */}
          <div className="compact-dashboard__stats">
            <div className="compact-dashboard__stat compact-dashboard__stat--points">
              <Trophy className="compact-dashboard__stat-icon" />
              <div className="compact-dashboard__stat-content">
                <span className="compact-dashboard__stat-value">{totalScore.toLocaleString()}</span>
                <span className="compact-dashboard__stat-label">
                  {t('dashboard.totalScore', 'Points earned')}
                </span>
              </div>
            </div>

            <div className="compact-dashboard__stat compact-dashboard__stat--accuracy">
              <Target className="compact-dashboard__stat-icon" />
              <div className="compact-dashboard__stat-content">
                <span className="compact-dashboard__stat-value">{avgScore}%</span>
                <span className="compact-dashboard__stat-label">
                  {t('dashboard.learningAccuracy', 'Accuracy')}
                </span>
              </div>
            </div>

            <div className="compact-dashboard__stat compact-dashboard__stat--sessions">
              <Clock className="compact-dashboard__stat-icon" />
              <div className="compact-dashboard__stat-content">
                <span className="compact-dashboard__stat-value">{totalSessions}</span>
                <span className="compact-dashboard__stat-label">
                  {t('dashboard.studySessions', 'Sessions')}
                </span>
              </div>
            </div>

            <div className="compact-dashboard__stat compact-dashboard__stat--time">
              <TrendingUp className="compact-dashboard__stat-icon" />
              <div className="compact-dashboard__stat-content">
                <span className="compact-dashboard__stat-value">
                  {Math.round(totalTimeSpent / 60)}
                </span>
                <span className="compact-dashboard__stat-label">
                  {t('dashboard.timeSpent', 'Time practiced')}
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Progress Summary */}
          <div className="compact-dashboard__progress">
            <h3 className="compact-dashboard__section-title">
              {t('dashboard.weeklyProgress', 'Progreso Semanal')}
            </h3>
            <div className="compact-dashboard__progress-content">
              {progressData.length === 0 ? (
                <div className="compact-dashboard__no-data">
                  <TrendingUp className="compact-dashboard__no-data-icon" />
                  <p className="compact-dashboard__no-data-text">
                    {t('dashboard.completeModulesMessage')}
                  </p>
                </div>
              ) : (
                <div className="compact-dashboard__progress-bars">
                  {progressData.slice(-5).map((day, index) => {
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString(language, { weekday: 'short' });
                    return (
                      <div key={index} className="compact-dashboard__progress-day">
                        <div className="compact-dashboard__progress-bar">
                          <div
                            className="compact-dashboard__progress-fill dynamic-height"
                            style={
                              {
                                '--dynamic-height': `${Math.max(day.averageScore || 0, 5)}%`,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                        <span className="compact-dashboard__progress-day-label">{dayName}</span>
                        <span className="compact-dashboard__progress-day-value">
                          {day.averageScore || 0}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
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
