"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Studio() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [numSlides, setNumSlides] = useState<number>(3);
  const [aspectRatio, setAspectRatio] = useState<number>(0.8); // 0.8 is 4:5 vertical
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when file changes to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const setFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  };

  const handleExport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/studio/split?num_slides=${numSlides}&aspect_ratio=${aspectRatio}`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process and split the image on the server.");
      }

      // Download the ZIP file returned by the backend
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nuframe_spliced_${numSlides}_slides.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      setError(err.message || "Something went wrong while exporting files.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to show readable aspect ratios
  const getAspectRatioLabel = () => {
    if (aspectRatio === 0.8) return "4:5 Portrait (Instagram)";
    if (aspectRatio === 1.0) return "1:1 Square";
    if (aspectRatio === 0.5625) return "9:16 Vertical (Stories/Reels)";
    return `${aspectRatio.toFixed(2)} Custom`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] font-sans text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative w-8 h-8 rounded-lg overflow-hidden border border-indigo-500/30">
              <Image 
                src="/icon-192x192.png" 
                alt="NuFrame Logo" 
                fill
                className="object-cover"
              />
            </Link>
            <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NuFrame
            </Link>
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              The Studio
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              The Vault
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Controls & Options */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4">Splicer Settings</h2>
            
            {/* Aspect Ratio Config */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Frame Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAspectRatio(0.8)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    aspectRatio === 0.8
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  4:5 Portrait
                </button>
                <button
                  onClick={() => setAspectRatio(1.0)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    aspectRatio === 1.0
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  1:1 Square
                </button>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Active: {getAspectRatioLabel()}
              </span>
            </div>

            {/* Slides Count Config */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <span>Number of Slides</span>
                <span className="text-indigo-400">{numSlides} Frames</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={numSlides}
                onChange={(e) => setNumSlides(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>2 Slices</span>
                <span>6 Slices</span>
              </div>
            </div>

            {/* Exporter Actions */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <button
                onClick={handleExport}
                disabled={!selectedFile || isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Split & Export Slices
                  </>
                )}
              </button>
              
              {selectedFile && (
                <button
                  onClick={handleClear}
                  className="w-full text-xs font-semibold text-gray-400 hover:text-white py-2 text-center transition-colors"
                >
                  Clear Image
                </button>
              )}
            </div>
          </div>
          
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Right Side: Visual Sandbox / Preview Canvas */}
        <div className="flex-1 rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm flex flex-col min-h-[450px] relative overflow-hidden">
          
          {!previewUrl ? (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-indigo-500/30 rounded-2xl bg-white/[0.005] hover:bg-white/[0.01] transition-all cursor-pointer p-8 text-center"
            >
              <div className="h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 mb-4 flex">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white">Drag & drop your panorama image here</p>
              <p className="text-xs text-gray-500 mt-1">or click to browse from files. Supports PNG, JPG, WEBP.</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            /* Live Splicing Canvas Preview */
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Preview Canvas Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Live Swipe Preview & Slices Layout
                </span>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Seamless Flow Active
                </span>
              </div>
              
              {/* Slicing Simulator Container */}
              <div className="flex-1 flex items-center justify-center p-4 bg-black/40 rounded-2xl overflow-x-auto min-h-[300px]">
                <div 
                  className="relative flex select-none"
                  style={{
                    height: "300px",
                    // Width is determined by the number of slides times each slide's width
                    // Let's say one slide is 300px * aspectRatio wide
                    width: `${300 * aspectRatio * numSlides}px`
                  }}
                >
                  {/* Underlay Image */}
                  <img
                    src={previewUrl}
                    alt="Splicer preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                  
                  {/* Splicing Guidelines Overlay */}
                  {[...Array(numSlides)].map((_, i) => (
                    <div
                      key={i}
                      className="relative h-full border-r border-dashed border-indigo-500/60 flex items-start p-2"
                      style={{
                        width: `${300 * aspectRatio}px`,
                        // Hide border on the last slice
                        borderRightWidth: i === numSlides - 1 ? 0 : "1px"
                      }}
                    >
                      {/* Frame Index Overlay Badge */}
                      <span className="bg-black/80 backdrop-blur border border-white/10 rounded-full text-[10px] font-bold text-gray-300 w-5 h-5 flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips footer */}
              <div className="mt-4 text-xs text-gray-500 flex items-start gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                <svg className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.08 1.04l-.425.88a.75.75 0 11-1.25-.86l.554-1.04H11.25zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
                </svg>
                <p>
                  The vertical dashed lines indicate where your panoramic image will be cut. NuFrame handles the maths to ensure the alignment is 100% accurate and pixel-perfect across swipes.
                </p>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
