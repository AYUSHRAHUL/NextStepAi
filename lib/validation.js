import { z } from "zod";

// Input sanitization and validation schemas
export const userUpdateSchema = z.object({
  industry: z.string().min(1).max(100).trim(),
  experience: z.number().int().min(0).max(50),
  bio: z.string().max(1000).trim().optional(),
  skills: z.array(z.string().max(50).trim()).max(20),
});

export const resumeSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(1).max(100).trim(),
    email: z.string().email().max(100),
    phone: z.string().max(20).optional(),
    location: z.string().max(100).optional(),
    linkedin: z.string().url().max(200).optional(),
    github: z.string().url().max(200).optional(),
  }),
  summary: z.string().max(1000).trim(),
  skills: z.string().max(2000).trim(),
  experience: z.array(z.object({
    company: z.string().max(100).trim(),
    position: z.string().max(100).trim(),
    startDate: z.string().max(20),
    endDate: z.string().max(20).optional(),
    description: z.string().max(1000).trim(),
  })).max(20),
  education: z.array(z.object({
    institution: z.string().max(100).trim(),
    degree: z.string().max(100).trim(),
    field: z.string().max(100).trim(),
    startDate: z.string().max(20),
    endDate: z.string().max(20).optional(),
  })).max(10),
  projects: z.array(z.object({
    name: z.string().max(100).trim(),
    description: z.string().max(1000).trim(),
    technologies: z.string().max(200).trim(),
    url: z.string().url().max(200).optional(),
  })).max(15),
});

export const coverLetterSchema = z.object({
  jobTitle: z.string().min(1).max(100).trim(),
  companyName: z.string().min(1).max(100).trim(),
  jobDescription: z.string().max(5000).trim().optional(),
  content: z.string().max(10000).trim(),
});

export const quizSchema = z.object({
  category: z.string().min(1).max(50).trim(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  questionCount: z.number().int().min(1).max(20),
});

// Sanitization functions
export const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, ""); // Remove event handlers
  }
  return input;
};

export const sanitizeHtml = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove iframe tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ""); // Remove event handlers
};

// Rate limiting helper
export const createRateLimit = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Check current requests
    const userRequests = Array.from(requests.values())
      .filter(timestamp => timestamp > windowStart);
    
    if (userRequests.length >= maxRequests) {
      return false; // Rate limited
    }
    
    requests.set(identifier, now);
    return true; // Allowed
  };
};

// Security headers helper
export const getSecurityHeaders = () => ({
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
});
