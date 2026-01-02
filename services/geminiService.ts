
import { GoogleGenAI, Type } from "@google/genai";
import { SelectionState, RoadmapResult, SkillType, ResourceLink, Certification } from "../types";

// Fixed: Always use a named parameter for apiKey and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoadmap = async (selections: SelectionState): Promise<RoadmapResult> => {
  const isBuilding = selections.skillType === SkillType.BUILDING;
  
  const prompt = `
    TASK: Act as the Lead AI Architect at 'Botbrained Learn'. 
    Generate a high-performance, quirky, and relatable AI Course Roadmap.
    
    INPUT PARAMS:
    - Persona: ${selections.persona}
    - Vertical: ${selections.vertical}
    - Level: ${selections.level}
    - Skill Path: ${selections.skillType}
    ${isBuilding ? `Build Focus: ${selections.buildType}` : ''}

    CONTENT REQUIREMENTS:
    - title: A quirky, funny name for this course.
    - summary: A relatable 2-sentence hook about surviving 2026.
    - syllabus: 4 modules of intensive learning.
    - sessionBreakdown: A 90-minute hyper-intensive session plan.
    - topicsToCover: Exactly 13 core topics to master. 
      Each topic needs: topicNumber, title, content (detailed explanation), recommendedTool (the best tool to use for this task), and toolExplanation (why this tool is the goat).
    - marketingStrategy: 3 high-conversion ad sets with pain-point positioning.
    - tools: 10 relevant tools.
    - readingMaterials: 3 book or paper titles.
    - outcomes: 3-5 key takeaways.

    Return ONLY valid JSON.
  `;

  // Use the global instance for general generation tasks
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          syllabus: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                lessons: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "description", "lessons"],
            },
          },
          sessionBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                duration: { type: Type.STRING },
                topic: { type: Type.STRING },
                activity: { type: Type.STRING },
              },
              required: ["duration", "topic", "activity"],
            },
          },
          tools: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketingStrategy: {
            type: Type.OBJECT,
            properties: {
              adSets: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    positioningStatement: { type: Type.STRING },
                    staticImages: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { hook: { type: Type.STRING }, visual: { type: Type.STRING } },
                        required: ["hook", "visual"]
                      }
                    },
                    carousel: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          slideNumber: { type: Type.INTEGER },
                          heading: { type: Type.STRING },
                          body: { type: Type.STRING },
                        },
                        required: ["slideNumber", "heading", "body"]
                      }
                    },
                    videoIdeas: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          scriptHook: { type: Type.STRING },
                          animationDescription: { type: Type.STRING },
                          duration: { type: Type.STRING },
                        },
                        required: ["title", "scriptHook", "animationDescription", "duration"]
                      }
                    }
                  },
                  required: ["positioningStatement", "staticImages", "carousel", "videoIdeas"]
                }
              }
            },
            required: ["adSets"]
          },
          topicsToCover: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topicNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                recommendedTool: { type: Type.STRING },
                toolExplanation: { type: Type.STRING },
              },
              required: ["topicNumber", "title", "content", "recommendedTool", "toolExplanation"]
            }
          },
          readingMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
          outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "summary", "syllabus", "marketingStrategy", "outcomes", "sessionBreakdown", "tools", "topicsToCover", "readingMaterials"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  try {
    const data = JSON.parse(text);
    return {
      ...data,
      searchResources: [],
      certifications: [],
      originalSelections: selections
    };
  } catch (e) {
    console.error("JSON Parse Error:", text);
    throw new Error("Failed to parse roadmap data. Please try again.");
  }
};

export const fetchLiveResources = async (
  type: 'video' | 'blog' | 'certification',
  context: { title: string; vertical: string; level: string; persona: string }
): Promise<any[]> => {
  const prompt = `Find REAL, VALID, and HIGH-QUALITY ${type} resources for:
    Target Audience: ${context.persona} working in ${context.vertical} at a ${context.level} level.
    Core Topic: ${context.title}`;

  // Fixed: Create a new instance right before making an API call
  const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await genAI.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      // Fixed: Removed responseMimeType and responseSchema because search-grounded responses 
      // may not be in valid JSON format and URLs must be extracted from groundingChunks.
    },
  });

  // Fixed: Mandatory extraction of URLs from groundingMetadata.groundingChunks when using googleSearch
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || "Found Resource",
      url: chunk.web.uri,
      name: chunk.web.title || "Found Resource", // Compatibility with Certification type
      provider: "Verified Source", // Compatibility with Certification type
      type: type
    }));
};
