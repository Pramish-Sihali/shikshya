'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { GamificationResult } from '@/lib/gamification';

interface XPGainAnimationProps {
  result: GamificationResult | null;
  onComplete?: () => void;
}

export default function XPGainAnimation({ result, onComplete }: XPGainAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (result) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

      if (result.levelUp || result.badges.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [result, onComplete]);

  if (!result) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {showConfetti && (
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
            numberOfPieces={100}
            gravity={0.1}
          />
        )}
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl"
        >
          {/* XP Gain */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-bold text-accent mb-2"
            >
              +{result.xpGain.amount} XP
            </motion.div>
            <p className="text-gray-600">{result.xpGain.reason}</p>
          </motion.div>

          {/* Level Up */}
          {result.levelUp && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-3xl font-bold text-primary mb-2"
              >
                🎉 Level Up!
              </motion.div>
              <p className="text-lg">
                Level {result.levelUp.oldLevel} → Level {result.levelUp.newLevel}
              </p>
            </motion.div>
          )}

          {/* Streak Update */}
          {result.streakUpdate && result.streakUpdate.newStreak > result.streakUpdate.oldStreak && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-2xl font-bold text-orange-500 mb-2"
              >
                🔥 {result.streakUpdate.newStreak} Day Streak!
              </motion.div>
              <p className="text-gray-600">Keep it up!</p>
            </motion.div>
          )}

          {/* New Badges */}
          {result.badges.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-6"
            >
              <h3 className="text-xl font-bold text-primary mb-4">New Badges Earned!</h3>
              <div className="flex justify-center space-x-4">
                {result.badges.map((badgeReward, index) => (
                  <motion.div
                    key={badgeReward.badge.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    className="text-center"
                  >
                    <div className="text-3xl mb-2">{badgeReward.badge.icon}</div>
                    <div className="text-sm font-medium">{badgeReward.badge.name}</div>
                    <div className="text-xs text-gray-500">{badgeReward.badge.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={onComplete}
            className="btn-primary"
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}