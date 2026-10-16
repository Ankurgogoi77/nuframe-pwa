"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Layers,
  FolderClosed,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export interface TourStep {
  targetSelector: string;
  title: string;
  description: string;
  proTip: string;
  category: string;
  position?: "bottom" | "top" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="brand-logo"]',
    title: "Welcome to NuFrame Creator OS",
    description:
      "Your complete workspace to capture, journal, direct, and publish visual stories. Built with a Warm Editorial aesthetic tailored for modern creators.",
    proTip: "NuFrame works seamlessly as a Mobile PWA on your phone and as a wide-screen desktop workstation.",
    category: "CREATOR OS",
    position: "bottom",
  },
  {
    targetSelector: '[data-tour="ai-director-banner"]',
    title: "Multimodal AI Director",
    description:
      "Upload 3–5 pictures from your camera roll. NuFrame AI analyzes lighting, palette, mood, and drafts structured 3-slide panoramic carousel hooks.",
    proTip: "Our multimodal engine detects retro film grain, golden hour light, and automatically matches postal stamp dates.",
    category: "AI DIRECTOR",
    position: "bottom",
  },
  {
    targetSelector: '[data-tour="quick-actions"]',
    title: "Seamless Panoramic Studio",
    description:
      "Quickly launch into Carousel, Journal, Story, or Collage modes. Cut panoramic images into seamless 4:5 vertical or 1:1 square multi-slide carousels.",
    proTip: "4:5 vertical ratio occupies 92% of the mobile phone screen, delivering 2.4x higher swipe retention.",
    category: "STUDIO",
    position: "bottom",
  },
  {
    targetSelector: '[data-tour="trend-radar"]',
    title: "Regional Trend Radar",
    description:
      "Live data intelligence tracking rising vs fatigued formats across Hyderabad, Telangana, India, and global hubs with MAKE IT / ADAPT IT / SKIP decisions.",
    proTip: "Filter out over-saturated formats before spending hours shooting. Spot exploding audio hooks early.",
    category: "TREND INTELLIGENCE",
    position: "right",
  },
  {
    targetSelector: '[data-tour="creator-vault"]',
    title: "Cloud Creator Vault & R2 Storage",
    description:
      "Organize high-resolution RAW captures and exports backed by Cloudflare R2 with zero egress fees and Google Cloud readiness.",
    proTip: "Connect your storage to sync drafts across your mobile phone and desktop workstation instantly.",
    category: "STORAGE & VAULT",
    position: "right",
  },
  {
    targetSelector: '[data-tour="chatbot-trigger"]',
    title: "AI Creative Assistant Chatbot",
    description:
      "Need quick carousel hooks, lighting advice, or regional trend insights? Tap the AI Assistant anytime to brainstorm on the fly.",
    proTip: "Ask the assistant to 'Draft a 3-slide hook' or 'Explain the Sunday Study trend' for instant answers.",
    category: "ASSISTANT",
    position: "top",
  },
];

export default function TutorialTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Check if tour should run on initial visit or when triggered
  useEffect(() => {
    const handleStartTour = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };

    window.addEventListener("start-nuframe-tour", handleStartTour);

    // Auto-prompt tour on first visit after a short delay
    const hasSeenTour = localStorage.getItem("nuframe_tour_seen");
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("start-nuframe-tour", handleStartTour);
    };
  }, []);

  // Update target bounding box
  const updateTargetRect = useCallback(() => {
    if (!isOpen) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    const el = document.querySelector(step.targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      // Fallback center box if selector not visible on current screen size
      setTargetRect({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 150,
        width: 300,
        height: 200,
        bottom: window.innerHeight / 2 + 100,
        right: window.innerWidth / 2 + 150,
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 - 100,
        toJSON: () => {},
      } as DOMRect);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [updateTargetRect, isOpen]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("nuframe_tour_seen", "true");
  };

  if (!isOpen || !targetRect) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  // Calculate Tooltip position to stay within viewport bounds
  const tooltipWidth = 360;
  const tooltipHeight = 240;
  const padding = 16;

  let top = targetRect.bottom + padding;
  let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

  // Keep within horizontal screen bounds
  if (left < padding) left = padding;
  if (left + tooltipWidth > window.innerWidth - padding) {
    left = window.innerWidth - tooltipWidth - padding;
  }

  // If tooltip overflows bottom, place it above target
  if (top + tooltipHeight > window.innerHeight - padding) {
    top = targetRect.top - tooltipHeight - padding;
  }
  if (top < padding) top = padding;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Darkened Spotlight Backdrop Cutout */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300"
        style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }}
      >
        <defs>
          <mask id="spotlight-mask">
            {/* White covers all (opaque) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout reveals highlighted element */}
            <rect
              x={targetRect.left - 6}
              y={targetRect.top - 6}
              width={targetRect.width + 12}
              height={targetRect.height + 12}
              rx="16"
              fill="black"
            />
          </mask>
        </defs>
        {/* Semi-transparent dark overlay with mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 14, 12, 0.78)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Glowing Spotlight Focus Ring */}
      <div
        className="absolute pointer-events-none rounded-2xl border-2 border-[#C96B4B] shadow-[0_0_25px_rgba(201,107,75,0.6)] animate-pulse transition-all duration-300"
        style={{
          top: targetRect.top - 6,
          left: targetRect.left - 6,
          width: targetRect.width + 12,
          height: targetRect.height + 12,
        }}
      />

      {/* Interactive Tooltip Card */}
      <div
        className="absolute z-[101] bg-[#1C1B19] text-[#F7F4EE] border border-[#C96B4B]/40 rounded-3xl p-5 shadow-2xl transition-all duration-300 w-[92vw] max-w-[380px]"
        style={{ top, left }}
      >
        {/* Header: Category Badge & Step Counter & Close */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#C96B4B]/20 text-[#D97855] border border-[#C96B4B]/30">
              {step.category}
            </span>
            <span className="text-xs text-[#9C9890] font-medium">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1 text-[#9C9890] hover:text-[#F7F4EE] transition-colors rounded-lg"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-[#F7F4EE] mb-1.5 flex items-center gap-2">
          <span>{step.title}</span>
        </h3>

        {/* Description */}
        <p className="text-xs text-[#DBD2C7] leading-relaxed mb-3">
          {step.description}
        </p>

        {/* Pro Creator Tip Box */}
        <div className="bg-[#242320] border border-[#33312C] rounded-2xl p-3 mb-4 flex items-start gap-2.5 text-xs text-[#E6E1D8]">
          <Lightbulb className="w-4 h-4 text-[#C96B4B] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[#D97855]">Pro Tip: </span>
            {step.proTip}
          </div>
        </div>

        {/* Footer: Progress Dots & Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#2A2926]">
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-5 bg-[#C96B4B]"
                    : "w-1.5 bg-[#33312C]"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-[#242320] hover:bg-[#33312C] text-xs font-semibold text-[#DBD2C7] transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-[#C96B4B] hover:bg-[#B3593B] text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center gap-1"
            >
              <span>{isLast ? "Done" : "Next"}</span>
              {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              {isLast && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
