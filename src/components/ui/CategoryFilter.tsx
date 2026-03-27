import React, { useState } from 'react';
import { Tags, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../utils/i18n';
import type { Category } from '../../types';
import '../../styles/components/category-filter.css';

const ALL_CATEGORIES: Category[] = [
  'Vocabulary',
  'Grammar',
  'PhrasalVerbs',
  'Idioms',
  'Reading',
  'Review',
];

const CATEGORY_EMOJIS: Record<Category, string> = {
  Vocabulary: '📚',
  Grammar: '📝',
  PhrasalVerbs: '🔗',
  Idioms: '💭',
  Reading: '📖',
  Review: '🔄',
};

const CATEGORY_I18N_KEYS: Record<Category, string> = {
  Vocabulary: 'categories.vocabulary',
  Grammar: 'categories.grammar',
  PhrasalVerbs: 'categories.phrasalverbs',
  Idioms: 'categories.idioms',
  Reading: 'categories.reading',
  Review: 'categories.review',
};

export const CategoryFilter: React.FC = () => {
  const { categories, setCategories, language } = useSettingsStore();
  const { t } = useTranslation(language);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleCategory = (category: Category) => {
    const isActive = categories.includes(category);
    let next: string[];

    if (isActive) {
      next = categories.filter(c => c !== category);
    } else {
      next = [...categories, category];
    }

    // Req 1.4: if all deselected, auto-select all
    if (next.length === 0) {
      next = [...ALL_CATEGORIES];
    }

    setCategories(next);
  };

  return (
    <div className="category-filter">
      <button
        className="category-filter__toggle-btn"
        onClick={() => setIsExpanded(prev => !prev)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? t('categoryFilter.collapse') : t('categoryFilter.expand')}
        type="button"
      >
        <Tags aria-hidden="true" />
        {t('categoryFilter.title')}
        {isExpanded ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
      </button>

      <div
        className={`category-filter__panel${isExpanded ? ' category-filter__panel--open' : ''}`}
        role="group"
        aria-label={t('categoryFilter.title')}
      >
        <div className="category-filter__chips">
          {ALL_CATEGORIES.map(category => {
            const isActive = categories.includes(category);
            return (
              <button
                key={category}
                className={`category-filter__chip${isActive ? ' category-filter__chip--active' : ''}`}
                onClick={() => handleToggleCategory(category)}
                aria-pressed={isActive}
                type="button"
              >
                <span className="category-filter__chip-emoji" aria-hidden="true">
                  {CATEGORY_EMOJIS[category]}
                </span>
                <span className="category-filter__chip-label">
                  {t(CATEGORY_I18N_KEYS[category])}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
