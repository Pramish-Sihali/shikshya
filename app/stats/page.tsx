'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { useApp } from '@/contexts/AppContext';
import { GamificationEngine } from '@/lib/gamification';

export default function StatsPage() {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading stats...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Failed to load stats</div>
        </div>
      </div>
    );
  }

  const getProgressToNextLevel = () => {
    return GamificationEngine.getProgressToNextLevel(user.xp);
  };

  const getXpForNextLevel = () => {
    return GamificationEngine.getXpForNextLevel(user.xp);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Your Learning Stats</h1>
          <p className="text-gray-600">Track your progress and achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - XP & Level */}
          <div className="space-y-6">
            {/* XP Card */}
            <div className="card bg-gradient-to-br from-accent to-accent-light">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⭐</div>
                <h2 className="text-3xl font-bold text-primary mb-2">{user.xp} XP</h2>
                <p className="text-primary/70">Experience Points</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-primary">
                  <span>Level {user.level}</span>
                  <span>Level {user.level + 1}</span>
                </div>
                <ProgressBar 
                  current={getProgressToNextLevel()} 
                  total={100} 
                  showPercentage={false}
                />
                <p className="text-sm text-primary/70 text-center">
                  {getXpForNextLevel()} XP to reach Level {user.level + 1}
                </p>
              </div>
            </div>

            {/* Streak Card */}
            <div className="card bg-gradient-to-br from-orange-100 to-orange-200">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔥</div>
                <h2 className="text-3xl font-bold text-orange-600 mb-2">{user.streak.currentStreak} Days</h2>
                <p className="text-orange-500">Current Streak</p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center text-sm text-orange-600">
                  {user.streak.currentStreak > 0 
                    ? "Great job! Keep the momentum going!" 
                    : "Start your learning streak today!"
                  }
                </div>
                
                {/* Streak Calendar */}
                {user.streak.streakHistory.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-orange-700 mb-3">Recent Activity</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {user.streak.streakHistory.slice(-21).map((date, index) => (
                        <div 
                          key={index} 
                          className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center text-xs text-white font-bold" 
                          title={date}
                        >
                          {new Date(date).getDate()}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-orange-500 mt-2">Last 21 active days</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Badges */}
          <div className="space-y-6">
            {/* Badges Card */}
            <div className="card bg-gradient-to-br from-primary/10 to-primary/20">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-primary mb-2">{user.badges.length} Badges</h2>
                <p className="text-primary/70">Achievements Unlocked</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {user.badges.map((badge) => (
                    <div key={badge.id} className="bg-white/70 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <h3 className="font-semibold text-primary text-sm mb-1">{badge.name}</h3>
                      <p className="text-xs text-primary/70">{badge.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
                
                {user.badges.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4 opacity-50">🏅</div>
                    <p className="text-primary/70">No badges earned yet</p>
                    <p className="text-sm text-primary/50 mt-2">Complete courses and challenges to earn your first badge!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-bold text-primary mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enrolled Courses</span>
                  <span className="font-semibold text-primary">{user.enrolledCourses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Level</span>
                  <span className="font-semibold text-primary">Level {user.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total XP</span>
                  <span className="font-semibold text-primary">{user.xp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-semibold text-primary">
                    {Math.max(user.streak.currentStreak, user.streak.streakHistory.length)} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-primary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}