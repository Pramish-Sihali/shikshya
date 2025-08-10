'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Timer from '@/components/Timer';
import Quiz from '@/components/Quiz';
import XPGainAnimation from '@/components/XPGainAnimation';
import { Course, Module, Progress } from '@/lib/types';
import { GamificationResult } from '@/lib/gamification';

export default function ModulePage({ params }: { params: Promise<{ id: string; moduleId: string }> }) {
  const { id, moduleId } = use(params);
  // For demo purposes, use mock session
  const session = { user: { name: 'Demo User', id: 'demo-1' } };
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);

  useEffect(() => {
    if (false) {
      router.push('/');
      return;
    }

    if (true) {
      fetchModuleData();
    }
  }, [status, id, moduleId, router]);

  const fetchModuleData = async () => {
    try {
      // Fetch course
      const courseResponse = await fetch(`/api/courses/${id}`);
      const courseData = await courseResponse.json();
      setCourse(courseData);

      // Find module
      const moduleData = courseData.modules.find((m: Module) => m.id === moduleId);
      if (!moduleData) {
        throw new Error('Module not found');
      }
      setModule(moduleData);

      // Fetch progress
      if (session?.user?.id) {
        const progressResponse = await fetch(`/api/user/progress?userId=${session.user.id}`);
        const progressData = await progressResponse.json();
        const moduleProgress = progressData.progress.find(
          (p: Progress) => p.courseId === id && p.moduleId === moduleId
        );
        setProgress(moduleProgress || null);
        setTimeSpent(moduleProgress?.timeSpentSeconds || 0);
      }
    } catch (error) {
      console.error('Failed to fetch module data:', error);
      router.push(`/courses/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (completed: boolean = false, score?: number) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/progress/${moduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          courseId: id,
          timeSpentSeconds: timeSpent,
          completed,
          ...(score !== undefined && { score })
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
        
        if (data.gamification) {
          setGamificationResult(data.gamification);
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleCompleteModule = async () => {
    setCompleting(true);
    await updateProgress(true);
    setCompleting(false);
  };

  const handleQuizComplete = async (score: number, answers: number[], quizTimeSpent: number) => {
    setCompleting(true);
    
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          courseId: id,
          moduleId: moduleId,
          answers,
          timeSpent: timeSpent + quizTimeSpent
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
        
        if (data.gamification) {
          setGamificationResult(data.gamification);
        }
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setCompleting(false);
    }
  };

  const handleTimeUpdate = async (seconds: number) => {
    setTimeSpent(seconds);
    
    // Auto-save every 15 seconds
    if (seconds % 15 === 0 && seconds > 0) {
      await updateProgress();
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
    if (!module) return null;

    switch (module.type) {
      case 'doc':
        return (
          <div className="prose max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: module.markdown?.replace(/\n/g, '<br>') || 'No content available' 
              }} 
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="aspect-video">
            <iframe
              src={module.contentUrl}
              title={module.title}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        );
      
      case 'quiz':
        if (!module.quiz) return <div>Quiz not found</div>;
        return (
          <Quiz 
            quiz={module.quiz} 
            onComplete={handleQuizComplete}
          />
        );
      
      case 'game':
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-primary mb-4">{module.title}</h3>
            <p className="text-gray-600 mb-6">This is a placeholder for the {module.game?.type} game.</p>
            <Link href="/games" className="btn-primary">
              Play Game
            </Link>
          </div>
        );
      
      default:
        return <div>Unknown module type</div>;
    }
  };

  if (false || loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading module...</div>
        </div>
      </div>
    );
  }

  if (false || !course || !module) {
    return null;
  }

  const isCompleted = progress?.completed || false;
  const nextModuleUrl = getNextModuleUrl();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link 
                href={`/courses/${id}`} 
                className="text-sm text-gray-500 hover:text-primary mb-2 inline-block"
              >
                ← Back to {course.title}
              </Link>
              <h1 className="text-2xl font-bold text-primary">{module.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                <span>{module.type.toUpperCase()}</span>
                <span>{module.timeEstimateMinutes} min estimated</span>
                {isCompleted && <span className="text-green-600 font-medium">✓ Completed</span>}
              </div>
            </div>
            
            {/* Timer - only show for doc and video modules */}
            {(module.type === 'doc' || module.type === 'video') && (
              <Timer 
                onTimeUpdate={handleTimeUpdate}
                autoStart={!isCompleted}
              />
            )}
          </div>
        </div>

        {/* Module Content */}
        <div className="card mb-8">
          {renderModuleContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {progress?.timeSpentSeconds && (
              <p className="text-sm text-gray-500">
                Time spent: {Math.floor(progress.timeSpentSeconds / 60)}m {progress.timeSpentSeconds % 60}s
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            {/* Mark Complete Button - only for doc and video modules */}
            {(module.type === 'doc' || module.type === 'video') && !isCompleted && (
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