"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Brain,
  Sparkles,
  Target,
  Compass,
  Palette,
  Check,
  UserCheck,
  Layers,
  ArrowRight,
} from "lucide-react";

export interface CreatorProfileData {
  name: string;
  role: string;
  niche: string;
  audience: string;
  tone: string;
  goal: string;
  pillars: string[];
  avatar: string;
  paletteColors: string[];
}

export const PRESET_PROFILES: Record<string, CreatorProfileData> = {
  ananya: {
    name: "Ananya",
    role: "Visual Storyteller & Traveler",
    niche: "Travel & Visual Storytelling",
    audience: "Aesthetic-conscious creators, slow travelers, 22–34 yo seeking mindful escapes.",
    tone: "Introspective, sensory, unhurried, 35mm warm nostalgic.",
    goal: "High swipe retention & community saves (Target >15%).",
    pillars: [
      "Hidden Coastal Alleys & Heritage Architecture",
      "Slow Sunday Coffee & Local Bookstore Studies",
      "Authentic Regional Street Corners",
    ],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    paletteColors: ["#C96B4B", "#F7F4EE", "#60735A", "#171717"],
  },
  aarav: {
    name: "Aarav",
    role: "Tech & Product Architect",
    niche: "Tech, AI & Startup Building",
    audience: "Engineers, founders, tech enthusiasts looking for deep technical clarity.",
    tone: "Analytical, crisp, design-forward, actionable systems.",
    goal: "Authority building & newsletter subscriber conversion.",
    pillars: [
      "Full-Stack Architecture & Cloud Run Teardowns",
      "AI Engineering Systems & Multimodal Pipelines",
      "Solo Builder Economics & Zero-Egress Storage",
    ],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    paletteColors: ["#2B4C7E", "#F4ECE4", "#D97855", "#141414"],
  },
  meera: {
    name: "Meera",
    role: "Culinary & Culture Chronicler",
    niche: "Food, Heritage & Sensory Culture",
    audience: "Food lovers, cultural explorers, travelers searching for authentic recipes.",
    tone: "Vibrant, evocative, warm hospitality, generational heritage.",
    goal: "Viral regional reach and high comment engagement.",
    pillars: [
      "Old City Irani Chai & Breakfast Heritage",
      "Slow Clay-Pot Cooking & Forgotten Spices",
      "Street Vendors Behind the City's Iconic Dishes",
    ],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    paletteColors: ["#C6A15B", "#F7F4EE", "#C96B4B", "#20201E"],
  },
};

interface CreatorBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileChange?: (profile: CreatorProfileData) => void;
}

export default function CreatorBrainModal({
  isOpen,
  onClose,
  onProfileChange,
}: CreatorBrainModalProps) {
  const [selectedKey, setSelectedKey] = useState<string>("ananya");
  const [profile, setProfile] = useState<CreatorProfileData>(PRESET_PROFILES.ananya);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nuframe_active_profile");
    if (saved && PRESET_PROFILES[saved]) {
      setSelectedKey(saved);
      setProfile(PRESET_PROFILES[saved]);
    }
  }, []);

  const handleSelectPreset = (key: string) => {
    setSelectedKey(key);
    const newProfile = PRESET_PROFILES[key];
    setProfile(newProfile);
    localStorage.setItem("nuframe_active_profile", key);
    if (onProfileChange) {
      onProfileChange(newProfile);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1C1B19] border border-[#C96B4B]/40 text-[#F7F4EE] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2926] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C96B4B] flex items-center justify-center text-white shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Creator Knowledge Brain
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C96B4B]/20 text-[#D97855] border border-[#C96B4B]/30">
                  PRD Core
                </span>
              </div>
              <p className="text-xs text-[#9C9890] mt-0.5">
                Inspectable creator context that drives the Multimodal AI Director
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

        {/* Preset Persona Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#9C9890]">
            Switch Active Creator Persona (Instant Context Adaptation)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(PRESET_PROFILES).map(([key, item]) => {
              const isSelected = selectedKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#C96B4B]/15 border-[#C96B4B] shadow-sm"
                      : "bg-[#242320] border-[#33312C] hover:border-[#6F6A62]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden relative shrink-0">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F7F4EE] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#9C9890] truncate max-w-[75px]">
                        {item.niche.split("&")[0]}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-bold text-[#D97855] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active Brain
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Knowledge Profile Cards */}
        <div className="space-y-3.5 bg-[#242320] p-4 rounded-2xl border border-[#33312C] text-xs">
          {/* Audience & Niche */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97855] flex items-center gap-1">
              <Compass className="w-3 h-3" /> Target Audience & Niche
            </span>
            <p className="text-[#E6E1D8] leading-relaxed">
              <strong>{profile.niche}</strong> — {profile.audience}
            </p>
          </div>

          {/* Content Pillars */}
          <div className="space-y-1 pt-2 border-t border-[#33312C]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97855] flex items-center gap-1">
              <Layers className="w-3 h-3" /> Content Pillars
            </span>
            <ul className="space-y-1 text-[#DBD2C7] pl-1">
              {profile.pillars.map((pillar, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#C96B4B] font-bold">0{i + 1}.</span>
                  <span>{pillar}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tone & Brand Guidance */}
          <div className="space-y-1 pt-2 border-t border-[#33312C]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97855] flex items-center gap-1">
              <Palette className="w-3 h-3" /> Brand Tone & Aesthetic Guidance
            </span>
            <p className="text-[#DBD2C7] italic">"{profile.tone}"</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-[#9C9890]">Palette Tokens:</span>
              <div className="flex items-center gap-1.5">
                {profile.paletteColors.map((color, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-white/20 inline-block"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Primary Growth Goal */}
          <div className="space-y-1 pt-2 border-t border-[#33312C]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97855] flex items-center gap-1">
              <Target className="w-3 h-3" /> Strategic Objective
            </span>
            <p className="text-[#60735A] font-semibold">{profile.goal}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#60735A] font-semibold">
            {isSaved ? "✓ Profile Saved to Creator Brain" : "Synced with AI Content Director"}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#C96B4B] hover:bg-[#B3593B] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Done</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
