import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights", id: "generate-industry-insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const text = res.response.candidates[0].content.parts[0].text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);

export const generateRoadmap = inngest.createFunction(
  { name: "Generate Roadmap", id: "roadmap-generate" },
  { event: "roadmap/generate" },
  async ({ event, step }) => {
    const { roadmapId, userId, targetRole, targetIndustry } = event.data || {};
    if (!roadmapId || !userId || !targetRole) {
      throw new Error("Missing data for roadmap generation");
    }

    // Validate pending roadmap exists
    const pending = await step.run("Fetch pending roadmap", async () => {
      return await db.roadmap.findFirst({ where: { id: roadmapId, userId } });
    });
    if (!pending) {
      throw new Error("Pending roadmap not found");
    }

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

    const res = await step.ai.wrap(
      "gemini",
      async (p) => model.generateContent(p),
      prompt
    );

    const text = res.response?.candidates?.[0]?.content?.parts?.[0]?.text || res.response?.text?.() || "";
    const cleaned = String(text).replace(/```(?:json)?\n?/g, "").trim();
    let roadmapJson = {};
    try {
      roadmapJson = JSON.parse(cleaned);
    } catch (e) {
      // Fallback minimal structure
      roadmapJson = { title: `${targetRole} Roadmap`, summary: "", weeks: [] };
    }

    await step.run("Update roadmap", async () => {
      await db.roadmap.update({
        where: { id: roadmapId },
        data: {
          title: roadmapJson.title || `${targetRole} Roadmap`,
          content: roadmapJson.summary || "",
          steps: Array.isArray(roadmapJson.weeks) ? roadmapJson.weeks : [],
          certifications: Array.isArray(roadmapJson.certifications) ? roadmapJson.certifications : [],
          projects: Array.isArray(roadmapJson.projects) ? roadmapJson.projects : [],
          networking: Array.isArray(roadmapJson.networking) ? roadmapJson.networking : [],
          recommendedSkills: Array.isArray(roadmapJson.recommendedSkills) ? roadmapJson.recommendedSkills : [],
          blocks3d: Array.isArray(roadmapJson.blocks3d) ? roadmapJson.blocks3d : [],
          connections: Array.isArray(roadmapJson.connections) ? roadmapJson.connections : [],
          status: "completed",
        },
      });
    });

    return { ok: true };
  }
);
