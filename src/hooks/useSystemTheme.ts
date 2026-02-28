import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { setupSystemThemeListener, detectSystemTheme } from '../utils/themeInitializer';

/**
 * Hook to sync with system theme changes
 * Only updates the theme if user hasn't manually set a preference
 */
export function useSystemTheme() {
  const { setTheme } = useSettingsStore();

  useEffect(() => {
    // Set up listener for system theme changes
    const cleanup = setupSystemThemeListener(newTheme => {
      // Only auto-update if user hasn't stored a manual preference
      try {
        const storedSettings = localStorage.getItem('settings-storage');
        if (!storedSettings) {
          // No stored preference, follow system
          setTheme(newTheme);
        } else {
          const parsed = JSON.parse(storedSettings);
          // If theme was set to system preference initially, keep following system
          if (!parsed.state?.theme || parsed.state.theme === detectSystemTheme()) {
            setTheme(newTheme);
          }
        }
      } catch (error) {
        console.warn('Failed to check stored theme preference:', error);
        // On error, follow system theme
        setTheme(newTheme);
      }
    });

    return cleanup;
  }, [setTheme]);
}
