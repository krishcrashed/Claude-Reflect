import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routing for analyzing user queries using Gemini
  app.post("/api/analyze-query", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
      }

      const formattedHistory = history ? history.map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n') : '';

      // We want to generate diagnostic questions if sufficiency is 'Low' or 'Medium'
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are Claude, a helpful AI assistant. 
${formattedHistory ? `Previous Conversation:\n${formattedHistory}\n\n` : ''}The user has given the following new prompt:
"${prompt}"

Please provide two things:
1. A direct, clear, and comprehensive response to their prompt, formatting it nicely in markdown (using text, prose, code blocks, tables, etc., just like Claude). Provide a high-quality answer but leave room for ambiguity where appropriate and do not pose as the ultimate authority.
2. A reflective evaluation of your own reasoning and output to support human judgment (Reflect Data). Include what context was provided, what is missing and its impact, any hidden assumptions you had to make to answer, and an uncertainty calibration (high/medium/low areas of uncertainty). Include a recommended next action for the user, and a set of "stress test" alternative perspectives to avoid blind trust.
3. A list of 2-3 highly specific, succinct clarification questions the user could answer to give you more relevant context or better understand their underlying needs. To minimize user effort, the questions should require very short answers. Only make them multiple-choice (MCQ) when there are a small handful of obvious, mutually-exclusive options.

Respond strictly in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description: "The main markdown response to the user's prompt",
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: {
                      type: Type.STRING,
                      description: "The short clarification question.",
                    },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Optional. 3-4 short options if the question is multiple choice.",
                    }
                  },
                  required: ["text"]
                },
              },
              reflectData: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.STRING, description: "'High', 'Medium', or 'Low' context sufficiency" },
                  provided: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Facts provided in the prompt" },
                  missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Crucial missing context" },
                  missingImpact: { type: Type.STRING, description: "Why the missing context matters for output quality" },
                  assumptions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        fact: { type: Type.STRING, description: "The related topic" },
                        assumption: { type: Type.STRING, description: "What you assumed" },
                        reason: { type: Type.STRING, description: "Why you assumed it" },
                        impact: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" }
                      },
                      required: ["fact", "assumption", "reason", "impact"]
                    }
                  },
                  uncertainty: {
                    type: Type.OBJECT,
                    properties: {
                      high: { type: Type.ARRAY, items: { type: Type.STRING } },
                      medium: { type: Type.ARRAY, items: { type: Type.STRING } },
                      low: { type: Type.ARRAY, items: { type: Type.STRING } },
                      explanation: { type: Type.STRING }
                    },
                    required: ["high", "medium", "low", "explanation"]
                  },
                  nextAction: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: "'Proceed', 'Proceed With Caution', 'Add More Context', 'Reframe Request', or 'Decline/Pivot'" },
                      explanation: { type: Type.STRING }
                    },
                    required: ["type", "explanation"]
                  },
                  stressTest: {
                    type: Type.ARRAY,
                    description: "Alternative perspectives or potential pitfalls to avoid blind trust",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        role: { type: Type.STRING, description: "The persona offering this perspective" },
                        avatar: { type: Type.STRING, description: "An emoji" },
                        title: { type: Type.STRING, description: "Warning or perspective title" },
                        text: { type: Type.STRING, description: "The explanation" },
                        riskRating: { type: Type.STRING, description: "'Critical', 'Moderate', or 'Secondary'" }
                      },
                      required: ["id", "role", "avatar", "title", "text", "riskRating"]
                    }
                  }
                },
                required: ["score", "provided", "missing", "missingImpact", "assumptions", "uncertainty", "nextAction", "stressTest"]
              }
            },
            required: ["answer", "questions", "reflectData"]
          },
        },
      });

      const responseText = response.text?.trim() || "{}";
      console.log("Raw response:", responseText);
      const parsedData = JSON.parse(responseText);
      res.json(parsedData);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to analyze query" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
