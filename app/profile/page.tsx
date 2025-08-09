'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { User, Course, Progress } from '@/lib/types';
import { GamificationEngine } from '@/lib/gamification';

interface ProfileData {
  user: User;
  progress: Progress[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status, router]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile and progress
      const profileResponse = await fetch(`/api/user/progress?userId=${session?.user?.id}`);
      const profileData = await profileResponse.json();
      setProfileData(profileData);

      // Fetch enrolled courses
      const coursesResponse = await fetch('/api/courses');
      const allCourses = await coursesResponse.json();
      const enrolled = allCourses.filter((course: Course) => 
        profileData.user.enrolledCourses.includes(course.id)
      );
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !profileData) {
    return null;
  }

  const { user, progress } = profileData;

  const getProgressToNextLevel = () => {
    return GamificationEngine.getProgressToNextLevel(user.xp);
  };

  const getXpForNextLevel = () => {
    return GamificationEngine.getXpForNextLevel(user.xp);
  };

  const getTotalTimeSpent = () => {
    return progress.reduce((total: number, p: Progress) => total + (p.timeSpentSeconds || 0), 0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getCompletedModulesCount = () => {
    return progress.filter((p: Progress) => p.completed).length;
  };

  const getTotalModulesCount = () => {
    return enrolledCourses.reduce((total, course) => total + course.modules.length, 0);
  };

  const getCourseProgress = (courseId: string) => {
    const courseProgress = progress.filter((p: Progress) => p.courseId === courseId);
    const completed = courseProgress.filter((p: Progress) => p.completed).length;
    const course = enrolledCourses.find(c => c.id === courseId);
    const total = course?.modules.length || 0;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getRecentActivity = () => {
    return progress
      .filter((p: Progress) => p.completedAt)
      .sort((a: Progress, b: Progress) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 10);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-primary mb-1">{user.name}</h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Level {user.level}</span>
                </div>
              </div>
            </div>
            
            {/* Level Progress */}
            <div className="text-right">
              <div className="text-2xl font-bold text-accent mb-1">{user.xp} XP</div>
              <div className="text-sm text-gray-500 mb-2">
                {getXpForNextLevel()} XP to Level {user.level + 1}
              </div>
              <div className="w-32">
                <ProgressBar 
                  current={getProgressToNextLevel()} 
                  total={100} 
                  showPercentage={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="card">
              <h2 className="text-xl font-bold text-primary mb-6">Learning Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{user.xp}</div>
                  <div className="text-sm text-gray-500">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{user.level}</div>
                  <div className="text-sm text-gray-500">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 mb-1">{user.streak.currentStreak}</div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{formatTime(getTotalTimeSpent())}</div>
                  <div className="text-sm text-gray-500">Time Spent</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="card">
              <h2 className="text-xl font-bold text-primary mb-6">Achievements</h2>
              {user.badges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.badges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <div className="font-medium text-gray-900">{badge.name}</div>
                        <div className="text-sm text-gray-500">{badge.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Earned {new Date(badge.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏆</div>
                  <p className="text-gray-500">No badges earned yet</p>
                  <p className="text-sm text-gray-400 mt-1">Complete courses and games to earn your first badge!</p>
                </div>
              )}
            </div>

            {/* Course Progress */}
            <div className="card">
              <h2 className="text-xl font-bold text-primary mb-6">Course Progress</h2>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const courseProgress = getCourseProgress(course.id);
                    return (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.description}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-bold text-primary">{courseProgress.percentage}%</div>
                            <div className="text-gray-500">
                              {courseProgress.completed}/{courseProgress.total}
                            </div>
                          </div>
                        </div>
                        <ProgressBar 
                          current={courseProgress.completed} 
                          total={courseProgress.total}
                          showPercentage={false}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-gray-500">No courses enrolled</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Activity & Streak */}
          <div className="space-y-6">
            {/* Streak Calendar */}
            <div className="card">
              <h2 className="text-lg font-bold text-primary mb-4">Streak Activity</h2>
              {user.streak.streakHistory.length > 0 ? (
                <div>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {user.streak.streakHistory.slice(-21).map((date, index) => (
                      <div 
                        key={index} 
                        className="w-6 h-6 bg-accent rounded text-xs flex items-center justify-center text-primary font-bold" 
                        title={date}
                      >
                        {new Date(date).getDate()}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Last 3 weeks of activity</p>
                  <div className="mt-3 text-center">
                    <div className="text-lg font-bold text-orange-500">{user.streak.currentStreak} days</div>
                    <div className="text-sm text-gray-500">Current streak</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🔥</div>
                  <p className="text-gray-500 text-sm">Start your learning streak!</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-lg font-bold text-primary mb-4">Recent Activity</h2>
              {getRecentActivity().length > 0 ? (
                <div className="space-y-3">
                  {getRecentActivity().map((item: Progress, index) => {
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
                          {new Date(item.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h2 className="text-lg font-bold text-primary mb-4">Progress Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Modules Completed</span>
                  <span className="font-medium">{getCompletedModulesCount()}/{getTotalModulesCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Courses Enrolled</span>
                  <span className="font-medium">{enrolledCourses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time</span>
                  <span className="font-medium">{formatTime(getTotalTimeSpent())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Badges Earned</span>
                  <span className="font-medium">{user.badges.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}