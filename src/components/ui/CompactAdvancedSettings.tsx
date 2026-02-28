import React, { useState, useEffect } from 'react';
import { X, Settings, Save, Gamepad2, Palette, Wrench } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../utils/i18n';
import { validateGameSettings } from '../../utils/inputValidation';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import '../../styles/components/compact-advanced-settings.css';
import '../../styles/components/modal-buttons.css';

interface CompactAdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompactAdvancedSettings: React.FC<CompactAdvancedSettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    theme,
    language,
    level,
    developmentMode,
    randomizeItems,
    categories,
    gameSettings,
    setTheme,
    setLanguage,
    setLevel,
    setDevelopmentMode,
    setRandomizeItems,
    setCategories,
    setGameSetting,
  } = useSettingsStore();

  const { t } = useTranslation(language);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'games' | 'categories'>('general');

  // Handle escape key to close modal
  useEscapeKey(isOpen, onClose);

  // Local state for editing
  const [localTheme, setLocalTheme] = useState(theme);
  const [localLanguage, setLocalLanguage] = useState(language);
  const [localLevel, setLocalLevel] = useState(level);
  const [localDevelopmentMode, setLocalDevelopmentMode] = useState(developmentMode);
  const [localRandomizeItems, setLocalRandomizeItems] = useState(randomizeItems);
  const [localCategories, setLocalCategories] = useState(categories);
  const [localGameSettings, setLocalGameSettings] = useState(gameSettings);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalTheme(theme);
      setLocalLanguage(language);
      setLocalLevel(level);
      setLocalDevelopmentMode(developmentMode);
      setLocalRandomizeItems(randomizeItems);
      setLocalCategories(categories);
      setLocalGameSettings(gameSettings);
      setHasChanges(false);
    }
  }, [isOpen, theme, language, level, developmentMode, randomizeItems, categories, gameSettings]);

  // Check for changes
  useEffect(() => {
    const changed =
      localTheme !== theme ||
      localLanguage !== language ||
      localLevel !== level ||
      localDevelopmentMode !== developmentMode ||
      localRandomizeItems !== randomizeItems ||
      JSON.stringify(localCategories) !== JSON.stringify(categories) ||
      JSON.stringify(localGameSettings) !== JSON.stringify(gameSettings);
    setHasChanges(changed);
  }, [
    localTheme,
    localLanguage,
    localLevel,
    localDevelopmentMode,
    localRandomizeItems,
    localCategories,
    localGameSettings,
    theme,
    language,
    level,
    developmentMode,
    randomizeItems,
    categories,
    gameSettings,
  ]);

  const handleSave = () => {
    if (!hasChanges) return;

    // Validate all settings before saving
    const validatedSettings = validateGameSettings(localGameSettings);

    // Apply all changes
    setTheme(localTheme);
    setLanguage(localLanguage);
    setLevel(localLevel);
    setDevelopmentMode(localDevelopmentMode);
    setRandomizeItems(localRandomizeItems);
    setCategories(localCategories);

    // Apply validated game settings
    Object.entries(validatedSettings).forEach(([mode, settings]) => {
      Object.entries(settings as Record<string, unknown>).forEach(([setting, value]) => {
        setGameSetting(mode as any, setting, value as number);
      });
    });

    setHasChanges(false);
    onClose();
  };

  const handleSaveAndClose = () => {
    if (hasChanges) {
      handleSave();
    } else {
      onClose();
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories: string[];
    if (checked) {
      newCategories = [...localCategories, category];
    } else {
      newCategories = localCategories.filter(c => c !== category);
    }

    // UX: If no categories selected, auto-select all for consistency
    if (newCategories.length === 0) {
      newCategories = [...allCategories];
    }

    setLocalCategories(newCategories);
  };

  const handleGameSettingChange = (mode: string, setting: string, value: number) => {
    setLocalGameSettings({
      ...localGameSettings,
      [mode]: {
        ...localGameSettings[mode as keyof typeof localGameSettings],
        [setting]: value,
      },
    });
  };

  if (!isOpen) return null;

  const allCategories = ['Vocabulary', 'Grammar', 'PhrasalVerbs', 'Idioms'];
  const categoryLabels = {
    Vocabulary: t('settings.vocabulary'),
    Grammar: t('settings.grammar'),
    PhrasalVerbs: t('settings.phrasalVerbs'),
    Idioms: t('settings.idioms'),
  };

  return (
    <div className="compact-settings">
      <div className="compact-settings__container">
        <div className="compact-settings__header">
          <div className="compact-settings__title-section">
            <Settings className="compact-settings__icon" />
            <h2 className="compact-settings__title">{t('modals.advancedSettings')}</h2>
          </div>
          <button onClick={onClose} className="modal__close-btn" aria-label={t('common.close')}>
            <X className="modal__close-icon" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="compact-settings__tabs">
          <button
            onClick={() => setActiveTab('general')}
            className={`compact-settings__tab ${activeTab === 'general' ? 'compact-settings__tab--active' : ''}`}
          >
            <Palette className="compact-settings__tab-icon" />
            <span className="compact-settings__tab-title">{t('settings.generalSettings')}</span>
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`compact-settings__tab ${activeTab === 'games' ? 'compact-settings__tab--active' : ''}`}
          >
            <Gamepad2 className="compact-settings__tab-icon" />
            <span className="compact-settings__tab-title compact-settings__tab-title--compact">
              {t('settings.itemSettings')}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`compact-settings__tab ${activeTab === 'categories' ? 'compact-settings__tab--active' : ''}`}
          >
            <Wrench className="compact-settings__tab-icon" />
            <span className="compact-settings__tab-title">{t('settings.categorySettings')}</span>
          </button>
        </div>

        <div className="compact-settings__content">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="compact-settings__section">
              <div className="compact-settings__fields">
                <div className="compact-settings__field">
                  <label className="compact-settings__label">{t('settings.theme')}</label>
                  <select
                    className="compact-settings__select"
                    value={localTheme}
                    onChange={e => setLocalTheme(e.target.value as 'light' | 'dark')}
                  >
                    <option value="light">☀️ {t('settings.light')}</option>
                    <option value="dark">🌙 {t('settings.dark')}</option>
                  </select>
                </div>

                <div className="compact-settings__field">
                  <label className="compact-settings__label">{t('settings.language')}</label>
                  <select
                    className="compact-settings__select"
                    value={localLanguage}
                    onChange={e => setLocalLanguage(e.target.value as 'en' | 'es')}
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Español</option>
                  </select>
                </div>

                <div className="compact-settings__field">
                  <label className="compact-settings__label">{t('settings.level')}</label>
                  <select
                    className="compact-settings__select"
                    value={localLevel}
                    onChange={e => setLocalLevel(e.target.value as any)}
                  >
                    <option value="all">🌟 {t('settings.all')}</option>
                    <option value="a1">🟢 A1</option>
                    <option value="a2">🟡 A2</option>
                    <option value="b1">🟠 B1</option>
                    <option value="b2">🔴 B2</option>
                    <option value="c1">🟣 C1</option>
                    <option value="c2">⚫ C2</option>
                  </select>
                </div>

                <div className="compact-settings__field compact-settings__field--dev">
                  <div className="compact-settings__toggle-container">
                    <label
                      className="compact-settings__label compact-settings__label--dev"
                      title={t(
                        'settings.developmentModeDescription',
                        'Unlock all modes for testing'
                      )}
                    >
                      🔧 Dev Mode:{' '}
                      {localDevelopmentMode ? t('settings.enabled') : t('settings.disabled')}
                    </label>
                    <input
                      type="checkbox"
                      id="developmentMode"
                      className="compact-settings__toggle"
                      checked={localDevelopmentMode}
                      onChange={e => setLocalDevelopmentMode(e.target.checked)}
                    />
                  </div>
                </div>

                <div className="compact-settings__field compact-settings__field--dev">
                  <div className="compact-settings__toggle-container">
                    <label
                      className="compact-settings__label compact-settings__label--dev"
                      title={t(
                        'settings.randomizeItemsDescription',
                        'Shuffle cards, questions and exercises in random order'
                      )}
                    >
                      🎲 {t('settings.randomizeItems')}:{' '}
                      {localRandomizeItems ? t('settings.enabled') : t('settings.disabled')}
                    </label>
                    <input
                      type="checkbox"
                      id="randomizeItems"
                      className="compact-settings__toggle"
                      checked={localRandomizeItems}
                      onChange={e => setLocalRandomizeItems(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Games Settings Tab */}
          {activeTab === 'games' && (
            <div className="compact-settings__section">
              <div className="compact-settings__games">
                <div className="compact-settings__game">
                  <label className="compact-settings__game-label">
                    📚 {t('settings.flashcardMode')}
                  </label>
                  <div className="compact-settings__game-stepper">
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--minus"
                      onClick={() =>
                        handleGameSettingChange(
                          'flashcardMode',
                          'wordCount',
                          Math.max(5, (localGameSettings.flashcardMode.wordCount || 10) - 1)
                        )
                      }
                      disabled={(localGameSettings.flashcardMode.wordCount || 10) <= 5}
                      aria-label="Decrease flashcard count"
                    >
                      −
                    </button>
                    <span className="compact-settings__stepper-value">
                      {localGameSettings.flashcardMode.wordCount || 10}
                    </span>
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--plus"
                      onClick={() =>
                        handleGameSettingChange(
                          'flashcardMode',
                          'wordCount',
                          Math.min(30, (localGameSettings.flashcardMode.wordCount || 10) + 1)
                        )
                      }
                      disabled={(localGameSettings.flashcardMode.wordCount || 10) >= 30}
                      aria-label="Increase flashcard count"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="compact-settings__game">
                  <label className="compact-settings__game-label">
                    ❓ {t('settings.quizMode')}
                  </label>
                  <div className="compact-settings__game-stepper">
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--minus"
                      onClick={() =>
                        handleGameSettingChange(
                          'quizMode',
                          'questionCount',
                          Math.max(5, (localGameSettings.quizMode.questionCount || 10) - 1)
                        )
                      }
                      disabled={(localGameSettings.quizMode.questionCount || 10) <= 5}
                      aria-label="Decrease quiz count"
                    >
                      −
                    </button>
                    <span className="compact-settings__stepper-value">
                      {localGameSettings.quizMode.questionCount || 10}
                    </span>
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--plus"
                      onClick={() =>
                        handleGameSettingChange(
                          'quizMode',
                          'questionCount',
                          Math.min(25, (localGameSettings.quizMode.questionCount || 10) + 1)
                        )
                      }
                      disabled={(localGameSettings.quizMode.questionCount || 10) >= 25}
                      aria-label="Increase quiz count"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="compact-settings__game">
                  <label className="compact-settings__game-label">
                    ✏️ {t('settings.completionMode')}
                  </label>
                  <div className="compact-settings__game-stepper">
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--minus"
                      onClick={() =>
                        handleGameSettingChange(
                          'completionMode',
                          'itemCount',
                          Math.max(5, (localGameSettings.completionMode.itemCount || 10) - 1)
                        )
                      }
                      disabled={(localGameSettings.completionMode.itemCount || 10) <= 5}
                      aria-label="Decrease completion count"
                    >
                      −
                    </button>
                    <span className="compact-settings__stepper-value">
                      {localGameSettings.completionMode.itemCount || 10}
                    </span>
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--plus"
                      onClick={() =>
                        handleGameSettingChange(
                          'completionMode',
                          'itemCount',
                          Math.min(20, (localGameSettings.completionMode.itemCount || 10) + 1)
                        )
                      }
                      disabled={(localGameSettings.completionMode.itemCount || 10) >= 20}
                      aria-label="Increase completion count"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="compact-settings__game">
                  <label className="compact-settings__game-label">
                    🔄 {t('settings.sortingMode')}
                  </label>
                  <div className="compact-settings__game-stepper">
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--minus"
                      onClick={() =>
                        handleGameSettingChange(
                          'sortingMode',
                          'wordCount',
                          Math.max(8, (localGameSettings.sortingMode.wordCount || 12) - 1)
                        )
                      }
                      disabled={(localGameSettings.sortingMode.wordCount || 12) <= 8}
                      aria-label="Decrease sorting count"
                    >
                      −
                    </button>
                    <span className="compact-settings__stepper-value">
                      {localGameSettings.sortingMode.wordCount || 12}
                    </span>
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--plus"
                      onClick={() =>
                        handleGameSettingChange(
                          'sortingMode',
                          'wordCount',
                          Math.min(20, (localGameSettings.sortingMode.wordCount || 12) + 1)
                        )
                      }
                      disabled={(localGameSettings.sortingMode.wordCount || 12) >= 20}
                      aria-label="Increase sorting count"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="compact-settings__game">
                  <label className="compact-settings__game-label">
                    🔗 {t('settings.matchingMode')}
                  </label>
                  <div className="compact-settings__game-stepper">
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--minus"
                      onClick={() =>
                        handleGameSettingChange(
                          'matchingMode',
                          'wordCount',
                          Math.max(4, (localGameSettings.matchingMode.wordCount || 6) - 1)
                        )
                      }
                      disabled={(localGameSettings.matchingMode.wordCount || 6) <= 4}
                      aria-label="Decrease matching count"
                    >
                      −
                    </button>
                    <span className="compact-settings__stepper-value">
                      {localGameSettings.matchingMode.wordCount || 6}
                    </span>
                    <button
                      type="button"
                      className="compact-settings__stepper-btn compact-settings__stepper-btn--plus"
                      onClick={() =>
                        handleGameSettingChange(
                          'matchingMode',
                          'wordCount',
                          Math.min(12, (localGameSettings.matchingMode.wordCount || 6) + 1)
                        )
                      }
                      disabled={(localGameSettings.matchingMode.wordCount || 6) >= 12}
                      aria-label="Increase matching count"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="compact-settings__section">
              <div className="compact-settings__categories">
                {allCategories.map(category => (
                  <div key={category} className="compact-settings__category">
                    <input
                      type="checkbox"
                      id={category}
                      checked={localCategories.includes(category)}
                      onChange={e => handleCategoryChange(category, e.target.checked)}
                      className="compact-settings__category-checkbox"
                    />
                    <label htmlFor={category} className="compact-settings__category-label">
                      {category === 'Vocabulary' &&
                        `📚 ${categoryLabels[category as keyof typeof categoryLabels]}`}
                      {category === 'Grammar' &&
                        `📝 ${categoryLabels[category as keyof typeof categoryLabels]}`}
                      {category === 'PhrasalVerbs' &&
                        `🔗 ${categoryLabels[category as keyof typeof categoryLabels]}`}
                      {category === 'Idioms' &&
                        `💭 ${categoryLabels[category as keyof typeof categoryLabels]}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions - Homologated with other modals */}
        <div className="modal__actions modal__actions--single">
          <button
            onClick={handleSaveAndClose}
            className="modal__btn modal__btn--primary"
            aria-label={hasChanges ? t('common.save') : t('common.close')}
          >
            <Save className="modal__btn-icon" />
            {hasChanges ? t('common.save') : t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
