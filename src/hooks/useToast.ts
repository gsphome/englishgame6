import { useCallback } from 'react';
import { toast } from '../stores/toastStore';

/**
 * Custom hook for toast notifications with predefined messages for learning app
 */
export const useToast = () => {
  // Learning-specific toast messages
  const showCorrectAnswer = useCallback(() => {
    const messages = [
      '¡Correcto! 🎉',
      '¡Excelente! ✨',
      '¡Perfecto! 🌟',
      '¡Bien! 👏',
      '¡Genial! 🚀',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    // Quick success feedback - explanation is already in main UI
    toast.success(randomMessage, undefined, { duration: 2000 });
  }, []);

  const showIncorrectAnswer = useCallback(() => {
    // Quick error feedback - explanation is already in main UI
    toast.error('Incorrecto', undefined, { duration: 2000 });
  }, []);

  const showModuleCompleted = useCallback((moduleName: string, score: number, accuracy: number) => {
    // Use single toast to ensure clean completion message
    if (accuracy >= 90) {
      toast.success(
        '🎉 ¡Excelente trabajo!',
        `${moduleName} completado con ${accuracy.toFixed(0)}% de precisión (+${score} puntos)`
      );
    } else if (accuracy >= 70) {
      toast.success(
        '✨ ¡Bien hecho!',
        `${moduleName} completado con ${accuracy.toFixed(0)}% de precisión (+${score} puntos)`
      );
    } else if (accuracy >= 50) {
      toast.info(
        'Módulo completado',
        `${moduleName} - ${accuracy.toFixed(0)}% de precisión. ¡Sigue practicando!`
      );
    } else {
      toast.warning(
        'Módulo completado',
        `${moduleName} - ${accuracy.toFixed(0)}% de precisión. Te recomendamos repasar el contenido.`
      );
    }
  }, []);

  const showLevelUp = useCallback((newLevel: number, totalPoints: number) => {
    toast.success(
      '¡Nivel alcanzado!',
      `Has llegado al nivel ${newLevel} (+${totalPoints} puntos)`,
      { duration: 5000 }
    );
  }, []);

  const showStreak = useCallback((days: number) => {
    toast.success('¡Racha activa!', `${days} días consecutivos aprendiendo 🔥`);
  }, []);

  const showConnectionError = useCallback(() => {
    toast.error('Error de conexión', 'Verifica tu conexión a internet', {
      action: {
        label: 'Reintentar',
        onClick: () => window.location.reload(),
      },
    });
  }, []);

  const showSaveSuccess = useCallback((item: string = 'Configuración') => {
    toast.success('Guardado', `${item} guardada correctamente`);
  }, []);

  const showLoadingError = useCallback((item: string = 'contenido') => {
    toast.error('Error de carga', `No se pudo cargar ${item}. Intenta de nuevo.`);
  }, []);

  const showFeatureComingSoon = useCallback((feature: string) => {
    toast.info('Próximamente', `${feature} estará disponible pronto`);
  }, []);

  const showTip = useCallback((tip: string) => {
    toast.info('💡 Consejo', tip, { duration: 6000 });
  }, []);

  const showWelcome = useCallback((userName?: string) => {
    const message = userName ? `¡Bienvenido de vuelta, ${userName}!` : '¡Bienvenido!';
    toast.success(message, 'Listo para seguir aprendiendo');
  }, []);

  // Generic toast functions (re-exported for convenience)
  const showSuccess = useCallback((title: string, message?: string) => {
    toast.success(title, message);
  }, []);

  const showError = useCallback((title: string, message?: string) => {
    toast.error(title, message);
  }, []);

  const showInfo = useCallback((title: string, message?: string) => {
    toast.info(title, message);
  }, []);

  const showWarning = useCallback((title: string, message?: string) => {
    toast.warning(title, message);
  }, []);

  return {
    // Learning-specific
    showCorrectAnswer,
    showIncorrectAnswer,
    showModuleCompleted,
    showLevelUp,
    showStreak,
    showTip,
    showWelcome,

    // System-specific
    showConnectionError,
    showSaveSuccess,
    showLoadingError,
    showFeatureComingSoon,

    // Generic
    showSuccess,
    showError,
    showInfo,
    showWarning,

    // Direct access to toast store
    toast,
  };
};
