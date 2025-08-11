'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { useApp } from '@/contexts/AppContext';
import { GamificationEngine } from '@/lib/gamification';

export default function Dashboard() {
  const { user, courses, progress, isLoading } = useApp();

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Failed to load user data</div>
        </div>
      </div>
    );
  }

  // Get enrolled courses
  const enrolledCourses = courses.filter(course => user.enrolledCourses.includes(course.id));

  const getProgressToNextLevel = () => {
    return GamificationEngine.getProgressToNextLevel(user.xp);
  };

  const getXpForNextLevel = () => {
    return GamificationEngine.getXpForNextLevel(user.xp);
  };

  const getCompletedModulesCount = (courseId: string) => {
    return progress.filter(p => p.courseId === courseId && p.completed).length;
  };

  const getTotalModulesCount = (courseId: string) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    return course?.modules.length || 0;
  };

  const getRecentActivity = () => {
    return progress
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* XP & Level */}
              <div className="card bg-gradient-to-br from-accent to-accent-light relative overflow-hidden group cursor-pointer" title="Experience Points - Earn XP by completing lessons, quizzes, and challenges!">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">⭐</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{user.xp}</div>
                    <div className="text-sm text-primary/70">XP</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {user.level}</span>
                    <span>{getXpForNextLevel()} XP to next level</span>
                  </div>
                  <ProgressBar 
                    current={getProgressToNextLevel()} 
                    total={100} 
                    showPercentage={false}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="card bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden group cursor-pointer" title="Daily Streak - Keep learning every day to maintain your streak!">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">🔥</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{user.streak.currentStreak}</div>
                    <div className="text-sm text-orange-500">Day Streak</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                <div className="text-sm text-gray-600">
                  {user.streak.currentStreak > 0 ? 'Keep it up!' : 'Start your streak today!'}
                </div>
              </div>

              {/* Badges */}
              <div className="card bg-gradient-to-br from-primary/10 to-primary/20 relative overflow-hidden group cursor-pointer" title="Badges - Collect achievements by completing courses and special challenges!">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">🏆</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{user.badges.length}</div>
                    <div className="text-sm text-primary/70">Badges</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                <div className="flex space-x-1">
                  {user.badges.slice(0, 3).map((badge) => (
                    <span key={badge.id} className="text-lg" title={badge.name}>
                      {badge.icon}
                    </span>
                  ))}
                  {user.badges.length > 3 && (
                    <span className="text-sm text-gray-500">+{user.badges.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">My Courses</h2>
                <Link href="/courses" className="btn-secondary text-sm">
                  Browse All Courses
                </Link>
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const completed = getCompletedModulesCount(course.id);
                    const total = getTotalModulesCount(course.id);
                    const progressPercent = total > 0 ? (completed / total) * 100 : 0;

                    return (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.description}</p>
                          </div>
                          <Link 
                            href={`/courses/${course.id}`}
                            className="btn-primary text-sm px-4 py-2"
                          >
                            Continue
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{completed} of {total} modules completed</span>
                            <span>{Math.round(progressPercent)}%</span>
                          </div>
                          <ProgressBar current={progressPercent} total={100} showPercentage={false} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-gray-500 mb-4">No courses enrolled yet</p>
                  <Link href="/courses" className="btn-primary">
                    Explore Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card bg-gradient-to-br from-accent/20 to-accent/30 border-accent/30">
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="/courses" className="flex items-center p-3 bg-white/70 rounded-lg hover:bg-white/90 hover:shadow-sm transition-all duration-200">
                  <div className="text-2xl mr-3">📚</div>
                  <div>
                    <div className="font-medium text-primary">Browse Courses</div>
                    <div className="text-sm text-primary/70">Find new courses to learn</div>
                  </div>
                </Link>
                <Link href="/roadmaps" className="flex items-center p-3 bg-white/70 rounded-lg hover:bg-white/90 hover:shadow-sm transition-all duration-200">
                  <div className="text-2xl mr-3">🗺️</div>
                  <div>
                    <div className="font-medium text-primary">Career Roadmaps</div>
                    <div className="text-sm text-primary/70">Follow structured learning paths</div>
                  </div>
                </Link>
                <Link href="/games" className="flex items-center p-3 bg-white/70 rounded-lg hover:bg-white/90 hover:shadow-sm transition-all duration-200">
                  <div className="text-2xl mr-3">🎮</div>
                  <div>
                    <div className="font-medium text-primary">Play Quest</div>
                    <div className="text-sm text-primary/70">Learn through fun games</div>
                  </div>
                </Link>
                <Link href="/stats" className="flex items-center p-3 bg-white/70 rounded-lg hover:bg-white/90 hover:shadow-sm transition-all duration-200">
                  <div className="text-2xl mr-3">📊</div>
                  <div>
                    <div className="font-medium text-primary">View Stats</div>
                    <div className="text-sm text-primary/70">XP, Streaks & Badges details</div>
                  </div>
                </Link>
                <Link href="/profile" className="flex items-center p-3 bg-white/70 rounded-lg hover:bg-white/90 hover:shadow-sm transition-all duration-200">
                  <div className="text-2xl mr-3">👤</div>
                  <div>
                    <div className="font-medium text-primary">My Profile</div>
                    <div className="text-sm text-primary/70">Account settings</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-lg font-bold text-primary mb-4">Recent Activity</h2>
              {getRecentActivity().length > 0 ? (
                <div className="space-y-3">
                  {getRecentActivity().map((item, index) => {
                    const course = enrolledCourses.find(c => c.id === item.courseId);
                    const moduleItem = course?.modules.find(m => m.id === item.moduleId);
                    
                    return (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className="text-lg">
                          {moduleItem?.type === 'doc' && '📖'}
                          {moduleItem?.type === 'video' && '📹'}
                          {moduleItem?.type === 'quiz' && '🧠'}
                          {moduleItem?.type === 'game' && '🎮'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{moduleItem?.title}</div>
                          <div className="text-gray-500">{course?.title}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(item.completedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>

            {/* Streak Calendar */}
            {user.streak.streakHistory.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-primary mb-4">Streak Calendar</h2>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {user.streak.streakHistory.slice(-14).map((date, index) => (
                    <div key={index} className="w-6 h-6 bg-accent rounded flex items-center justify-center text-primary font-bold" title={date}>
                      {new Date(date).getDate()}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 14 active days</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}