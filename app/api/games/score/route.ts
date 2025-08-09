import { NextRequest, NextResponse } from 'next/server';
import { addGameScore, getCourseById } from '@/lib/data';
import { GamificationEngine } from '@/lib/gamification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId, score, courseId, moduleId } = body;

    if (!userId || !gameId || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get game details to calculate XP
    let maxScore = 100;
    let baseXpReward = 25;

    if (courseId && moduleId) {
      const course = getCourseById(courseId);
      const foundModule = course?.modules.find(m => m.id === moduleId);
      if (foundModule?.game) {
        maxScore = foundModule.game.maxScore;
        baseXpReward = foundModule.game.xpReward;
      }
    }

    // Calculate XP based on score percentage
    const scorePercentage = Math.min(score / maxScore, 1);
    const xpEarned = Math.round(baseXpReward * scorePercentage);

    // Save game score
    const gameScore = addGameScore(userId, gameId, score, xpEarned);

    // Award XP
    const gamificationResult = GamificationEngine.awardXP(userId, 'GAME_COMPLETED', xpEarned);

    // Update streak
    const streakResult = GamificationEngine.updateStreak(userId);
    if (streakResult && gamificationResult) {
      gamificationResult.streakUpdate = streakResult.streakUpdate;
    }

    return NextResponse.json({
      gameScore,
      xpEarned,
      scorePercentage: Math.round(scorePercentage * 100),
      gamification: gamificationResult
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit game score' },
      { status: 500 }
    );
  }
}