"use client";

import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ResultsDisplay, { EvaluationResult } from "@/components/ResultsDisplay";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (text: string) => {
    setExtractedText(text);
    setIsEvaluating(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, jobDescription: jobDescription.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to evaluate resume");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred");
      setExtractedText(null); // Reset so upload is shown again
    } finally {
      setIsEvaluating(false);
    }
  };

  const isUploadPhase = !extractedText && !result;

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden w-full pb-20">
      {/* Background Animated Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-blob z-0 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[120px] animate-blob z-0 pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="fixed top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] animate-blob z-0 pointer-events-none" style={{ animationDelay: "4s" }} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center mt-20">

        {/* Hero — only shown on upload phase */}
        {isUploadPhase && (
          <div className="w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-sm font-medium text-indigo-300">Powered by GPT-4o</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Optimize Your Resume.<br />
              <span className="text-gradient">Land the Dream Job.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-sans">
              Upload your resume and get an instant AI-powered review — complete with ATS scoring, keyword gap analysis, and rewritten bullet points.
            </p>

            {/* Job Description Input */}
            <div className="w-full max-w-3xl mx-auto mb-2 text-left">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-300 font-sans flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Job Description <span className="text-gray-500 font-normal">(Optional — enables JD match score & keyword analysis)</span>
                </label>
                {jobDescription && (
                  <button onClick={() => setJobDescription("")} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste the job description here to get a tailored match score and see which keywords your resume is missing..."
                className="w-full bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 rounded-xl p-4 font-sans text-sm resize-none focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
              />
            </div>

            {/* File Upload */}
            <FileUpload onUploadComplete={handleUploadComplete} />

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left mt-6 mb-8">
              <div className="glass-card p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-heading font-semibold text-white mb-1">Instant Scoring</h3>
                <p className="text-gray-400 text-xs font-sans">Overall quality, ATS compatibility, and JD match — all in seconds.</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3 text-orange-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-base font-heading font-semibold text-white mb-1">Keyword Gap Analysis</h3>
                <p className="text-gray-400 text-xs font-sans">See exactly which ATS keywords your resume is missing and which ones match.</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-3 text-fuchsia-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-base font-heading font-semibold text-white mb-1">AI Bullet Rewrites</h3>
                <p className="text-gray-400 text-xs font-sans">Get AI-powered, impact-driven rewrites of your bullet points you can copy instantly.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl w-full mx-auto mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-left">
            <strong className="block mb-1 font-semibold text-red-400">Analysis Failed</strong>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Evaluating Loader */}
        {isEvaluating && (
          <div className="w-full max-w-3xl mx-auto glass-card rounded-2xl p-14 text-center border border-white/10 mt-8">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-8">
                <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin absolute inset-0"></div>
                <div className="w-14 h-14 border-4 border-fuchsia-500/20 border-b-fuchsia-500 rounded-full animate-spin absolute inset-3" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-white mb-3">Analyzing Your Resume...</h3>
              <p className="text-gray-400 font-sans max-w-sm">Our AI is evaluating formatting, keywords, impact language, and generating personalized suggestions.</p>
              <div className="flex gap-6 mt-8 text-xs text-gray-600 font-sans">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block"></span>Parsing content</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse inline-block" style={{ animationDelay: "0.3s" }}></span>Scoring quality</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" style={{ animationDelay: "0.6s" }}></span>Writing suggestions</span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isEvaluating && (
          <ResultsDisplay result={result} />
        )}
      </div>
    </main>
  );
}
