export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  xp: number;
  level: number;
  streak: {
    currentStreak: number;
    lastActiveDate: string | null;
    streakHistory: string[];
  };
  badges: Badge[];
  enrolledCourses: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  modules: Module[];
  thumbnail?: string;
}

export interface Module {
  id: string;
  type: 'doc' | 'video' | 'quiz' | 'game';
  title: string;
  contentUrl?: string;
  markdown?: string;
  timeEstimateMinutes: number;
  quiz?: Quiz;
  game?: Game;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface FlashcardData {
  cards: Array<{ front: string; back: string }>;
}

export interface MatchingData {
  pairs: Array<{ id: string; left: string; right: string }>;
}

export interface Game {
  id: string;
  type: 'flashcards' | 'matching';
  data: FlashcardData | MatchingData;
  maxScore: number;
  xpReward: number;
}

export interface Progress {
  userId: string;
  courseId: string;
  moduleId: string;
  completed: boolean;
  timeSpentSeconds: number;
  score?: number;
  completedAt?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  recommendedCourseId?: string;
  xpReward: number;
}

export interface UserRoadmap {
  userId: string;
  roadmapId: string;
  completedSteps: string[];
  followedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface GameScore {
  userId: string;
  gameId: string;
  score: number;
  xpEarned: number;
  playedAt: string;
}