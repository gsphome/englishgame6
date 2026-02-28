import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useUserStore } from '../../stores/userStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useMenuNavigation } from '../../hooks/useMenuNavigation';
import { useProgressStore } from '../../stores/progressStore';
import { useTranslation } from '../../utils/i18n';
import { useToast } from '../../hooks/useToast';
import { useLearningCleanup } from '../../hooks/useLearningCleanup';
import { conditionalShuffle } from '../../utils/randomUtils';
import { ContentAdapter } from '../../utils/contentAdapter';
import ContentRenderer from '../ui/ContentRenderer';
import LearningProgressHeader from '../ui/LearningProgressHeader';

import type { LearningModule, QuizData } from '../../types';

interface QuizComponentProps {
  module: LearningModule;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ module }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const { updateSessionScore } = useAppStore();
  const { updateUserScore } = useUserStore();
  const { theme, language, randomizeItems } = useSettingsStore();

  // Process questions with optional randomization based on settings
  const processedQuestions = useMemo(() => {
    if (!module?.data) return [];

    const questions = module.data as QuizData[];
    const processedQuestions = conditionalShuffle(questions, randomizeItems);

    // Conditionally randomize options for each question
    return processedQuestions.map(question => {
      if (!question.options || !question.correct) return question;

      const processedOptions = conditionalShuffle([...question.options], randomizeItems);

      return {
        ...question,
        options: processedOptions,
      };
    });
  }, [module?.data, randomizeItems]);
  const { returnToMenu } = useMenuNavigation();
  const { addProgressEntry } = useProgressStore();
  const { t } = useTranslation(language);
  const { showCorrectAnswer, showIncorrectAnswer, showModuleCompleted } = useToast();
  useLearningCleanup();

  const handleReturnToMenu = () => returnToMenu();

  const isDark = theme === 'dark';
  const textColor = isDark ? 'white' : '#111827';

  const currentQuestion = processedQuestions[currentIndex];

  const handleAnswerSelect = useCallback(
    (optionIndex: number) => {
      if (showResult || !currentQuestion) return;

      const selectedAnswerText = currentQuestion.options?.[optionIndex];
      const isCorrect = selectedAnswerText === currentQuestion.correct;

      setSelectedAnswer(optionIndex);
      setShowResult(true);

      updateSessionScore(isCorrect ? { correct: 1 } : { incorrect: 1 });

      if (isCorrect) {
        showCorrectAnswer();
      } else {
        showIncorrectAnswer();
      }
    },
    [showResult, currentQuestion, updateSessionScore, showCorrectAnswer, showIncorrectAnswer]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < processedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const { sessionScore } = useAppStore.getState();
      const finalScore = Math.round((sessionScore.correct / sessionScore.total) * 100);
      const accuracy = sessionScore.accuracy;

      // Register progress
      addProgressEntry({
        score: finalScore,
        totalQuestions: sessionScore.total,
        correctAnswers: sessionScore.correct,
        moduleId: module.id,
        learningMode: 'quiz',
        timeSpent: timeSpent,
      });

      showModuleCompleted(module.name, finalScore, accuracy);
      updateUserScore(module.id, finalScore, timeSpent);
      returnToMenu({ autoScrollToNext: true });
    }
  }, [
    currentIndex,
    processedQuestions.length,
    startTime,
    addProgressEntry,
    module.id,
    module.name,
    showModuleCompleted,
    updateUserScore,
    returnToMenu,
  ]);

  useEffect(() => {
    if (processedQuestions.length === 0) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4' && !showResult && currentQuestion) {
        const optionIndex = parseInt(e.key) - 1;
        if (optionIndex < (currentQuestion.options?.length || 0)) {
          handleAnswerSelect(optionIndex);
        }
      } else if (e.key === 'Enter' && showResult) {
        handleNext();
      } else if (e.key === 'Escape') {
        returnToMenu();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    showResult,
    currentQuestion,
    processedQuestions.length,
    handleAnswerSelect,
    handleNext,
    returnToMenu,
  ]);

  // Early return if no data
  if (!processedQuestions.length) {
    return (
      <div className="quiz-component__no-data">
        <p className="quiz-component__no-data-text">{t('learning.noQuizQuestions')}</p>
        <button onClick={handleReturnToMenu} className="quiz-component__no-data-btn">
          {t('learning.backToMenu')}
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-component__container">
      {/* Unified progress header */}
      <LearningProgressHeader
        title={module.name}
        currentIndex={currentIndex}
        totalItems={processedQuestions.length}
        mode="quiz"
        helpText={showResult ? t('learning.pressEnterNext') : t('learning.pressSelectOption')}
      />

      {/* Question */}
      <div className="quiz-component__question-card">
        <h3
          className="quiz-component__question-title dynamic-text-color"
          style={{ '--dynamic-text-color': textColor } as React.CSSProperties}
        >
          <ContentRenderer
            content={ContentAdapter.ensureStructured(
              currentQuestion?.question ||
                currentQuestion?.sentence ||
                t('learning.loadingQuestion'),
              'quiz'
            )}
          />
        </h3>

        {/* Options */}
        <div className="quiz-component__options">
          {(currentQuestion?.options || []).map((option, index) => {
            let buttonClass = 'quiz-component__option';

            if (showResult) {
              if (currentQuestion?.options[index] === currentQuestion?.correct) {
                buttonClass += ' quiz-component__option--correct';
              } else if (
                index === selectedAnswer &&
                currentQuestion?.options[index] !== currentQuestion?.correct
              ) {
                buttonClass += ' quiz-component__option--incorrect';
              } else {
                buttonClass += ' quiz-component__option--disabled';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="quiz-component__option-content">
                  <div className="quiz-component__option-left">
                    <span className="quiz-component__option-number">{index + 1}</span>
                    <span
                      className="quiz-component__option-text dynamic-text-color"
                      style={{ '--dynamic-text-color': textColor } as React.CSSProperties}
                    >
                      {option}
                    </span>
                  </div>

                  {showResult && (
                    <div>
                      {currentQuestion?.options[index] === currentQuestion?.correct && (
                        <CheckCircle className="quiz-component__option-icon quiz-component__option-icon--correct" />
                      )}
                      {index === selectedAnswer &&
                        currentQuestion?.options[index] !== currentQuestion?.correct && (
                          <XCircle className="quiz-component__option-icon quiz-component__option-icon--incorrect" />
                        )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation - Always present with smooth transition */}
        <div
          className={`quiz-component__explanation-container ${
            showResult && currentQuestion?.explanation
              ? 'quiz-component__explanation-container--visible'
              : 'quiz-component__explanation-container--hidden'
          }`}
        >
          <div className="quiz-component__explanation">
            <h4
              className="quiz-component__explanation-title dynamic-text-color"
              style={{ '--dynamic-text-color': textColor } as React.CSSProperties}
            >
              {t('learning.explanation')}
            </h4>
            <div
              className="quiz-component__explanation-content dynamic-text-color"
              style={{ '--dynamic-text-color': textColor } as React.CSSProperties}
            >
              <ContentRenderer
                content={ContentAdapter.ensureStructured(
                  currentQuestion?.explanation || '',
                  'explanation'
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unified Control Bar */}
      <div className="game-controls">
        {/* Home Navigation */}
        <button
          onClick={handleReturnToMenu}
          className="game-controls__home-btn"
          title={t('learning.returnToMainMenu')}
        >
          <Home className="game-controls__home-btn__icon" />
        </button>

        <button
          onClick={handleNext}
          disabled={!showResult}
          className="game-controls__primary-btn game-controls__primary-btn--green"
        >
          <span>
            {currentIndex === processedQuestions.length - 1
              ? t('learning.finishQuiz')
              : t('learning.nextQuestion')}
          </span>
          <ArrowRight className="game-controls__primary-btn__icon" />
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;
