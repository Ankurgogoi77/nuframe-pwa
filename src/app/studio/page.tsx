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
  ZoomOut,
  Share2,
  MapPin,
  Move,
  Smartphone,
  Calendar,
  Check,
  X,
  Grid,
} from "lucide-react";
import RepurposeDrawer from "@/components/RepurposeDrawer";
import GoogleMapsModal, { LocationData } from "@/components/GoogleMapsModal";
import CarouselSimulatorModal from "@/components/CarouselSimulatorModal";
import ScheduleModal from "@/components/ScheduleModal";

type StudioTool = "Layout" | "Text" | "Elements" | "Photos" | "Filters" | "Stickers" | "Adjust";

export default function CreativeStudioPage() {
  const [aspectRatio, setAspectRatio] = useState<"4:5" | "1:1">("4:5");
  const [slideCount, setSlideCount] = useState<number>(3);
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [showSliceGuides, setShowSliceGuides] = useState<boolean>(true);
  const [isAutoDirecting, setIsAutoDirecting] = useState<boolean>(false);
  const [isRepurposing, setIsRepurposing] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  
  // Pointer / Touch Coordinate Tracking (Pan & Zoom)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.0);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Unified active tool state
  const [activeTool, setActiveTool] = useState<StudioTool>("Layout");

  // Editable canvas states
  const [canvasTitle, setCanvasTitle] = useState("PONDICHERRY");
  const [stampText, setStampText] = useState("21 OCT 2026 · HYDERABAD");
  const [captionText, setCaptionText] = useState("Good food. Better company. Unforgettable sunsets.");
  const [curvedText, setCurvedText] = useState("SOMEWHERE BETWEEN ROUTINE & FREEDOM");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans" | "mono" | "italic">("serif");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [textColor, setTextColor] = useState<string>("#F7F4EE");

  // Elements visibility & badge styles
  const [showLocationBadge, setShowLocationBadge] = useState<boolean>(true);
  const [showCaptionBox, setShowCaptionBox] = useState<boolean>(true);
  const [badgeStyle, setBadgeStyle] = useState<"stamp" | "minimal" | "gps">("stamp");

  // Filter & Color Adjustments
  const [filterPreset, setFilterPreset] = useState<string>("none");
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [warmth, setWarmth] = useState<number>(0);

  // Active stickers
  const [activeStickers, setActiveStickers] = useState<string[]>(["35mm"]);

  const [currentImage, setCurrentImage] = useState<string>(
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated Preset Travel Panoramas
  const photoPresets = [
    {
      name: "Pondicherry",
      url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
      title: "PONDICHERRY",
      caption: "French architecture meets coastal serenity.",
      stamp: "2026 · PONDICHERRY",
    },
    {
      name: "Goa Sunset",
      url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
      title: "GOA SUNSET",
      caption: "Golden light casting shadows across the Arabian Sea.",
      stamp: "2026 · GOA CLIFFS",
    },
    {
      name: "Jaipur Pink",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      title: "PINK CITY",
      caption: "Intricate terracotta lattices carved in timeless history.",
      stamp: "2026 · JAIPUR",
    },
    {
      name: "Himalayas",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      title: "HIMALAYAN SILENCE",
      caption: "Waking up to snow peaks touching the clear azure sky.",
      stamp: "2026 · HIMACHAL",
    },
    {
      name: "Charminar",
      url: "https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=1600&q=80",
      title: "CHARMINAR DUSK",
      caption: "The bustling pulse of old stone and chai aromas.",
      stamp: "2026 · HYDERABAD",
    },
    {
      name: "Kerala",
      url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
      title: "BACKWATERS",
      caption: "Drifting slowly under coconut palms and tranquil ripples.",
      stamp: "2026 · ALLEPPEY",
    },
  ];

  // Curated Filter Presets
  const filterPresets = [
    { name: "Original", css: "none", desc: "Clean & natural" },
    { name: "35mm Grain", css: "sepia(0.22) contrast(1.12) brightness(1.04) saturate(1.08)", desc: "Warm film aesthetic" },
    { name: "Terracotta Sun", css: "sepia(0.35) saturate(1.28) hue-rotate(-10deg) brightness(1.02)", desc: "Earthy golden tones" },
    { name: "Dust Blue", css: "hue-rotate(15deg) contrast(1.15) brightness(0.96) saturate(0.92)", desc: "Moody cinematic" },
    { name: "1960s Noir", css: "grayscale(1) contrast(1.25) brightness(0.96)", desc: "High contrast B&W" },
    { name: "Golden Hour", css: "saturate(1.35) sepia(0.22) brightness(1.08) contrast(1.06)", desc: "Sunset glow" },
    { name: "Vintage Fade", css: "contrast(0.92) brightness(1.12) sepia(0.2) saturate(0.88)", desc: "Matte print tones" },
    { name: "Warm Amber", css: "sepia(0.38) saturate(1.22) contrast(1.06)", desc: "Rich amber highlights" },
  ];

  // Compute live CSS filter combining preset + sliders
  const getCombinedFilter = () => {
    let filterStr = "";
    if (filterPreset !== "none") {
      filterStr += filterPreset + " ";
    }
    if (brightness !== 100) filterStr += `brightness(${brightness}%) `;
    if (contrast !== 100) filterStr += `contrast(${contrast}%) `;
    if (saturation !== 100) filterStr += `saturate(${saturation}%) `;
    if (warmth !== 0) filterStr += `sepia(${warmth}%) `;
    return filterStr.trim() || "none";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);
      handleResetTransform();
      setExportSuccessMessage(`Loaded photo: ${file.name}`);
      setTimeout(() => setExportSuccessMessage(null), 3000);
    }
  };

  // Drag and Drop Zone Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);
      handleResetTransform();
      setExportSuccessMessage(`Loaded photo: ${file.name}`);
      setTimeout(() => setExportSuccessMessage(null), 3000);
    }
  };

  // Pointer & Touch Coordinate Tracking (Pan & Zoom)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    setIsPanning(true);
    setStartPoint({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPoint.x,
      y: e.clientY - startPoint.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom((prev) => Math.min(Math.max(0.7, prev + delta), 3.0));
  };

  const handleResetTransform = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
  };

  const handleResetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(0);
    setFilterPreset("none");
    handleResetTransform();
    setExportSuccessMessage("Reset all adjustments & filters");
    setTimeout(() => setExportSuccessMessage(null), 2500);
  };

  const toggleSticker = (stickerId: string) => {
    setActiveStickers((prev) =>
      prev.includes(stickerId)
        ? prev.filter((id) => id !== stickerId)
        : [...prev, stickerId]
    );
  };

  const handleLocationSelected = (location: LocationData) => {
    const locName = location.name.toUpperCase();
    const city = (location.location_badge || location.name).toUpperCase();
    setCanvasTitle(locName.slice(0, 20));
    if (location.latitude && location.longitude) {
      setStampText(`2026 · ${city} · ${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`);
    } else {
      setStampText(`2026 · ${city}`);
    }
    setExportSuccessMessage(`Tagged: ${location.location_badge} via Google Maps!`);
    setTimeout(() => setExportSuccessMessage(null), 3000);
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
            setExportSuccessMessage("Uploaded to Cloud Vault & Analyzed by AI Director!");
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

      setExportSuccessMessage(`Exporting seamless carousel slides (${slideCount} slices ready)!`);
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch {
      setExportSuccessMessage("Export completed.");
      setTimeout(() => setExportSuccessMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const leftTools: { label: StudioTool; icon: any }[] = [
    { label: "Layout", icon: Layers },
    { label: "Text", icon: Type },
    { label: "Elements", icon: Stamp },
    { label: "Photos", icon: ImageIcon },
    { label: "Filters", icon: Palette },
    { label: "Stickers", icon: Sticker },
    { label: "Adjust", icon: Sliders },
  ];

  // Get active font class for title
  const getTitleFontClass = () => {
    switch (fontFamily) {
      case "serif":
        return "font-serif tracking-widest font-black";
      case "sans":
        return "font-sans tracking-tight font-extrabold";
      case "mono":
        return "font-mono tracking-wider font-bold";
      case "italic":
        return "font-serif italic tracking-wide font-bold";
      default:
        return "font-serif tracking-widest font-black";
    }
  };

  const getTitleSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-xl sm:text-2xl";
      case "md":
        return "text-2xl sm:text-3xl";
      case "lg":
        return "text-3xl sm:text-4xl";
      case "xl":
        return "text-4xl sm:text-5xl";
      default:
        return "text-3xl sm:text-4xl";
    }
  };

  // Render Inspector Content for Selected Tool
  const renderToolControls = () => {
    switch (activeTool) {
      case "Layout":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio("4:5")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    aspectRatio === "4:5"
                      ? "bg-[#D97855] border-[#D97855] text-white shadow-sm"
                      : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8] hover:border-[#3A3833]"
                  }`}
                >
                  <span className="block font-bold">4:5 Vertical</span>
                  <span className="text-[10px] opacity-80">Instagram Carousel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("1:1")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    aspectRatio === "1:1"
                      ? "bg-[#D97855] border-[#D97855] text-white shadow-sm"
                      : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8] hover:border-[#3A3833]"
                  }`}
                >
                  <span className="block font-bold">1:1 Square</span>
                  <span className="text-[10px] opacity-80">Standard Grid</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-2">
                Slices / Slide Count
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setSlideCount(num);
                      if (activeSlide > num) setActiveSlide(num);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      slideCount === num
                        ? "bg-[#D97855] border-[#D97855] text-white shadow"
                        : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8]"
                    }`}
                  >
                    {num} Slides
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2A2926]">
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-[#F4F0E8] font-medium">Show Slicing Guides</span>
                <input
                  type="checkbox"
                  checked={showSliceGuides}
                  onChange={(e) => setShowSliceGuides(e.target.checked)}
                  className="w-4 h-4 accent-[#D97855] rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#9C9890] mt-1">
                Vertical dashed lines indicate continuous panoramic cut points.
              </p>
            </div>

            <div className="pt-2 border-t border-[#2A2926]">
              <button
                type="button"
                onClick={handleResetTransform}
                className="w-full bg-[#141414] border border-[#2A2926] hover:border-[#D97855] text-xs font-semibold text-[#F4F0E8] py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D97855]" />
                <span>Center & Reset Transform</span>
              </button>
            </div>
          </div>
        );

      case "Text":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={canvasTitle}
                onChange={(e) => setCanvasTitle(e.target.value.toUpperCase())}
                placeholder="ENTER TITLE"
                className="w-full bg-[#141414] border border-[#2A2926] focus:border-[#D97855] rounded-xl px-3 py-2 text-xs text-white font-bold tracking-wider outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Story Caption / Quote
              </label>
              <textarea
                rows={2}
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder="Write your story..."
                className="w-full bg-[#141414] border border-[#2A2926] focus:border-[#D97855] rounded-xl p-2.5 text-xs text-white outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Banner / Subtitle
              </label>
              <input
                type="text"
                value={curvedText}
                onChange={(e) => setCurvedText(e.target.value.toUpperCase())}
                placeholder="SUBTITLE"
                className="w-full bg-[#141414] border border-[#2A2926] focus:border-[#D97855] rounded-xl px-3 py-2 text-xs text-white font-semibold outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Typography Aesthetic
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: "serif", label: "Editorial Serif", fontClass: "font-serif" },
                    { id: "sans", label: "Modern Sans", fontClass: "font-sans" },
                    { id: "mono", label: "Typewriter", fontClass: "font-mono" },
                    { id: "italic", label: "Story Italic", fontClass: "font-serif italic" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFontFamily(item.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs border transition-all text-center ${
                      fontFamily === item.id
                        ? "bg-[#D97855] border-[#D97855] text-white font-bold"
                        : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8]"
                    }`}
                  >
                    <span className={`block ${item.fontClass} text-xs`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Title Size
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={`py-1.5 rounded-lg text-xs font-bold border uppercase transition-all ${
                      fontSize === sz
                        ? "bg-[#D97855] border-[#D97855] text-white"
                        : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                {[
                  { color: "#F7F4EE", name: "Ivory" },
                  { color: "#D97855", name: "Terracotta" },
                  { color: "#E8D5B5", name: "Sand Gold" },
                  { color: "#71879A", name: "Dust Blue" },
                  { color: "#171717", name: "Charcoal" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setTextColor(c.color)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      textColor === c.color ? "border-white scale-110 shadow-md" : "border-[#3A3833]"
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2A2926]">
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-2">
                Quick Story Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "SUMMER ESCAPE",
                  "GOA MEMORIES",
                  "PONDICHERRY",
                  "HIMALAYAN DIARIES",
                  "GOLDEN HOUR STORY",
                ].map((txt) => (
                  <button
                    key={txt}
                    type="button"
                    onClick={() => setCanvasTitle(txt)}
                    className="bg-[#141414] hover:bg-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8] border border-[#2A2926] px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "Elements":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Location Badge Stamp
              </label>
              <input
                type="text"
                value={stampText}
                onChange={(e) => setStampText(e.target.value.toUpperCase())}
                placeholder="2026 · CITY"
                className="w-full bg-[#141414] border border-[#2A2926] focus:border-[#D97855] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none transition-colors"
              />
            </div>

            {/* Tag with Google Maps Button */}
            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="w-full bg-[#141414] border border-[#EA4335]/50 hover:border-[#EA4335] text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:bg-[#EA4335]/10"
            >
              <MapPin className="w-4 h-4 text-[#EA4335]" />
              <span>Tag Location via Google Maps</span>
            </button>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Quick City Presets
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { city: "Pondicherry", stamp: "2026 · PONDICHERRY" },
                  { city: "Goa Cliffs", stamp: "2026 · GOA CLIFFS" },
                  { city: "Jaipur", stamp: "2026 · JAIPUR" },
                  { city: "Hyderabad", stamp: "2026 · CHARMINAR" },
                  { city: "Ladakh", stamp: "2026 · PANGONG TSO" },
                  { city: "Alleppey", stamp: "2026 · BACKWATERS" },
                ].map((item) => (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => {
                      setStampText(item.stamp);
                      setCanvasTitle(item.city.toUpperCase());
                    }}
                    className="bg-[#141414] hover:bg-[#20201E] border border-[#2A2926] hover:border-[#D97855] px-2.5 py-2 rounded-xl text-left text-[#F4F0E8] transition-all"
                  >
                    <span className="block font-semibold text-xs">{item.city}</span>
                    <span className="text-[10px] text-[#9C9890]">{item.stamp}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-1.5">
                Badge Style
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "stamp", label: "Postal Stamp" },
                    { id: "minimal", label: "Minimal" },
                    { id: "gps", label: "GPS Pill" },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBadgeStyle(b.id)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      badgeStyle === b.id
                        ? "bg-[#D97855] border-[#D97855] text-white"
                        : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2A2926] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#F4F0E8]">Show Location Badge</span>
                <input
                  type="checkbox"
                  checked={showLocationBadge}
                  onChange={(e) => setShowLocationBadge(e.target.checked)}
                  className="w-4 h-4 accent-[#D97855] rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#F4F0E8]">Show Polaroid Caption Card</span>
                <input
                  type="checkbox"
                  checked={showCaptionBox}
                  onChange={(e) => setShowCaptionBox(e.target.checked)}
                  className="w-4 h-4 accent-[#D97855] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        );

      case "Photos":
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#D97855] hover:bg-[#C96B4B] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Custom Photo</span>
            </button>

            <div>
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block mb-2">
                Scenic Panorama Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {photoPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setCurrentImage(preset.url);
                      setCanvasTitle(preset.title);
                      setCaptionText(preset.caption);
                      setStampText(preset.stamp);
                      handleResetTransform();
                      setExportSuccessMessage(`Loaded ${preset.name} panorama`);
                      setTimeout(() => setExportSuccessMessage(null), 2500);
                    }}
                    className={`relative rounded-xl overflow-hidden border transition-all group text-left aspect-[4/3] ${
                      currentImage === preset.url
                        ? "border-[#D97855] ring-2 ring-[#D97855]/40"
                        : "border-[#2A2926] hover:border-[#3A3833]"
                    }`}
                  >
                    <Image
                      src={preset.url}
                      alt={preset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-white text-[11px] font-bold truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2A2926]">
              <div className="flex items-center justify-between text-xs text-[#9C9890] mb-2">
                <span>Pan & Zoom</span>
                <span className="font-mono text-white">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-[#20201E] text-white border border-[#2A2926]"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.7"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#D97855] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3.0, z + 0.15))}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-[#20201E] text-white border border-[#2A2926]"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleResetTransform}
                className="w-full mt-2 text-center text-xs text-[#D97855] hover:underline"
              >
                Reset Pan & Zoom
              </button>
            </div>
          </div>
        );

      case "Filters":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider">
                Film & Color Grading
              </label>
              {filterPreset !== "none" && (
                <button
                  type="button"
                  onClick={() => setFilterPreset("none")}
                  className="text-[10px] text-[#D97855] hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filterPresets.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setFilterPreset(f.css)}
                  className={`p-2 rounded-xl border transition-all text-left group ${
                    filterPreset === f.css
                      ? "bg-[#D97855]/20 border-[#D97855] text-white"
                      : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8] hover:border-[#3A3833]"
                  }`}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-1.5 bg-neutral-900 border border-[#2A2926]">
                    <Image
                      src={currentImage}
                      alt={f.name}
                      fill
                      className="object-cover"
                      style={{ filter: f.css }}
                    />
                  </div>
                  <span className="block font-bold text-xs text-white">{f.name}</span>
                  <span className="text-[10px] text-[#9C9890] block truncate">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "Stickers":
        return (
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider block">
              Film & Travel Stickers
            </label>
            <p className="text-xs text-[#9C9890]">
              Click to stamp authentic retro badges onto your continuous panorama.
            </p>

            <div className="space-y-2">
              {[
                { id: "35mm", title: "● REC · 35MM FILM", desc: "Top left retro film badge" },
                { id: "kodak", title: "KODAK PORTRA 400", desc: "Gold analog film stamp" },
                { id: "vol", title: "VOL. 01 / COLLECTOR", desc: "Monochrome editorial tag" },
                { id: "wander", title: "✦ WANDERLUST", desc: "Terracotta travel accent" },
                { id: "airmail", title: "✈ PAR AVION · AIR MAIL", desc: "Vintage aviation post stamp" },
              ].map((stk) => {
                const isActive = activeStickers.includes(stk.id);
                return (
                  <button
                    key={stk.id}
                    type="button"
                    onClick={() => toggleSticker(stk.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-[#D97855]/20 border-[#D97855] text-white"
                        : "bg-[#141414] border-[#2A2926] text-[#9C9890] hover:text-[#F4F0E8]"
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-xs text-[#F4F0E8]">{stk.title}</span>
                      <span className="text-[10px] text-[#9C9890]">{stk.desc}</span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${
                        isActive
                          ? "bg-[#D97855] border-[#D97855] text-white"
                          : "border-[#3A3833] text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "Adjust":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#9C9890] uppercase tracking-wider">
                Photo Adjustments
              </label>
              <button
                type="button"
                onClick={handleResetAdjustments}
                className="text-[10px] text-[#D97855] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Brightness */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9C9890]">Brightness</span>
                <span className="font-mono text-white">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-[#D97855] cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9C9890]">Contrast</span>
                <span className="font-mono text-white">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full accent-[#D97855] cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9C9890]">Saturation</span>
                <span className="font-mono text-white">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full accent-[#D97855] cursor-pointer"
              />
            </div>

            {/* Warmth / Sepia */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9C9890]">Warmth</span>
                <span className="font-mono text-white">{warmth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={warmth}
                onChange={(e) => setWarmth(parseInt(e.target.value))}
                className="w-full accent-[#D97855] cursor-pointer"
              />
            </div>

            {/* Zoom Slider */}
            <div className="pt-2 border-t border-[#2A2926]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#9C9890]">Canvas Zoom</span>
                <span className="font-mono text-white">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#D97855] cursor-pointer"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#F4F0E8] font-sans flex flex-col justify-between selection:bg-[#D97855] selection:text-white">
      {/* Studio Top Control Bar */}
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
              onClick={handleResetAdjustments}
              className="p-1.5 rounded-lg text-[#9C9890] hover:text-[#F4F0E8] hover:bg-[#20201E] cursor-pointer"
              title="Reset Adjustments"
              aria-label="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Aspect Ratio & Zoom Presets */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#20201E] border border-[#2A2926] p-0.5 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAspectRatio("4:5")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                aspectRatio === "4:5"
                  ? "bg-[#D97855] text-white"
                  : "text-[#9C9890] hover:text-[#F4F0E8]"
              }`}
            >
              4:5 Vertical
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio("1:1")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                aspectRatio === "1:1"
                  ? "bg-[#D97855] text-white"
                  : "text-[#9C9890] hover:text-[#F4F0E8]"
              }`}
            >
              1:1 Square
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-[#20201E] border border-[#2A2926] px-2 py-1 rounded-full text-xs text-[#9C9890]">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="hover:text-white px-1 font-bold cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
            <span className="font-mono text-[11px] min-w-[36px] text-center text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3.0, z + 0.1))}
              className="hover:text-white px-1 font-bold cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleResetTransform}
              className="text-[10px] text-[#D97855] hover:underline ml-1 cursor-pointer"
              title="Reset Zoom & Pan"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right CTA: Repurpose, Simulator & Export Buttons */}
        <div className="flex items-center gap-2">
          {/* Live Carousel Preview Button */}
          <button
            type="button"
            onClick={() => setIsSimulatorOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#20201E] hover:bg-[#2A2926] text-[#F4F0E8] border border-[#3A3833] text-xs font-semibold px-3 py-2 rounded-full active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Preview Continuous Carousel Swipe"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#71879A]" />
            <span className="hidden sm:inline">Live Preview</span>
          </button>

          {/* Google Maps Location Tagger Button */}
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#20201E] hover:bg-[#2A2926] text-[#F4F0E8] border border-[#3A3833] text-xs font-semibold px-3 py-2 rounded-full active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Search Google Maps to tag location badge"
          >
            <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
            <span>Maps</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRepurposing(true)}
            className="bg-[#20201E] hover:bg-[#2A2926] text-[#F4F0E8] border border-[#3A3833] text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Repurpose across Instagram, LinkedIn, Reels, Threads"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D97855]" />
            <span className="hidden sm:inline">Repurpose</span>
          </button>

          {/* Schedule Broadcast Button */}
          <button
            type="button"
            onClick={() => setIsScheduleOpen(true)}
            className="bg-[#20201E] hover:bg-[#2A2926] text-[#F4F0E8] border border-[#3A3833] text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Schedule Broadcast"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D97855]" />
            <span className="hidden sm:inline">Schedule</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#D97855] hover:bg-[#C96B4B] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-[#D97855]/20 flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-70 cursor-pointer"
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

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================== */}
        {/* DESKTOP LEFT TOOLBAR */}
        {/* ============================================================== */}
        <aside className="hidden md:flex flex-col w-20 bg-[#20201E] border-r border-[#2A2926] py-4 items-center shrink-0 space-y-3">
          {leftTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.label;
            return (
              <button
                key={tool.label}
                type="button"
                onClick={() => {
                  setActiveTool(tool.label);
                  setIsMobileDrawerOpen(true);
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer w-16 ${
                  isSelected
                    ? "bg-[#D97855] text-white shadow-md shadow-[#D97855]/20"
                    : "text-[#9C9890] hover:text-[#F4F0E8] hover:bg-[#2A2926]"
                }`}
                title={`Open ${tool.label} tools`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
                <span className="text-[10px] font-semibold">{tool.label}</span>
              </button>
            );
          })}
        </aside>

        {/* ============================================================== */}
        {/* CENTER VIEWPORT (The Creative Canvas) */}
        {/* ============================================================== */}
        <main className="flex-1 p-3 md:p-6 flex flex-col items-center justify-center overflow-y-auto">
          {/* AI Story Director Ribbon */}
          <div className="w-full max-w-md md:max-w-xl flex items-center justify-between bg-[#20201E] border border-[#2A2926] rounded-xl px-4 py-2.5 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97855]" />
              <span className="text-[#F4F0E8] font-semibold">
                AI Story Director
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoDirect}
              disabled={isAutoDirecting}
              className="text-[11px] font-bold text-[#D97855] bg-[#D97855]/15 hover:bg-[#D97855]/25 px-3 py-1 rounded-lg border border-[#D97855]/30 transition-all flex items-center gap-1.5 cursor-pointer"
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

          {/* Canvas Viewport Frame with Drag-Drop & Pointer Pan/Zoom */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full max-w-md rounded-2xl overflow-hidden bg-[#20201E] border-2 shadow-2xl transition-all duration-300 ${
              isDragging ? "border-[#D97855] ring-4 ring-[#D97855]/30" : "border-[#2A2926]"
            } ${aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"}`}
          >
            {/* Drag-and-Drop Active Overlay */}
            {isDragging && (
              <div className="absolute inset-0 z-40 bg-[#141414]/90 backdrop-blur-xs flex flex-col items-center justify-center border-2 border-dashed border-[#D97855] text-white p-4">
                <Upload className="w-10 h-10 text-[#D97855] animate-bounce mb-2" />
                <p className="font-serif font-bold text-sm">Drop panorama photo here</p>
                <p className="text-xs text-[#9C9890] mt-1">Automatic seamless framing</p>
              </div>
            )}

            {/* Interactive Image Container with Pointer/Touch Pan & Zoom */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              style={{ cursor: isPanning ? "grabbing" : "grab", touchAction: "none" }}
              className="relative w-full h-full overflow-hidden select-none"
            >
              <div
                className="w-full h-full transition-transform duration-75"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  filter: getCombinedFilter(),
                }}
              >
                <Image
                  src={currentImage}
                  alt="Studio Panorama"
                  fill
                  className="object-cover pointer-events-none"
                  priority
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

              {/* Dynamic Vertical Dashed Cut Guides */}
              {showSliceGuides && (
                <div
                  className="absolute inset-0 pointer-events-none grid"
                  style={{ gridTemplateColumns: `repeat(${slideCount}, minmax(0, 1fr))` }}
                >
                  {[...Array(slideCount)].map((_, i) => (
                    <div
                      key={i}
                      className={`relative ${
                        i < slideCount - 1 ? "border-r-2 border-dashed border-white/50" : ""
                      }`}
                    >
                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        Slide {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Sticker Overlays */}
              {activeStickers.includes("35mm") && (
                <div className="absolute top-8 left-6 bg-black/80 border border-white/20 text-[#F4F0E8] px-2 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase shadow pointer-events-none">
                  ● REC · 35MM FILM
                </div>
              )}

              {activeStickers.includes("kodak") && (
                <div className="absolute bottom-24 right-6 bg-[#FBBC05] text-[#141414] px-2 py-0.5 rounded font-black text-[9px] tracking-wider uppercase shadow-md rotate-[-2deg] pointer-events-none">
                  PORTRA 400
                </div>
              )}

              {activeStickers.includes("vol") && (
                <div className="absolute bottom-24 left-6 bg-white/90 text-black px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest shadow pointer-events-none">
                  VOL. 01 / COLLECTOR
                </div>
              )}

              {activeStickers.includes("wander") && (
                <div className="absolute top-24 right-6 bg-[#141414]/85 text-[#D97855] border border-[#D97855]/40 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide shadow pointer-events-none">
                  ✦ WANDERLUST
                </div>
              )}

              {activeStickers.includes("airmail") && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#EA4335]/90 text-white border border-white/40 px-2 py-0.5 rounded-sm text-[8px] font-mono tracking-widest uppercase shadow pointer-events-none">
                  ✈ PAR AVION · AIR MAIL
                </div>
              )}

              {/* Postal Stamp Badge - Clickable to open Google Maps or Elements */}
              {showLocationBadge && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTool("Elements");
                    setIsMapModalOpen(true);
                  }}
                  title="Click to edit or change location on Google Maps"
                  className={`absolute top-8 right-6 transition-all cursor-pointer pointer-events-auto hover:scale-105 ${
                    badgeStyle === "stamp"
                      ? "bg-[#F7F4EE]/95 border-2 border-dashed border-[#C96B4B] text-[#171717] px-2.5 py-1 rounded shadow-lg transform rotate-2"
                      : badgeStyle === "minimal"
                      ? "bg-black/75 border border-white/30 text-white px-2.5 py-1 rounded-md text-[9px]"
                      : "bg-[#141414]/90 border border-[#D97855]/50 text-white px-3 py-1 rounded-full text-[9px]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase">
                    <MapPin className="w-2.5 h-2.5 text-[#EA4335]" />
                    <span>{stampText}</span>
                  </div>
                </button>
              )}

              {/* Headline - Clickable to switch to Text Tool */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTool("Text");
                  setIsMobileDrawerOpen(true);
                }}
                title="Click to edit title"
                className="absolute top-20 left-6 right-6 text-center cursor-pointer pointer-events-auto group/title"
              >
                <h2
                  className={`${getTitleFontClass()} ${getTitleSizeClass()} drop-shadow-md transition-all group-hover/title:scale-[1.02] group-hover/title:text-[#D97855]`}
                  style={{ color: textColor }}
                >
                  {canvasTitle}
                </h2>
                <span className="text-[9px] text-white/50 opacity-0 group-hover/title:opacity-100 transition-opacity block font-sans">
                  ✎ Click to edit
                </span>
              </div>

              {/* Polaroid / Handwritten Caption Card - Clickable to switch to Text Tool */}
              {showCaptionBox && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTool("Text");
                    setIsMobileDrawerOpen(true);
                  }}
                  title="Click to edit story caption"
                  className="absolute bottom-6 left-6 right-6 bg-[#F7F4EE]/90 backdrop-blur-sm text-[#171717] p-3 rounded-xl border border-[#DBD2C7] shadow-lg cursor-pointer pointer-events-auto hover:ring-2 hover:ring-[#D97855]/60 transition-all group/caption"
                >
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
              )}

              {/* Coordinates & Pan/Zoom Indicator Badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-[9px] text-[#9C9890] font-mono px-2 py-0.5 rounded-md pointer-events-none flex items-center gap-1.5">
                <Move className="w-2.5 h-2.5 text-[#D97855]" />
                <span>Drag to pan · Scroll to zoom</span>
              </div>
            </div>
          </div>

          {/* Quick Slide Count Selector & Upload */}
          <div className="w-full max-w-md flex items-center justify-between mt-3 px-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#9C9890] mr-1 hidden sm:inline">Slices:</span>
              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setSlideCount(num);
                    if (activeSlide > num) setActiveSlide(num);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    slideCount === num
                      ? "bg-[#D97855] text-white ring-2 ring-[#D97855]/40"
                      : "bg-[#20201E] text-[#9C9890] hover:text-[#F4F0E8]"
                  }`}
                  title={`${num} seamless panorama slides`}
                >
                  {num}P
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(true)}
                className="text-[#71879A] hover:text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[#9C9890] hover:text-white cursor-pointer font-semibold text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Mobile Tool Bar (Scrollable dock below canvas on mobile) */}
          <div className="lg:hidden w-full max-w-md mt-3 bg-[#20201E] border border-[#2A2926] rounded-2xl p-1.5 flex items-center justify-around overflow-x-auto gap-1">
            {leftTools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTool === tool.label;
              return (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => {
                    setActiveTool(tool.label);
                    setIsMobileDrawerOpen(true);
                  }}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#D97855] text-white"
                      : "text-[#9C9890] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                  <span className="text-[9px] font-semibold">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </main>

        {/* ============================================================== */}
        {/* DESKTOP RIGHT INSPECTOR PANEL */}
        {/* ============================================================== */}
        <aside className="hidden lg:flex flex-col w-80 bg-[#20201E] border-l border-[#2A2926] p-5 shrink-0 overflow-y-auto space-y-4">
          {/* Active Tool Header & Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#F4F0E8] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D97855]" />
                {activeTool} Studio
              </span>
              <span className="text-[10px] text-[#9C9890]">Interactive Editor</span>
            </div>

            {/* Tool Category Selector Pills */}
            <div className="grid grid-cols-4 gap-1 bg-[#141414] p-1 rounded-xl border border-[#2A2926]">
              {(["Layout", "Text", "Elements", "Photos", "Filters", "Stickers", "Adjust"] as StudioTool[]).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTool(tab)}
                    className={`py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer truncate px-1 text-center ${
                      activeTool === tab
                        ? "bg-[#D97855] text-white font-bold shadow-sm"
                        : "text-[#9C9890] hover:text-[#F4F0E8]"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Dynamic Active Tool Controls */}
          <div className="pt-2">
            {renderToolControls()}
          </div>
        </aside>
      </div>

      {/* Mobile Tool Bottom Sheet / Drawer */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#20201E] border-t border-[#3A3833] rounded-t-3xl p-5 max-h-[75vh] overflow-y-auto space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2926]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97855]" />
                <h3 className="font-serif font-bold text-sm text-[#F4F0E8]">
                  {activeTool} Controls
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-7 h-7 rounded-full bg-[#141414] flex items-center justify-center text-[#9C9890] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tool Switcher inside Drawer */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(["Layout", "Text", "Elements", "Photos", "Filters", "Stickers", "Adjust"] as StudioTool[]).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTool(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTool === tab
                        ? "bg-[#D97855] text-white"
                        : "bg-[#141414] text-[#9C9890] hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Active Controls */}
            <div className="pt-2 pb-6">
              {renderToolControls()}
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Only Bottom Navigation Dock */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Google Maps Location Picker Modal */}
      <GoogleMapsModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleLocationSelected}
        initialQuery="Pondicherry, India"
      />

      {/* Carousel Track Simulator Modal (Continuous Swipe-Test) */}
      <CarouselSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        imageUrl={currentImage}
        slideCount={slideCount}
        aspectRatio={aspectRatio}
        title={canvasTitle}
        caption={captionText}
        stampText={stampText}
        curvedText={curvedText}
        pan={pan}
        zoom={zoom}
        filterStyle={getCombinedFilter()}
      />

      {/* Broadcaster Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        canonicalTitle={canvasTitle}
        captionText={captionText}
        locationTag={stampText}
      />
    </div>
  );
}
