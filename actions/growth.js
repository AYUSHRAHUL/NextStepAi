"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "@/lib/inngest/client";

// Store session chat histories
const messageHistories = {};

// Initialize the chatbot model
const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

/**
 * Growth chatbot with session-based chat history
 * @param {string} userInput - The user's message
 * @param {string} sessionId - Unique session identifier
 */
export async function growthChat(userInput, sessionId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      name: true,
      industry: true,
      experience: true,
      skills: true,
      bio: true,
    },
  });

  if (!user) throw new Error("User not found");

  // Initialize session history if it doesn't exist
  if (!messageHistories[sessionId]) {
    messageHistories[sessionId] = [];
  }

  // Add user context to the first message of the session
  if (messageHistories[sessionId].length === 0) {
    const userContext = `User Profile:
- Name: ${user.name || "Not specified"}
- Industry: ${user.industry || "Not specified"}
- Experience: ${user.experience ? `${user.experience} years` : "Not specified"}
- Skills: ${Array.isArray(user.skills) && user.skills.length ? user.skills.join(", ") : "Not specified"}
- Background: ${user.bio || "Not specified"}

Please use this context to provide personalized career guidance.`;

    messageHistories[sessionId].push({
      role: "system",
      content: userContext
    });
  }

  // Add user message to history
  messageHistories[sessionId].push({
    role: "user",
    content: userInput
  });

  try {
    const model = getModel();
    
    // Build conversation context
    const conversationHistory = messageHistories[sessionId]
      .map(msg => `${msg.role === 'system' ? 'System' : msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `You are an AI career growth coach designed to help professionals with career guidance and alignment.

Instructions:
- Use the user's profile context to provide personalized advice
- Help clarify career goals, map skills to roles, suggest learning paths, projects, certifications
- Provide job search strategy and 30-60-90 day action plans
- Be concise, structured, and actionable (keep responses under 100 words when possible)
- Ask one clarifying question at a time if you need more information
- If unsure about something, respond with "I'm not sure about that, but I can help you research it."
- Use the conversation history to provide context-aware guidance
- Always prioritize clarity and relevance in your answers
- Be supportive and encourage exploration of interests and opportunities

Conversation History:
${conversationHistory}

Provide your response:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    // Add assistant response to history
    messageHistories[sessionId].push({
      role: "assistant",
      content: response
    });

    // Keep only last 10 messages to avoid token limits
    if (messageHistories[sessionId].length > 10) {
      messageHistories[sessionId] = messageHistories[sessionId].slice(-10);
    }
    
    return { reply: response };
  } catch (error) {
    console.error("Growth chat error:", error);
    throw new Error("Failed to generate response");
  }
}

/**
 * Generate a new session ID for chat
 */
export async function createNewSession() {
  return uuidv4();
}

export async function requestRoadmap(targetRole, targetIndustry) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId }, select: { id: true, industry: true } });
  if (!user) throw new Error("User not found");

  // Ensure Roadmap model exists
  if (!db.roadmap) {
    throw new Error("Roadmap storage not ready. Run npx prisma generate and restart.");
  }

  // Create a pending roadmap record first
  const pending = await db.roadmap.create({
    data: {
      userId: user.id,
      title: `${targetRole} Roadmap`,
      targetRole,
      targetIndustry: targetIndustry || user.industry || "",
      steps: [],
      content: "",
      certifications: [],
      projects: [],
      networking: [],
      recommendedSkills: [],
      blocks3d: [],
      connections: [],
      status: "pending",
    },
    select: { id: true },
  });

  // Try background workflow first
  try {
    await inngest.send({
      name: "roadmap/generate",
      data: {
        roadmapId: pending.id,
        userId: user.id,
        targetRole,
        targetIndustry,
      },
    });
    return { ok: true, mode: "queued", roadmapId: pending.id };
  } catch (err) {
    // Fallback: generate synchronously
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create a comprehensive 12-week career workflow for a professional transitioning to ${targetRole} in ${targetIndustry || 'technology'} industry.

CRITICAL REQUIREMENTS:
1. ALL nodes MUST be connected in a logical sequence
2. Create a clear progression path from beginner to advanced
3. Ensure proper dependencies between skills, projects, and certifications
4. Include realistic timelines and prerequisites

Return ONLY JSON with this exact structure:
{
  "title": string,
  "summary": string,
  "weeks": [
    {
      "week": number,
      "focus": string,
      "tasks": [string],
      "resources": [string],
      "milestones": [string],
      "prerequisites": [string],
      "dependencies": [number]
    }
  ],
  "certifications": [
    {
      "name": string,
      "provider": string,
      "duration": string,
      "prerequisites": [string],
      "week": number
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": [string],
      "difficulty": "beginner" | "intermediate" | "advanced",
      "week": number,
      "prerequisites": [string]
    }
  ],
  "networking": [
    {
      "activity": string,
      "platform": string,
      "type": string,
      "week": number
    }
  ],
  "recommendedSkills": [
    {
      "skill": string,
      "level": "beginner" | "intermediate" | "advanced",
      "category": string,
      "week": number,
      "prerequisites": [string]
    }
  ],
  "connections": [
    {
      "from": string,
      "to": string,
      "type": "prerequisite" | "dependency" | "sequence"
    }
  ],
  "blocks3d": [
    {
      "week": number,
      "x": number,
      "y": number,
      "z": number,
      "width": number,
      "height": number,
      "depth": number,
      "color": string
    }
  ]
}

STRUCTURE RULES:
- Week 1-3: Foundation skills and basic concepts
- Week 4-6: Intermediate skills and first projects
- Week 7-9: Advanced skills and complex projects
- Week 10-12: Specialization and portfolio building
- Each week must build upon previous weeks
- All skills must have clear prerequisites
- Projects must be connected to relevant skills
- Certifications should align with skill progression
- Networking activities should support career goals

CONNECTION RULES:
- Every skill must connect to at least one project
- Every project must connect to relevant skills
- Certifications must connect to prerequisite skills
- Weeks must connect in sequential order
- Create clear learning paths with no isolated nodes

JSON ONLY. No markdown or explanations.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
      const roadmapJson = JSON.parse(cleaned);

      await db.roadmap.update({
        where: { id: pending.id },
        data: {
          title: roadmapJson.title || `${targetRole} Roadmap`,
          steps: roadmapJson.weeks || [],
          content: roadmapJson.summary || "",
          certifications: Array.isArray(roadmapJson.certifications) ? roadmapJson.certifications : [],
          projects: Array.isArray(roadmapJson.projects) ? roadmapJson.projects : [],
          networking: Array.isArray(roadmapJson.networking) ? roadmapJson.networking : [],
          recommendedSkills: Array.isArray(roadmapJson.recommendedSkills) ? roadmapJson.recommendedSkills : [],
          blocks3d: Array.isArray(roadmapJson.blocks3d) ? roadmapJson.blocks3d : [],
          connections: Array.isArray(roadmapJson.connections) ? roadmapJson.connections : [],
          status: "completed",
        },
      });

      return { ok: true, mode: "inline", roadmapId: pending.id };
    } catch (e) {
      console.error("Roadmap inline generation failed:", e);
      try {
        await db.roadmap.update({ where: { id: pending.id }, data: { status: "failed" } });
      } catch {}
      throw new Error("Failed to generate roadmap");
    }
  }
}

export async function getRoadmapById(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!id) throw new Error("Missing id");
  const user = await db.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } });
  if (!user) throw new Error("User not found");
  const roadmap = await db.roadmap.findFirst({ where: { id, userId: user.id } });
  if (!roadmap) throw new Error("Not found");
  return roadmap;
}

export async function listRoadmaps() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } });
  if (!user) throw new Error("User not found");
  const items = await db.roadmap.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true, createdAt: true, targetRole: true, targetIndustry: true },
  });
  return items;
}


