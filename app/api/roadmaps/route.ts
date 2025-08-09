import { NextRequest, NextResponse } from 'next/server';
import { getAllRoadmaps, getUserRoadmaps } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const roadmaps = getAllRoadmaps();
    
    if (userId) {
      const userRoadmaps = getUserRoadmaps(userId);
      
      // Enhance roadmaps with user progress
      const enhancedRoadmaps = roadmaps.map(roadmap => {
        const userRoadmap = userRoadmaps.find(ur => ur.roadmapId === roadmap.id);
        return {
          ...roadmap,
          isFollowed: !!userRoadmap,
          completedSteps: userRoadmap?.completedSteps || [],
          followedAt: userRoadmap?.followedAt
        };
      });

      return NextResponse.json(enhancedRoadmaps);
    }

    return NextResponse.json(roadmaps);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch roadmaps' },
      { status: 500 }
    );
  }
}