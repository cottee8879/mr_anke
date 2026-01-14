import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates an image representation of a wish description using Gemini.
 * Uses 'gemini-2.5-flash-image' for image generation.
 */
export const generateWishImage = async (wishDescription: string): Promise<string> => {
  if (!apiKey) {
    console.error("API Key is missing");
    // Fallback image if no key is provided to prevent app crash during demo
    return `https://picsum.photos/seed/${encodeURIComponent(wishDescription.slice(0, 10))}/800/800`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a dreamy, artistic, and visually stunning digital art illustration representing this wish: "${wishDescription}". Do not include text in the image. High quality, detailed.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    // Fallback to picsum in case of error (e.g., quota exceeded) for better UX
    return `https://picsum.photos/seed/${Date.now()}/800/800`;
  }
};