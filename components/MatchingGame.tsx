'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingGameProps {
  pairs: MatchPair[];
  timeLimit?: number;
  onComplete: (score: number, timeSpent: number) => void;
}

interface GameItem {
  id: string;
  text: string;
  pairId: string;
  side: 'left' | 'right';
  matched: boolean;
}

export default function MatchingGame({ pairs, timeLimit = 120, onComplete }: MatchingGameProps) {
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Initialize game items
    const leftItems: GameItem[] = pairs.map(pair => ({
      id: `${pair.id}-left`,
      text: pair.left,
      pairId: pair.id,
      side: 'left',
      matched: false
    }));

    const rightItems: GameItem[] = pairs.map(pair => ({
      id: `${pair.id}-right`,
      text: pair.right,
      pairId: pair.id,
      side: 'right',
      matched: false
    }));

    // Shuffle right items for randomness
    const shuffledRightItems = [...rightItems].sort(() => Math.random() - 0.5);

    setGameItems([...leftItems, ...shuffledRightItems]);
  }, [pairs]);

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

  useEffect(() => {
    if (matches === pairs.length && gameState === 'playing') {
      finishGame();
    }
  }, [matches, pairs.length, gameState]);

  const finishGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = attempts > 0 ? Math.round((matches / attempts) * 100) : 0;
    const score = Math.round((matches / pairs.length) * accuracy);
    
    setGameState('finished');
    onComplete(score, timeSpent);
  };

  const handleItemClick = (item: GameItem) => {
    if (item.matched || gameState === 'finished') return;

    if (!selectedItem) {
      setSelectedItem(item);
    } else if (selectedItem.id === item.id) {
      // Deselect
      setSelectedItem(null);
    } else if (selectedItem.side === item.side) {
      // Select different item on same side
      setSelectedItem(item);
    } else {
      // Attempt to match
      setAttempts(prev => prev + 1);
      
      if (selectedItem.pairId === item.pairId) {
        // Successful match
        setGameItems(prev => prev.map(gameItem => 
          gameItem.pairId === item.pairId 
            ? { ...gameItem, matched: true }
            : gameItem
        ));
        setMatches(prev => prev + 1);
        setFeedback({ type: 'success', message: 'Great match!' });
        setSelectedItem(null);
      } else {
        // Failed match
        setFeedback({ type: 'error', message: 'Not a match, try again!' });
        setTimeout(() => {
          setSelectedItem(null);
        }, 1000);
      }

      // Clear feedback after delay
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const restartGame = () => {
    const leftItems: GameItem[] = pairs.map(pair => ({
      id: `${pair.id}-left`,
      text: pair.left,
      pairId: pair.id,
      side: 'left',
      matched: false
    }));

    const rightItems: GameItem[] = pairs.map(pair => ({
      id: `${pair.id}-right`,
      text: pair.right,
      pairId: pair.id,
      side: 'right',
      matched: false
    }));

    const shuffledRightItems = [...rightItems].sort(() => Math.random() - 0.5);

    setGameItems([...leftItems, ...shuffledRightItems]);
    setSelectedItem(null);
    setMatches(0);
    setAttempts(0);
    setTimeLeft(timeLimit);
    setGameState('playing');
    setFeedback(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const leftItems = gameItems.filter(item => item.side === 'left');
  const rightItems = gameItems.filter(item => item.side === 'right');

  if (gameState === 'finished') {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = attempts > 0 ? Math.round((matches / attempts) * 100) : 0;

    return (
      <div className="card max-w-2xl mx-auto text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-primary mb-4">Game Complete!</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{matches}</div>
            <div className="text-sm text-green-700">Matches</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-blue-700">Accuracy</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
            <div className="text-sm text-purple-700">Time</div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {matches} of {pairs.length} pairs matched • {attempts} attempts
        </div>

        <div className="text-center">
          <button onClick={restartGame} className="btn-secondary">
            Try Again
          </button>
          <div className="text-sm text-gray-600 mt-4">
            🎯 Excellent matching! Returning to course...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Match the pairs by clicking items from both columns
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-green-600">{matches}/{pairs.length} matched</span>
          </div>
          <div className="text-lg font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(matches / pairs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-center py-2 mb-4 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback.message}
        </motion.div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          {leftItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: item.matched ? 1 : 1.02 }}
              whileTap={{ scale: item.matched ? 1 : 0.98 }}
              onClick={() => handleItemClick(item)}
              disabled={item.matched}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                item.matched
                  ? 'bg-green-100 border-green-300 text-green-700 cursor-default'
                  : selectedItem?.id === item.id
                  ? 'border-accent bg-accent bg-opacity-10'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="font-medium">{item.text}</div>
            </motion.button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: item.matched ? 1 : 1.02 }}
              whileTap={{ scale: item.matched ? 1 : 0.98 }}
              onClick={() => handleItemClick(item)}
              disabled={item.matched}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                item.matched
                  ? 'bg-green-100 border-green-300 text-green-700 cursor-default'
                  : selectedItem?.id === item.id
                  ? 'border-accent bg-accent bg-opacity-10'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="font-medium">{item.text}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Click one item from each column to make a match
      </div>
    </div>
  );
}