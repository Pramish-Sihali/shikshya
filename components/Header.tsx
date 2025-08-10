'use client';

import Link from 'next/link';

export default function Header() {
  // For demo purposes, show as authenticated user
  const isAuthenticated = true;
  const user = { name: 'John Doe' };

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-accent">
              Shikshya Path
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="hover:text-accent-light transition-colors">
              Dashboard
            </Link>
            <Link href="/courses" className="hover:text-accent-light transition-colors">
              Courses
            </Link>
            <Link href="/roadmaps" className="hover:text-accent-light transition-colors">
              Roadmaps
            </Link>
            <Link href="/games" className="hover:text-accent-light transition-colors">
              Games
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="text-white hover:text-accent-light transition-colors"
                >
                  {user.name}
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-white hover:text-accent-light transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-accent-light">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}