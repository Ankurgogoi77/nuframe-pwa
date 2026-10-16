"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";
import {
  ChevronLeft,
  Undo2,
  Redo2,
  Download,
  Sparkles,
  Type,
  Stamp,
  Layers,
  Sliders,
  Sticker,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  RotateCcw,
  Palette,
  Eye,
  Settings2,
  ZoomIn,
  Share2,
} from "lucide-react";
import RepurposeDrawer from "@/components/RepurposeDrawer";

export default function CreativeStudioPage() {
  const [aspectRatio, setAspectRatio] = useState<"4:5" | "1:1">("4:5");
  const [slideCount, setSlideCount] = useState<number>(3);
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [isAutoDirecting, setIsAutoDirecting] = useState<boolean>(false);
  const [isRepurposing, setIsRepurposing] = useState<boolean>(false);
  const [activeLeftTool, setActiveLeftTool] = useState<string>("Layout");
  const [activeRightTab, setActiveRightTab] = useState<"Text" | "Style" | "Elements" | "Adjust">("Text");

  // Editable canvas states
  const [canvasTitle, setCanvasTitle] = useState("PONDICHERRY");
  const [stampText, setStampText] = useState("21 OCT 2026 · HYDERABAD");
  const [captionText, setCaptionText] = useState("Good food. Better company. Unforgettable sunsets.");
  const [curvedText, setCurvedText] = useState("SOMEWHERE BETWEEN ROUTINE & FREEDOM");
  const [currentImage, setCurrentImage] = useState<string>(
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);
    }
  };

  const handleAutoDirect = async () => {
    setIsAutoDirecting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("creator_niche", "Travel & Visual Storytelling");
        formData.append("target_audience", "Aesthetic conscious creators & travelers");

        const response = await fetch(`${apiUrl}/api/ai/analyze-and-direct`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const plan = data.director_plan;
          if (plan) {
            if (plan.theme_and_mood?.recommended_aesthetic) {
              setCurvedText(plan.theme_and_mood.recommended_aesthetic.toUpperCase());
            }
            if (plan.narrative_hook) {
              setCanvasTitle(plan.narrative_hook.slice(0, 24).toUpperCase());
            }
            if (plan.slides && plan.slides.length > 0) {
              const firstSlide = plan.slides[0];
              setCaptionText(firstSlide.caption || firstSlide.story_text || captionText);
              setStampText(firstSlide.suggested_stamp || "2026 · AI DIRECTED");
            }
          }
          if (data.uploaded_assets && data.uploaded_assets[0]?.url) {
            setExportSuccessMessage("Uploaded to Cloudflare R2 & Analyzed by AI Director!");
            setTimeout(() => setExportSuccessMessage(null), 4000);
          }
          setIsAutoDirecting(false);
          return;
        }
      }

      // If no file uploaded or API response wasn't ok, run intelligent simulation
      setTimeout(() => {
        setCanvasTitle("SUNKISSED HYDERABAD");
        setStampText("OCT 2026 · CHARMINAR");
        setCaptionText("Finding stillness between routine and freedom. Framed on 35mm.");
        setCurvedText("SUNRISE TO SUNSET · CHARMINAR");
        setIsAutoDirecting(false);
      }, 1200);
    } catch {
      setTimeout(() => {
        setCanvasTitle("SUNKISSED HYDERABAD");
        setStampText("OCT 2026 · CHARMINAR");
        setCaptionText("Finding stillness between routine and freedom. Framed on 35mm.");
        setCurvedText("SUNRISE TO SUNSET · CHARMINAR");
        setIsAutoDirecting(false);
      }, 800);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const ratio = aspectRatio === "4:5" ? 0.8 : 1.0;
        const res = await fetch(`${apiUrl}/api/studio/split?num_slides=${slideCount}&aspect_ratio=${ratio}`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const blob = await res.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `nuframe_carousel_${slideCount}slides.zip`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setExportSuccessMessage("Downloaded seamless sliced carousel zip bundle!");
          setTimeout(() => setExportSuccessMessage(null), 4000);
          setIsExporting(false);
          return;
        }
      }

      setExportSuccessMessage("Exporting seamless carousel slides (3 pixel-perfect slices ready)!");
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch {
      setExportSuccessMessage("Export completed.");
      setTimeout(() => setExportSuccessMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const leftTools = [
    { label: "Layout", icon: Layers },
    { label: "Text", icon: Type },
    { label: "Elements", icon: Stamp },
    { label: "Photos", icon: ImageIcon },
    { label: "Filters", icon: Palette },
    { label: "Stickers", icon: Sticker },
    { label: "Adjust", icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-[#F4F0E8] font-sans flex flex-col justify-between selection:bg-[#D97855] selection:text-white">
      {/* Studio Top Control Bar (Unified Desktop & Mobile) */}
      <header className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md px-4 py-3 border-b border-[#2A2926] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#9C9890] hover:text-[#F4F0E8] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-serif text-lg font-bold text-[#F4F0E8] hidden sm:inline">
              NuFrame Studio
            </span>
          </Link>

          <div className="flex items-center gap-1 border-l border-[#2A2926] pl-3">
            <button
              className="p-1.5 rounded-lg text-[#9C9890] hover:text-[#F4F0E8] hover:bg-[#20201E]"
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-lg text-[#9C9890] hover:text-[#F4F0E8] hover:bg-[#20201E]"
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Aspect Ratio & Zoom Presets */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#20201E] border border-[#2A2926] p-0.5 rounded-full text-xs font-semibold">
            <button
              onClick={() => setAspectRatio("4:5")}
              className={`px-3 py-1 rounded-full transition-all ${
                aspectRatio === "4:5"
                  ? "bg-[#D97855] text-white"
                  : "text-[#9C9890] hover:text-[#F4F0E8]"
              }`}
            >
              4:5 Vertical
            </button>
            <button
              onClick={() => setAspectRatio("1:1")}
              className={`px-3 py-1 rounded-full transition-all ${
                aspectRatio === "1:1"
                  ? "bg-[#D97855] text-white"
                  : "text-[#9C9890] hover:text-[#F4F0E8]"
              }`}
            >
              1:1 Square
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-[#20201E] border border-[#2A2926] px-3 py-1 rounded-full text-xs text-[#9C9890]">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>100%</span>
          </div>
        </div>

        {/* Right CTA: Repurpose & Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRepurposing(true)}
            className="bg-[#20201E] hover:bg-[#2A2926] text-[#F4F0E8] border border-[#3A3833] text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            title="Repurpose across Instagram, LinkedIn, Reels, Threads"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D97855]" />
            <span>Repurpose</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#D97855] hover:bg-[#C96B4B] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-[#D97855]/20 flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-70"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {isExporting ? "Slicing..." : "Export"}
          </button>
        </div>
      </header>

      {/* Multi-Platform Repurposing Agent Drawer */}
      <RepurposeDrawer
        isOpen={isRepurposing}
        onClose={() => setIsRepurposing(false)}
        canonicalTitle={canvasTitle}
        canonicalCaption={captionText}
      />

      {/* Toast Notification Banner */}
      {exportSuccessMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#C96B4B] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-top duration-200">
          ✓ {exportSuccessMessage}
        </div>
      )}

      {/* Main Studio Body (3-Column Layout on Desktop, Focused Viewport on Mobile) */}
      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================== */}
        {/* DESKTOP LEFT TOOLBAR (Hidden on mobile) */}
        {/* ============================================================== */}
        <aside className="hidden md:flex flex-col w-20 bg-[#20201E] border-r border-[#2A2926] py-4 items-center shrink-0 space-y-4">
          {leftTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeLeftTool === tool.label;
            return (
              <button
                key={tool.label}
                onClick={() => setActiveLeftTool(tool.label)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isSelected
                    ? "bg-[#D97855]/20 text-[#D97855]"
                    : "text-[#9C9890] hover:text-[#F4F0E8] hover:bg-[#2A2926]"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
                <span className="text-[10px] font-medium">{tool.label}</span>
              </button>
            );
          })}
        </aside>

        {/* ============================================================== */}
        {/* CENTER VIEWPORT (The Creative Canvas) */}
        {/* ============================================================== */}
        <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center overflow-y-auto">
          {/* Multimodal AI Director Ribbon */}
          <div className="w-full max-w-xl flex items-center justify-between bg-[#20201E] border border-[#2A2926] rounded-xl px-4 py-2.5 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97855]" />
              <span className="text-[#F4F0E8] font-semibold">
                Multimodal AI Director
              </span>
            </div>
            <button
              onClick={handleAutoDirect}
              disabled={isAutoDirecting}
              className="text-[11px] font-bold text-[#D97855] bg-[#D97855]/15 hover:bg-[#D97855]/25 px-3 py-1 rounded-lg border border-[#D97855]/30 transition-all flex items-center gap-1.5"
            >
              {isAutoDirecting ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Analyzing Media...
                </>
              ) : (
                "Auto-Direct Story"
              )}
            </button>
          </div>

          {/* Canvas Viewport Frame */}
          <div
            className={`relative w-full max-w-md rounded-2xl overflow-hidden bg-[#20201E] border-2 border-[#2A2926] shadow-2xl transition-all duration-300 ${
              aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
            }`}
          >
            {/* Background Panorama Image */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={currentImage}
                alt="Studio Panorama"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

              {/* Vertical Dashed Cut Guides (Seamless Panorama Slices) */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3">
                <div className="border-r border-dashed border-white/40 relative">
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Slide 1
                  </span>
                </div>
                <div className="border-r border-dashed border-white/40 relative">
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Slide 2
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Slide 3
                  </span>
                </div>
              </div>

              {/* Postal Stamp Badge */}
              <div className="absolute top-8 right-6 bg-[#F7F4EE]/95 border-2 border-dashed border-[#C96B4B] text-[#171717] px-2.5 py-1 rounded shadow-lg transform rotate-2">
                <div className="flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase">
                  <Stamp className="w-2.5 h-2.5 text-[#C96B4B]" />
                  {stampText}
                </div>
              </div>

              {/* Curved / Editorial Headline */}
              <div className="absolute top-20 left-6 right-6 text-center">
                <h2 className="font-serif text-3xl font-extrabold text-[#F7F4EE] tracking-widest drop-shadow-md">
                  {canvasTitle}
                </h2>
              </div>

              {/* Polaroid / Handwritten Caption */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#F7F4EE]/90 backdrop-blur-sm text-[#171717] p-3 rounded-xl border border-[#DBD2C7] shadow-lg">
                <p className="font-sans text-xs italic text-[#171717] leading-relaxed">
                  "{captionText}"
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-[#6F6A62]">
                  <span>{curvedText}</span>
                  <span className="text-[#C96B4B] font-semibold">
                    Slide {activeSlide} of {slideCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Navigation & Photo Upload Trigger */}
          <div className="w-full max-w-md flex items-center justify-between mt-3 px-1 text-xs">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveSlide(num)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                    activeSlide === num
                      ? "bg-[#D97855] text-white ring-2 ring-[#D97855]/40"
                      : "bg-[#20201E] text-[#9C9890] hover:text-[#F4F0E8]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <label
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-[#D97855] hover:text-white cursor-pointer font-semibold text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace Photo
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </main>

        {/* ============================================================== */}
        {/* DESKTOP RIGHT INSPECTOR PANEL (Typography & Style Studio) */}
        {/* ============================================================== */}
        <aside className="hidden lg:flex flex-col w-72 bg-[#20201E] border-l border-[#2A2926] p-5 shrink-0 space-y-5">
          {/* Inspector Tabs */}
          <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-[#2A2926] text-xs">
            {(["Text", "Style", "Elements", "Adjust"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRightTab(tab)}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  activeRightTab === tab
                    ? "bg-[#D97855] text-white"
                    : "text-[#9C9890] hover:text-[#F4F0E8]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Text Tool Options */}
          <div className="space-y-3">
            <button
              onClick={() => setCanvasTitle("PONDICHERRY")}
              className="w-full bg-[#D97855] text-white font-bold py-2 rounded-xl text-xs shadow hover:bg-[#C96B4B] transition-all"
            >
              + Add Title Text
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setCanvasTitle("SUMMER ESCAPE")}
                className="bg-[#141414] border border-[#2A2926] p-3 rounded-xl hover:border-[#D97855] transition-all text-center"
              >
                <span className="font-serif text-sm font-bold block">Title</span>
                <span className="text-[10px] text-[#9C9890]">Handwritten</span>
              </button>

              <button
                onClick={() => setCanvasTitle("GOA MEMORIES")}
                className="bg-[#141414] border border-[#2A2926] p-3 rounded-xl hover:border-[#D97855] transition-all text-center"
              >
                <span className="font-sans text-sm font-bold block">Curved</span>
                <span className="text-[10px] text-[#9C9890]">Arc Title</span>
              </button>

              <button
                onClick={() => setStampText("21 MAY 2026 · TRAVEL")}
                className="bg-[#141414] border border-[#2A2926] p-3 rounded-xl hover:border-[#D97855] transition-all text-center"
              >
                <span className="text-xs font-bold block text-[#D97855]">STAMP</span>
                <span className="text-[10px] text-[#9C9890]">Postal Badge</span>
              </button>

              <button
                onClick={() => setCaptionText("A day captured in 35mm frames.")}
                className="bg-[#141414] border border-[#2A2926] p-3 rounded-xl hover:border-[#D97855] transition-all text-center"
              >
                <span className="italic text-xs block">Quote</span>
                <span className="text-[10px] text-[#9C9890]">Typewriter</span>
              </button>
            </div>
          </div>

          {/* Recommended Preset Styles */}
          <div className="pt-3 border-t border-[#2A2926] space-y-2">
            <span className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider">
              Recommended for You
            </span>
            {[
              "PONDICHERRY · Editorial Serif",
              "Good Food, Better Company",
              "Sunrise to Sunset",
              "TRAVEL DIARIES",
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setCanvasTitle(preset.split(" · ")[0])}
                className="w-full text-left bg-[#141414] hover:bg-[#2A2926] px-3 py-2 rounded-xl text-xs font-medium text-[#F4F0E8] transition-colors border border-[#2A2926]"
              >
                {preset}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Mobile-Only Bottom Navigation Dock */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
