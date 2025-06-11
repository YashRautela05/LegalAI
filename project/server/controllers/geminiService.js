import { GoogleGenAI, Type } from "@google/genai";

async function generateResponse(data) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      required: ["summary", "analysis"],
      properties: {
        summary: {
          type: Type.STRING,
        },
        analysis: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["category", "description", "severity"],
            properties: {
              category: {
                type: Type.STRING,
              },
              description: {
                type: Type.STRING,
              },
              severity: {
                type: Type.STRING,
                enum: ["low", "medium", "high"],
              },
            },
          },
        },
      },
    },
    systemInstruction: [
      {
        text: `You are a highly skilled legal analyst AI specializing in reviewing and analyzing legal documents such as contracts, agreements, policies, and notices. Your primary responsibility is to assess the document for potential legal, financial, operational, and compliance risks.
  - Provide a brief summary 
  - Return the analysis strictly in a structured JSON format as described
  `,
      },
    ],
  };
  const model = "gemini-2.0-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: `application/pdf`,
          },
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });
  return response;
}

export default generateResponse;
