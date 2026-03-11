import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '../stores/settingsStore';
import { apiService, fetchModules, fetchModuleData } from '../services/api';
import type { LearningModule } from '../types';

export const useModuleData = (moduleId: string) => {
  const { categories, level, gameSettings, developmentMode } = useSettingsStore();

  return useQuery({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      const response = await fetchModuleData(moduleId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch module data');
      }
      return response.data;
    },
    select: (module: LearningModule) => {
      // Apply filtering using the service layer
      if (module.data && Array.isArray(module.data)) {
        // Determine limit based on game settings
        let limit = 10; // default

        if (module.learningMode) {
          switch (module.learningMode) {
            case 'flashcard':
              limit = gameSettings.flashcardMode.wordCount;
              break;
            case 'quiz':
              limit = gameSettings.quizMode.questionCount;
              break;
            case 'completion':
              limit = gameSettings.completionMode.itemCount;
              break;
            case 'sorting':
              // For sorting mode, we need more data than the final word count
              // because the component will select words from multiple categories
              limit =
                gameSettings.sortingMode.wordCount * gameSettings.sortingMode.categoryCount * 2;
              break;
            case 'matching':
              limit = gameSettings.matchingMode.wordCount;
              break;
          }
        }

        const filteredData = apiService.filterModuleData(
          module.data,
          {
            categories: developmentMode ? [] : categories,
            level: developmentMode ? 'all' : level,
            limit,
          },
          moduleId
        );

        return { ...module, data: filteredData };
      }

      return module;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('not found')) {
        return false; // Don't retry for 404-like errors
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });
};

export const useAllModules = () => {
  const { categories, level, developmentMode } = useSettingsStore();

  return useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const response = await fetchModules();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch modules');
      }
      return response.data;
    },
    select: (modules: LearningModule[]) => {
      // In development mode, show all modules without filtering
      if (developmentMode) {
        return modules;
      }

      // Filter modules based on settings
      return modules.filter(module => {
        // Filter by categories
        if (categories.length > 0 && module.category) {
          if (!categories.includes(module.category)) {
            return false;
          }
        }

        // Filter by level - module.level can be array or string
        if (level !== 'all' && module.level) {
          const moduleLevels = Array.isArray(module.level) ? module.level : [module.level];
          if (!moduleLevels.includes(level as any)) {
            return false;
          }
        }

        return true;
      });
    },
    staleTime: 15 * 60 * 1000, // 15 minutes for modules list
    retry: 3,
  });
};
