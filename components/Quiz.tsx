'use client';

import { useState, useEffect } from 'react';
import { Quiz as QuizType } from '@/lib/types';

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number, answers: number[], timeSpent: number) => void;
  onRetry?: () => void;
}

export default function Quiz({ quiz, onComplete, onRetry }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(quiz.questions[0]?.timeLimit || 30);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up, move to next question or finish quiz
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isCompleted]);

  const handleTimeUp = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      moveToNextQuestion();
    } else {
      finishQuiz();
    }
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setTimeLeft(quiz.questions[prevQuestion]?.timeLimit || 30);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setTimeLeft(quiz.questions[nextQuestion]?.timeLimit || 30);
    } else {
      finishQuiz();
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeft(quiz.questions[0]?.timeLimit || 30);
    setTotalTimeSpent(0);
    setIsCompleted(false);
  };

  const finishQuiz = () => {
    setIsCompleted(true);
    const score = calculateScore();
    onComplete(score, answers, totalTimeSpent);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (isCompleted) {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;
    
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">{passed ? '🎉' : '😅'}</div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            {passed ? 'Congratulations!' : 'Almost There!'}
          </h2>
          <p className="text-lg text-gray-900 mb-6">
            {passed 
              ? `Excellent! You scored ${score}% and passed the quiz!`
              : `You scored ${score}%. You need ${quiz.passingScore}% to pass. Don't give up - try again!`
            }
          </p>
          
          {/* Results Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length}
                </div>
                <div className="text-sm text-gray-500">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {answers.filter((answer, index) => answer !== -1 && answer !== quiz.questions[index].correctAnswer).length}
                </div>
                <div className="text-sm text-gray-500">Wrong</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-500">
                  {Math.floor(totalTimeSpent / 60)}:{(totalTimeSpent % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500">Time</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            {!passed && onRetry && (
              <button 
                onClick={restartQuiz}
                className="btn-primary"
              >
                Try Again
              </button>
            )}
            {!passed && (
              <button 
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                Back to Course
              </button>
            )}
            {passed && (
              <button 
                onClick={() => window.history.back()}
                className="btn-primary"
              >
                Continue Course
              </button>
            )}
          </div>

          {/* XP Reward Info */}
          <p className="text-sm text-gray-500 mt-4">
            {passed ? `+${quiz.xpReward} XP earned!` : `+${Math.floor(quiz.xpReward / 3)} XP for trying`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-900">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {currentQuestionData.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-accent bg-accent bg-opacity-10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 ${
                  answers[currentQuestion] === index
                    ? 'border-accent bg-accent'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-full h-full rounded-full bg-accent flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <span className="font-medium text-gray-900">{String.fromCharCode(65 + index)}.</span>
                <span className="ml-2 text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          {currentQuestion > 0 && (
            <button
              onClick={moveToPreviousQuestion}
              className="btn-secondary"
            >
              ← Previous
            </button>
          )}
          <div className="text-sm text-gray-900">
            Time remaining: {timeLeft}s
          </div>
        </div>
        <button
          onClick={moveToNextQuestion}
          disabled={answers[currentQuestion] === -1}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}