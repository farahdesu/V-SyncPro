
import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from "../types";

export const parseCV = async (content: string | { data: string; mimeType: string }): Promise<CVData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      headline: { type: Type.STRING, description: "Professional LinkedIn headline" },
      about: { type: Type.STRING, description: "First-person professional bio" },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      experience: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            location: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            school: { type: Type.STRING },
            degree: { type: Type.STRING },
            fieldOfStudy: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      projects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            link: { type: Type.STRING }
          }
        }
      },
      certifications: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            issuingOrganization: { type: Type.STRING },
            issueDate: { type: Type.STRING }
          }
        }
      },
      volunteer: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            organization: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      languages: { type: Type.ARRAY, items: { type: Type.STRING } },
      awards: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            issuer: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      publications: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            publisher: { type: Type.STRING },
            publicationDate: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      patents: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            number: { type: Type.STRING }
          }
        }
      }
    },
    required: ["name", "headline", "about", "skills", "experience", "education"]
  };

  const isText = typeof content === 'string';
  const prompt = `Act as a senior executive recruiter. Perform a deep, multi-pass analysis of the provided CV. 
  
  OBJECTIVE:
  1. Extract EVERY professional detail with 100% fidelity.
  2. Map all research, publications, conference papers, and patents into their respective sections.
  3. Synthesize a powerful LinkedIn 'About' section that captures their unique value proposition.
  4. Ensure no job role or project is left behind, no matter how small.
  
  Do not rush. Ensure structural integrity and thoroughness in the final JSON response.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: isText 
        ? { parts: [{ text: `${prompt}\n\nCV CONTENT:\n${content}` }] }
        : { parts: [{ inlineData: content }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Slightly higher for more natural summarization in 'About'
        thinkingConfig: { thinkingBudget: 8192 } // Significant thinking budget for deep reasoning
      }
    });

    const text = response.text;
    if (!text) throw new Error("Thorough analysis produced an empty response. Please try again.");
    
    const parsed = JSON.parse(text);
    return {
      projects: [], certifications: [], volunteer: [], languages: [], 
      awards: [], publications: [], patents: [], organizations: [], testScores: [],
      ...parsed
    } as CVData;
  } catch (error) {
    console.error("Gemini Parsing failed:", error);
    throw error;
  }
};
