import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import type { LearningModule } from '../types';

export const useSearch = (modules: LearningModule[]) => {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(modules, {
      keys: ['name', 'description', 'category', 'tags'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [modules]);

  const results = useMemo(() => {
    if (!query.trim()) return modules;
    return fuse.search(query).map(result => result.item);
  }, [query, fuse, modules]);

  return { query, setQuery, results };
};
