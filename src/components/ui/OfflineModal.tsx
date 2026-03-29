import React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAppStore } from '../../stores/appStore';
import { useTranslation } from '../../utils/i18n';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import '../../styles/components/offline-modal.css';

interface OfflineModalProps {
  isOpen: boolean;
  onRetry: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({ isOpen, onRetry }) => {
  const { language } = useSettingsStore();
  const { t } = useTranslation(language);
  const setCurrentView = useAppStore(state => state.setCurrentView);

  const handleGoToMenu = () => {
    setCurrentView('menu');
    window.location.hash = '#/menu';
  };

  useEscapeKey(isOpen, handleGoToMenu);

  if (!isOpen) return null;

  return (
    <div className="offline-modal" role="presentation" onClick={handleGoToMenu}>
      <div
        className="offline-modal__container"
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="offline-modal-title"
        aria-describedby="offline-modal-message"
      >
        <div className="offline-modal__header">
          <span className="offline-modal__icon" aria-hidden="true">📡</span>
        </div>
        <div className="offline-modal__body">
          <h2 id="offline-modal-title" className="offline-modal__title">
            {t('errors.moduleNotAvailableOffline')}
          </h2>
          <p id="offline-modal-message" className="offline-modal__message">
            {t('errors.moduleNotAvailableOfflineDescription')}
          </p>
        </div>
        <div className="offline-modal__actions">
          <button
            onClick={handleGoToMenu}
            className="offline-modal__btn offline-modal__btn--primary"
          >
            {t('navigation.returnToMenu')}
          </button>
          <button
            onClick={onRetry}
            className="offline-modal__btn offline-modal__btn--secondary"
          >
            {t('errors.tryAgain')}
          </button>
        </div>
      </div>
    </div>
  );
};
