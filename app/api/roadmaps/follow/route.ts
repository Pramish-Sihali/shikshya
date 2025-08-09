import { NextRequest, NextResponse } from 'next/server';
import { followRoadmap } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, roadmapId } = body;

    if (!userId || !roadmapId) {
      return NextResponse.json(
        { error: 'Missing userId or roadmapId' },
        { status: 400 }
      );
    }

    const userRoadmap = followRoadmap(userId, roadmapId);

    return NextResponse.json({
      success: true,
      userRoadmap
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to follow roadmap' },
      { status: 500 }
    );
  }
}