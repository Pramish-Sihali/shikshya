'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { Course, Progress, Module } from '@/lib/types';

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchCourseData();
    }
  }, [status, id, router]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${id}`);
      if (!courseResponse.ok) {
        throw new Error('Course not found');
      }
      const courseData = await courseResponse.json();
      setCourse(courseData);

      // Fetch user progress
      if (session?.user?.id) {
        const progressResponse = await fetch(`/api/user/progress?userId=${session.user.id}`);
        const progressData = await progressResponse.json();
        setProgress(progressData.progress.filter((p: Progress) => p.courseId === id));
      }
    } catch (error) {
      console.error('Failed to fetch course data:', error);
      router.push('/courses');
    } finally {
      setLoading(false);
    }
  };

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId);
  };

  const isModuleCompleted = (moduleId: string) => {
    return getModuleProgress(moduleId)?.completed || false;
  };

  const isModuleUnlocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return true; // First module is always unlocked
    
    // Check if previous module is completed
    const prevModule = course?.modules[moduleIndex - 1];
    return prevModule ? isModuleCompleted(prevModule.id) : false;
  };

  const getCompletedModulesCount = () => {
    if (!course) return 0;
    return course.modules.filter(module => isModuleCompleted(module.id)).length;
  };

  const getCourseProgressPercent = () => {
    if (!course || course.modules.length === 0) return 0;
    return (getCompletedModulesCount() / course.modules.length) * 100;
  };

  const getTotalTimeSpent = () => {
    return progress.reduce((total, p) => total + (p.timeSpentSeconds || 0), 0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getModuleIcon = (type: Module['type']) => {
    switch (type) {
      case 'doc': return '📖';
      case 'video': return '📹';
      case 'quiz': return '🧠';
      case 'game': return '🎮';
      default: return '📄';
    }
  };

  const getModuleTypeLabel = (type: Module['type']) => {
    switch (type) {
      case 'doc': return 'Reading';
      case 'video': return 'Video';
      case 'quiz': return 'Quiz';
      case 'game': return 'Game';
      default: return 'Module';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading course...</div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Link href="/courses" className="text-sm text-gray-500 hover:text-primary mb-2 inline-block">
                ← Back to Courses
              </Link>
              <h1 className="text-3xl font-bold text-primary mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <span>{course.modules.length} modules</span>
                <span>{course.modules.reduce((acc, mod) => acc + mod.timeEstimateMinutes, 0)} min estimated</span>
                <span>{formatTime(getTotalTimeSpent())} completed</span>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="rgb(229, 231, 235)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="rgb(212, 175, 55)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${getCourseProgressPercent() * 2.2} 220`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {Math.round(getCourseProgressPercent())}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <ProgressBar 
            current={getCompletedModulesCount()} 
            total={course.modules.length}
            label="Overall Progress"
          />
        </div>

        {/* Course Modules */}
        <div className="space-y-4">
          {course.modules.map((module, index) => {
            const moduleProgress = getModuleProgress(module.id);
            const isCompleted = isModuleCompleted(module.id);
            const isUnlocked = isModuleUnlocked(index);

            return (
              <div 
                key={module.id} 
                className={`card ${!isUnlocked ? 'opacity-60' : ''} ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Module Status */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                          ✓
                        </div>
                      ) : isUnlocked ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                          {getModuleIcon(module.type)}
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                          🔒
                        </div>
                      )}
                    </div>

                    {/* Module Info */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          {getModuleTypeLabel(module.type)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-x-4">
                        <span>{module.timeEstimateMinutes} min</span>
                        {moduleProgress?.timeSpentSeconds && (
                          <span>Spent: {formatTime(moduleProgress.timeSpentSeconds)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isUnlocked ? (
                      <Link 
                        href={`/courses/${course.id}/modules/${module.id}`}
                        className={isCompleted ? 'btn-secondary' : 'btn-primary'}
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Link>
                    ) : (
                      <button 
                        disabled 
                        className="btn-secondary opacity-50 cursor-not-allowed"
                      >
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Course Completion */}
        {getCourseProgressPercent() === 100 && (
          <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-4">You&apos;ve completed all modules in this course!</p>
              <Link href="/courses" className="btn-primary">
                Explore More Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}