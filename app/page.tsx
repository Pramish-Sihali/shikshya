'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Learn. <span className="text-accent">Play.</span> Grow.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master programming and technology skills through gamified courses, 
            interactive roadmaps, and fun mini-games. Level up your learning journey!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signin" className="btn-primary text-lg px-8 py-4">
              Start Learning Free
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-4">
              Explore Features
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-gray-600">Interactive Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-gray-600">Career Roadmaps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-gray-600">XP to Earn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Shikshya Path?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We combine the best of Duolingo&apos;s gamification, Roadmap.sh&apos;s structured learning, 
              and modern LMS features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">Gamified Learning</h3>
              <p className="text-gray-300">
                Earn XP, unlock badges, maintain streaks, and level up as you learn. 
                Stay motivated with our engaging reward system.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">Career Roadmaps</h3>
              <p className="text-gray-300">
                Follow structured paths for Frontend Development, DevOps, Data Science, 
                and more. Track your progress and unlock new skills.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">Interactive Games</h3>
              <p className="text-gray-300">
                Learn through flashcard games, matching puzzles, and interactive 
                challenges that make complex concepts stick.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">Rich Content</h3>
              <p className="text-gray-300">
                Access documentation, video lessons, quizzes, and hands-on exercises 
                designed by industry experts.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">Progress Tracking</h3>
              <p className="text-gray-300">
                Monitor your learning time, completion rates, and skill development 
                with detailed progress analytics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">Daily Streaks</h3>
              <p className="text-gray-300">
                Build consistent learning habits with daily streak challenges 
                and achievement milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Course Categories */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Diverse Learning Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From coding to cooking, fitness to finance - explore unconventional skills
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Large Feature - Tech Skills */}
            <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-500 to-primary p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Programming & Tech</h3>
                <p className="text-blue-100 mb-6">
                  Master React, JavaScript, CSS, and modern web development with interactive lessons and real projects.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">JavaScript</span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">CSS</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            </div>

            {/* Culinary Arts */}
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-2xl text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Culinary Arts</h3>
              <p className="text-orange-100 text-sm">Master knife skills, cooking techniques, and kitchen fundamentals</p>
            </div>

            {/* Fitness & Calisthenics */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-6 rounded-2xl text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Calisthenics</h3>
              <p className="text-green-100 text-sm">Build strength with bodyweight exercises and movement patterns</p>
            </div>

            {/* Video Editing */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Video Editing</h3>
              <p className="text-purple-100 text-sm">Create professional videos with cutting, transitions, and effects</p>
            </div>

            {/* Photography */}
            <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-6 rounded-2xl text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Photography</h3>
              <p className="text-pink-100 text-sm">Master exposure, composition, and digital photography techniques</p>
            </div>

            {/* Personal Finance */}
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-6 rounded-2xl text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Personal Finance</h3>
              <p className="text-yellow-100 text-sm">Build financial literacy with budgeting, saving, and investing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Learners Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are accelerating their learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Frontend Developer</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
&ldquo;The gamification made learning React so much more engaging. I leveled up both my skills and my confidence!&rdquo;
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Marcus Johnson</h4>
                  <p className="text-sm text-gray-500">Aspiring Chef</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
&ldquo;Never thought I&apos;d learn cooking online, but the knife skills video and safety quizzes were incredibly helpful!&rdquo;
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Aisha Patel</h4>
                  <p className="text-sm text-gray-500">Content Creator</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
&ldquo;The video editing course taught me J-cuts and L-cuts that transformed my content. The games made learning fun!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Roadmap Preview */}
      <section id="roadmaps" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Career Roadmaps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow structured learning paths to achieve your career goals
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-2xl font-bold text-primary mb-6">Frontend Developer Path</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <div className="font-medium">Learn HTML & CSS</div>
                    <div className="text-sm text-gray-600">Master the building blocks of web development</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <div className="font-medium">JavaScript Fundamentals</div>
                    <div className="text-sm text-gray-600">Learn JavaScript programming basics</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <div className="font-medium">React Development</div>
                    <div className="text-sm text-gray-600">Build modern web applications with React</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <div className="font-medium">Build Portfolio Project</div>
                    <div className="text-sm text-gray-600">Create a full-stack web application</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners who are already leveling up their skills with Shikshya Path.
          </p>
          <Link href="/auth/signin" className="btn-accent text-lg px-8 py-4">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-4">Shikshya Path</div>
            <p className="text-gray-300 mb-8">
              Empowering learners through gamified education
            </p>
            <div className="text-sm text-gray-400">
              © 2024 Shikshya Path. Built with Next.js for educational purposes.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
