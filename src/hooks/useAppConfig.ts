import { useQuery } from '@tanstack/react-query';
import { secureJsonFetch } from '../utils/secureHttp';
import { getAssetPath } from '../utils/pathUtils';
import { logError, logDebug } from '../utils/logger';

export interface Level {
  code: string;
  name: string;
  description: string;
  color: string;
}

export interface Unit {
  id: number;
  name: string;
  description: string;
  targetLevel: string[];
}

export interface AppConfig {
  learningSettings: {
    categories: string[];
    levels: Level[];
    units: Unit[];
  };
  progressTracking: {
    enabled: boolean;
    adaptiveLearning: boolean;
  };
}

/**
 * Hook to fetch and cache app configuration
 */
export const useAppConfig = () => {
  return useQuery({
    queryKey: ['app-config'],
    queryFn: async (): Promise<AppConfig> => {
      try {
        const configPath = getAssetPath('app-config.json');
        const config = await secureJsonFetch<AppConfig>(configPath);

        logDebug(
          'App config loaded successfully',
          {
            categoriesCount: config.learningSettings.categories.length,
            levelsCount: config.learningSettings.levels.length,
            unitsCount: config.learningSettings.units.length,
          },
          'useAppConfig'
        );

        return config;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logError('Failed to load app config', { error: errorMessage }, 'useAppConfig');

        // Return default config as fallback
        return {
          learningSettings: {
            categories: ['Vocabulary', 'Grammar', 'PhrasalVerbs', 'Idioms'],
            levels: [
              { code: 'a1', name: 'Beginner', description: 'Basic level', color: '#4CAF50' },
              { code: 'a2', name: 'Elementary', description: 'Elementary level', color: '#8BC34A' },
              {
                code: 'b1',
                name: 'Intermediate',
                description: 'Intermediate level',
                color: '#FFC107',
              },
              {
                code: 'b2',
                name: 'Upper Intermediate',
                description: 'Upper intermediate level',
                color: '#FF9800',
              },
              { code: 'c1', name: 'Advanced', description: 'Advanced level', color: '#FF5722' },
              { code: 'c2', name: 'Proficient', description: 'Proficient level', color: '#F44336' },
            ],
            units: [
              { id: 1, name: 'Foundation', description: 'Basic foundation', targetLevel: ['a1'] },
              {
                id: 2,
                name: 'Building Blocks',
                description: 'Building blocks',
                targetLevel: ['a2'],
              },
              {
                id: 3,
                name: 'Communication',
                description: 'Communication skills',
                targetLevel: ['b1'],
              },
              { id: 4, name: 'Fluency', description: 'Fluency development', targetLevel: ['b2'] },
              {
                id: 5,
                name: 'Proficiency',
                description: 'Advanced proficiency',
                targetLevel: ['c1'],
              },
              { id: 6, name: 'Mastery', description: 'Language mastery', targetLevel: ['c2'] },
            ],
          },
          progressTracking: {
            enabled: true,
            adaptiveLearning: true,
          },
        };
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a network/file not found error
      if (
        error instanceof Error &&
        (error.message.includes('fetch') || error.message.includes('not found'))
      ) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get available categories from config
 */
export const useAvailableCategories = () => {
  const { data: config, isLoading, error } = useAppConfig();

  return {
    categories: config?.learningSettings.categories || [],
    isLoading,
    error,
  };
};

/**
 * Hook to get available levels from config
 */
export const useAvailableLevels = () => {
  const { data: config, isLoading, error } = useAppConfig();

  return {
    levels: config?.learningSettings.levels || [],
    isLoading,
    error,
  };
};

/**
 * Hook to get available units from config
 */
export const useAvailableUnits = () => {
  const { data: config, isLoading, error } = useAppConfig();

  return {
    units: config?.learningSettings.units || [],
    isLoading,
    error,
  };
};
