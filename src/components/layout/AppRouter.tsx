import React, { Suspense, lazy } from 'react';
import { useAppStore } from '../../stores/appStore';
import { useModuleData } from '../../hooks/useModuleData';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { MainMenu } from '../ui/MainMenu';
import type { LearningModule } from '../../types';
import '../../styles/components/app-router.css';

// Lazy load learning components with better error handling
const FlashcardComponent = lazy(() =>
  import('../learning/FlashcardComponent')
    .then(module => ({
      default: module.default,
    }))
    .catch(() => ({
      default: () => (
        <div className="app-router__error-fallback">Failed to load Flashcard component</div>
      ),
    }))
);

const QuizComponent = lazy(() =>
  import('../learning/QuizComponent')
    .then(module => ({
      default: module.default,
    }))
    .catch(() => ({
      default: () => (
        <div className="app-router__error-fallback">Failed to load Quiz component</div>
      ),
    }))
);

const CompletionComponent = lazy(() =>
  import('../learning/CompletionComponent')
    .then(module => ({
      default: module.default,
    }))
    .catch(() => ({
      default: () => (
        <div className="app-router__error-fallback">Failed to load Completion component</div>
      ),
    }))
);

const SortingComponent = lazy(() =>
  import('../learning/SortingComponent')
    .then(module => ({
      default: module.default,
    }))
    .catch(() => ({
      default: () => (
        <div className="app-router__error-fallback">Failed to load Sorting component</div>
      ),
    }))
);

const MatchingComponent = lazy(() =>
  import('../learning/MatchingComponent')
    .then(module => ({
      default: module.default,
    }))
    .catch(() => ({
      default: () => (
        <div className="app-router__error-fallback">Failed to load Matching component</div>
      ),
    }))
);

const ReadingComponent = lazy(() =>
  import('../learning/ReadingComponent')
    .then(module => ({
      default: module.default,
    }))
    .catch(() => ({
      default: () => (
        <div className="app-router__error-fallback">Failed to load Reading component</div>
      ),
    }))
);

// Enhanced loading component
const ComponentLoader: React.FC = () => (
  <div className="app-router__loader">
    <LoadingSkeleton />
  </div>
);

// Error component for module loading failures
const ModuleError: React.FC<{ error: Error; moduleId: string; onRetry: () => void }> = ({
  error,
  moduleId,
  onRetry,
}) => (
  <div className="app-router__error">
    <div className="app-router__error-container">
      <div className="app-router__error-icon">⚠️</div>
      <h3 className="app-router__error-title">Failed to load module: {moduleId}</h3>
      <p className="app-router__error-message">{error.message}</p>
      <div className="app-router__error-actions">
        <button onClick={onRetry} className="app-router__error-btn app-router__error-btn--primary">
          Retry
        </button>
        <button
          onClick={() => window.location.reload()}
          className="app-router__error-btn app-router__error-btn--secondary"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

interface LearningComponentWrapperProps {
  moduleId: string;
  children: (module: LearningModule) => React.ReactNode;
}

// Wrapper component to handle module data loading
const LearningComponentWrapper: React.FC<LearningComponentWrapperProps> = ({
  moduleId,
  children,
}) => {
  const { data: moduleData, isLoading, error, refetch } = useModuleData(moduleId);

  if (isLoading) {
    return <ComponentLoader />;
  }

  if (error) {
    return <ModuleError error={error as Error} moduleId={moduleId} onRetry={() => refetch()} />;
  }

  if (!moduleData) {
    return (
      <div className="app-router__no-module">
        <p className="app-router__no-module-text">No module data available</p>
      </div>
    );
  }

  return <>{children(moduleData)}</>;
};

export const AppRouter: React.FC = () => {
  const { currentView, currentModule } = useAppStore();

  // Return menu for menu view
  if (currentView === 'menu') {
    return <MainMenu />;
  }

  // For learning modes, we need a module
  const moduleId = currentModule?.id;
  if (!moduleId) {
    return (
      <div className="app-router__no-module">
        <p className="app-router__no-module-text">No module selected</p>
        <button onClick={() => window.location.reload()} className="app-router__no-module-btn">
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <Suspense fallback={<ComponentLoader />}>
      <LearningComponentWrapper moduleId={moduleId}>
        {module => {
          switch (currentView) {
            case 'flashcard':
              return <FlashcardComponent module={module} />;
            case 'quiz':
              return <QuizComponent module={module} />;
            case 'completion':
              return <CompletionComponent module={module} />;
            case 'sorting':
              return <SortingComponent module={module} />;
            case 'matching':
              return <MatchingComponent module={module} />;
            case 'reading':
              return <ReadingComponent module={module} />;
            default:
              return (
                <div className="app-router__unknown-view">
                  <p className="app-router__unknown-view-text">Unknown view: {currentView}</p>
                </div>
              );
          }
        }}
      </LearningComponentWrapper>
    </Suspense>
  );
};
