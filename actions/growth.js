"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";

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


