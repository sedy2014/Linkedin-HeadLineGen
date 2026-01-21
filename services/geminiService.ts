
import { GoogleGenAI, Type } from '@google/genai';
import type { HeadlineSuggestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const headlineSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      headline: {
        type: Type.STRING,
        description: 'The generated LinkedIn headline.',
      },
      score: {
        type: Type.INTEGER,
        description: 'A score from 1-100 evaluating the headline\'s effectiveness.',
      },
      rationale: {
        type: Type.STRING,
        description: 'A brief explanation for the score, formatted as a single string with three markdown bullet points covering clarity, keywords, and audience appeal.',
      },
    },
    required: ['headline', 'score', 'rationale'],
  },
};

export async function summarizeLinkedInProfile(url: string): Promise<string | undefined> {
  const prompt = `
    Please visit the following LinkedIn profile URL and provide a concise summary (around 100-150 words) of the individual's current role, key skills, achievements, and implied career trajectory. Focus on information relevant for crafting a compelling LinkedIn headline.
    URL: ${url}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.1, // Keep temperature low for factual summary
      },
    });

    const summaryText = response.text.trim();
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    // If there's no meaningful summary text OR no successful grounding results, consider it a failure.
    // A meaningful summary should be longer than a few words and not contain phrases indicating access issues.
    // Successful grounding chunks indicate the search tool found and processed content.
    if (!summaryText || summaryText.length < 20 || summaryText.toLowerCase().includes("could not access") || !groundingChunks || groundingChunks.length === 0) {
        console.warn('LinkedIn profile summarization failed: no meaningful text or no grounding chunks.', { summaryText, groundingChunks });
        return undefined;
    }
    
    return summaryText;

  } catch (error) {
    console.error('Error summarizing LinkedIn profile with Gemini API:', error);
    // Re-throwing a more specific error for App.tsx to catch
    throw new Error('Failed to access or summarize the LinkedIn profile. Ensure the URL is valid, the profile is public, and try again.');
  }
}

export async function generateHeadlines(role: string, goals: string, profileSummary?: string): Promise<HeadlineSuggestion[]> {
  let prompt = `
    As an expert career coach and LinkedIn branding specialist, generate exactly 10 optimized LinkedIn headlines for a professional with the following details:
    - Current Role/Title: "${role}"
    - Career Goals: "${goals}"
  `;

  if (profileSummary) {
    prompt += `
    For additional context and ideation, consider the following summary of a LinkedIn profile:
    "${profileSummary}"
    Please integrate insights from this summary to create even more relevant and impactful headlines.
    `;
  }

  prompt += `
    For each headline, provide a score from 1 to 100 and a rationale. The score should be based on Clarity, Keyword Optimization, and Audience Appeal.

    The rationale MUST be a single string containing exactly three markdown bullet points, starting with a "*". Each bullet point must correspond to one of the scoring criteria.
    Example Rationale Format: "* Clarity & Conciseness: Excellent, very direct.\\n* Keyword Optimization: Includes 'Product Manager' and 'AI'.\\n* Audience Appeal: Strong for tech recruiters."

    The final output must be a JSON array of objects, strictly following the provided schema. Do not include any other text or explanations outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: headlineSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const suggestions: HeadlineSuggestion[] = JSON.parse(jsonText);
    
    // Sort by score descending
    suggestions.sort((a, b) => b.score - a.score);

    return suggestions;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('The request to the AI service failed. Please try again.');
  }
}