import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../src/services/api';
import * as secureHttp from '../src/utils/secureHttp';
import * as pathUtils from '../src/utils/pathUtils';

// Mock dependencies
vi.mock('../src/utils/secureHttp');
vi.mock('../src/utils/pathUtils');
vi.mock('../src/utils/logger', () => ({
  logError: vi.fn(),
  logDebug: vi.fn(),
}));

describe('API Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiService.clearCache();
    
    // Mock path utilities
    vi.mocked(pathUtils.getLearningModulesPath).mockReturnValue('/data/learningModules.json');
    vi.mocked(pathUtils.getAssetPath).mockImplementation((path: string) => `/assets/${path}`);
  });

  describe('fetchModules', () => {
    it('should fetch and enhance modules successfully', async () => {
      const mockModules = [
        {
          id: 'test-module-1',
          name: 'Test Module 1',
          learningMode: 'flashcard',
          level: ['a1'],
          category: 'Vocabulary',
          unit: 1,
          prerequisites: [],
        },
        {
          id: 'test-module-2',
          name: 'Test Module 2',
          learningMode: 'quiz',
          level: ['a2'],
          category: 'Grammar',
          unit: 2,
          prerequisites: ['test-module-1'],
          estimatedTime: 10,
          difficulty: 4,
        }
      ];

      vi.mocked(secureHttp.secureJsonFetch).mockResolvedValue(mockModules);
      vi.mocked(secureHttp.validateUrl).mockImplementation((url: string) => url);

      const result = await apiService.fetchModules();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      
      // Check enhancement of first module (missing values)
      expect(result.data[0].estimatedTime).toBe(5); // Default value
      expect(result.data[0].difficulty).toBe(3); // Default value
      expect(result.data[0].tags).toEqual(['Vocabulary']); // Default from category
      
      // Check second module (has values)
      expect(result.data[1].estimatedTime).toBe(10); // Original value
      expect(result.data[1].difficulty).toBe(4); // Original value
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(secureHttp.secureJsonFetch).mockRejectedValue(new Error('Network error'));
      vi.mocked(secureHttp.validateUrl).mockImplementation((url: string) => url);

      const result = await apiService.fetchModules();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.error).toBe('Network error');
    });

    it('should use cache on subsequent calls', async () => {
      const mockModules = [
        {
          id: 'test-module-1',
          name: 'Test Module 1',
          learningMode: 'flashcard',
          level: ['a1'],
          category: 'Vocabulary',
          unit: 1,
          prerequisites: [],
        }
      ];

      vi.mocked(secureHttp.secureJsonFetch).mockResolvedValue(mockModules);
      vi.mocked(secureHttp.validateUrl).mockImplementation((url: string) => url);

      // First call
      const result1 = await apiService.fetchModules();
      expect(result1.success).toBe(true);

      // Second call should use cache
      const result2 = await apiService.fetchModules();
      expect(result2.success).toBe(true);
      expect(result2.data).toEqual(result1.data);

      // secureJsonFetch should only be called once
      expect(secureHttp.secureJsonFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchModuleData', () => {
    it('should fetch module with data successfully', async () => {
      const mockModules = [
        {
          id: 'test-flashcard',
          name: 'Test Flashcard',
          learningMode: 'flashcard',
          level: ['a1'],
          category: 'Vocabulary',
          unit: 1,
          prerequisites: [],
          dataPath: 'data/test-flashcard.json',
        }
      ];

      const mockModuleData = [
        { en: 'hello', es: 'hola' },
        { en: 'goodbye', es: 'adiós' }
      ];

      vi.mocked(secureHttp.secureJsonFetch)
        .mockResolvedValueOnce(mockModules) // First call for modules list
        .mockResolvedValueOnce(mockModuleData); // Second call for module data
      vi.mocked(secureHttp.validateUrl).mockImplementation((url: string) => url);

      const result = await apiService.fetchModuleData('test-flashcard');

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('test-flashcard');
      expect(result.data.data).toEqual(mockModuleData);
      expect(secureHttp.secureJsonFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle module not found', async () => {
      const mockModules = [
        {
          id: 'existing-module',
          name: 'Existing Module',
          learningMode: 'flashcard',
          level: ['a1'],
          category: 'Vocabulary',
          unit: 1,
          prerequisites: [],
        }
      ];

      vi.mocked(secureHttp.secureJsonFetch).mockResolvedValue(mockModules);
      vi.mocked(secureHttp.validateUrl).mockImplementation((url: string) => url);

      const result = await apiService.fetchModuleData('non-existent-module');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Module non-existent-module not found');
    });

    it('should handle module without dataPath', async () => {
      const mockModules = [
        {
          id: 'no-data-module',
          name: 'No Data Module',
          learningMode: 'flashcard',
          level: ['a1'],
          category: 'Vocabulary',
          unit: 1,
          prerequisites: [],
          // No dataPath
        }
      ];

      vi.mocked(secureHttp.secureJsonFetch).mockResolvedValue(mockModules);
      vi.mocked(secureHttp.validateUrl).mockImplementation((url: string) => url);

      const result = await apiService.fetchModuleData('no-data-module');

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('no-data-module');
      expect(result.data.data).toBeUndefined();
      // Should only call once for modules list, not for data
      expect(secureHttp.secureJsonFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('filterModuleData', () => {
    const mockData = [
      { category: 'Vocabulary', level: 'a1', text: 'Item 1' },
      { category: 'Grammar', level: 'a1', text: 'Item 2' },
      { category: 'Vocabulary', level: 'b1', text: 'Item 3' },
      { category: 'PhrasalVerbs', level: 'b1', text: 'Item 4' },
    ];

    it('should filter by categories', () => {
      const result = apiService.filterModuleData(
        mockData,
        { categories: ['Vocabulary'] },
        'test-module'
      );

      expect(result).toHaveLength(2);
      expect(result.every(item => item.category === 'Vocabulary')).toBe(true);
    });

    it('should filter by level', () => {
      const result = apiService.filterModuleData(
        mockData,
        { level: 'a1' },
        'test-module'
      );

      expect(result).toHaveLength(2);
      expect(result.every(item => item.level === 'a1')).toBe(true);
    });

    it('should apply limit', () => {
      const result = apiService.filterModuleData(
        mockData,
        { limit: 2 },
        'test-module'
      );

      expect(result).toHaveLength(2);
    });



    it('should handle empty data', () => {
      const result = apiService.filterModuleData(
        [],
        { categories: ['Vocabulary'] },
        'test-module'
      );

      expect(result).toEqual([]);
    });

    it('should handle non-array data', () => {
      const result = apiService.filterModuleData(
        null as any,
        { categories: ['Vocabulary'] },
        'test-module'
      );

      expect(result).toEqual([]);
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      apiService.clearCache();
      const stats = apiService.getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });

    it('should provide cache statistics', async () => {
      const mockModules = [{ id: 'test', name: 'Test', learningMode: 'flashcard', level: ['a1'], category: 'Vocabulary', unit: 1, prerequisites: [] }];
      vi.mocked(secureHttp.secureJsonFetch).mockResolvedValue(mockModules);
      vi.mocked(secureHttp.validateUrl).mockImplementation((url: string) => url);

      await apiService.fetchModules();
      
      const stats = apiService.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.keys.length).toBeGreaterThan(0);
    });
  });

});