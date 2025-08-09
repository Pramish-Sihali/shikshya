# Shikshya Path - Gamified Learning Platform

A proof-of-concept learning platform that combines the best of Duolingo's gamification, Roadmap.sh's structured learning paths, and modern LMS features. Built with Next.js, featuring interactive courses, career roadmaps, and educational games.

## Features

### 🎯 Core Functionality
- **Gamified Learning**: Earn XP, unlock badges, maintain streaks, and level up
- **Interactive Courses**: Documentation, video lessons, quizzes, and games
- **Career Roadmaps**: Structured learning paths for different tech careers
- **Mini-Games**: Flashcards and matching games for skill practice
- **Progress Tracking**: Detailed analytics and time tracking
- **User Profiles**: Achievement showcases and learning statistics

### 🎨 Design
- **Modern UI**: Clean, responsive design with midnight blue and gold theme
- **Nunito Font**: Professional typography for enhanced readability
- **SVG Icons**: Clean vector icons throughout the interface
- **Mobile Responsive**: Works seamlessly across all device sizes

### 🔧 Technical Features
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS 4**: Modern utility-first styling
- **NextAuth.js**: Secure authentication system
- **In-Memory Database**: POC-ready data management
- **Animation**: Smooth transitions and XP gain celebrations

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   The `.env.local` file is already configured with development defaults.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Demo Accounts

The application comes with pre-seeded demo accounts:

### User 1 (With Progress)
- **Email**: `user1@example.com`
- **Password**: `password`
- **Features**: Has enrolled courses, completed modules, earned badges, active streak

### User 2 (Fresh Start)
- **Email**: `user2@example.com`
- **Password**: `password`
- **Features**: Clean slate for testing the onboarding experience

## Testing the Application

### Core User Journey
1. **Landing Page**: Visit the homepage to see marketing content
2. **Sign In**: Use demo credentials to access the platform
3. **Dashboard**: View progress, streaks, XP, and quick actions
4. **Course Enrollment**: Browse and enroll in available courses
5. **Learning Modules**: Complete docs, videos, quizzes, and games
6. **Roadmap Following**: Follow career paths and mark milestones
7. **Games**: Play flashcards and matching games for extra XP
8. **Profile**: View achievements, badges, and learning statistics

### Key Features to Test
- ✅ User authentication with demo accounts
- ✅ Course enrollment and progress tracking  
- ✅ Module completion with timer functionality
- ✅ Quiz system with scoring and XP rewards
- ✅ Interactive games (flashcards and matching)
- ✅ Roadmap milestone completion
- ✅ XP gain animations and badge unlocking
- ✅ Streak tracking and calendar display
- ✅ Responsive design across devices

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── api/                     # API endpoints
│   ├── auth/                    # Authentication pages
│   ├── courses/                 # Course-related pages
│   ├── dashboard/               # User dashboard
│   ├── games/                   # Mini-games
│   ├── profile/                 # User profile
│   ├── roadmaps/               # Career roadmaps
│   ├── globals.css             # Global styles and theme
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── providers.tsx           # App providers
├── components/                  # Reusable UI components
│   ├── Header.tsx              # Main navigation
│   ├── ProgressBar.tsx         # Progress visualization
│   ├── Timer.tsx               # Learning session timer
│   ├── Quiz.tsx                # Interactive quiz component
│   ├── FlashcardsGame.tsx      # Flashcard game implementation
│   ├── MatchingGame.tsx        # Matching game implementation
│   └── XPGainAnimation.tsx     # Gamification animations
├── lib/                         # Core business logic
│   ├── auth.ts                 # Authentication configuration
│   ├── data.ts                 # In-memory data store
│   ├── gamification.ts         # XP, badges, and streak logic
│   └── types.ts                # TypeScript definitions
└── public/                      # Static assets
```

## Data Models

### User
- Personal information and authentication
- XP, level, and gamification stats
- Learning streak tracking
- Badge collection
- Enrolled courses

### Courses
- Structured learning modules
- Mixed content types (docs, videos, quizzes, games)
- Time estimates and difficulty levels

### Progress Tracking
- Module completion status
- Time spent per module
- Quiz scores and attempts
- Overall course progress

### Roadmaps
- Career-focused learning paths
- Sequential milestones
- Course recommendations
- Completion rewards

## Gamification System

### XP Rewards
- Reading documentation: 10 XP
- Watching videos: 20 XP  
- Passing quizzes: 30 XP
- Completing games: 15-50 XP (based on performance)
- Module completion: 15 XP
- Roadmap milestones: 50+ XP

### Level System
- Level = floor(XP / 100) + 1
- Each level requires 100 additional XP
- Visual progress indicators throughout the app

### Badge System
- First Steps: Enroll in first course
- Week Warrior: 7-day learning streak
- Rising Star: Earn 500 XP
- Quiz Master: Pass multiple quizzes
- Game Player: Complete games
- Roadmap Explorer: Complete roadmap milestones

### Streak Tracking
- Daily activity tracking
- Visual calendar display
- Streak recovery mechanics
- Motivational messaging

## Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4 with custom theme
- **Authentication**: NextAuth.js with credentials provider
- **State Management**: React Context + local state
- **Animations**: Framer Motion for smooth transitions
- **Data Storage**: In-memory for POC (easily replaceable)

### Key Design Decisions
- **Component-Based**: Reusable UI components for consistency
- **Type-Safe API**: Full TypeScript coverage for reliability
- **Responsive Design**: Mobile-first approach
- **Performance**: Client-side caching and optimistic updates

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### Immediate Improvements
- Database integration (PostgreSQL/MongoDB)
- Real video streaming with progress tracking
- Advanced analytics and reporting
- Content management system for instructors

### Advanced Features
- AI-powered course recommendations
- Social features (leaderboards, peer learning)
- Offline mode support
- Multi-language localization
- Mobile app (React Native)

## Contributing

This is a proof-of-concept built for educational purposes. For production use, consider implementing:
- Proper database persistence
- Comprehensive error handling
- Automated testing suite
- Security hardening
- Performance monitoring
- Content delivery network

---

**Built with Next.js, TypeScript, and Tailwind CSS**
