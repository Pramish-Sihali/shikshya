import { User, Badge } from './types';
import { updateUser } from './data';

export interface XPGain {
  amount: number;
  reason: string;
  timestamp: string;
}

export interface BadgeReward {
  badge: Badge;
  isNew: boolean;
}

export interface GamificationResult {
  xpGain: XPGain;
  levelUp?: {
    oldLevel: number;
    newLevel: number;
  };
  badges: BadgeReward[];
  streakUpdate?: {
    oldStreak: number;
    newStreak: number;
  };
}

export class GamificationEngine {
  private static readonly XP_PER_LEVEL = 100;
  
  // XP rewards for different activities
  private static readonly XP_REWARDS = {
    DOC_READ: 10,
    VIDEO_WATCHED: 20,
    QUIZ_PASSED: 30,
    QUIZ_FAILED: 5,
    GAME_COMPLETED: 25,
    MODULE_COMPLETED: 15,
    COURSE_COMPLETED: 100,
    ROADMAP_STEP_COMPLETED: 50,
    DAILY_LOGIN: 5,
  };

  // Badge definitions
  private static readonly BADGE_DEFINITIONS = [
    {
      id: 'first-course',
      name: 'First Steps',
      description: 'Enrolled in your first course',
      icon: '🎓',
      condition: (user: User) => user.enrolledCourses.length >= 1
    },
    {
      id: '7-day-streak',
      name: 'Week Warrior',
      description: 'Maintained a 7-day learning streak',
      icon: '🔥',
      condition: (user: User) => user.streak.currentStreak >= 7
    },
    {
      id: '500-xp',
      name: 'Rising Star',
      description: 'Earned 500 XP points',
      icon: '⭐',
      condition: (user: User) => user.xp >= 500
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Passed 10 quizzes',
      icon: '🧠',
      condition: (user: User) => {
        // This would need to be tracked in progress data
        // For now, we'll use a simple XP threshold
        return user.xp >= 300;
      }
    },
    {
      id: 'game-player',
      name: 'Game Player',
      description: 'Played your first game',
      icon: '🎮',
      condition: (user: User) => {
        // This would need game play tracking
        return user.xp >= 50;
      }
    },
    {
      id: 'roadmap-explorer',
      name: 'Roadmap Explorer',
      description: 'Completed a roadmap milestone',
      icon: '🗺️',
      condition: (user: User) => user.xp >= 100
    }
  ];

  static calculateLevel(xp: number): number {
    return Math.floor(xp / this.XP_PER_LEVEL) + 1;
  }

  static getXpForNextLevel(currentXp: number): number {
    const currentLevel = this.calculateLevel(currentXp);
    return currentLevel * this.XP_PER_LEVEL - currentXp;
  }

  static getProgressToNextLevel(currentXp: number): number {
    const currentLevel = this.calculateLevel(currentXp);
    const xpAtCurrentLevel = (currentLevel - 1) * this.XP_PER_LEVEL;
    const xpInCurrentLevel = currentXp - xpAtCurrentLevel;
    return (xpInCurrentLevel / this.XP_PER_LEVEL) * 100;
  }

  static awardXP(
    userId: string, 
    activity: keyof typeof GamificationEngine.XP_REWARDS,
    customAmount?: number
  ): GamificationResult | null {
    const user = updateUser(userId, {});
    if (!user) return null;

    const xpAmount = customAmount || this.XP_REWARDS[activity];
    const oldLevel = this.calculateLevel(user.xp);
    const newXp = user.xp + xpAmount;
    const newLevel = this.calculateLevel(newXp);

    // Update user XP and level
    const updatedUser = updateUser(userId, {
      xp: newXp,
      level: newLevel
    });

    if (!updatedUser) return null;

    const xpGain: XPGain = {
      amount: xpAmount,
      reason: this.getActivityDisplayName(activity),
      timestamp: new Date().toISOString()
    };

    const result: GamificationResult = {
      xpGain,
      badges: this.checkAndAwardBadges(updatedUser)
    };

    if (newLevel > oldLevel) {
      result.levelUp = {
        oldLevel,
        newLevel
      };
    }

    return result;
  }

  static updateStreak(userId: string): GamificationResult | null {
    const user = updateUser(userId, {});
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const oldStreak = user.streak.currentStreak;
    let newStreak = oldStreak;
    let streakHistory = [...user.streak.streakHistory];

    // Check if user was active today
    if (user.streak.lastActiveDate === today) {
      // Already counted today, no change
      return null;
    }

    // Check if this is a continuation of the streak
    if (user.streak.lastActiveDate === yesterday) {
      // Continuing streak
      newStreak = oldStreak + 1;
    } else if (user.streak.lastActiveDate === null || user.streak.lastActiveDate < yesterday) {
      // Starting new streak or broken streak
      newStreak = 1;
      streakHistory = []; // Reset history for new streak
    }

    // Add today to streak history
    streakHistory.push(today);

    // Update user
    const updatedUser = updateUser(userId, {
      streak: {
        currentStreak: newStreak,
        lastActiveDate: today,
        streakHistory
      }
    });

    if (!updatedUser) return null;

    const result: GamificationResult = {
      xpGain: {
        amount: this.XP_REWARDS.DAILY_LOGIN,
        reason: 'Daily login streak',
        timestamp: new Date().toISOString()
      },
      streakUpdate: {
        oldStreak,
        newStreak
      },
      badges: this.checkAndAwardBadges(updatedUser)
    };

    return result;
  }

  private static checkAndAwardBadges(user: User): BadgeReward[] {
    const rewards: BadgeReward[] = [];
    const existingBadgeIds = user.badges.map(b => b.id);

    for (const badgeDef of this.BADGE_DEFINITIONS) {
      if (!existingBadgeIds.includes(badgeDef.id) && badgeDef.condition(user)) {
        const newBadge: Badge = {
          id: badgeDef.id,
          name: badgeDef.name,
          description: badgeDef.description,
          icon: badgeDef.icon,
          unlockedAt: new Date().toISOString()
        };

        user.badges.push(newBadge);
        rewards.push({
          badge: newBadge,
          isNew: true
        });
      }
    }

    return rewards;
  }

  private static getActivityDisplayName(activity: keyof typeof GamificationEngine.XP_REWARDS): string {
    const displayNames: Record<typeof activity, string> = {
      DOC_READ: 'Reading documentation',
      VIDEO_WATCHED: 'Watching video',
      QUIZ_PASSED: 'Passing quiz',
      QUIZ_FAILED: 'Attempting quiz',
      GAME_COMPLETED: 'Completing game',
      MODULE_COMPLETED: 'Completing module',
      COURSE_COMPLETED: 'Completing course',
      ROADMAP_STEP_COMPLETED: 'Roadmap milestone',
      DAILY_LOGIN: 'Daily activity'
    };

    return displayNames[activity];
  }

  static getBadgeByActivity(activity: string): string {
    const activityBadges: Record<string, string> = {
      'doc': '📚',
      'video': '📹',
      'quiz': '🧠',
      'game': '🎮',
      'course': '🎓',
      'roadmap': '🗺️',
      'streak': '🔥'
    };

    return activityBadges[activity] || '✨';
  }
}