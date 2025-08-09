import { NextRequest, NextResponse } from 'next/server';
import { updateRoadmapProgress, getRoadmapById } from '@/lib/data';
import { GamificationEngine } from '@/lib/gamification';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, roadmapId, stepId } = body;

    if (!userId || !roadmapId || !stepId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update roadmap progress
    const userRoadmap = updateRoadmapProgress(userId, roadmapId, stepId);
    
    if (!userRoadmap) {
      return NextResponse.json(
        { error: 'User roadmap not found' },
        { status: 404 }
      );
    }

    // Get step details for XP reward
    const roadmap = getRoadmapById(roadmapId);
    const step = roadmap?.steps.find(s => s.id === stepId);
    
    const xpReward = step?.xpReward || 50;
    
    // Award XP
    const gamificationResult = GamificationEngine.awardXP(
      userId, 
      'ROADMAP_STEP_COMPLETED',
      xpReward
    );

    // Update streak
    const streakResult = GamificationEngine.updateStreak(userId);
    if (streakResult && gamificationResult) {
      gamificationResult.streakUpdate = streakResult.streakUpdate;
    }

    return NextResponse.json({
      userRoadmap,
      xpEarned: xpReward,
      gamification: gamificationResult
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to complete milestone' },
      { status: 500 }
    );
  }
}