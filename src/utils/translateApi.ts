
const API_KEY = "AIzaSyAp8dNo5_YDJSGCTV8YpyGPfVYQeVGTWnw";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export interface TranslationRequest {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

export const translateText = async ({
  sourceText,
  sourceLanguage,
  targetLanguage,
}: TranslationRequest): Promise<TranslationResponse> => {
  try {
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only respond with the translation, no additional text:

${sourceText}`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    const translatedText = data.candidates[0].content.parts[0].text.trim();
    
    return { translatedText };
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};
