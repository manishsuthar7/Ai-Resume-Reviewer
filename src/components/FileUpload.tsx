"use client";

import React, { useState, useRef } from "react";

export default function FileUpload({ onUploadComplete }: { onUploadComplete: (text: string) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await processFile(e.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        setError(null);
        const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!validTypes.includes(file.type)) {
            setError("Please upload a PDF or DOCX file.");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("resume", file);

            const response = await fetch("/api/extract", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process the document.");
            }

            const data = await response.json();
            if (data.text) {
                onUploadComplete(data.text);
            } else {
                throw new Error("Could not extract text from the document.");
            }
        } catch (err: unknown) {
            setError((err as Error).message || "An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
            <div
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragging
                    ? "border-indigo-400 bg-indigo-500/10 scale-105"
                    : "border-white/20 glass hover:border-white/40 hover:bg-white/5"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer">
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                            <p className="mb-2 text-sm text-gray-400 font-sans">Extracting text...</p>
                        </div>
                    ) : (
                        <>
                            <svg className="w-12 h-12 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-lg text-gray-300 font-sans"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-sm text-gray-500 font-sans">PDF or DOCX (Max 5MB)</p>
                        </>
                    )}
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </div>

            {error && (
                <div className="mt-4 p-4 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
}
