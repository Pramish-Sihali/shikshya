'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Course, Progress, Roadmap } from '@/lib/types';
import { GamificationResult } from '@/lib/gamification';

interface AppContextType {
  // User state
  user: User | null;
  isLoading: boolean;
  
  // Data
  courses: Course[];
  roadmaps: Roadmap[];
  progress: Progress[];
  
  // Actions
  updateUser: (updates: Partial<User>) => void;
  updateProgress: (courseId: string, moduleId: string, progressUpdate: Partial<Progress>) => void;
  enrollInCourse: (courseId: string) => void;
  completeModule: (courseId: string, moduleId: string) => Promise<GamificationResult | null>;
  
  // UI state
  showXPAnimation: GamificationResult | null;
  setShowXPAnimation: (result: GamificationResult | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for development
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  passwordHash: '',
  xp: 250,
  level: 3,
  streak: {
    currentStreak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    streakHistory: [
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    ]
  },
  badges: [
    {
      id: 'first-course',
      name: 'First Steps',
      description: 'Enrolled in your first course',
      icon: '🎓',
      unlockedAt: new Date().toISOString()
    },
    {
      id: '100-xp',
      name: 'Getting Started',
      description: 'Earned your first 100 XP',
      icon: '✨',
      unlockedAt: new Date().toISOString()
    },
    {
      id: '3-day-streak',
      name: 'Learning Habit',
      description: 'Maintained a 3-day learning streak',
      icon: '🔥',
      unlockedAt: new Date().toISOString()
    }
  ],
  enrolledCourses: ['1', '6'],
  createdAt: new Date().toISOString()
};

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    price: 0,
    modules: [
      {
        id: '1-1',
        type: 'doc',
        title: 'Introduction to React',
        markdown: '# Introduction to React\n\nReact is a JavaScript library...',
        timeEstimateMinutes: 15
      },
      {
        id: '1-2',
        type: 'video',
        title: 'React Components',
        contentUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
        timeEstimateMinutes: 20
      },
      {
        id: '1-3',
        type: 'quiz',
        title: 'React Basics Quiz',
        timeEstimateMinutes: 10,
        quiz: {
          id: 'quiz-1-3',
          questions: [
            {
              id: 'q1',
              question: 'What is React?',
              options: ['A database', 'A JavaScript library', 'A CSS framework', 'A web server'],
              correctAnswer: 1,
              timeLimit: 30
            }
          ],
          passingScore: 70,
          xpReward: 30
        }
      }
    ]
  },
  {
    id: '6',
    title: 'Video Editing Mastery',
    description: 'Create professional videos with modern editing techniques',
    price: 0,
    modules: [
      {
        id: '6-1',
        type: 'doc',
        title: 'Video Editing Fundamentals',
        markdown: '# Video Editing Fundamentals\n\nLearn the essential concepts...',
        timeEstimateMinutes: 25
      },
      {
        id: '6-2',
        type: 'doc',
        title: 'Color Correction and Grading',
        markdown: '# Color Correction and Grading\n\nTransform the look and feel...',
        timeEstimateMinutes: 20
      },
      {
        id: '6-3',
        type: 'video',
        title: 'Timeline and Cutting Techniques',
        contentUrl: 'https://www.youtube.com/embed/8z7JKBYbyg0',
        timeEstimateMinutes: 18
      }
    ]
  }
];

const mockProgress: Progress[] = [
  {
    userId: '1',
    courseId: '1',
    moduleId: '1-1',
    completed: true,
    timeSpentSeconds: 600,
    completedAt: new Date().toISOString()
  },
  {
    userId: '1',
    courseId: '1',
    moduleId: '1-2',
    completed: false,
    timeSpentSeconds: 300
  },
  {
    userId: '1',
    courseId: '6',
    moduleId: '6-1',
    completed: true,
    timeSpentSeconds: 900,
    completedAt: new Date().toISOString()
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses] = useState<Course[]>(mockCourses);
  const [roadmaps] = useState<Roadmap[]>([]);
  const [progress, setProgress] = useState<Progress[]>(mockProgress);
  const [showXPAnimation, setShowXPAnimation] = useState<GamificationResult | null>(null);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const updateProgress = (courseId: string, moduleId: string, progressUpdate: Partial<Progress>) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.courseId === courseId && p.moduleId === moduleId);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...progressUpdate };
        return updated;
      } else {
        const newProgress: Progress = {
          userId: user?.id || '1',
          courseId,
          moduleId,
          completed: false,
          timeSpentSeconds: 0,
          ...progressUpdate
        };
        return [...prev, newProgress];
      }
    });
  };

  const enrollInCourse = (courseId: string) => {
    if (user && !user.enrolledCourses.includes(courseId)) {
      updateUser({
        enrolledCourses: [...user.enrolledCourses, courseId]
      });
    }
  };

  const completeModule = async (courseId: string, moduleId: string): Promise<GamificationResult | null> => {
    // Simulate XP gain and badge earning
    const xpGain = Math.floor(Math.random() * 30) + 15; // 15-45 XP
    const newXP = (user?.xp || 0) + xpGain;
    const oldLevel = Math.floor((user?.xp || 0) / 100) + 1;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    updateUser({ xp: newXP, level: newLevel });
    
    updateProgress(courseId, moduleId, {
      completed: true,
      completedAt: new Date().toISOString()
    });

    // Check for new badges
    const newBadges = [];
    if (newXP >= 500 && (user?.xp || 0) < 500) {
      newBadges.push({
        badge: {
          id: '500-xp',
          name: 'Rising Star',
          description: 'Earned 500 XP points',
          icon: '⭐',
          unlockedAt: new Date().toISOString()
        },
        isNew: true
      });
    }

    const result: GamificationResult = {
      xpGain: {
        amount: xpGain,
        reason: 'Completing module',
        timestamp: new Date().toISOString()
      },
      badges: newBadges,
      ...(newLevel > oldLevel && {
        levelUp: {
          oldLevel,
          newLevel
        }
      })
    };

    return result;
  };

  const value: AppContextType = {
    user,
    isLoading,
    courses,
    roadmaps,
    progress,
    updateUser,
    updateProgress,
    enrollInCourse,
    completeModule,
    showXPAnimation,
    setShowXPAnimation
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}