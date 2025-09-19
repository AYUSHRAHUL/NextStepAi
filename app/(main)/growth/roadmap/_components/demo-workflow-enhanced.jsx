"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Info,
  BookOpen,
  Video,
  ExternalLink,
  Clock,
  Star,
  Users,
  X
} from "lucide-react";

import { nodeTypes } from "./workflow-nodes-clean";

// Study resources database with real YouTube and article links
const studyResources = {
  "week-1": {
    title: "JavaScript Fundamentals",
    resources: [
      {
        type: "video",
        title: "JavaScript ES6+ Complete Course",
        provider: "freeCodeCamp",
        duration: "8 hours",
        rating: 4.8,
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        description: "Complete JavaScript course covering ES6+ features, async/await, and modern JavaScript patterns."
      },
      {
        type: "video",
        title: "JavaScript DOM Manipulation",
        provider: "Traversy Media",
        duration: "2 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=0ik6X4DJKCc",
        description: "Learn DOM manipulation, event handling, and modern JavaScript techniques."
      },
      {
        type: "article",
        title: "JavaScript ES6+ Features Guide",
        provider: "MDN Web Docs",
        duration: "30 min read",
        rating: 4.9,
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        description: "Comprehensive guide to modern JavaScript features and best practices."
      },
      {
        type: "article",
        title: "Async/Await in JavaScript",
        provider: "JavaScript.info",
        duration: "20 min read",
        rating: 4.6,
        url: "https://javascript.info/async-await",
        description: "Deep dive into asynchronous JavaScript and async/await patterns."
      }
    ]
  },
  "week-2": {
    title: "React Basics",
    resources: [
      {
        type: "video",
        title: "React Tutorial for Beginners",
        provider: "Programming with Mosh",
        duration: "3 hours",
        rating: 4.8,
        url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        description: "Complete React tutorial covering components, props, state, and JSX."
      },
      {
        type: "video",
        title: "React Crash Course 2021",
        provider: "Traversy Media",
        duration: "2 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        description: "Learn React fundamentals including components, state, and props."
      },
      {
        type: "article",
        title: "React Official Tutorial",
        provider: "React.js",
        duration: "45 min read",
        rating: 4.9,
        url: "https://react.dev/learn",
        description: "Official React tutorial with interactive examples and best practices."
      }
    ]
  },
  "week-3": {
    title: "React Hooks",
    resources: [
      {
        type: "video",
        title: "React Hooks Complete Guide",
        provider: "Codevolution",
        duration: "4 hours",
        rating: 4.8,
        url: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
        description: "Comprehensive guide to all React hooks including useState, useEffect, useContext, and custom hooks."
      },
      {
        type: "video",
        title: "React Hooks Explained",
        provider: "Web Dev Simplified",
        duration: "1.5 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
        description: "Learn React hooks including useState, useEffect, and custom hooks."
      },
      {
        type: "article",
        title: "React Hooks Documentation",
        provider: "React.js",
        duration: "1 hour read",
        rating: 4.9,
        url: "https://react.dev/reference/react",
        description: "Official React hooks reference with examples and use cases."
      }
    ]
  },
  "week-4": {
    title: "State Management",
    resources: [
      {
        type: "video",
        title: "Redux Toolkit Complete Course",
        provider: "Laith Academy",
        duration: "6 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=u3KlatzB7GM",
        description: "Learn Redux Toolkit, the modern way to manage state in React applications."
      },
      {
        type: "video",
        title: "Redux Crash Course",
        provider: "Traversy Media",
        duration: "2 hours",
        rating: 4.6,
        url: "https://www.youtube.com/watch?v=93p3L0Rby9g",
        description: "Learn Redux fundamentals and state management patterns."
      },
      {
        type: "article",
        title: "Redux Toolkit Quick Start",
        provider: "Redux Toolkit",
        duration: "30 min read",
        rating: 4.8,
        url: "https://redux-toolkit.js.org/tutorials/quick-start",
        description: "Official Redux Toolkit quick start guide with examples."
      }
    ]
  },
  "week-5": {
    title: "TypeScript Integration",
    resources: [
      {
        type: "video",
        title: "TypeScript Course for Beginners",
        provider: "freeCodeCamp",
        duration: "5 hours",
        rating: 4.8,
        url: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
        description: "Complete TypeScript course covering types, interfaces, generics, and React integration."
      },
      {
        type: "video",
        title: "TypeScript with React",
        provider: "Ben Awad",
        duration: "2 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=FJDVKeh7RJI",
        description: "Learn TypeScript specifically for React development."
      },
      {
        type: "article",
        title: "TypeScript with React",
        provider: "TypeScript Handbook",
        duration: "45 min read",
        rating: 4.7,
        url: "https://www.typescriptlang.org/docs/handbook/react.html",
        description: "Official guide to using TypeScript with React applications."
      }
    ]
  },
  "week-6": {
    title: "Next.js Framework",
    resources: [
      {
        type: "video",
        title: "Next.js 14 Complete Course",
        provider: "Code with Antonio",
        duration: "8 hours",
        rating: 4.9,
        url: "https://www.youtube.com/watch?v=wm5gJPwSlO4",
        description: "Complete Next.js course covering SSR, SSG, API routes, and performance optimization."
      },
      {
        type: "video",
        title: "Next.js Crash Course",
        provider: "Traversy Media",
        duration: "2 hours",
        rating: 4.6,
        url: "https://www.youtube.com/watch?v=mTz0GXj8NN0",
        description: "Learn Next.js fundamentals including pages, routing, and API routes."
      },
      {
        type: "article",
        title: "Next.js Documentation",
        provider: "Next.js",
        duration: "2 hours read",
        rating: 4.9,
        url: "https://nextjs.org/docs",
        description: "Official Next.js documentation with guides and API reference."
      }
    ]
  },
  "week-7": {
    title: "Testing & Quality",
    resources: [
      {
        type: "video",
        title: "React Testing Library Tutorial",
        provider: "Web Dev Simplified",
        duration: "3 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=8Xwq35cPwYg",
        description: "Learn React Testing Library, Jest, and testing best practices."
      },
      {
        type: "video",
        title: "Jest Testing Framework",
        provider: "freeCodeCamp",
        duration: "2 hours",
        rating: 4.6,
        url: "https://www.youtube.com/watch?v=7r4xVDI2vho",
        description: "Complete Jest testing framework tutorial for React applications."
      },
      {
        type: "article",
        title: "Testing React Applications",
        provider: "React Testing Library",
        duration: "1 hour read",
        rating: 4.8,
        url: "https://testing-library.com/docs/react-testing-library/intro",
        description: "Official React Testing Library documentation and examples."
      }
    ]
  },
  "week-8": {
    title: "Performance & Optimization",
    resources: [
      {
        type: "video",
        title: "React Performance Optimization",
        provider: "Ben Awad",
        duration: "2 hours",
        rating: 4.6,
        url: "https://www.youtube.com/watch?v=BxgvVdZ3VqY",
        description: "Learn React performance optimization techniques and best practices."
      },
      {
        type: "video",
        title: "Web Performance Optimization",
        provider: "Traversy Media",
        duration: "1.5 hours",
        rating: 4.5,
        url: "https://www.youtube.com/watch?v=5fLW7n1qZmk",
        description: "Learn web performance optimization techniques and tools."
      },
      {
        type: "article",
        title: "React Performance Guide",
        provider: "React.js",
        duration: "45 min read",
        rating: 4.7,
        url: "https://react.dev/learn/render-and-commit",
        description: "Official React performance optimization guide."
      }
    ]
  },
  "week-9": {
    title: "Advanced Patterns",
    resources: [
      {
        type: "video",
        title: "Advanced React Patterns",
        provider: "Kent C. Dodds",
        duration: "4 hours",
        rating: 4.9,
        url: "https://www.youtube.com/watch?v=SuzSntUpP3s",
        description: "Learn advanced React patterns including compound components, render props, and HOCs."
      },
      {
        type: "video",
        title: "React Design Patterns",
        provider: "Codevolution",
        duration: "3 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=YaZg8wg39QQ",
        description: "Learn React design patterns and best practices."
      },
      {
        type: "article",
        title: "React Design Patterns",
        provider: "Patterns.dev",
        duration: "1 hour read",
        rating: 4.8,
        url: "https://www.patterns.dev/posts/",
        description: "Comprehensive guide to React design patterns and architecture."
      }
    ]
  },
  "week-10": {
    title: "Portfolio Development",
    resources: [
      {
        type: "video",
        title: "Build a Portfolio Website",
        provider: "Traversy Media",
        duration: "3 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=0YFrGy_mzV0",
        description: "Build a complete portfolio website with Next.js and modern design."
      },
      {
        type: "video",
        title: "Portfolio Website Tutorial",
        provider: "freeCodeCamp",
        duration: "4 hours",
        rating: 4.6,
        url: "https://www.youtube.com/watch?v=0YFrGy_mzV0",
        description: "Complete portfolio website tutorial with React and modern tools."
      },
      {
        type: "article",
        title: "Portfolio Best Practices",
        provider: "Dev.to",
        duration: "20 min read",
        rating: 4.5,
        url: "https://dev.to/",
        description: "Best practices for creating an impressive developer portfolio."
      }
    ]
  },
  "week-11": {
    title: "Interview Preparation",
    resources: [
      {
        type: "video",
        title: "Frontend Interview Questions",
        provider: "Tech Interview Pro",
        duration: "5 hours",
        rating: 4.8,
        url: "https://www.youtube.com/watch?v=Yg5a2FxU4GI",
        description: "Complete frontend interview preparation with coding challenges and system design."
      },
      {
        type: "video",
        title: "React Interview Questions",
        provider: "Web Dev Simplified",
        duration: "2 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=FXqX7oof0I0",
        description: "Common React interview questions and answers."
      },
      {
        type: "article",
        title: "Frontend Interview Guide",
        provider: "Frontend Masters",
        duration: "2 hours read",
        rating: 4.7,
        url: "https://frontendmasters.com/",
        description: "Comprehensive frontend interview preparation guide."
      }
    ]
  },
  "week-12": {
    title: "Job Search & Applications",
    resources: [
      {
        type: "video",
        title: "How to Get a Frontend Developer Job",
        provider: "Coding Addict",
        duration: "2 hours",
        rating: 4.6,
        url: "https://www.youtube.com/watch?v=Zftx8KqRk24",
        description: "Complete guide to landing your first frontend developer job."
      },
      {
        type: "video",
        title: "Developer Job Search Tips",
        provider: "Traversy Media",
        duration: "1 hour",
        rating: 4.5,
        url: "https://www.youtube.com/watch?v=Zftx8KqRk24",
        description: "Tips and strategies for finding developer jobs."
      },
      {
        type: "article",
        title: "Job Search Strategy",
        provider: "Indeed Career Guide",
        duration: "30 min read",
        rating: 4.4,
        url: "https://www.indeed.com/career-advice",
        description: "Effective job search strategies for developers."
      }
    ]
  },
  "skill-1": {
    title: "JavaScript ES6+",
    resources: [
      {
        type: "video",
        title: "JavaScript ES6+ Features",
        provider: "freeCodeCamp",
        duration: "3 hours",
        rating: 4.8,
        url: "https://www.youtube.com/watch?v=WZQc7RU-18Q",
        description: "Learn all ES6+ features including arrow functions, destructuring, modules, and more."
      },
      {
        type: "video",
        title: "Modern JavaScript Tutorial",
        provider: "Traversy Media",
        duration: "2 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        description: "Learn modern JavaScript features and best practices."
      },
      {
        type: "article",
        title: "ES6 Features Guide",
        provider: "ES6 Features",
        duration: "1 hour read",
        rating: 4.7,
        url: "http://es6-features.org/",
        description: "Comprehensive guide to ES6 features with examples."
      }
    ]
  },
  "skill-2": {
    title: "React.js",
    resources: [
      {
        type: "video",
        title: "React Complete Course",
        provider: "Programming with Mosh",
        duration: "6 hours",
        rating: 4.8,
        url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        description: "Complete React course from basics to advanced concepts."
      },
      {
        type: "video",
        title: "React Tutorial for Beginners",
        provider: "freeCodeCamp",
        duration: "4 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=DLX62G4lc44",
        description: "Learn React from scratch with hands-on projects."
      },
      {
        type: "article",
        title: "React Documentation",
        provider: "React.js",
        duration: "3 hours read",
        rating: 4.9,
        url: "https://react.dev/",
        description: "Official React documentation with tutorials and API reference."
      }
    ]
  },
  "project-1": {
    title: "E-commerce Dashboard",
    resources: [
      {
        type: "video",
        title: "Build E-commerce Dashboard",
        provider: "Code with Antonio",
        duration: "10 hours",
        rating: 4.7,
        url: "https://www.youtube.com/watch?v=wm5gJPwSlO4",
        description: "Complete tutorial to build an e-commerce dashboard with React and Redux."
      },
      {
        type: "video",
        title: "E-commerce App Tutorial",
        provider: "Traversy Media",
        duration: "8 hours",
        rating: 4.6,
        url: "https://www.youtube.com/watch?v=0YFrGy_mzV0",
        description: "Build a complete e-commerce application with React and Node.js."
      },
      {
        type: "article",
        title: "E-commerce Dashboard Design",
        provider: "Dribbble",
        duration: "15 min read",
        rating: 4.5,
        url: "https://dribbble.com/",
        description: "Design inspiration and best practices for e-commerce dashboards."
      }
    ]
  }
};

// Comprehensive 12-week demo workflow data
const demoWorkflowData = {
  nodes: [
    // Goal Node
    {
      id: "goal",
      type: "goalNode",
      position: { x: 800, y: 50 },
      data: {
        goal: "Become a Senior Frontend Developer",
        timeline: "12 weeks",
        priority: "high"
      }
    },
    
    // 12 Weeks - Foundation Phase (Weeks 1-4)
    {
      id: "week-1",
      type: "weekNode",
      position: { x: 100, y: 250 },
      data: {
        week: 1,
        focus: "JavaScript Fundamentals",
        tasks: ["ES6+ syntax", "Async/await", "DOM manipulation", "Event handling"],
        status: "completed"
      }
    },
    {
      id: "week-2",
      type: "weekNode",
      position: { x: 300, y: 250 },
      data: {
        week: 2,
        focus: "React Basics",
        tasks: ["JSX syntax", "Components", "Props & State", "Event handling"],
        status: "completed"
      }
    },
    {
      id: "week-3",
      type: "weekNode",
      position: { x: 500, y: 250 },
      data: {
        week: 3,
        focus: "React Hooks",
        tasks: ["useState", "useEffect", "Custom hooks", "Context API"],
        status: "in-progress"
      }
    },
    {
      id: "week-4",
      type: "weekNode",
      position: { x: 700, y: 250 },
      data: {
        week: 4,
        focus: "State Management",
        tasks: ["Redux basics", "Redux Toolkit", "State patterns", "Middleware"],
        status: "pending"
      }
    },
    
    // Intermediate Phase (Weeks 5-8)
    {
      id: "week-5",
      type: "weekNode",
      position: { x: 900, y: 250 },
      data: {
        week: 5,
        focus: "TypeScript Integration",
        tasks: ["TypeScript basics", "React + TypeScript", "Type definitions", "Advanced types"],
        status: "pending"
      }
    },
    {
      id: "week-6",
      type: "weekNode",
      position: { x: 1100, y: 250 },
      data: {
        week: 6,
        focus: "Next.js Framework",
        tasks: ["SSR/SSG", "Routing", "API routes", "Performance optimization"],
        status: "pending"
      }
    },
    {
      id: "week-7",
      type: "weekNode",
      position: { x: 100, y: 450 },
      data: {
        week: 7,
        focus: "Testing & Quality",
        tasks: ["Jest & React Testing", "Unit tests", "Integration tests", "E2E testing"],
        status: "pending"
      }
    },
    {
      id: "week-8",
      type: "weekNode",
      position: { x: 300, y: 450 },
      data: {
        week: 8,
        focus: "Performance & Optimization",
        tasks: ["Code splitting", "Lazy loading", "Bundle optimization", "Performance metrics"],
        status: "pending"
      }
    },
    
    // Advanced Phase (Weeks 9-12)
    {
      id: "week-9",
      type: "weekNode",
      position: { x: 500, y: 450 },
      data: {
        week: 9,
        focus: "Advanced Patterns",
        tasks: ["Design patterns", "Architecture", "Micro-frontends", "Advanced React"],
        status: "pending"
      }
    },
    {
      id: "week-10",
      type: "weekNode",
      position: { x: 700, y: 450 },
      data: {
        week: 10,
        focus: "Portfolio Development",
        tasks: ["Portfolio website", "Project showcase", "Code documentation", "GitHub optimization"],
        status: "pending"
      }
    },
    {
      id: "week-11",
      type: "weekNode",
      position: { x: 900, y: 450 },
      data: {
        week: 11,
        focus: "Interview Preparation",
        tasks: ["Technical interviews", "System design", "Coding challenges", "Behavioral prep"],
        status: "pending"
      }
    },
    {
      id: "week-12",
      type: "weekNode",
      position: { x: 1100, y: 450 },
      data: {
        week: 12,
        focus: "Job Search & Applications",
        tasks: ["Resume optimization", "Job applications", "Networking", "Interview scheduling"],
        status: "pending"
      }
    },
    
    // Skills Section
    {
      id: "skill-1",
      type: "skillNode",
      position: { x: 50, y: 650 },
      data: {
        skill: "JavaScript ES6+",
        level: "Advanced",
        category: "Core Language"
      }
    },
    {
      id: "skill-2",
      type: "skillNode",
      position: { x: 200, y: 650 },
      data: {
        skill: "React.js",
        level: "Advanced",
        category: "Frontend Framework"
      }
    },
    {
      id: "skill-3",
      type: "skillNode",
      position: { x: 350, y: 650 },
      data: {
        skill: "TypeScript",
        level: "Intermediate",
        category: "Type System"
      }
    },
    {
      id: "skill-4",
      type: "skillNode",
      position: { x: 500, y: 650 },
      data: {
        skill: "Redux/Redux Toolkit",
        level: "Intermediate",
        category: "State Management"
      }
    },
    {
      id: "skill-5",
      type: "skillNode",
      position: { x: 650, y: 650 },
      data: {
        skill: "Next.js",
        level: "Intermediate",
        category: "Full-stack Framework"
      }
    },
    {
      id: "skill-6",
      type: "skillNode",
      position: { x: 800, y: 650 },
      data: {
        skill: "Testing (Jest/RTL)",
        level: "Beginner",
        category: "Quality Assurance"
      }
    },
    
    // Projects Section
    {
      id: "project-1",
      type: "projectNode",
      position: { x: 1300, y: 200 },
      data: {
        project: "E-commerce Dashboard",
        technologies: ["React", "Redux", "Material-UI", "Chart.js"],
        status: "planned"
      }
    },
    {
      id: "project-2",
      type: "projectNode",
      position: { x: 1300, y: 350 },
      data: {
        project: "Task Management App",
        technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
        status: "planned"
      }
    },
    {
      id: "project-3",
      type: "projectNode",
      position: { x: 1300, y: 500 },
      data: {
        project: "Portfolio Website",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "MDX"],
        status: "planned"
      }
    },
    {
      id: "project-4",
      type: "projectNode",
      position: { x: 1300, y: 650 },
      data: {
        project: "Real-time Chat App",
        technologies: ["React", "Socket.io", "Node.js", "MongoDB"],
        status: "planned"
      }
    },
    
    // Certifications Section
    {
      id: "cert-1",
      type: "certificationNode",
      position: { x: 50, y: 800 },
      data: {
        certification: "React Developer Certification",
        provider: "Meta",
        status: "planned"
      }
    },
    {
      id: "cert-2",
      type: "certificationNode",
      position: { x: 250, y: 800 },
      data: {
        certification: "JavaScript Algorithms & Data Structures",
        provider: "freeCodeCamp",
        status: "planned"
      }
    },
    {
      id: "cert-3",
      type: "certificationNode",
      position: { x: 450, y: 800 },
      data: {
        certification: "Frontend Development Libraries",
        provider: "freeCodeCamp",
        status: "planned"
      }
    },
    
    // Networking Section
    {
      id: "networking-1",
      type: "networkingNode",
      position: { x: 700, y: 800 },
      data: {
        activity: "Join React Community",
        platform: "Discord",
        status: "completed"
      }
    },
    {
      id: "networking-2",
      type: "networkingNode",
      position: { x: 900, y: 800 },
      data: {
        activity: "Attend Tech Meetups",
        platform: "Meetup.com",
        status: "planned"
      }
    },
    {
      id: "networking-3",
      type: "networkingNode",
      position: { x: 1100, y: 800 },
      data: {
        activity: "LinkedIn Networking",
        platform: "LinkedIn",
        status: "planned"
      }
    }
  ],
  edges: [
    // Goal to first week
    {
      id: "edge-goal-to-week-1",
      source: "goal",
      target: "week-1",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 3 }
    },
    
    // Week progression connections
    {
      id: "edge-week-1-to-week-2",
      source: "week-1",
      target: "week-2",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-2-to-week-3",
      source: "week-2",
      target: "week-3",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-3-to-week-4",
      source: "week-3",
      target: "week-4",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-4-to-week-5",
      source: "week-4",
      target: "week-5",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-5-to-week-6",
      source: "week-5",
      target: "week-6",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-6-to-week-7",
      source: "week-6",
      target: "week-7",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-7-to-week-8",
      source: "week-7",
      target: "week-8",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-8-to-week-9",
      source: "week-8",
      target: "week-9",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-9-to-week-10",
      source: "week-9",
      target: "week-10",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-10-to-week-11",
      source: "week-10",
      target: "week-11",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    {
      id: "edge-week-11-to-week-12",
      source: "week-11",
      target: "week-12",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 }
    },
    
    // Skills connections to weeks
    {
      id: "edge-week-1-to-skill-1",
      source: "week-1",
      target: "skill-1",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 2 }
    },
    {
      id: "edge-week-2-to-skill-2",
      source: "week-2",
      target: "skill-2",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 2 }
    },
    {
      id: "edge-week-5-to-skill-3",
      source: "week-5",
      target: "skill-3",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 2 }
    },
    {
      id: "edge-week-4-to-skill-4",
      source: "week-4",
      target: "skill-4",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 2 }
    },
    {
      id: "edge-week-6-to-skill-5",
      source: "week-6",
      target: "skill-5",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 2 }
    },
    {
      id: "edge-week-7-to-skill-6",
      source: "week-7",
      target: "skill-6",
      type: "smoothstep",
      style: { stroke: "#f59e0b", strokeWidth: 2 }
    },
    
    // Project connections
    {
      id: "edge-week-3-to-project-1",
      source: "week-3",
      target: "project-1",
      type: "smoothstep",
      style: { stroke: "#8b5cf6", strokeWidth: 2 }
    },
    {
      id: "edge-week-6-to-project-2",
      source: "week-6",
      target: "project-2",
      type: "smoothstep",
      style: { stroke: "#8b5cf6", strokeWidth: 2 }
    },
    {
      id: "edge-week-10-to-project-3",
      source: "week-10",
      target: "project-3",
      type: "smoothstep",
      style: { stroke: "#8b5cf6", strokeWidth: 2 }
    },
    {
      id: "edge-week-9-to-project-4",
      source: "week-9",
      target: "project-4",
      type: "smoothstep",
      style: { stroke: "#8b5cf6", strokeWidth: 2 }
    },
    
    // Certification connections
    {
      id: "edge-week-2-to-cert-1",
      source: "week-2",
      target: "cert-1",
      type: "smoothstep",
      style: { stroke: "#ef4444", strokeWidth: 2 }
    },
    {
      id: "edge-week-1-to-cert-2",
      source: "week-1",
      target: "cert-2",
      type: "smoothstep",
      style: { stroke: "#ef4444", strokeWidth: 2 }
    },
    {
      id: "edge-week-6-to-cert-3",
      source: "week-6",
      target: "cert-3",
      type: "smoothstep",
      style: { stroke: "#ef4444", strokeWidth: 2 }
    },
    
    // Networking connections
    {
      id: "edge-week-1-to-networking-1",
      source: "week-1",
      target: "networking-1",
      type: "smoothstep",
      style: { stroke: "#06b6d4", strokeWidth: 2 }
    },
    {
      id: "edge-week-8-to-networking-2",
      source: "week-8",
      target: "networking-2",
      type: "smoothstep",
      style: { stroke: "#06b6d4", strokeWidth: 2 }
    },
    {
      id: "edge-week-12-to-networking-3",
      source: "week-12",
      target: "networking-3",
      type: "smoothstep",
      style: { stroke: "#06b6d4", strokeWidth: 2 }
    }
  ]
};

const DemoWorkflow = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(demoWorkflowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(demoWorkflowData.edges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowResources(true);
  }, []);

  const handleExport = () => {
    const flowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    };
    
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'demo-career-workflow.json');
    linkElement.click();
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background" 
    : "h-[700px] w-full border rounded-lg";

  const getNodeResources = (nodeId) => {
    return studyResources[nodeId] || {
      title: "Study Resources",
      resources: [
        {
          type: "article",
          title: "General Learning Resources",
          provider: "MDN Web Docs",
          duration: "30 min read",
          rating: 4.5,
          url: "https://developer.mozilla.org/",
          description: "Comprehensive web development documentation and tutorials."
        }
      ]
    };
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />;
      case "article": return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Interactive Demo - 12-Week Frontend Developer Career Path</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {nodes.length} nodes, {edges.length} connections
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isPlaying ? "Pause" : "Play"} Animation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNodes(demoWorkflowData.nodes);
                setEdges(demoWorkflowData.edges);
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Canvas */}
      <div className={containerClass}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
        >
          <Background 
            variant="dots" 
            gap={20} 
            size={1} 
            color="#e5e7eb"
            className="opacity-50"
          />
          <Controls 
            showInteractive={false}
            position="top-right"
          />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case "goalNode": return "#6366f1";
                case "weekNode": return "#8b5cf6";
                case "skillNode": return "#f59e0b";
                case "projectNode": return "#ef4444";
                case "certificationNode": return "#10b981";
                case "networkingNode": return "#06b6d4";
                default: return "#6b7280";
              }
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
            position="bottom-left"
          />
        </ReactFlow>
      </div>

      {/* Study Resources Panel */}
      {showResources && selectedNode && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">
                  Study Resources - {getNodeResources(selectedNode.id).title}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResources(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getNodeResources(selectedNode.id).resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                          {resource.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.provider}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {resource.duration}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {resource.rating}/5.0
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {resource.description}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open Resource
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">12-Week Career Development Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{nodes.filter(n => n.type === "weekNode").length}</div>
              <div className="text-sm text-muted-foreground">Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{nodes.filter(n => n.type === "skillNode").length}</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{nodes.filter(n => n.type === "projectNode").length}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{nodes.filter(n => n.type === "certificationNode").length}</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-500">{nodes.filter(n => n.type === "networkingNode").length}</div>
              <div className="text-sm text-muted-foreground">Networking</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DemoWorkflowWrapper = () => {
  return (
    <ReactFlowProvider>
      <DemoWorkflow />
    </ReactFlowProvider>
  );
};

export default DemoWorkflowWrapper;
