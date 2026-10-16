"use client";

import { useState } from "react";
import {
  X,
  Layers,
  Copy,
  Check,
  Smartphone,
  Share2,
  FileText,
  Video,
  Sparkles,
  Download,
} from "lucide-react";

interface RepurposeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  canonicalTitle: string;
  canonicalCaption: string;
}

export default function RepurposeDrawer({
  isOpen,
  onClose,
  canonicalTitle,
  canonicalCaption,
}: RepurposeDrawerProps) {
  const [activeTab, setActiveTab] = useState<"instagram" | "linkedin" | "reel" | "thread">("instagram");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const variants = {
    instagram: {
      platform: "Instagram 4:5 Carousel",
      icon: Smartphone,
      badge: "High Swipe Retention",
      format: "3-5 Slices · 1080×1350 px (4:5 Ratio)",
      hook: `"${canonicalTitle}" — The places we pass without really looking.`,
      content: `${canonicalCaption}\n\nFinding stillness in ordinary places. Shot on film, journaled on NuFrame. ✨\n\nSlide 1: Cover Hook\nSlide 2: Panoramic Story Transition\nSlide 3: Reflection & Outro\n\n#NuFrame #VisualJournal #Storytelling #WarmEditorial #35mmVibes`,
      cta: "👉 Swipe across the cutline to reveal the full panorama. Save this for your next weekend escape.",
    },
    linkedin: {
      platform: "LinkedIn Visual Document / PDF",
      icon: FileText,
      badge: "Thought Leadership",
      format: "PDF Slide Carousel · 1080×1080 px",
      hook: `How slowing down my content creation increased audience engagement by 2.4x.`,
      content: `Most content is engineered for fleeting 2-second dopamine.\n\nHere is what happened when I pivoted from rapid neon reels to a structured 35mm visual journal format:\n\n1. Swipe-through rate rose from 38% to 84%.\n2. Saves outpaced likes for the first time.\n3. Conversations shifted from surface reactions to thoughtful replies.\n\nThe takeaway: Modern audiences are fatigued by noise. They crave thoughtful, well-framed visual stillness.`,
      cta: "♻️ Repost if you believe creators should prioritize depth over algorithmic churn.",
    },
    reel: {
      platform: "Short-Form Reel / TikTok Script",
      icon: Video,
      badge: "Fast Discovery",
      format: "Vertical 9:16 · 15–30 Seconds",
      hook: `[Visual: Slow pan over old sandstone arch with chai cup steaming]\nVoiceover: "They say you only truly see a city when you stop rushing through it."`,
      content: `[0:00 - 0:03] Hook: Slow reveal of morning light cutting across the street.\n[0:03 - 0:12] Story Beat: Quick micro-cuts (receipt on wooden table, vintage camera clicking, shadow pattern).\n[0:12 - 0:22] Reflection: "Took 40 photos today. Only kept three. But these three tell the whole story."\n[0:22 - 0:28] Outro: NuFrame Infinite Frame mark fades in.\n\nRecommended Audio: Ambient lo-fi acoustic or warm vinyl static crackle.`,
      cta: "Drop a ☕ if you need a slow morning like this.",
    },
    thread: {
      platform: "X / Threads Visual Thread",
      icon: Share2,
      badge: "Viral Discussion",
      format: "5-Post Mini Thread",
      hook: `I spent 48 hours capturing the unseen corners of the city.\n\nHere are 4 frames that made me rethink what it means to travel slowly: 🧵👇`,
      content: `1/5 The sunlight hits the old promenade differently at 6:40 AM before the city wakes up.\n\n2/5 Rule of thumb: The most memorable photo is usually the one you almost didn't take because you were too busy looking at your phone.\n\n3/5 Film grain adds emotional weight that pristine 4K video simply can't manufacture.\n\n4/5 Frame your stories with intention, not volume.`,
      cta: "Which frame resonates most with you? Check out the full high-res carousel on my profile.",
    },
  };

  const currentVariant = variants[activeTab];
  const Icon = currentVariant.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1C1B19] border border-[#C96B4B]/40 text-[#F7F4EE] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2926] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C96B4B] flex items-center justify-center text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Content Repurposing Agent
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#60735A] border border-[#60735A]/30">
                  FR-07 Ready
                </span>
              </div>
              <p className="text-xs text-[#9C9890] mt-0.5">
                One canonical story &rarr; 4 platform-optimized variants
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9C9890] hover:text-[#F7F4EE] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-[#242320] p-1.5 rounded-2xl border border-[#33312C] text-xs">
          {[
            { key: "instagram", label: "Instagram", icon: Smartphone },
            { key: "linkedin", label: "LinkedIn", icon: FileText },
            { key: "reel", label: "Reels / TikTok", icon: Video },
            { key: "thread", label: "Threads / X", icon: Share2 },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 rounded-xl font-semibold flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? "bg-[#C96B4B] text-white shadow-sm"
                    : "text-[#9C9890] hover:text-[#F7F4EE] hover:bg-[#2A2926]"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span className="text-[10px] truncate max-w-[70px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Variant Card */}
        <div className="bg-[#242320] p-5 rounded-2xl border border-[#33312C] space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-[#D97855]" />
              <span className="font-bold text-sm text-[#F7F4EE]">
                {currentVariant.platform}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#60735A] bg-[#EAF0E6] px-2.5 py-0.5 rounded-full">
              {currentVariant.badge}
            </span>
          </div>

          {/* Hook */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C9890]">
              Optimized Hook
            </span>
            <p className="font-serif text-sm font-semibold text-[#F7F4EE] bg-[#1C1B19] p-3 rounded-xl border border-[#33312C]">
              {currentVariant.hook}
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C9890]">
              Adapted Narrative & Copy
            </span>
            <div className="bg-[#1C1B19] p-3.5 rounded-xl border border-[#33312C] text-[#DBD2C7] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto font-mono text-[11px]">
              {currentVariant.content}
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C9890]">
              Tailored Call to Action (CTA)
            </span>
            <p className="text-[#C96B4B] font-medium bg-[#1C1B19] p-2.5 rounded-xl border border-[#33312C]">
              {currentVariant.cta}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[#9C9890]">
            Linked to canonical project: <strong>{canonicalTitle}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleCopy(
                  `${currentVariant.hook}\n\n${currentVariant.content}\n\n${currentVariant.cta}`,
                  activeTab
                )
              }
              className="px-4 py-2 rounded-xl bg-[#242320] hover:bg-[#33312C] text-xs font-semibold text-[#DBD2C7] border border-[#33312C] transition-all flex items-center gap-1.5"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#60735A]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Variant</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#C96B4B] hover:bg-[#B3593B] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Apply to Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
