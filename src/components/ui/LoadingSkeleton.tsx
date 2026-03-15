import React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../utils/i18n';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'button' | 'header' | 'grid' | 'score';
  count?: number;
  className?: string;
  width?: string;
  height?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  count = 1,
  className = '',
  width,
  height,
}) => {
  const { language } = useSettingsStore();
  const { t } = useTranslation(language);
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-24 w-24 rounded-lg';
      case 'text':
        return 'h-4 w-full rounded';
      case 'button':
        return 'h-10 w-32 rounded-lg';
      case 'header':
        return 'h-6 w-48 rounded';
      case 'score':
        return 'h-8 w-40 rounded-xl';
      case 'grid':
        return 'h-24 w-24 rounded-lg';
      default:
        return 'h-4 w-full rounded';
    }
  };

  const skeletonClasses = `${baseClasses} ${getVariantClasses()} ${className}`;
  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  if (count === 1) {
    return (
      <div className={skeletonClasses} style={style} aria-label={t('common.loadingContent')} />
    );
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      role="status"
      aria-label={t('common.loadingContent')}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClasses} style={style} />
      ))}
    </div>
  );
};

// Componentes específicos para casos comunes
export const ModuleGridSkeleton: React.FC = () => {
  const { language } = useSettingsStore();
  const { t } = useTranslation(language);
  return (
    <div className="menu__grid" role="status" aria-label={t('navigation.loadingModules')}>
      <div className="menu__grid-container">
        {Array.from({ length: 12 }).map((_, index) => (
          <LoadingSkeleton key={index} variant="grid" />
        ))}
      </div>
    </div>
  );
};
