'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashCard {
  front: string;
  back: string;
}

interface FlashcardsGameProps {
  cards: FlashCard[];
  timeLimit?: number; // in seconds
  onComplete: (score: number, timeSpent: number) => void;
}

export default function FlashcardsGame({ cards, timeLimit = 180, onComplete }: FlashcardsGameProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (gameState === 'finished') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const finishGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const totalAttempts = correctCount + wrongCount;
    const score = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    
    setGameState('finished');
    onComplete(score, timeSpent);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }

    // Move to next card or finish
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      finishGame();
    }
  };

  const restartGame = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(timeLimit);
    setGameState('playing');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  if (gameState === 'finished') {
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    return (
      <div className="card max-w-2xl mx-auto text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-primary mb-4">Game Complete!</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-green-700">Correct</div>
          </div>
          <div className="bg-red-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{wrongCount}</div>
            <div className="text-sm text-red-700">Wrong</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-blue-700">Accuracy</div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Time: {formatTime(timeSpent)} • Score: {Math.round((correctCount / cards.length) * 100)}
        </div>

        <button onClick={restartGame} className="btn-primary mr-4">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-green-600">✓ {correctCount}</span>
            <span className="mx-2">•</span>
            <span className="text-red-600">✗ {wrongCount}</span>
          </div>
          <div className="text-lg font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div 
          className="relative w-full h-64 cursor-pointer perspective-1000"
          onClick={handleCardFlip}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isFlipped ? 'back' : 'front'}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center p-8 shadow-lg"
            >
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-2">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>
                <div className="text-sm text-gray-500">
                  {isFlipped ? 'Definition' : 'Click to reveal definition'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Answer Buttons */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-4"
        >
          <button
            onClick={() => handleAnswer(false)}
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            ✗ Wrong
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            ✓ Correct
          </button>
        </motion.div>
      )}

      {!isFlipped && (
        <div className="text-center text-sm text-gray-500">
          Study the term, then click the card to see the definition
        </div>
      )}
    </div>
  );
}