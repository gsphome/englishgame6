import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../utils/i18n';
import '../../styles/components/orientation-lock.css';

interface OrientationLockProps {
  /** Optional custom message for the orientation lock */
  message?: string;
  /** Optional custom subtitle */
  subtitle?: string;
}

/**
 * OrientationLock Component
 *
 * Displays a user-friendly message when the device is in landscape orientation
 * on mobile devices, encouraging users to rotate to portrait mode for optimal
 * learning experience.
 *
 * Features:
 * - Only shows on mobile devices in landscape mode
 * - Elegant design consistent with app theme
 * - Animated rotation icon
 * - Theme-aware styling (light/dark mode)
 * - Internationalization support (English/Spanish)
 * - Accessibility compliant
 */
export const OrientationLock: React.FC<OrientationLockProps> = ({ message, subtitle }) => {
  const { language } = useSettingsStore();
  const { t } = useTranslation(language);

  return (
    <div className="orientation-lock">
      <div className="orientation-lock__container">
        <div className="orientation-lock__icon-wrapper">
          <RotateCcw className="orientation-lock__icon" size={48} aria-hidden="true" />
        </div>

        <div className="orientation-lock__content">
          <h2 className="orientation-lock__title">{message || t('orientation.title')}</h2>
          <p className="orientation-lock__subtitle">{subtitle || t('orientation.subtitle')}</p>
          <p className="orientation-lock__explanation">{t('orientation.explanation')}</p>
        </div>
      </div>
    </div>
  );
};
