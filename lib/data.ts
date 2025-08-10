import { User, Course, Progress, Roadmap, UserRoadmap, GameScore } from './types';

// In-memory data store for POC
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user1@example.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    xp: 150,
    level: 2,
    streak: {
      currentStreak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakHistory: [
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      ]
    },
    badges: [
      {
        id: 'first-course',
        name: 'First Steps',
        description: 'Enrolled in your first course',
        icon: '🎓',
        unlockedAt: new Date().toISOString()
      }
    ],
    enrolledCourses: ['1'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'user2@example.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    xp: 0,
    level: 1,
    streak: {
      currentStreak: 0,
      lastActiveDate: null,
      streakHistory: []
    },
    badges: [],
    enrolledCourses: [],
    createdAt: new Date().toISOString()
  }
];

const courses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    price: 0,
    modules: [
      {
        id: '1-1',
        type: 'doc',
        title: 'Introduction to React',
        markdown: `# Introduction to React

React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".

## Key Concepts:
- **Components**: Building blocks of React applications
- **JSX**: Syntax extension for JavaScript
- **Props**: Data passed to components
- **State**: Component's internal data

## Why React?
- Declarative
- Component-Based
- Learn Once, Write Anywhere`,
        timeEstimateMinutes: 15
      },
      {
        id: '1-2',
        type: 'video',
        title: 'React Components',
        contentUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
        timeEstimateMinutes: 20
      },
      {
        id: '1-2-game',
        type: 'game',
        title: 'Component Building Game',
        timeEstimateMinutes: 8,
        game: {
          id: 'game-1-2-component',
          type: 'matching',
          data: {
            pairs: [
              { id: 'p1', left: 'function MyComponent()', right: 'Functional component syntax' },
              { id: 'p2', left: 'props.name', right: 'Accessing component properties' },
              { id: 'p3', left: 'useState()', right: 'Hook for managing state' },
              { id: 'p4', left: '<div>Hello</div>', right: 'JSX element syntax' }
            ]
          },
          maxScore: 100,
          xpReward: 20
        }
      },
      {
        id: '1-3',
        type: 'quiz',
        title: 'React Basics Quiz',
        timeEstimateMinutes: 10,
        quiz: {
          id: 'quiz-1-3',
          questions: [
            {
              id: 'q1',
              question: 'What is React?',
              options: ['A database', 'A JavaScript library', 'A CSS framework', 'A web server'],
              correctAnswer: 1,
              timeLimit: 30
            },
            {
              id: 'q2',
              question: 'What does JSX stand for?',
              options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extension', 'JavaScript Extension'],
              correctAnswer: 0,
              timeLimit: 30
            }
          ],
          passingScore: 70,
          xpReward: 30
        }
      },
      {
        id: '1-4',
        type: 'game',
        title: 'React Terms Flashcards',
        timeEstimateMinutes: 10,
        game: {
          id: 'game-1-4',
          type: 'flashcards',
          data: {
            cards: [
              { front: 'Component', back: 'A reusable piece of UI' },
              { front: 'Props', back: 'Data passed to components' },
              { front: 'State', back: 'Internal component data' },
              { front: 'JSX', back: 'JavaScript XML syntax' }
            ]
          },
          maxScore: 100,
          xpReward: 25
        }
      }
    ]
  },
  {
    id: '2',
    title: 'JavaScript Essentials',
    description: 'Master JavaScript fundamentals',
    price: 0,
    modules: [
      {
        id: '2-1',
        type: 'doc',
        title: 'Variables and Data Types',
        markdown: `# JavaScript Variables and Data Types

JavaScript is a dynamically typed language with several data types.

## Variable Declaration:
\`\`\`javascript
let name = "John";
const age = 30;
var city = "New York";
\`\`\`

## Data Types:
- **String**: Text data
- **Number**: Numeric values
- **Boolean**: true/false
- **Array**: Ordered lists
- **Object**: Key-value pairs
- **null**: Intentionally empty
- **undefined**: Not defined`,
        timeEstimateMinutes: 20
      },
      {
        id: '2-1-game',
        type: 'game',
        title: 'JavaScript Syntax Practice',
        timeEstimateMinutes: 7,
        game: {
          id: 'game-2-1-syntax',
          type: 'flashcards',
          data: {
            cards: [
              { front: 'let x = 5;', back: 'Declares a variable x with value 5' },
              { front: 'const PI = 3.14;', back: 'Declares a constant PI' },
              { front: 'typeof "hello"', back: 'Returns "string"' },
              { front: 'null vs undefined', back: 'null is intentional, undefined is not set' }
            ]
          },
          maxScore: 100,
          xpReward: 15
        }
      },
      {
        id: '2-2',
        type: 'quiz',
        title: 'JavaScript Basics Quiz',
        timeEstimateMinutes: 15,
        quiz: {
          id: 'quiz-2-2',
          questions: [
            {
              id: 'q1',
              question: 'Which keyword creates a constant variable?',
              options: ['var', 'let', 'const', 'static'],
              correctAnswer: 2,
              timeLimit: 25
            },
            {
              id: 'q2',
              question: 'What type is "Hello World"?',
              options: ['Number', 'String', 'Boolean', 'Object'],
              correctAnswer: 1,
              timeLimit: 20
            }
          ],
          passingScore: 70,
          xpReward: 30
        }
      },
      {
        id: '2-3',
        type: 'game',
        title: 'JavaScript Code Challenge',
        timeEstimateMinutes: 12,
        game: {
          id: 'game-2-3-challenge',
          type: 'matching',
          data: {
            pairs: [
              { id: 'p1', left: 'array.push(item)', right: 'Adds item to end of array' },
              { id: 'p2', left: 'string.length', right: 'Gets number of characters' },
              { id: 'p3', left: 'if (condition) {}', right: 'Conditional statement' },
              { id: 'p4', left: 'for (let i = 0; i < 5; i++)', right: 'Loop structure' },
              { id: 'p5', left: 'function name() {}', right: 'Function declaration' }
            ]
          },
          maxScore: 100,
          xpReward: 25
        }
      }
    ]
  },
  {
    id: '3',
    title: 'CSS Styling',
    description: 'Learn modern CSS techniques',
    price: 0,
    modules: [
      {
        id: '3-1',
        type: 'doc',
        title: 'CSS Grid and Flexbox',
        markdown: `# CSS Grid and Flexbox

Modern CSS layout techniques for creating responsive designs.

## Flexbox:
Perfect for one-dimensional layouts (rows or columns).

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid:
Ideal for two-dimensional layouts.

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\``,
        timeEstimateMinutes: 25
      },
      {
        id: '3-1-game',
        type: 'game',
        title: 'CSS Layout Flashcards',
        timeEstimateMinutes: 6,
        game: {
          id: 'game-3-1-layout',
          type: 'flashcards',
          data: {
            cards: [
              { front: 'display: flex', back: 'Creates flexible container' },
              { front: 'display: grid', back: 'Creates grid container' },
              { front: 'justify-content: center', back: 'Centers items horizontally' },
              { front: 'align-items: center', back: 'Centers items vertically' }
            ]
          },
          maxScore: 100,
          xpReward: 15
        }
      },
      {
        id: '3-2',
        type: 'game',
        title: 'CSS Property Matching',
        timeEstimateMinutes: 10,
        game: {
          id: 'game-3-2',
          type: 'matching',
          data: {
            pairs: [
              { id: 'p1', left: 'display: flex', right: 'Creates flexible container' },
              { id: 'p2', left: 'grid-gap', right: 'Space between grid items' },
              { id: 'p3', left: 'justify-content', right: 'Align items horizontally' },
              { id: 'p4', left: 'align-items', right: 'Align items vertically' }
            ]
          },
          maxScore: 100,
          xpReward: 20
        }
      }
    ]
  },
  {
    id: '4',
    title: 'Culinary Arts Basics',
    description: 'Master essential cooking techniques and kitchen fundamentals',
    price: 0,
    modules: [
      {
        id: '4-1',
        type: 'doc',
        title: 'Kitchen Safety & Equipment',
        markdown: `# Kitchen Safety & Equipment

Essential knowledge for safe and efficient cooking.

## Kitchen Safety Rules:
- **Knife Safety**: Always cut away from your body
- **Hot Surface Awareness**: Use oven mitts and pot holders
- **Cross-Contamination**: Separate raw and cooked foods
- **Fire Safety**: Keep pan handles turned inward

## Essential Equipment:
- **Chef's Knife**: Your most important tool
- **Cutting Board**: Separate boards for meat and vegetables
- **Measuring Tools**: Accurate measurements matter
- **Heat-Safe Utensils**: Silicone or wooden spoons

## Basic Techniques:
- **Knife Skills**: Julienne, dice, chop, mince
- **Heat Control**: Understanding temperature zones
- **Seasoning**: Salt, pepper, herbs, and spices`,
        timeEstimateMinutes: 20
      },
      {
        id: '4-2',
        type: 'video',
        title: 'Basic Knife Skills',
        contentUrl: 'https://www.youtube.com/embed/JMA2SqaDgG8',
        timeEstimateMinutes: 15
      },
      {
        id: '4-2-game',
        type: 'game',
        title: 'Kitchen Equipment Quiz',
        timeEstimateMinutes: 8,
        game: {
          id: 'game-4-2-equipment',
          type: 'flashcards',
          data: {
            cards: [
              { front: "Chef's Knife", back: 'Most important kitchen tool for cutting' },
              { front: 'Cutting Board', back: 'Surface for safe food preparation' },
              { front: 'Oven Mitts', back: 'Protect hands from hot surfaces' },
              { front: 'Measuring Cups', back: 'Ensure accurate ingredient amounts' }
            ]
          },
          maxScore: 100,
          xpReward: 20
        }
      },
      {
        id: '4-3',
        type: 'quiz',
        title: 'Cooking Fundamentals Quiz',
        timeEstimateMinutes: 10,
        quiz: {
          id: 'quiz-4-3',
          questions: [
            {
              id: 'q1',
              question: 'What temperature should chicken be cooked to?',
              options: ['145°F', '160°F', '165°F', '180°F'],
              correctAnswer: 2,
              timeLimit: 30
            },
            {
              id: 'q2',
              question: 'Which cut is best for slow cooking?',
              options: ['Tenderloin', 'Chuck roast', 'Ribeye', 'Sirloin'],
              correctAnswer: 1,
              timeLimit: 25
            }
          ],
          passingScore: 70,
          xpReward: 30
        }
      },
      {
        id: '4-4',
        type: 'game',
        title: 'Cooking Terms Matching',
        timeEstimateMinutes: 8,
        game: {
          id: 'game-4-4',
          type: 'matching',
          data: {
            pairs: [
              { id: 'p1', left: 'Sauté', right: 'Cook quickly in shallow fat' },
              { id: 'p2', left: 'Braise', right: 'Cook slowly in liquid' },
              { id: 'p3', left: 'Julienne', right: 'Cut into thin strips' },
              { id: 'p4', left: 'Mise en Place', right: 'Everything in its place' }
            ]
          },
          maxScore: 100,
          xpReward: 20
        }
      }
    ]
  },
  {
    id: '5',
    title: 'Calisthenics Training',
    description: 'Build strength and mobility using your body weight',
    price: 0,
    modules: [
      {
        id: '5-1',
        type: 'doc',
        title: 'Bodyweight Training Foundations',
        markdown: `# Bodyweight Training Foundations

Master the fundamentals of calisthenics for strength and mobility.

## Core Principles:
- **Progressive Overload**: Gradually increase difficulty
- **Proper Form**: Quality over quantity always
- **Consistency**: Regular practice builds strength
- **Rest and Recovery**: Muscles grow during rest

## Basic Movement Patterns:
- **Push**: Push-ups, dips, handstand push-ups
- **Pull**: Pull-ups, rows, muscle-ups
- **Squat**: Air squats, pistol squats, jump squats
- **Core**: Planks, L-sits, hanging leg raises

## Progression Strategies:
- **Increase Reps**: More repetitions at same difficulty
- **Increase Sets**: More rounds of exercise
- **Decrease Rest**: Less time between exercises
- **Increase Difficulty**: Advance to harder variations`,
        timeEstimateMinutes: 18
      },
      {
        id: '5-2',
        type: 'video',
        title: 'Perfect Push-up Form',
        contentUrl: 'https://www.youtube.com/embed/JyCG_5l3XLk',
        timeEstimateMinutes: 12
      },
      {
        id: '5-2-game',
        type: 'game',
        title: 'Exercise Form Matching',
        timeEstimateMinutes: 10,
        game: {
          id: 'game-5-2-form',
          type: 'matching',
          data: {
            pairs: [
              { id: 'p1', left: 'Push-up', right: 'Targets chest, shoulders, triceps' },
              { id: 'p2', left: 'Pull-up', right: 'Targets back, biceps' },
              { id: 'p3', left: 'Squat', right: 'Targets legs, glutes' },
              { id: 'p4', left: 'Plank', right: 'Targets core muscles' },
              { id: 'p5', left: 'Dip', right: 'Targets triceps, chest' }
            ]
          },
          maxScore: 100,
          xpReward: 22
        }
      },
      {
        id: '5-3',
        type: 'quiz',
        title: 'Calisthenics Knowledge Check',
        timeEstimateMinutes: 8,
        quiz: {
          id: 'quiz-5-3',
          questions: [
            {
              id: 'q1',
              question: 'What is the key to progressive overload in calisthenics?',
              options: ['Lifting heavier weights', 'Doing more exercises', 'Gradually increasing difficulty', 'Working out every day'],
              correctAnswer: 2,
              timeLimit: 30
            },
            {
              id: 'q2',
              question: 'Which exercise primarily targets the pulling muscles?',
              options: ['Push-ups', 'Squats', 'Pull-ups', 'Planks'],
              correctAnswer: 2,
              timeLimit: 25
            }
          ],
          passingScore: 70,
          xpReward: 25
        }
      }
    ]
  },
  {
    id: '6',
    title: 'Video Editing Mastery',
    description: 'Create professional videos with modern editing techniques',
    price: 0,
    modules: [
      {
        id: '6-1',
        type: 'doc',
        title: 'Video Editing Fundamentals',
        markdown: `# Video Editing Fundamentals

Learn the essential concepts for creating compelling video content.

## Basic Editing Concepts:
- **Timeline**: Where you arrange your clips
- **Cuts**: Transitions between clips
- **Trimming**: Adjusting clip length
- **Layering**: Video and audio on separate tracks

## Types of Cuts:
- **Hard Cut**: Direct transition between clips (90% of edits)
- **J-Cut**: Audio continues before video changes
- **L-Cut**: Audio changes before video
- **Cross Dissolve**: Smooth blend for emotional moments

## Essential Tools:
- **Razor Tool**: Split clips at specific points
- **Selection Tool**: Move and adjust clips
- **Zoom Tool**: Navigate timeline precisely
- **Hand Tool**: Pan across timeline
- **Slip Tool**: Adjust clip content without changing duration

## The 321 Rule:
- **3** copies of important footage
- **2** different storage types (SSD + HDD)
- **1** offsite backup (cloud storage)

## Project Organization:
Create folder structure:
- Raw_Footage/
- Assets/ (graphics, music, SFX)
- Project_Files/
- Exports/
- Archive/`,
        timeEstimateMinutes: 25
      },
      {
        id: '6-1-game',
        type: 'game',
        title: 'Video Editing Basics Quiz',
        timeEstimateMinutes: 8,
        game: {
          id: 'game-6-1-basics',
          type: 'flashcards',
          data: {
            cards: [
              { front: 'Timeline', back: 'Where video clips are arranged chronologically' },
              { front: 'Hard Cut', back: 'Direct transition between clips (most common)' },
              { front: 'J-Cut', back: 'Audio continues while video changes' },
              { front: 'Razor Tool', back: 'Splits clips at specific points' },
              { front: 'B-Roll', back: 'Supplementary footage supporting main content' }
            ]
          },
          maxScore: 100,
          xpReward: 20
        }
      },
      {
        id: '6-2',
        type: 'doc',
        title: 'Color Correction and Grading',
        markdown: `# Color Correction and Grading

Transform the look and feel of your footage through color manipulation.

## Color Correction vs Color Grading:
- **Correction**: Fix technical issues (exposure, white balance)
- **Grading**: Create artistic look and mood

## Primary Color Correction:
1. **Exposure**: Fix over/under exposed shots
2. **Highlights/Shadows**: Recover detail in bright/dark areas  
3. **White Balance**: Correct color temperature
4. **Contrast**: Set black and white points
5. **Saturation**: Adjust color intensity

## Color Wheels:
- **Lift** (Shadows): Adjust dark areas
- **Gamma** (Midtones): Adjust middle values
- **Gain** (Highlights): Adjust bright areas

## Popular Color Grades:
- **Orange & Teal**: Blockbuster cinematic look
- **Desaturated**: Gritty, realistic feel  
- **High Contrast**: Dramatic, punchy style
- **Vintage**: Film emulation with grain

## Technical Standards:
- **Rec. 709**: Standard HD color space
- **Rec. 2020**: 4K/HDR color space
- **DCI-P3**: Digital cinema standard

## Workflow Tips:
1. Always correct before grading
2. Use scopes, not just your eyes
3. Match shots within scenes
4. Create consistent look across project
5. Export with proper color space`,
        timeEstimateMinutes: 20
      },
      {
        id: '6-3',
        type: 'video',
        title: 'Timeline and Cutting Techniques',
        contentUrl: 'https://www.youtube.com/embed/8z7JKBYbyg0',
        timeEstimateMinutes: 18
      },
      {
        id: '6-3-game',
        type: 'game',
        title: 'Color Grading Challenge',
        timeEstimateMinutes: 12,
        game: {
          id: 'game-6-3-color',
          type: 'matching',
          data: {
            pairs: [
              { id: 'p1', left: 'Orange & Teal', right: 'Blockbuster cinematic look' },
              { id: 'p2', left: 'Lift', right: 'Adjusts shadow/dark areas' },
              { id: 'p3', left: 'Gamma', right: 'Adjusts midtone values' },
              { id: 'p4', left: 'White Balance', right: 'Corrects color temperature' },
              { id: 'p5', left: 'Rec. 709', right: 'Standard HD color space' }
            ]
          },
          maxScore: 100,
          xpReward: 25
        }
      },
      {
        id: '6-4',
        type: 'doc',
        title: 'Audio Post-Production',
        markdown: `# Audio Post-Production

Great audio is 50% of your video's success. Master these audio editing techniques.

## Audio Levels (dBFS):
- **Dialogue**: -12 to -6 dBFS (primary focus)
- **Music**: -18 to -12 dBFS (supporting)
- **Sound Effects**: -15 to -8 dBFS (accent)
- **Room Tone**: -30 to -20 dBFS (background)

## Essential Audio Processing:
1. **Noise Reduction**: Remove unwanted background noise
2. **EQ (Equalization)**: Shape frequency response
3. **Compression**: Control dynamic range
4. **De-esser**: Reduce harsh 's' sounds
5. **Limiter**: Prevent audio clipping

## EQ Frequency Guide:
- **80-120 Hz**: Remove low rumble (high-pass filter)
- **200-500 Hz**: Reduce muddiness  
- **1-3 kHz**: Add clarity and presence
- **5-8 kHz**: Enhance intelligibility
- **10+ kHz**: Add air and sparkle

## Audio Mixing Tips:
- **Duck music** under dialogue
- **Use room tone** to fill gaps
- **Match audio perspective** to shot size
- **Add subtle reverb** for space
- **Automate levels** for consistency

## Common Audio Problems:
- **Echo**: Too much reverb or room reflection
- **Hum**: Electrical interference (50/60Hz)
- **Sibilance**: Harsh 's' and 't' sounds  
- **Clipping**: Digital distortion from levels too high
- **Phase Issues**: Cancellation from multiple mics`,
        timeEstimateMinutes: 22
      },
      {
        id: '6-5',
        type: 'video',
        title: 'Professional Audio Mixing',
        contentUrl: 'https://www.youtube.com/embed/JyCG_5l3XLk',
        timeEstimateMinutes: 16
      },
      {
        id: '6-5-game',
        type: 'game',
        title: 'Audio Levels Practice',
        timeEstimateMinutes: 10,
        game: {
          id: 'game-6-5-audio',
          type: 'flashcards',
          data: {
            cards: [
              { front: 'Dialogue Level', back: '-12 to -6 dBFS (primary audio)' },
              { front: 'Music Level', back: '-18 to -12 dBFS (supporting)' },
              { front: 'High-Pass Filter', back: 'Removes low frequency rumble (80-120Hz)' },
              { front: 'Compression', back: 'Controls dynamic range of audio' },
              { front: 'De-esser', back: 'Reduces harsh sibilant sounds' },
              { front: 'Room Tone', back: 'Background ambience at -30 to -20 dBFS' }
            ]
          },
          maxScore: 100,
          xpReward: 22
        }
      },
      {
        id: '6-6',
        type: 'quiz',
        title: 'Video Editing Mastery Quiz',
        timeEstimateMinutes: 15,
        quiz: {
          id: 'quiz-6-6',
          questions: [
            {
              id: 'q1',
              question: 'What is a J-cut?',
              options: ['A type of transition effect', 'Audio continues while video changes', 'A diagonal cut across the frame', 'A jump cut technique'],
              correctAnswer: 1,
              timeLimit: 30
            },
            {
              id: 'q2',
              question: 'What is the standard frame rate for cinema?',
              options: ['30fps', '60fps', '24fps', '25fps'],
              correctAnswer: 2,
              timeLimit: 25
            },
            {
              id: 'q3',
              question: 'What should dialogue audio levels be?',
              options: ['-18 to -12 dBFS', '-12 to -6 dBFS', '-6 to 0 dBFS', '-30 to -20 dBFS'],
              correctAnswer: 1,
              timeLimit: 25
            },
            {
              id: 'q4',
              question: 'What does color correction do?',
              options: ['Creates artistic mood', 'Fixes technical issues', 'Adds special effects', 'Increases saturation'],
              correctAnswer: 1,
              timeLimit: 30
            }
          ],
          passingScore: 75,
          xpReward: 40
        }
      },
      {
        id: '6-7',
        type: 'game',
        title: 'Video Editing Workflow Challenge',
        timeEstimateMinutes: 15,
        game: {
          id: 'game-6-7-workflow',
          type: 'matching',
          data: {
            pairs: [
              { id: 'p1', left: 'Pre-Production', right: 'Planning and project setup' },
              { id: 'p2', left: 'Assembly Edit', right: 'Rough cut with main story' },
              { id: 'p3', left: 'Fine Cut', right: 'Detailed edit with B-roll' },
              { id: 'p4', left: 'Color Grade', right: 'Artistic look and mood' },
              { id: 'p5', left: 'Audio Mix', right: 'Balance dialogue, music, SFX' },
              { id: 'p6', left: 'Final Export', right: 'Render for specific delivery' }
            ]
          },
          maxScore: 100,
          xpReward: 35
        }
      },
      {
        id: '6-8',
        type: 'doc',
        title: 'Export Settings and Delivery',
        markdown: `# Export Settings and Delivery

Master the final step: delivering your video in the right format for each platform.

## Platform-Specific Settings:

### YouTube/Vimeo
- **Codec**: H.264
- **Resolution**: 1080p (1920x1080) or 4K (3840x2160)
- **Frame Rate**: Match source (24/30/60fps)
- **Bitrate**: 8-12 Mbps (1080p), 35-45 Mbps (4K)
- **Audio**: AAC, 320kbps, 48kHz

### Social Media
- **Instagram Feed**: 1080x1080 (square)
- **Instagram Stories/Reels**: 1080x1920 (9:16)
- **TikTok**: 1080x1920, 30fps max
- **Facebook**: 1280x720 minimum
- **Twitter**: 1280x720, under 2:20 duration

### Professional/Broadcast
- **Codec**: ProRes 422 or DNxHD
- **Color Space**: Rec. 709 (HD), Rec. 2020 (4K)
- **Audio**: 48kHz, 24-bit
- **Timecode**: Drop-frame for 29.97fps

## Bitrate Guidelines:
- **1080p**: 5-10 Mbps (web), 50-100 Mbps (broadcast)
- **4K**: 25-45 Mbps (web), 150-300 Mbps (broadcast)
- **Audio**: 128-320 kbps (AAC), 48-96 kHz

## Quality Control Checklist:
- ✓ Audio levels consistent (-12 to -6 dBFS dialogue)
- ✓ No dropped frames or technical glitches
- ✓ Color consistency within scenes
- ✓ Text readable and well-timed
- ✓ Proper aspect ratio for platform
- ✓ File size appropriate for delivery

## Archive and Backup:
1. **Master File**: Highest quality (ProRes/DNxHD)
2. **Project Files**: Native editing project + media
3. **Delivery Files**: Platform-optimized exports
4. **Documentation**: Export settings, revision notes

## Delivery Methods:
- **Cloud Transfer**: Google Drive, Dropbox, WeTransfer
- **FTP/SFTP**: For broadcast/professional clients
- **Physical Media**: USB drives, external hard drives
- **Streaming Platforms**: Direct upload to YouTube/Vimeo

## File Naming Convention:
ProjectName_Version_Platform_Date.extension
Example: "Nike_Commercial_V3_YouTube_20240115.mp4"`,
        timeEstimateMinutes: 18
      }
    ]
  },
  {
    id: '7',
    title: 'Digital Photography',
    description: 'Capture stunning photos with composition and technical skills',
    price: 0,
    modules: [
      {
        id: '7-1',
        type: 'doc',
        title: 'Camera Basics & Exposure',
        markdown: `# Camera Basics & Exposure

Master the technical fundamentals of digital photography.

## The Exposure Triangle:
- **Aperture (f-stop)**: Controls depth of field
  - Low f-numbers (f/1.4) = Shallow depth, blurred background
  - High f-numbers (f/8-f/16) = Deep depth, everything sharp
- **Shutter Speed**: Controls motion blur
  - Fast shutter (1/500s) = Freeze motion
  - Slow shutter (1/30s) = Show movement
- **ISO**: Controls sensor sensitivity
  - Low ISO (100-400) = Clean image, needs good light
  - High ISO (1600+) = More noise, works in low light

## Camera Modes:
- **Manual (M)**: Full control over all settings
- **Aperture Priority (A/Av)**: You set aperture, camera sets shutter
- **Shutter Priority (S/Tv)**: You set shutter, camera sets aperture
- **Auto ISO**: Camera adjusts ISO automatically

## Focusing:
- **Single Point AF**: Precise focus on specific subject
- **Continuous AF**: Tracks moving subjects
- **Manual Focus**: Full control in challenging conditions`,
        timeEstimateMinutes: 22
      },
      {
        id: '7-2',
        type: 'quiz',
        title: 'Photography Fundamentals Quiz',
        timeEstimateMinutes: 10,
        quiz: {
          id: 'quiz-7-2',
          questions: [
            {
              id: 'q1',
              question: 'For a shallow depth of field, you should use:',
              options: ['High f-stop (f/16)', 'Low f-stop (f/1.4)', 'Fast shutter speed', 'High ISO'],
              correctAnswer: 1,
              timeLimit: 30
            },
            {
              id: 'q2',
              question: 'Which ISO setting produces the cleanest image?',
              options: ['ISO 100', 'ISO 800', 'ISO 1600', 'ISO 3200'],
              correctAnswer: 0,
              timeLimit: 25
            }
          ],
          passingScore: 70,
          xpReward: 30
        }
      }
    ]
  },
  {
    id: '8',
    title: 'Personal Finance 101',
    description: 'Build financial literacy and money management skills',
    price: 0,
    modules: [
      {
        id: '8-1',
        type: 'doc',
        title: 'Budgeting & Saving Strategies',
        markdown: `# Budgeting & Saving Strategies

Take control of your finances with proven money management techniques.

## The 50/30/20 Rule:
- **50% Needs**: Housing, food, transportation, utilities
- **30% Wants**: Entertainment, dining out, hobbies
- **20% Savings**: Emergency fund, retirement, debt repayment

## Emergency Fund:
- **Goal**: 3-6 months of living expenses
- **Location**: High-yield savings account
- **Purpose**: Unexpected expenses, job loss, emergencies
- **Building**: Start small, automate savings

## Debt Management:
- **List All Debts**: Amount owed, interest rates, minimums
- **Debt Snowball**: Pay minimums + extra on smallest debt
- **Debt Avalanche**: Pay minimums + extra on highest interest
- **Avoid New Debt**: Live within your means

## Investment Basics:
- **Start Early**: Compound interest is powerful
- **Diversify**: Don't put all eggs in one basket
- **Low Fees**: Index funds vs. managed funds
- **Regular Contributions**: Dollar-cost averaging`,
        timeEstimateMinutes: 20
      },
      {
        id: '8-2',
        type: 'quiz',
        title: 'Financial Literacy Quiz',
        timeEstimateMinutes: 12,
        quiz: {
          id: 'quiz-8-2',
          questions: [
            {
              id: 'q1',
              question: 'In the 50/30/20 rule, what percentage goes to savings?',
              options: ['50%', '30%', '20%', '10%'],
              correctAnswer: 2,
              timeLimit: 25
            },
            {
              id: 'q2',
              question: 'How many months of expenses should an emergency fund cover?',
              options: ['1-2 months', '3-6 months', '12 months', '24 months'],
              correctAnswer: 1,
              timeLimit: 30
            }
          ],
          passingScore: 70,
          xpReward: 30
        }
      }
    ]
  }
];

const roadmaps: Roadmap[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'Complete path to becoming a frontend developer',
    steps: [
      {
        id: 'step-1',
        title: 'Learn HTML & CSS',
        description: 'Master the building blocks of web development',
        recommendedCourseId: '3',
        xpReward: 50
      },
      {
        id: 'step-2',
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript programming basics',
        recommendedCourseId: '2',
        xpReward: 75
      },
      {
        id: 'step-3',
        title: 'React Development',
        description: 'Build modern web applications with React',
        recommendedCourseId: '1',
        xpReward: 100
      },
      {
        id: 'step-4',
        title: 'Build Portfolio Project',
        description: 'Create a full-stack web application',
        xpReward: 150
      }
    ]
  },
  {
    id: '2',
    title: 'DevOps Engineer',
    description: 'Path to DevOps mastery',
    steps: [
      {
        id: 'step-1',
        title: 'Linux Fundamentals',
        description: 'Master Linux command line and system administration',
        xpReward: 75
      },
      {
        id: 'step-2',
        title: 'Docker & Containers',
        description: 'Learn containerization technologies',
        xpReward: 100
      },
      {
        id: 'step-3',
        title: 'CI/CD Pipelines',
        description: 'Implement automated deployment workflows',
        xpReward: 125
      },
      {
        id: 'step-4',
        title: 'Cloud Platforms',
        description: 'Deploy and manage cloud infrastructure',
        xpReward: 150
      }
    ]
  },
  {
    id: '3',
    title: 'Data Scientist',
    description: 'Journey into data science and machine learning',
    steps: [
      {
        id: 'step-1',
        title: 'Python Programming',
        description: 'Learn Python for data analysis',
        xpReward: 75
      },
      {
        id: 'step-2',
        title: 'Statistics & Mathematics',
        description: 'Build strong statistical foundation',
        xpReward: 100
      },
      {
        id: 'step-3',
        title: 'Machine Learning',
        description: 'Implement ML algorithms and models',
        xpReward: 150
      },
      {
        id: 'step-4',
        title: 'Data Visualization',
        description: 'Create compelling data visualizations',
        xpReward: 125
      }
    ]
  }
];

// In-memory storage
const progress: Progress[] = [
  {
    userId: '1',
    courseId: '1',
    moduleId: '1-1',
    completed: true,
    timeSpentSeconds: 600,
    completedAt: new Date().toISOString()
  },
  {
    userId: '1',
    courseId: '1',
    moduleId: '1-2',
    completed: false,
    timeSpentSeconds: 300
  }
];

const userRoadmaps: UserRoadmap[] = [
  {
    userId: '1',
    roadmapId: '1',
    completedSteps: ['step-1'],
    followedAt: new Date().toISOString()
  }
];

const gameScores: GameScore[] = [];

// Data access functions
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  return users[index];
};

export const getAllCourses = (): Course[] => {
  return courses;
};

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getUserProgress = (userId: string): Progress[] => {
  return progress.filter(p => p.userId === userId);
};

export const getModuleProgress = (userId: string, moduleId: string): Progress | undefined => {
  return progress.find(p => p.userId === userId && p.moduleId === moduleId);
};

export const updateProgress = (userId: string, courseId: string, moduleId: string, updates: Partial<Progress>): Progress => {
  const existing = progress.find(p => p.userId === userId && p.moduleId === moduleId);
  
  if (existing) {
    Object.assign(existing, updates);
    return existing;
  } else {
    const newProgress: Progress = {
      userId,
      courseId,
      moduleId,
      completed: false,
      timeSpentSeconds: 0,
      ...updates
    };
    progress.push(newProgress);
    return newProgress;
  }
};

export const getAllRoadmaps = (): Roadmap[] => {
  return roadmaps;
};

export const getRoadmapById = (id: string): Roadmap | undefined => {
  return roadmaps.find(roadmap => roadmap.id === id);
};

export const getUserRoadmaps = (userId: string): UserRoadmap[] => {
  return userRoadmaps.filter(ur => ur.userId === userId);
};

export const followRoadmap = (userId: string, roadmapId: string): UserRoadmap => {
  const existing = userRoadmaps.find(ur => ur.userId === userId && ur.roadmapId === roadmapId);
  if (existing) return existing;
  
  const newUserRoadmap: UserRoadmap = {
    userId,
    roadmapId,
    completedSteps: [],
    followedAt: new Date().toISOString()
  };
  userRoadmaps.push(newUserRoadmap);
  return newUserRoadmap;
};

export const updateRoadmapProgress = (userId: string, roadmapId: string, stepId: string): UserRoadmap | null => {
  const userRoadmap = userRoadmaps.find(ur => ur.userId === userId && ur.roadmapId === roadmapId);
  if (!userRoadmap) return null;
  
  if (!userRoadmap.completedSteps.includes(stepId)) {
    userRoadmap.completedSteps.push(stepId);
  }
  return userRoadmap;
};

export const addGameScore = (userId: string, gameId: string, score: number, xpEarned: number): GameScore => {
  const gameScore: GameScore = {
    userId,
    gameId,
    score,
    xpEarned,
    playedAt: new Date().toISOString()
  };
  gameScores.push(gameScore);
  return gameScore;
};

export const getUserGameScores = (userId: string): GameScore[] => {
  return gameScores.filter(gs => gs.userId === userId);
};

export const enrollUserInCourse = (userId: string, courseId: string): boolean => {
  const user = getUserById(userId);
  if (!user || user.enrolledCourses.includes(courseId)) return false;
  
  user.enrolledCourses.push(courseId);
  return true;
};