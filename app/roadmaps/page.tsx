'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import XPGainAnimation from '@/components/XPGainAnimation';
import { Roadmap, Course } from '@/lib/types';
import { GamificationResult } from '@/lib/gamification';

interface EnhancedRoadmap extends Roadmap {
  isFollowed: boolean;
  completedSteps: string[];
  followedAt?: string;
}

export default function RoadmapsPage() {
  // For demo purposes, use mock session
  const session = { user: { name: 'Demo User', id: '1' } }; const status = 'authenticated';
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<EnhancedRoadmap[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);

  useEffect(() => {
    if (false) {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch roadmaps with user progress
      const roadmapsResponse = await fetch(`/api/roadmaps?userId=${session?.user?.id}`);
      const roadmapsData = await roadmapsResponse.json();
      setRoadmaps(roadmapsData);

      // Fetch courses for course recommendations
      const coursesResponse = await fetch('/api/courses');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowRoadmap = async (roadmapId: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/roadmaps/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          roadmapId
        }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to follow roadmap:', error);
    }
  };

  const handleCompleteStep = async (roadmapId: string, stepId: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/roadmaps/complete-milestone', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          roadmapId,
          stepId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.gamification) {
          setGamificationResult(data.gamification);
        }
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to complete step:', error);
    }
  };

  const getRoadmapIcon = (roadmapId: string) => {
    switch (roadmapId) {
      case '1': return '💻';
      case '2': return '⚙️';
      case '3': return '📊';
      default: return '🗺️';
    }
  };

  const getRecommendedCourse = (courseId?: string) => {
    return courses.find(course => course.id === courseId);
  };

  const getCompletionPercentage = (roadmap: EnhancedRoadmap) => {
    if (roadmap.steps.length === 0) return 0;
    return Math.round((roadmap.completedSteps.length / roadmap.steps.length) * 100);
  };

  if (false || loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading roadmaps...</div>
        </div>
      </div>
    );
  }

  if (false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Career Roadmaps</h1>
          <p className="text-gray-600">
            Follow structured learning paths to achieve your career goals. Track your progress and unlock new skills.
          </p>
        </div>

        {/* Roadmaps */}
        <div className="space-y-8">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="card">
              {/* Roadmap Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{getRoadmapIcon(roadmap.id)}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">{roadmap.title}</h2>
                    <p className="text-gray-600 mb-4">{roadmap.description}</p>
                    
                    {roadmap.isFollowed ? (
                      <div className="flex items-center space-x-4">
                        <div className="badge bg-green-500 text-white">Following</div>
                        <span className="text-sm text-gray-500">
                          {roadmap.completedSteps.length} of {roadmap.steps.length} completed ({getCompletionPercentage(roadmap)}%)
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {roadmap.steps.length} milestones • 
                        {roadmap.steps.reduce((total, step) => total + step.xpReward, 0)} XP total
                      </div>
                    )}
                  </div>
                </div>

                {!roadmap.isFollowed && (
                  <button
                    onClick={() => handleFollowRoadmap(roadmap.id)}
                    className="btn-accent"
                  >
                    Follow Roadmap
                  </button>
                )}
              </div>

              {/* Progress Bar (for followed roadmaps) */}
              {roadmap.isFollowed && (
                <div className="mb-6">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getCompletionPercentage(roadmap)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Roadmap Steps */}
              <div className="space-y-4">
                {roadmap.steps.map((step, index) => {
                  const isCompleted = roadmap.completedSteps.includes(step.id);
                  const isUnlocked = index === 0 || roadmap.completedSteps.includes(roadmap.steps[index - 1].id);
                  const recommendedCourse = getRecommendedCourse(step.recommendedCourseId);

                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : isUnlocked 
                          ? 'bg-white border-gray-200' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      {/* Step Number/Status */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                            ✓
                          </div>
                        ) : isUnlocked ? (
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold">
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                        
                        {/* Recommended Course */}
                        {recommendedCourse && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-500">Recommended:</span>
                            <Link 
                              href={`/courses/${recommendedCourse.id}`}
                              className="text-primary hover:underline font-medium"
                            >
                              {recommendedCourse.title}
                            </Link>
                          </div>
                        )}

                        {/* XP Reward */}
                        <div className="text-xs text-accent font-medium mt-2">
                          +{step.xpReward} XP
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {roadmap.isFollowed && isUnlocked && !isCompleted && (
                          <button
                            onClick={() => handleCompleteStep(roadmap.id, step.id)}
                            className="btn-primary text-sm px-4 py-2"
                          >
                            Mark Complete
                          </button>
                        )}
                        {isCompleted && (
                          <div className="text-green-600 text-sm font-medium">Completed</div>
                        )}
                        {!isUnlocked && (
                          <div className="text-gray-400 text-sm">Locked</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion Message */}
              {roadmap.isFollowed && getCompletionPercentage(roadmap) === 100 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <h3 className="font-bold text-primary mb-1">Roadmap Complete!</h3>
                  <p className="text-sm text-gray-600">
                    Congratulations on completing the {roadmap.title} roadmap!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {roadmaps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No roadmaps available</h3>
            <p className="text-gray-500">Check back later for new learning paths!</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-primary mb-4">How Roadmaps Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Following a Roadmap</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Click &ldquo;Follow Roadmap&rdquo; to start tracking progress</li>
                <li>• Complete milestones in order to unlock the next step</li>
                <li>• Each milestone rewards XP and may unlock badges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recommended Courses</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Some milestones suggest specific courses to take</li>
                <li>• Complete the course to build skills for that milestone</li>
                <li>• Use courses to prepare before marking milestones complete</li>
              </ul>
            </div>
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