'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Course, User } from '@/lib/types';

export default function Courses() {
  // For demo purposes, use mock session
  const session = { user: { name: 'Demo User', id: 'demo-1' } };
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch courses
      const coursesResponse = await fetch('/api/courses');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);

      // Fetch user data
      const userResponse = await fetch(`/api/user/progress?userId=${session.user.id}`);
      const userData = await userResponse.json();
      setUser(userData.user);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    
    setEnrolling(courseId);
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          courseId
        }),
      });

      if (response.ok) {
        // Refresh user data
        fetchData();
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId: string) => {
    return user?.enrolledCourses.includes(courseId) || false;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Course Catalog</h1>
          <p className="text-gray-600">Discover and enroll in interactive programming courses</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="card hover:shadow-lg transition-shadow">
              {/* Course Icon */}
              <div className="text-4xl mb-4 text-center">
                {course.id === '1' && <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">⚛️</div>}
                {course.id === '2' && <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">JS</div>}
                {course.id === '3' && <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">CSS</div>}
              </div>

              {/* Course Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-primary mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                {/* Course Stats */}
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{course.modules.length} modules</span>
                  <span>{course.modules.reduce((acc, mod) => acc + mod.timeEstimateMinutes, 0)} min</span>
                </div>

                {/* Module Types */}
                <div className="flex justify-center space-x-2 mb-4">
                  {course.modules.some(m => m.type === 'doc') && 
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      📖 Docs
                    </span>
                  }
                  {course.modules.some(m => m.type === 'video') && 
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      📹 Video
                    </span>
                  }
                  {course.modules.some(m => m.type === 'quiz') && 
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      🧠 Quiz
                    </span>
                  }
                  {course.modules.some(m => m.type === 'game') && 
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                      🎮 Game
                    </span>
                  }
                </div>

                {/* Price */}
                <div className="mb-4">
                  {course.price === 0 ? (
                    <span className="badge bg-green-500 text-white">Free</span>
                  ) : (
                    <span className="text-lg font-bold text-primary">${course.price}</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                {isEnrolled(course.id) ? (
                  <Link 
                    href={`/courses/${course.id}`}
                    className="btn-primary w-full"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling === course.id}
                    className="btn-accent w-full disabled:opacity-50"
                  >
                    {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-500">Check back later for new courses!</p>
          </div>
        )}
      </div>
    </div>
  );
}