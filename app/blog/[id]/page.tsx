'use client';

import { use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface BlogPostContent {
  id: string;
  title: string;
  category: string;
  readTime: number;
  publishedAt: string;
  content: string;
  relatedPosts: string[];
}

const blogPostsContent: Record<string, BlogPostContent> = {
  '1': {
    id: '1',
    title: 'Mastering React Hooks: A Complete Guide',
    category: 'React',
    readTime: 12,
    publishedAt: '2024-01-15',
    content: `
# Mastering React Hooks: A Complete Guide

React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components. Let's explore the most important hooks and how to use them effectively.

## Introduction to Hooks

React Hooks were introduced in React 16.8 as a way to use state and lifecycle methods in functional components. Before hooks, you had to use class components for any stateful logic.

### Why Hooks?

- **Simpler code**: No need for class components
- **Better reusability**: Custom hooks allow sharing stateful logic
- **Easier testing**: Functional components are easier to test
- **Better performance**: Hooks optimize re-renders

## useState Hook

The \`useState\` hook allows you to add state to functional components.

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### Key Points:
- Returns an array with current state and setter function
- Setter function can accept a value or a function
- State updates are asynchronous

## useEffect Hook

The \`useEffect\` hook lets you perform side effects in functional components.

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Dependency array

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
\`\`\`

### Effect Patterns:
1. **Run after every render**: \`useEffect(() => {})\`
2. **Run once**: \`useEffect(() => {}, [])\`
3. **Run when deps change**: \`useEffect(() => {}, [dep1, dep2])\`

## Custom Hooks

Custom hooks let you extract component logic into reusable functions.

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Usage
function CounterComponent() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
\`\`\`

## Best Practices

1. **Always use the dependency array** in useEffect
2. **Keep effects focused** - one effect per concern
3. **Use custom hooks** for reusable logic
4. **Don't call hooks inside loops or conditions**
5. **Use the ESLint plugin** for hooks rules

## Advanced Hooks

### useContext
For consuming context values:

\`\`\`javascript
const theme = useContext(ThemeContext);
\`\`\`

### useReducer
For complex state logic:

\`\`\`javascript
const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`

### useMemo
For expensive calculations:

\`\`\`javascript
const expensiveValue = useMemo(() => 
  computeExpensiveValue(a, b), [a, b]
);
\`\`\`

## Conclusion

React Hooks provide a powerful and flexible way to build React components. They simplify component logic, improve code reusability, and make testing easier. Start with \`useState\` and \`useEffect\`, then gradually explore other hooks as needed.

The key to mastering hooks is understanding their rules and patterns. Practice with small examples, then apply them to real projects. Happy coding!
    `,
    relatedPosts: ['2', '3']
  },
  '2': {
    id: '2',
    title: 'JavaScript ES6+ Features Every Developer Should Know',
    category: 'JavaScript',
    readTime: 15,
    publishedAt: '2024-01-10',
    content: `
# JavaScript ES6+ Features Every Developer Should Know

Modern JavaScript has evolved significantly since ES6 (ES2015). Let's explore the essential features that every developer should master.

## Arrow Functions

Arrow functions provide a concise syntax and lexical \`this\` binding:

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
\`\`\`

## Destructuring

Extract values from arrays and objects:

\`\`\`javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age, city = 'Unknown' } = person;

// Function parameters
function greet({ name, age }) {
  return \`Hello \${name}, you are \${age} years old\`;
}
\`\`\`

## Template Literals

String interpolation and multi-line strings:

\`\`\`javascript
const name = 'John';
const age = 30;

const greeting = \`Hello \${name}!
You are \${age} years old.
Next year you'll be \${age + 1}.\`;
\`\`\`

## Promises and Async/Await

Handle asynchronous operations elegantly:

\`\`\`javascript
// Promises
fetch('/api/users')
  .then(response => response.json())
  .then(users => console.log(users))
  .catch(error => console.error(error));

// Async/Await
async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## Spread and Rest Operators

\`\`\`javascript
// Spread - expand arrays/objects
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Rest - collect parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
\`\`\`

## Modules

Import and export functionality:

\`\`\`javascript
// math.js
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}

// main.js
import { PI, add } from './math.js';
import * as math from './math.js';
\`\`\`

## Classes

Object-oriented programming syntax:

\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks\`);
  }
}
\`\`\`

## Array Methods

Powerful array manipulation methods:

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Map - transform elements
const doubled = numbers.map(n => n * 2);

// Filter - select elements
const evens = numbers.filter(n => n % 2 === 0);

// Reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Find - locate element
const found = numbers.find(n => n > 3);
\`\`\`

## Object Methods

\`\`\`javascript
const obj = { a: 1, b: 2, c: 3 };

// Get keys, values, entries
const keys = Object.keys(obj);        // ['a', 'b', 'c']
const values = Object.values(obj);    // [1, 2, 3]
const entries = Object.entries(obj);  // [['a', 1], ['b', 2], ['c', 3]]

// Assign - merge objects
const merged = Object.assign({}, obj, { d: 4 });
\`\`\`

## Modern Features (ES2020+)

\`\`\`javascript
// Optional chaining
const user = { profile: { name: 'John' } };
const name = user.profile?.name; // Safe access

// Nullish coalescing
const value = userInput ?? 'default'; // Only null/undefined

// Dynamic imports
const module = await import('./feature.js');
\`\`\`

## Best Practices

1. Use \`const\` by default, \`let\` when reassignment needed
2. Prefer arrow functions for callbacks
3. Use destructuring for cleaner code
4. Embrace async/await over promise chains
5. Use template literals for string interpolation
6. Leverage array methods instead of loops

These ES6+ features make JavaScript more expressive, readable, and powerful. Master them to write modern, efficient JavaScript code!
    `,
    relatedPosts: ['1', '3']
  },
  '4': {
    id: '4',
    title: 'Video Editing Workflow: From Raw Footage to Final Cut',
    category: 'Video Editing',
    readTime: 20,
    publishedAt: '2024-01-05',
    content: `
# Video Editing Workflow: From Raw Footage to Final Cut

Professional video editing requires a systematic approach. This comprehensive guide walks you through the entire workflow from organizing raw footage to delivering the final product.

## Pre-Production Planning

Before you even touch your editing software, proper planning sets you up for success:

### Project Setup
- **Frame Rate**: Match your project settings to your footage (24fps for cinematic, 30fps for standard, 60fps for sports)
- **Resolution**: 1080p for web, 4K for high-end delivery
- **Aspect Ratio**: 16:9 for standard, 9:16 for social media

### Folder Structure
Organize your project files systematically:

\`\`\`
Project_Name/
├── 01_Raw_Footage/
│   ├── Camera_A/
│   ├── Camera_B/
│   └── Audio/
├── 02_Assets/
│   ├── Graphics/
│   ├── Music/
│   └── SFX/
├── 03_Project_Files/
├── 04_Exports/
└── 05_Archive/
\`\`\`

## Phase 1: Import and Organization

### Importing Footage
1. **Copy, don't move** original files
2. **Verify file integrity** before deleting originals
3. **Create proxies** for 4K footage to improve performance
4. **Sync audio** if recording separately

### Logging and Metadata
- **Add keywords** and descriptions
- **Rate clips** (★☆☆☆☆ to ★★★★★)
- **Color code** by scene or camera
- **Create bins** for different content types

## Phase 2: Assembly Edit (Rough Cut)

### Story Structure
Focus on the narrative flow:

1. **Hook** - Grab attention in first 15 seconds
2. **Setup** - Establish context and characters  
3. **Conflict/Problem** - Present the main challenge
4. **Resolution** - Show the solution or outcome
5. **Call to Action** - What should viewers do next?

### Basic Assembly
- **Select best takes** based on performance and technical quality
- **Create rough timeline** with primary footage
- **Don't worry about transitions** yet - focus on story
- **Leave gaps** for B-roll and graphics

### Pacing Guidelines
- **Fast cuts** (1-3 seconds) for action/excitement
- **Medium cuts** (3-6 seconds) for standard content
- **Long cuts** (6+ seconds) for emotional moments or complex visuals

## Phase 3: Fine Cut (Detailed Edit)

### B-Roll Integration
- **70/30 rule**: 70% A-roll (main footage), 30% B-roll (supporting footage)
- **Cutaway timing**: Change shots on natural pauses or emphasis
- **Variety in shots**: Wide, medium, close-up sequence

### Audio Editing
\`\`\`
Audio Levels (dBFS):
- Dialogue: -12 to -6 dBFS
- Music: -18 to -12 dBFS  
- Sound Effects: -15 to -8 dBFS
- Room tone: -30 to -20 dBFS
\`\`\`

### Transition Types
- **Cut**: Direct change (90% of transitions)
- **Cross Dissolve**: Smooth blend (emotional moments)
- **Fade In/Out**: Beginning/end of scenes
- **Wipe/Slide**: Creative transitions (use sparingly)

## Phase 4: Color Correction and Grading

### Correction First
1. **Fix exposure** - Adjust highlights and shadows
2. **White balance** - Correct color temperature
3. **Contrast** - Set proper black and white points
4. **Saturation** - Adjust color intensity

### Grading Second
1. **Establish look** - Choose color palette
2. **Create mood** - Warm for happy, cool for sad
3. **Match shots** - Ensure consistency within scenes
4. **Secondary corrections** - Adjust specific colors/areas

### Popular Color Grades
- **Orange and Teal**: Commercial/blockbuster look
- **Desaturated**: Gritty, realistic feel
- **High Contrast**: Dramatic, punchy look
- **Vintage**: Film emulation with grain and color shifts

## Phase 5: Audio Post-Production

### Dialogue Enhancement
\`\`\`
Audio Processing Chain:
1. Noise Reduction (-10 to -15dB)
2. EQ (High-pass at 80Hz, presence boost at 2-5kHz)
3. Compression (3:1 ratio, slow attack, fast release)
4. De-esser (reduce harsh 's' sounds)
5. Limiter (prevent clipping)
\`\`\`

### Music and Sound Design
- **Music placement**: Support emotion, don't overpower
- **Sound effects**: Enhance realism and impact
- **Ambient sound**: Create atmosphere and location sense
- **Audio transitions**: Fade music up/down during dialogue

## Phase 6: Graphics and Titles

### Title Design Principles
- **Readable fonts** (Sans-serif for screen)
- **High contrast** with background
- **Consistent sizing** and positioning
- **Appropriate duration** (3-5 seconds for simple titles)

### Lower Thirds
\`\`\`
Standard Lower Third Timing:
- Fade In: 0.5 seconds
- Hold: 3-4 seconds
- Fade Out: 0.5 seconds
Total: 4-5 seconds
\`\`\`

### Graphics Workflow
1. **Create style guide** (fonts, colors, animations)
2. **Design in layers** for easy editing
3. **Use templates** for consistency
4. **Export with alpha channel** for compositing

## Phase 7: Review and Revision

### Review Checklist
- **Audio levels** consistent throughout
- **Color matching** between shots
- **Jump cuts** and continuity errors
- **Text spelling** and timing
- **Overall pacing** and flow

### Client Review Process
1. **Export review copy** (lower resolution for faster upload)
2. **Use timestamped comments** for feedback
3. **Version control** (V1, V2, V3, etc.)
4. **Document changes** in revision notes

## Phase 8: Final Delivery

### Export Settings by Platform

#### YouTube/Vimeo
- **Codec**: H.264
- **Resolution**: 1080p or 4K
- **Frame Rate**: Match source
- **Bitrate**: 8-12 Mbps (1080p), 35-45 Mbps (4K)

#### Social Media
- **Instagram**: 1080x1080 (square), 1080x1920 (stories)
- **TikTok**: 1080x1920, 30fps
- **Facebook**: 1280x720 minimum

#### Broadcast/Professional
- **Codec**: ProRes 422 or DNxHD
- **Color Space**: Rec. 709
- **Audio**: 48kHz, 16-bit minimum

### Archive and Backup
1. **Project files** saved in organized folders
2. **Source material** archived on separate drives
3. **Final exports** in multiple formats
4. **Documentation** of settings and decisions

## Advanced Workflow Tips

### Collaboration
- **Shared storage** for team projects
- **Proxy workflows** for remote editing
- **Version control** systems
- **Clear naming conventions**

### Efficiency Tools
- **Keyboard shortcuts** for common actions
- **Custom workspace** layouts
- **Render queue** management
- **Template projects** for recurring work

### Performance Optimization
- **Use proxies** for 4K footage
- **Clear cache** regularly
- **Close unnecessary apps** while editing
- **Optimize storage** (fast SSDs for active projects)

## Troubleshooting Common Issues

### Technical Problems
- **Dropped frames**: Check storage speed and codec
- **Audio sync drift**: Use PluralEyes or manual sync
- **Color shifts**: Monitor calibration and color management
- **Export failures**: Check codec compatibility and disk space

### Creative Challenges
- **Pacing issues**: Vary shot lengths and add B-roll
- **Audio problems**: Use room tone and audio transitions
- **Story clarity**: Add graphics and restructure sequence
- **Visual consistency**: Create and follow style guide

## Conclusion

Professional video editing is both technical craft and creative art. This workflow provides the structure needed to handle projects efficiently while maintaining creative quality. Remember that every project is unique - adapt this workflow to fit your specific needs and style.

The key to mastering video editing is consistent practice and continuous learning. Start with these fundamentals, then develop your own preferred methods and shortcuts as you gain experience.

Start small, think big, and always tell compelling stories through your edits!
    `,
    relatedPosts: ['6', '7']
  }
};

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = blogPostsContent[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-700 mb-8">The article you&apos;re looking for doesn&apos; exist.</p>
          <Link href="/blog" className="btn-primary">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <Link href="/blog" className="text-primary hover:text-primary-dark mb-4 inline-block">
            ← Back to Blog
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent text-primary">
              {post.category}
            </span>
            <span className="text-sm text-gray-700">{formatDate(post.publishedAt)}</span>
            <span className="text-sm text-gray-700">{post.readTime} min read</span>
          </div>
          
          <h1 className="text-4xl font-bold text-primary mb-4">{post.title}</h1>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold text-primary mt-8 mb-4">$1</h1>')
                .replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-primary mt-6 mb-3">$1</h2>')
                .replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 mt-4 mb-2">$1</h3>')
                .replace(/^\*\*(.+)\*\*/gm, '<strong class="font-bold text-gray-900">$1</strong>')
                .replace(/^- (.+)$/gm, '<li class="text-gray-900 mb-1">$1</li>')
                // .replace(/```([^`]+)```/s, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm text-gray-900">$1</code></pre>')
                .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm text-gray-900">$1</code>')
                .replace(/\n\n/g, '</p><p class="text-gray-900 mb-4">')
                .replace(/^(?!<[h|p|l|c|s])(.+)$/gm, '<p class="text-gray-900 mb-4">$1')
            }} 
          />
        </div>

        {/* Article Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 mb-2">Enjoyed this article?</p>
              <div className="flex gap-4">
                <Link href="/courses" className="btn-primary text-sm px-4 py-2">
                  Take Related Courses
                </Link>
                <Link href="/blog" className="btn-secondary text-sm px-4 py-2">
                  Read More Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}