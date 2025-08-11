'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Timer from '@/components/Timer';
import Quiz from '@/components/Quiz';
import FlashcardsGame from '@/components/FlashcardsGame';
import MatchingGame from '@/components/MatchingGame';
import XPGainAnimation from '@/components/XPGainAnimation';
import { useApp } from '@/contexts/AppContext';
import { Module as ModuleType } from '@/lib/types';
import { GamificationResult } from '@/lib/gamification';

export default function ModulePage({ params }: { params: Promise<{ id: string; moduleId: string }> }) {
  const { id, moduleId } = use(params);
  const router = useRouter();
  const { courses, progress, completeModule, updateProgress, isLoading } = useApp();
  const [timeSpent, setTimeSpent] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);
  
  const course = courses.find(c => c.id === id);
  const currentModule = course?.modules.find(m => m.id === moduleId);
  const moduleProgress = progress.find(p => p.courseId === id && p.moduleId === moduleId);

  // Initialize time spent from existing progress
  useEffect(() => {
    if (moduleProgress?.timeSpentSeconds) {
      setTimeSpent(moduleProgress.timeSpentSeconds);
    }
  }, [moduleProgress?.timeSpentSeconds]);

  const handleCompleteModule = async () => {
    setCompleting(true);
    const result = await completeModule(id, moduleId);
    if (result) {
      setGamificationResult(result);
    }
    setCompleting(false);
  };

  const handleQuizComplete = async (score: number, answers: number[], quizTimeSpent: number) => {
    setCompleting(true);
    
    try {
      // Update progress with quiz completion
      updateProgress(id, moduleId, { 
        timeSpentSeconds: timeSpent + quizTimeSpent,
        completed: true,
        score: score
      });
      
      // Award XP for quiz completion
      const result = await completeModule(id, moduleId);
      if (result) {
        setGamificationResult(result);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setCompleting(false);
    }
  };

  const handleGameComplete = async (score: number, gameTimeSpent: number) => {
    setCompleting(true);
    
    try {
      const totalTime = timeSpent + gameTimeSpent;
      
      // Update progress with game completion
      updateProgress(id, moduleId, { 
        timeSpentSeconds: totalTime,
        completed: true,
        score: score
      });
      
      // Award XP for game completion
      const result = await completeModule(id, moduleId);
      if (result) {
        setGamificationResult(result);
      }

      // Auto-redirect back to course page after showing results
      setTimeout(() => {
        router.push(`/courses/${id}`);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit game completion:', error);
    } finally {
      setCompleting(false);
    }
  };

  const handleTimeUpdate = async (seconds: number) => {
    setTimeSpent(seconds);
    
    // Auto-save every 15 seconds
    if (seconds % 15 === 0 && seconds > 0) {
      updateProgress(id, moduleId, { timeSpentSeconds: seconds });
    }
  };

  const getNextModuleUrl = () => {
    if (!course) return null;
    
    const currentIndex = course.modules.findIndex(m => m.id === moduleId);
    if (currentIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentIndex + 1];
      return `/courses/${id}/modules/${nextModule.id}`;
    }
    
    return `/courses/${id}`;
  };

  const renderModuleContent = () => {
    if (!currentModule) return null;

    switch (currentModule.type) {
      case 'doc':
        return (
          <div className={`prose max-w-none ${isVideoEditingCourse ? 'prose-invert' : ''}`}>
            <div 
              className={isVideoEditingCourse ? 'text-white' : 'text-gray-900'}
              dangerouslySetInnerHTML={{ 
                __html: currentModule.markdown?.replace(/\n/g, '<br>') || 'No content available' 
              }} 
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="aspect-video">
            <iframe
              src={currentModule.contentUrl}
              title={currentModule.title}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        );
      
      case 'quiz':
        if (!currentModule.quiz) return <div>Quiz not found</div>;
        return (
          <Quiz 
            quiz={currentModule.quiz} 
            onComplete={handleQuizComplete}
          />
        );
      
      case 'game':
        if (!currentModule.game) return <div>Game not found</div>;
        
        if (currentModule.game.type === 'flashcards' && 'cards' in currentModule.game.data) {
          return (
            <FlashcardsGame
              cards={currentModule.game.data.cards}
              timeLimit={currentModule.timeEstimateMinutes * 60}
              onComplete={handleGameComplete}
            />
          );
        } else if (currentModule.game.type === 'matching' && 'pairs' in currentModule.game.data) {
          return (
            <MatchingGame
              pairs={currentModule.game.data.pairs}
              timeLimit={currentModule.timeEstimateMinutes * 60}
              onComplete={handleGameComplete}
            />
          );
        } else {
          return (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className={`text-xl font-bold mb-4 ${isVideoEditingCourse ? 'text-white' : 'text-primary'}`}>{currentModule.title}</h3>
              <p className={`mb-6 ${isVideoEditingCourse ? 'text-gray-300' : 'text-gray-600'}`}>Game type &apos;{currentModule.game.type}&apos; not yet implemented.</p>
            </div>
          );
        }
      
      default:
        return <div className={isVideoEditingCourse ? 'text-white' : 'text-gray-900'}>Unknown module type</div>;
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading module...</div>
        </div>
      </div>
    );
  }

  if (!course || !currentModule) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Module not found</div>
        </div>
      </div>
    );
  }

  const isCompleted = moduleProgress?.completed || false;
  const nextModuleUrl = getNextModuleUrl();

  // Special styling for Video Editing course
  const isVideoEditingCourse = id === '6';
  const bgClass = isVideoEditingCourse ? 'bg-black text-white' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Header */}
        <div className={`${isVideoEditingCourse ? 'bg-gray-900 text-white border-gray-700' : ''} card mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link 
                href={`/courses/${id}`} 
                className={`text-sm mb-2 inline-block transition-colors ${
                  isVideoEditingCourse 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-500 hover:text-primary'
                }`}
              >
                ← Back to {course.title}
              </Link>
              <h1 className={`text-2xl font-bold ${isVideoEditingCourse ? 'text-white' : 'text-primary'}`}>
                {currentModule.title}
              </h1>
              <div className={`flex items-center space-x-4 text-sm mt-2 ${
                isVideoEditingCourse ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <span>{currentModule.type.toUpperCase()}</span>
                <span>{currentModule.timeEstimateMinutes} min estimated</span>
                {isCompleted && (
                  <span className={`font-medium ${isVideoEditingCourse ? 'text-green-400' : 'text-green-600'}`}>
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
            
            {/* Timer - only show for doc and video modules */}
            {(currentModule.type === 'doc' || currentModule.type === 'video') && (
              <Timer 
                onTimeUpdate={handleTimeUpdate}
                autoStart={!isCompleted}
              />
            )}
          </div>
        </div>

        {/* Module Content */}
        <div className={`${isVideoEditingCourse ? 'bg-gray-900 text-white border-gray-700' : ''} card mb-8`}>
          {/* Gamified Progress Indicator for Video Editing Course */}
          {isVideoEditingCourse && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Module Progress</span>
                <span className="text-sm text-purple-200">{isCompleted ? '100%' : '50%'}</span>
              </div>
              <div className="w-full bg-purple-900 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: isCompleted ? '100%' : '50%' }}
                ></div>
              </div>
              {!isCompleted && (
                <div className="flex items-center mt-3 text-yellow-300">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm">Complete to earn XP and unlock the next module!</span>
                </div>
              )}
            </div>
          )}
          {renderModuleContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {moduleProgress?.timeSpentSeconds && (
              <p className={`text-sm ${isVideoEditingCourse ? 'text-gray-300' : 'text-gray-500'}`}>
                Time spent: {Math.floor(moduleProgress.timeSpentSeconds / 60)}m {moduleProgress.timeSpentSeconds % 60}s
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            {/* Mark Complete Button - only for doc and video modules */}
            {(currentModule.type === 'doc' || currentModule.type === 'video') && !isCompleted && (
              <button
                onClick={handleCompleteModule}
                disabled={completing}
                className="btn-accent disabled:opacity-50"
              >
                {completing ? 'Completing...' : 'Mark Complete'}
              </button>
            )}
            
            {/* Next/Continue Button */}
            {isCompleted && nextModuleUrl && (
              <Link href={nextModuleUrl} className="btn-primary">
                {nextModuleUrl.includes('modules') ? 'Next Module' : 'Course Overview'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* XP Gain Animation */}
      <XPGainAnimation 
        result={gamificationResult} 
        onComplete={() => setGamificationResult(null)}
      />
    </div>
  );
}