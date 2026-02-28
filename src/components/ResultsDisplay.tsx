"use client";

import React, { useEffect, useState } from "react";

export interface BulletRewrite {
    original: string;
    improved: string;
}

export interface EvaluationResult {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    ats_compatibility: number;
    jd_match_score: number | null;
    missing_keywords: string[];
    matched_keywords: string[];
    bullet_rewrites: BulletRewrite[];
}

const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
};

const getScoreRingColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
};

const ScoreCircle = ({ score, label, mounted, subtitle }: { score: number; label: string; mounted: boolean; subtitle?: string }) => (
    <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full glass border-2 border-white/10 mb-2">
            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="7" className="text-white/5" />
                <circle
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="7"
                    className={`${getScoreRingColor(score)} transition-all duration-1000 ease-out`}
                    strokeDasharray={`${score * 2.82} 282`}
                    style={{ strokeLinecap: "round", opacity: mounted ? 1 : 0 }}
                />
            </svg>
            <span className={`text-4xl font-bold font-heading ${getScoreColor(score)}`}>{mounted ? score : 0}</span>
        </div>
        <span className="text-sm text-gray-400 font-sans font-medium uppercase tracking-wider">{label}</span>
        {subtitle && <span className="text-xs text-gray-500 font-sans mt-0.5">{subtitle}</span>}
    </div>
);

export default function ResultsDisplay({ result }: { result: EvaluationResult }) {
    const [mounted, setMounted] = useState(false);
    const [activeBullet, setActiveBullet] = useState<number | null>(null);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const copyToClipboard = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const hasJD = result.jd_match_score !== null;

    return (
        <div className="w-full mx-auto text-left pb-20">

            {/* Header */}
            <div className="text-center mb-12 mt-4">
                <h2 className="text-4xl font-heading font-bold text-white mb-4">Resume Analysis Report</h2>
                <p className="text-gray-400 max-w-2xl mx-auto font-sans text-lg leading-relaxed">{result.summary}</p>
            </div>

            {/* Score Circles */}
            <div className="flex flex-wrap justify-center gap-10 mb-12">
                <ScoreCircle score={result.score} label="Overall Score" mounted={mounted} subtitle="Quality & Impact" />
                <ScoreCircle score={result.ats_compatibility} label="ATS Score" mounted={mounted} subtitle="Parser Compatibility" />
                {hasJD && result.jd_match_score !== null && (
                    <ScoreCircle score={result.jd_match_score} label="JD Match" mounted={mounted} subtitle="Job Fit" />
                )}
            </div>

            {/* Keywords (only if JD was provided) */}
            {hasJD && (result.matched_keywords.length > 0 || result.missing_keywords.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                    {/* Matched Keywords */}
                    <div className="glass-card rounded-2xl p-6 border-t-4 border-t-emerald-500">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <h3 className="text-lg font-heading font-semibold text-white">Matched Keywords</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.matched_keywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-sm font-sans border border-emerald-500/30">
                                    ✓ {kw}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="glass-card rounded-2xl p-6 border-t-4 border-t-orange-500">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-heading font-semibold text-white">Missing Keywords</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.missing_keywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 text-sm font-sans border border-orange-500/30">
                                    ✗ {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Strengths / Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                <div className="glass-card rounded-2xl p-6 border-t-4 border-t-green-500">
                    <div className="flex items-center gap-3 mb-4">
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="text-xl font-heading font-semibold text-white">Strengths</h3>
                    </div>
                    <ul className="space-y-3">
                        {result.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 font-sans text-sm">
                                <span className="text-green-500 mt-0.5 flex-shrink-0">●</span>
                                <span>{str}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-card rounded-2xl p-6 border-t-4 border-t-red-500">
                    <div className="flex items-center gap-3 mb-4">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <h3 className="text-xl font-heading font-semibold text-white">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-3">
                        {result.weaknesses.map((weak, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 font-sans text-sm">
                                <span className="text-red-500 mt-0.5 flex-shrink-0">●</span>
                                <span>{weak}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Actionable Improvements */}
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 w-full relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-2xl font-heading font-semibold text-white">Actionable Next Steps</h3>
                </div>
                <div className="space-y-3 relative z-10">
                    {result.improvements.map((imp, i) => (
                        <div key={i} className="p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20 flex gap-4 items-start">
                            <div className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                {i + 1}
                            </div>
                            <p className="text-indigo-100 font-sans text-sm mt-0.5">{imp}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Bullet Rewrites */}
            {result.bullet_rewrites && result.bullet_rewrites.length > 0 && (
                <div className="glass-card rounded-2xl p-6 border border-fuchsia-500/30 w-full relative overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-44 h-44 bg-fuchsia-500/10 blur-3xl rounded-full" />
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <svg className="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <h3 className="text-2xl font-heading font-semibold text-white">AI Bullet Rewrites</h3>
                    </div>
                    <p className="text-gray-500 text-sm font-sans mb-6 relative z-10">Click a bullet to reveal the improved version. Copy it with one click.</p>
                    <div className="space-y-4 relative z-10">
                        {result.bullet_rewrites.map((rewrite, i) => (
                            <div key={i} className="rounded-xl border border-white/10 overflow-hidden">
                                {/* Original */}
                                <button
                                    onClick={() => setActiveBullet(activeBullet === i ? null : i)}
                                    className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-xs font-bold bg-gray-700 text-gray-300 rounded px-2 py-0.5 mt-0.5 flex-shrink-0 font-sans uppercase tracking-wider">Original</span>
                                    <p className="text-gray-300 font-sans text-sm">{rewrite.original}</p>
                                    <svg
                                        className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-auto mt-0.5 transition-transform ${activeBullet === i ? "rotate-180" : ""}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {/* Improved — revealed on click */}
                                {activeBullet === i && (
                                    <div className="p-4 bg-fuchsia-900/20 border-t border-fuchsia-500/20 flex items-start gap-3">
                                        <span className="text-xs font-bold bg-fuchsia-500/30 text-fuchsia-300 rounded px-2 py-0.5 mt-0.5 flex-shrink-0 font-sans uppercase tracking-wider">Improved</span>
                                        <p className="text-fuchsia-100 font-sans text-sm flex-1">{rewrite.improved}</p>
                                        <button
                                            onClick={() => copyToClipboard(rewrite.improved, i)}
                                            className="flex-shrink-0 text-fuchsia-400 hover:text-fuchsia-200 transition-colors ml-2"
                                            title="Copy improved bullet"
                                        >
                                            {copiedIdx === i ? (
                                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 text-center">
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all border border-white/20 hover:scale-105"
                >
                    ← Analyze Another Resume
                </button>
            </div>
        </div>
    );
}
