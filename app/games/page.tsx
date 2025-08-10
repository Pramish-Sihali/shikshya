'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import FlashcardsGame from '@/components/FlashcardsGame';
import MatchingGame from '@/components/MatchingGame';
import XPGainAnimation from '@/components/XPGainAnimation';
import { GamificationResult } from '@/lib/gamification';

type GameType = 'menu' | 'flashcards' | 'matching';

export default function GamesPage() {
  // For demo purposes, use mock session
  const session = { user: { name: 'Demo User', id: 'demo-1' } };
  const router = useRouter();
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);

  const handleGameComplete = async (gameId: string, score: number, timeSpent: number) => {

    try {
      const response = await fetch('/api/games/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          gameId,
          score,
          timeSpent
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.gamification) {
          setGamificationResult(data.gamification);
        }
      }
    } catch (error) {
      console.error('Failed to submit game score:', error);
    }
  };

  const flashcardsData = [
    { front: 'Component', back: 'A reusable piece of UI in React' },
    { front: 'Props', back: 'Data passed from parent to child component' },
    { front: 'State', back: 'Internal component data that can change' },
    { front: 'JSX', back: 'JavaScript XML syntax for writing React elements' },
    { front: 'Hook', back: 'Special functions that let you use React features' },
    { front: 'useEffect', back: 'Hook for performing side effects in components' },
    { front: 'useState', back: 'Hook for adding state to functional components' },
    { front: 'Virtual DOM', back: 'React\'s representation of the actual DOM' }
  ];

  const matchingData = [
    { id: 'p1', left: 'display: flex', right: 'Creates a flexible container' },
    { id: 'p2', left: 'grid-gap', right: 'Space between grid items' },
    { id: 'p3', left: 'justify-content', right: 'Aligns items horizontally in flexbox' },
    { id: 'p4', left: 'align-items', right: 'Aligns items vertically in flexbox' },
    { id: 'p5', left: 'position: absolute', right: 'Positions element relative to nearest positioned ancestor' },
    { id: 'p6', left: 'z-index', right: 'Controls stacking order of elements' }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentGame === 'menu' && (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-primary mb-2">Learning Games</h1>
              <p className="text-gray-600">Practice your skills with fun, interactive games</p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Flashcards Game */}
              <div className="card hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗂️</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">Flashcards</h3>
                  <p className="text-gray-600 mb-6">
                    Test your knowledge of programming concepts with timed flashcards. 
                    Study terms and definitions to master key concepts.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div>• 8 React & JavaScript terms</div>
                    <div>• 3 minute time limit</div>
                    <div>• Self-paced learning</div>
                  </div>

                  <button
                    onClick={() => setCurrentGame('flashcards')}
                    className="btn-primary w-full"
                  >
                    Start Flashcards
                  </button>
                </div>
              </div>

              {/* Matching Game */}
              <div className="card hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">Matching Game</h3>
                  <p className="text-gray-600 mb-6">
                    Match CSS properties with their descriptions. Click items from 
                    both columns to find the correct pairs.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div>• 6 CSS property pairs</div>
                    <div>• 2 minute time limit</div>
                    <div>• Accuracy scoring</div>
                  </div>

                  <button
                    onClick={() => setCurrentGame('matching')}
                    className="btn-primary w-full"
                  >
                    Start Matching
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-12 card max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-primary mb-4">How Games Work</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="text-accent font-bold">XP:</span>
                  <span>Earn experience points based on your performance and accuracy</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-accent font-bold">Badges:</span>
                  <span>Unlock achievements for reaching milestones and high scores</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-accent font-bold">Streaks:</span>
                  <span>Playing games counts towards your daily learning streak</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-accent font-bold">Progress:</span>
                  <span>All game activity is tracked in your profile and dashboard</span>
                </div>
              </div>
            </div>
          </>
        )}

        {currentGame === 'flashcards' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setCurrentGame('menu')}
                className="text-gray-500 hover:text-primary mb-4"
              >
                ← Back to Games
              </button>
              <h1 className="text-2xl font-bold text-primary mb-2">React & JavaScript Flashcards</h1>
              <p className="text-gray-600">Study the term, flip the card to see the definition, then mark if you knew it</p>
            </div>

            <FlashcardsGame
              cards={flashcardsData}
              timeLimit={180}
              onComplete={(score, timeSpent) => {
                handleGameComplete('flashcards-react', score, timeSpent);
                setCurrentGame('menu');
              }}
            />
          </div>
        )}

        {currentGame === 'matching' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setCurrentGame('menu')}
                className="text-gray-500 hover:text-primary mb-4"
              >
                ← Back to Games
              </button>
              <h1 className="text-2xl font-bold text-primary mb-2">CSS Properties Matching</h1>
              <p className="text-gray-600">Match CSS properties with their correct descriptions</p>
            </div>

            <MatchingGame
              pairs={matchingData}
              timeLimit={120}
              onComplete={(score, timeSpent) => {
                handleGameComplete('matching-css', score, timeSpent);
                setCurrentGame('menu');
              }}
            />
          </div>
        )}
      </div>

      {/* XP Gain Animation */}
      <XPGainAnimation 
        result={gamificationResult} 
        onComplete={() => setGamificationResult(null)}
      />
    </div>
  );
}