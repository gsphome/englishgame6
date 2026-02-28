import React from 'react';

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
    return <div className={skeletonClasses} style={style} aria-label="Loading content" />;
  }

  return (
    <div className="space-y-2" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClasses} style={style} />
      ))}
    </div>
  );
};

// Componentes específicos para casos comunes
export const ModuleGridSkeleton: React.FC = () => (
  <div className="menu__grid" role="status" aria-label="Loading modules">
    <div className="menu__grid-container">
      {Array.from({ length: 12 }).map((_, index) => (
        <LoadingSkeleton key={index} variant="grid" />
      ))}
    </div>
  </div>
);

export const HeaderSkeleton: React.FC = () => (
  <div className="header-redesigned" role="status" aria-label="Loading header">
    <div className="header-redesigned__container">
      <div className="header-redesigned__left">
        <LoadingSkeleton variant="button" width="40px" height="40px" />
        <LoadingSkeleton variant="header" width="120px" />
      </div>
      <div className="header-redesigned__center">
        <LoadingSkeleton variant="score" />
      </div>
      <div className="header-redesigned__right">
        <LoadingSkeleton variant="button" width="80px" />
        <LoadingSkeleton variant="button" width="100px" />
      </div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="dashboard-skeleton" role="status" aria-label="Loading dashboard">
    <LoadingSkeleton variant="header" width="300px" />

    {/* Stats Cards Skeleton */}
    <div className="dashboard-skeleton__stats-grid">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="dashboard-skeleton__stat-card">
          <div className="dashboard-skeleton__stat-content">
            <LoadingSkeleton width="32px" height="32px" className="dashboard-skeleton__stat-icon" />
            <div className="dashboard-skeleton__stat-info">
              <LoadingSkeleton variant="text" width="80px" />
              <LoadingSkeleton variant="text" width="60px" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="dashboard-skeleton__charts-grid">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="dashboard-skeleton__chart-card">
          <LoadingSkeleton
            variant="header"
            width="200px"
            className="dashboard-skeleton__chart-title"
          />
          <LoadingSkeleton width="100%" height="300px" />
        </div>
      ))}
    </div>
  </div>
);
