
import { GoogleGenAI, Type } from "@google/genai";
import { SelectionState, RoadmapResult, SkillType, ResourceLink, Certification } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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
    - presentationPlan: Exactly 13 Slides. 
      Each slide needs: slideNumber, title, content (bullets), recommendedTool (Gamma, Canva, Tome, etc.), and toolExplanation (why it kicks ass for this slide).
    - marketingStrategy: 3 high-conversion ad sets with pain-point positioning.
    - tools: 10 relevant tools.
    - readingMaterials: 3 book or paper titles.
    - outcomes: 3-5 key takeaways.

    Return ONLY valid JSON. Note: Links (YouTube, Blogs, Certs) will be fetched later, so return empty arrays for searchResources and certifications for now.
  `;

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
          presentationPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                slideNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                recommendedTool: { type: Type.STRING },
                toolExplanation: { type: Type.STRING },
              },
              required: ["slideNumber", "title", "content", "recommendedTool", "toolExplanation"]
            }
          },
          readingMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
          outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "summary", "syllabus", "marketingStrategy", "outcomes", "sessionBreakdown", "tools", "presentationPlan", "readingMaterials"],
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
  const prompt = `
    Use Google Search to find REAL, VALID, and HIGH-QUALITY resources for the following:
    Type: ${type}
    Target Audience: ${context.persona} working in ${context.vertical} at a ${context.level} level.
    Core Topic: ${context.title}

    CRITICAL REQUIREMENTS:
    - You MUST use the 'googleSearch' tool. 
    - Search for actual existing content on YouTube, LinkedIn, or major AI blogs (Perplexity, OpenAI, Anthropic, Coursera, EdX).
    - Return exactly 5 results for video/blog and 3 for certifications.
    - For 'video': Return 5 real YouTube URLs.
    - For 'blog': Return 5 real blog posts or articles.
    - For 'certification': Return 3 real, valid AI certificates.

    Return the results in the following JSON format ONLY:
    If type is video or blog: [{"title": "...", "url": "...", "type": "${type}"}]
    If type is certification: [{"name": "...", "provider": "...", "url": "..."}]

    URLs MUST start with https://. NO HALLUCINATIONS.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            name: { type: Type.STRING },
            url: { type: Type.STRING },
            type: { type: Type.STRING },
            provider: { type: Type.STRING },
          },
          required: ["url"]
        }
      }
    },
  });

  const text = response.text;
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse live resources", e);
    return [];
  }
};
