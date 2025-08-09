import { NextRequest, NextResponse } from 'next/server';
import { enrollUserInCourse } from '@/lib/data';
import { GamificationEngine } from '@/lib/gamification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'Missing userId or courseId' },
        { status: 400 }
      );
    }

    const enrolled = enrollUserInCourse(userId, courseId);
    
    if (!enrolled) {
      return NextResponse.json(
        { error: 'Failed to enroll or already enrolled' },
        { status: 400 }
      );
    }

    // Award XP and check for badges (first course badge)
    const gamificationResult = GamificationEngine.awardXP(userId, 'DAILY_LOGIN');

    return NextResponse.json({
      success: true,
      gamification: gamificationResult
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}