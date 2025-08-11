'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { useApp } from '@/contexts/AppContext';
import { Module } from '@/lib/types';

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, courses, progress, isLoading } = useApp();
  
  const course = courses.find(c => c.id === id);
  const courseProgress = progress.filter(p => p.courseId === id);

  const getModuleProgress = (moduleId: string) => {
    return courseProgress.find(p => p.moduleId === moduleId);
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
    return courseProgress.reduce((total, p) => total + (p.timeSpentSeconds || 0), 0);
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

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Course not found</div>
        </div>
      </div>
    );
  }

  // Special styling for Video Editing course
  const isVideoEditingCourse = id === '6';
  const bgClass = isVideoEditingCourse ? 'bg-black text-white' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className={`${isVideoEditingCourse ? 'bg-gradient-to-br from-purple-900 to-gray-900 text-white border-gray-700' : ''} card mb-8`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <Link href="/courses" className={`text-sm ${isVideoEditingCourse ? 'text-purple-300 hover:text-white' : 'text-gray-500 hover:text-primary'} mb-2 inline-block`}>
                ← Back to Courses
              </Link>
              <h1 className={`text-3xl font-bold mb-2 ${isVideoEditingCourse ? 'text-white' : 'text-primary'}`}>
                {course.title}
              </h1>
              <p className={`mb-4 ${isVideoEditingCourse ? 'text-purple-200' : 'text-gray-600'}`}>
                {course.description}
              </p>
              
              {/* Course Stats */}
              <div className={`flex flex-wrap gap-6 text-sm ${isVideoEditingCourse ? 'text-purple-300' : 'text-gray-500'}`}>
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
                className={`card ${!isUnlocked ? 'opacity-60' : ''} ${
                  isCompleted ? 
                    (isVideoEditingCourse ? 'bg-gradient-to-r from-green-800 to-green-900 border-green-600' : 'bg-green-50 border-green-200') : 
                    (isVideoEditingCourse ? 'bg-gray-800 border-gray-600 text-white' : '')
                }`}
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
                        <h3 className={`font-semibold ${
                          isVideoEditingCourse ? 'text-white' : 'text-gray-900'
                        }`}>
                          {module.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          isVideoEditingCourse 
                            ? 'bg-gray-700 text-gray-200' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getModuleTypeLabel(module.type)}
                        </span>
                      </div>
                      <div className={`text-sm space-x-4 ${
                        isVideoEditingCourse ? 'text-gray-300' : 'text-gray-500'
                      }`}>
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
          <div className={`card ${isVideoEditingCourse ? 'bg-gradient-to-r from-purple-800 to-blue-900 text-white border-purple-600' : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'} mt-8`}>
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold mb-4">{isVideoEditingCourse ? 'Video Editing Mastery Unlocked!' : 'Congratulations!'}</h2>
              <p className={`text-lg mb-6 ${isVideoEditingCourse ? 'text-purple-200' : 'text-gray-600'}`}>
                {isVideoEditingCourse 
                  ? "You've mastered the art of video editing! Your creative journey has leveled up significantly."
                  : "You've completed all modules in this course!"
                }
              </p>
              
              {/* Achievement Stats */}
              <div className={`${isVideoEditingCourse ? 'bg-purple-900/50' : 'bg-white'} rounded-lg p-6 mb-6 inline-block`}>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${isVideoEditingCourse ? 'text-yellow-400' : 'text-primary'}`}>
                      {course.modules.length}
                    </div>
                    <div className={`text-sm ${isVideoEditingCourse ? 'text-purple-300' : 'text-gray-500'}`}>Modules Completed</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${isVideoEditingCourse ? 'text-yellow-400' : 'text-primary'}`}>
                      {course.modules.reduce((acc, mod) => acc + (mod.quiz?.xpReward || mod.game?.xpReward || 15), 0)}
                    </div>
                    <div className={`text-sm ${isVideoEditingCourse ? 'text-purple-300' : 'text-gray-500'}`}>XP Earned</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${isVideoEditingCourse ? 'text-yellow-400' : 'text-primary'}`}>
                      {formatTime(getTotalTimeSpent())}
                    </div>
                    <div className={`text-sm ${isVideoEditingCourse ? 'text-purple-300' : 'text-gray-500'}`}>Time Invested</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Link href="/courses" className={isVideoEditingCourse ? 'btn-accent' : 'btn-primary'}>
                  Explore More Courses
                </Link>
                <Link href="/stats" className={isVideoEditingCourse ? 'btn-secondary' : 'btn-secondary'}>
                  View Your Stats
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}