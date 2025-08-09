import { NextRequest, NextResponse } from 'next/server';
import { updateProgress, getCourseById } from '@/lib/data';
import { GamificationEngine } from '@/lib/gamification';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const body = await request.json();
    const { userId, courseId, timeSpentSeconds, completed } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'Missing userId or courseId' },
        { status: 400 }
      );
    }

    // Update progress
    const progress = updateProgress(userId, courseId, params.moduleId, {
      timeSpentSeconds,
      completed,
      ...(completed && { completedAt: new Date().toISOString() })
    });

    let gamificationResult = null;

    // Award XP if module was completed
    if (completed && !progress.completed) {
      // Get module type to determine XP reward
      const course = getCourseById(courseId);
      const foundModule = course?.modules.find(m => m.id === params.moduleId);
      
      let activity: keyof typeof GamificationEngine['XP_REWARDS'] = 'MODULE_COMPLETED';
      
      if (foundModule?.type === 'doc') activity = 'DOC_READ';
      else if (foundModule?.type === 'video') activity = 'VIDEO_WATCHED';
      else if (foundModule?.type === 'quiz') activity = 'QUIZ_PASSED';
      else if (foundModule?.type === 'game') activity = 'GAME_COMPLETED';

      gamificationResult = GamificationEngine.awardXP(userId, activity);
      
      // Also update streak
      const streakResult = GamificationEngine.updateStreak(userId);
      if (streakResult && gamificationResult) {
        gamificationResult.streakUpdate = streakResult.streakUpdate;
      }
    }

    return NextResponse.json({
      progress,
      gamification: gamificationResult
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}