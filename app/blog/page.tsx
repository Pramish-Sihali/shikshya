'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Mastering React Hooks: A Complete Guide',
    excerpt: 'Dive deep into React Hooks and learn how to use useState, useEffect, and custom hooks to build powerful applications.',
    category: 'React',
    readTime: 12,
    publishedAt: '2024-01-15',
    featured: true
  },
  {
    id: '2', 
    title: 'JavaScript ES6+ Features Every Developer Should Know',
    excerpt: 'Explore modern JavaScript features including arrow functions, destructuring, promises, and async/await.',
    category: 'JavaScript',
    readTime: 15,
    publishedAt: '2024-01-10',
    featured: true
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    excerpt: 'Learn the differences between CSS Grid and Flexbox and discover when each layout method is most effective.',
    category: 'CSS',
    readTime: 8,
    publishedAt: '2024-01-08',
    featured: false
  },
  {
    id: '4',
    title: 'Video Editing Workflow: From Raw Footage to Final Cut',
    excerpt: 'Step-by-step guide to professional video editing workflow, including organization, editing, and export strategies.',
    category: 'Video Editing',
    readTime: 20,
    publishedAt: '2024-01-05',
    featured: true
  },
  {
    id: '5',
    title: 'Calisthenics: Building Strength Without Equipment',
    excerpt: 'Comprehensive guide to bodyweight training, progression techniques, and creating effective workout routines.',
    category: 'Fitness',
    readTime: 10,
    publishedAt: '2024-01-03',
    featured: false
  },
  {
    id: '6',
    title: 'Photography Composition: Rule of Thirds and Beyond',
    excerpt: 'Master composition techniques to create visually stunning photographs that capture and hold attention.',
    category: 'Photography',
    readTime: 12,
    publishedAt: '2024-01-01',
    featured: false
  },
  {
    id: '7',
    title: 'Personal Finance: Building Your Emergency Fund',
    excerpt: 'Learn why emergency funds are crucial and get practical strategies for building and maintaining your financial safety net.',
    category: 'Finance',
    readTime: 14,
    publishedAt: '2023-12-28',
    featured: false
  },
  {
    id: '8',
    title: 'Kitchen Fundamentals: Knife Skills for Beginners',
    excerpt: 'Master basic knife techniques to improve your cooking efficiency and food presentation.',
    category: 'Cooking',
    readTime: 9,
    publishedAt: '2023-12-25',
    featured: false
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);
    
  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Learning Blog</h1>
          <p className="text-xl text-gray-900 max-w-2xl mx-auto">
            In-depth articles, tutorials, and insights to accelerate your learning journey across multiple disciplines.
          </p>
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article key={post.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-primary">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-700">⭐ Featured</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-900 mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{post.readTime} min read</span>
                </div>
                
                <div className="mt-4">
                  <Link 
                    href={`/blog/${post.id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">All Articles</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="text-sm text-accent font-medium">⭐ Featured</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-gray-900 mb-4">{post.excerpt}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                <span>{formatDate(post.publishedAt)}</span>
                <span>{post.readTime} min read</span>
              </div>
              
              <Link 
                href={`/blog/${post.id}`}
                className="btn-secondary text-sm px-4 py-2 inline-block"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center card bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
          <h3 className="text-2xl font-bold text-primary mb-4">Ready to Learn More?</h3>
          <p className="text-gray-900 mb-6 max-w-2xl mx-auto">
            Take your learning to the next level with our interactive courses, hands-on projects, and gamified learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
            <Link href="/games" className="btn-secondary">
              Play Learning Games
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}