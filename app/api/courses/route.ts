import { NextResponse } from 'next/server';
import { getAllCourses } from '@/lib/data';

export async function GET() {
  try {
    const courses = getAllCourses();
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}