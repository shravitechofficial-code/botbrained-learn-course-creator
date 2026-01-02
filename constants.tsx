
import React from 'react';

export const PERSONA_DATA = [
  { 
    id: 'JOB_SEEKER', 
    label: 'Job Seeker', 
    icon: '🚀', 
    description: 'Focus: Employability and Portfolio. Vibe Check: "I want to be the one giving orders to the AI, not the other way around."',
    idealFor: 'Fresh grads, career switchers, and anyone tired of ghosting recruiters.'
  },
  { 
    id: 'MID_MANAGEMENT', 
    label: 'Entry-Mid Management', 
    icon: '👔', 
    description: '0-10 Years Exp: Strategy and ROI. Vibe Check: "I need to look like I know what I\'m doing before my intern automates my job."',
    idealFor: 'Managers who want to lead transformation instead of being steamrolled by it.'
  },
];

export const VERTICAL_DETAILS = [
  { 
    label: 'Generic', 
    description: 'The All-Rounder. Perfect for: People who want AI to write their awkward breakup emails... or just work reports.',
    idealFor: 'General office ninjas and administrative magicians.'
  },
  { 
    label: 'HR', 
    description: 'Human-less Resources? Jk. Use AI to screen 10,000 resumes while you actually get some sleep.',
    idealFor: 'Recruiters and culture keepers who are drowning in paperwork.'
  },
  { 
    label: 'Marketing', 
    description: 'Stop staring at a blank screen. Let AI generate 50 headlines while you pretend to brainstorm.',
    idealFor: 'Creatives who want to focus on big ideas, not grunt work.'
  },
  { 
    label: 'Product', 
    description: 'Build mockups faster than your developers can say "it\'s a backend issue." Vibe coding included.',
    idealFor: 'Product people who want to bring ideas to life instantly.'
  },
  { 
    label: 'Sales', 
    description: 'Cold emails that actually feel warm. Research leads in 10 seconds instead of 10 hours.',
    idealFor: 'Quota crushers who want to work smarter, not harder.'
  },
];

export const LEVEL_DETAILS = [
  { 
    label: 'Beginner', 
    description: 'Power User Mode. Starting from: "I think ChatGPT is a fancy spell checker." Goal: World dominance.',
    idealFor: 'Total beginners who want to skip the learning curve.'
  },
  { 
    label: 'Intermediate', 
    description: 'The Integrator. For those who already have custom GPTs named after their pets.',
    idealFor: 'Users who want to connect AI to their actual files and data.'
  },
  { 
    label: 'Advanced', 
    description: 'The Architect. Building autonomous agents that will probably try to take over the office (in a good way).',
    idealFor: 'Pros who want to build multi-step automation empires.'
  },
];

export const SKILL_TYPE_DETAILS = [
  { 
    label: 'Using AI Applications', 
    description: 'The Pilot. Master the best apps on the planet. Ideal for: People who want results yesterday.',
    idealFor: 'Efficiency maximalists who love ready-made tools.'
  },
  { 
    label: 'Building AI Applications', 
    description: 'The Engineer. Create your own specialized tools. Ideal for: People who say "I wish there was an app for that."' ,
    idealFor: 'Founders and fixers who want to create custom logic.'
  },
];

export const BUILD_TYPE_DETAILS = [
  { 
    label: 'Vibe Coding', 
    description: 'Coding by shouting at your computer (politely). Build apps without learning semi-colons.',
    idealFor: 'Visionaries who hate syntax errors.'
  },
  { 
    label: 'Agentic Systems', 
    description: 'Creating an army of digital clones. Build systems that think, act, and solve problems while you nap.',
    idealFor: 'The ultimate lazy (but genius) achievers.'
  },
];

export const VERTICALS = VERTICAL_DETAILS.map(v => v.label);
export const LEVELS = LEVEL_DETAILS.map(l => l.label);
export const SKILL_TYPES = SKILL_TYPE_DETAILS.map(s => s.label);
export const BUILD_TYPES = BUILD_TYPE_DETAILS.map(b => b.label);

export const LOGO = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);
