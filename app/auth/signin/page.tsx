'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Refresh session and redirect
        await getSession();
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleDemoLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: userEmail,
        password: userPassword,
        redirect: false,
      });

      if (result?.error) {
        setError('Login failed');
      } else {
        await getSession();
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            <span className="text-accent">Shikshya Path</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Welcome back!
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => handleDemoLogin('user1@example.com', 'password')}
                disabled={loading}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demo User 1 (John Doe) - Has progress
              </button>
              <button
                onClick={() => handleDemoLogin('user2@example.com', 'password')}
                disabled={loading}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demo User 2 (Jane Smith) - Fresh start
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-accent">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}