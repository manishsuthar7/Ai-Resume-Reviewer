import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: NextRequest) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key is missing. Please add it to .env.local as OPENAI_API_KEY." },
                { status: 500 }
            );
        }

        const { resumeText, jobDescription } = await req.json();

        if (!resumeText) {
            return NextResponse.json({ error: "Missing resume text" }, { status: 400 });
        }

        const hasJD = jobDescription && jobDescription.trim().length > 0;

        const prompt = `You are a world-class technical recruiter and career coach. Analyze the provided resume${hasJD ? " against the provided Job Description" : ""} and return a comprehensive, strictly valid JSON response.

${hasJD ? `JOB DESCRIPTION:\n${jobDescription}\n\n` : ""}RESUME TEXT:\n${resumeText}

Return ONLY valid JSON matching this exact schema (no extra text, no markdown):
{
  "score": <number 0-100: holistic resume quality>,
  "summary": "<2-3 sentence candidate profile summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "improvements": ["<specific actionable improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>"],
  "ats_compatibility": <number 0-100: how well the resume will pass ATS parsers>,
  ${hasJD ? `"jd_match_score": <number 0-100: how well resume matches the JD requirements>,
  "missing_keywords": ["<keyword missing from resume but in JD 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "matched_keywords": ["<keyword found in both resume and JD 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],` : `"jd_match_score": null,
  "missing_keywords": [],
  "matched_keywords": [],`}
  "bullet_rewrites": [
    {
      "original": "<one existing bullet point from the resume, copied verbatim>",
      "improved": "<AI-rewritten version that is stronger, quantified, and action-verb led>"
    },
    {
      "original": "<another bullet point>",
      "improved": "<improved version>"
    },
    {
      "original": "<another bullet point>",
      "improved": "<improved version>"
    }
  ]
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a JSON-only AI. Output only valid JSON, no extra text." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.6,
        });

        const resultText = response.choices[0].message.content;
        const parsedResult = JSON.parse(resultText || "{}");

        return NextResponse.json(parsedResult);
    } catch (error: unknown) {
        console.error("AI Evaluation error:", error);
        return NextResponse.json({ error: (error as Error).message || "Failed to evaluate resume" }, { status: 500 });
    }
}
