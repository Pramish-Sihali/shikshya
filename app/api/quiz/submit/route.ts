import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, updateProgress } from '@/lib/data';
import { GamificationEngine } from '@/lib/gamification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, moduleId, answers, timeSpent } = body;

    if (!userId || !courseId || !moduleId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the quiz from the course
    const course = getCourseById(courseId);
    const foundModule = course?.modules.find(m => m.id === moduleId);
    const quiz = foundModule?.quiz;

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate score
    let correct = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        options: question.options
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Update progress
    const progress = updateProgress(userId, courseId, moduleId, {
      completed: passed,
      score,
      timeSpentSeconds: timeSpent || 0,
      ...(passed && { completedAt: new Date().toISOString() })
    });

    // Award XP
    const activity = passed ? 'QUIZ_PASSED' : 'QUIZ_FAILED';
    const customXp = passed ? quiz.xpReward : Math.floor(quiz.xpReward / 6);
    const gamificationResult = GamificationEngine.awardXP(userId, activity, customXp);

    // Update streak if passed
    if (passed) {
      const streakResult = GamificationEngine.updateStreak(userId);
      if (streakResult && gamificationResult) {
        gamificationResult.streakUpdate = streakResult.streakUpdate;
      }
    }

    return NextResponse.json({
      score,
      passed,
      correct,
      total: quiz.questions.length,
      passingScore: quiz.passingScore,
      results,
      progress,
      gamification: gamificationResult
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}