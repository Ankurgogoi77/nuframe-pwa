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
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Sliders,
  User,
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

export const GENERIC_PROFILE: CreatorProfileData = {
  name: "Creator",
  role: "Visual Storyteller",
  niche: "Visual Storytelling & Photography",
  audience: "Curious community & visual thinkers",
  tone: "Reflective, observant, natural, editorial",
  goal: "Turn everyday moments into compelling visual stories",
  pillars: [
    "Everyday Architecture & Light",
    "Local Cafes & Streets",
    "Visual Photo Essays",
  ],
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  paletteColors: ["#B85C43", "#71879A", "#60735A", "#171717"],
};

export const PRESET_PROFILES: Record<string, CreatorProfileData> = {
  travel: {
    name: "Travel Storyteller",
    role: "Visual Storyteller & Slow Traveler",
    niche: "Slow Travel & Heritage Architecture",
    audience: "Aesthetic-conscious travelers seeking mindful, authentic journeys.",
    tone: "Introspective, sensory, unhurried, warm 35mm grain.",
    goal: "High swipe retention & authentic community saves (>15%).",
    pillars: [
      "Hidden Coastal Alleys & Heritage Architecture",
      "Slow Sunday Coffee & Local Bookstore Studies",
      "Authentic Regional Street Corners",
    ],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    paletteColors: ["#B85C43", "#71879A", "#60735A", "#171717"],
  },
  tech: {
    name: "Product Architect",
    role: "Tech & Systems Builder",
    niche: "Software, Creative AI & Architecture",
    audience: "Builders, designers, and founders seeking practical clarity.",
    tone: "Analytical, crisp, design-forward, actionable frameworks.",
    goal: "Authority building & newsletter community growth.",
    pillars: [
      "Modern Web Architecture & Cloud Teardowns",
      "Creative AI Pipelines & Creator Tools",
      "Design Systems & Minimalist Workflows",
    ],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    paletteColors: ["#71879A", "#B85C43", "#2B4C7E", "#171717"],
  },
  culinary: {
    name: "Culture Chronicler",
    role: "Culinary & Culture Explorer",
    niche: "Food Heritage & Sensory Culture",
    audience: "Curious food lovers exploring authentic regional traditions.",
    tone: "Vibrant, evocative, warm hospitality, generational heritage.",
    goal: "High comment discussions & regional discovery saves.",
    pillars: [
      "Historic Old-City Chai & Breakfast Heritage",
      "Slow Clay-Pot Cooking & Forgotten Spices",
      "Artisans & Street Vendors Behind Local Dishes",
    ],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    paletteColors: ["#C6A15B", "#B85C43", "#71879A", "#171717"],
  },
};

const PALETTE_OPTIONS = [
  {
    name: "NuFrame Terracotta & Dust Blue",
    colors: ["#B85C43", "#71879A", "#60735A", "#171717"],
  },
  {
    name: "Warm Earth & Sand",
    colors: ["#C96B4B", "#C6A15B", "#E5DFD4", "#20201E"],
  },
  {
    name: "Nordic Slate & Mist",
    colors: ["#71879A", "#4F6D85", "#DCE7F0", "#141414"],
  },
  {
    name: "Olive Sage & Linen",
    colors: ["#60735A", "#B85C43", "#EAF0E6", "#171717"],
  },
];

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
  const [activeTab, setActiveTab] = useState<"custom" | "templates">("custom");
  const [profile, setProfile] = useState<CreatorProfileData>(GENERIC_PROFILE);
  const [newPillar, setNewPillar] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Load custom persona or user profile on open
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const customSaved = localStorage.getItem("nuframe_custom_persona");
      if (customSaved) {
        setProfile(JSON.parse(customSaved));
        return;
      }

      const userSaved = localStorage.getItem("nuframe_user");
      if (userSaved) {
        const parsed = JSON.parse(userSaved);
        setProfile({
          ...GENERIC_PROFILE,
          name: parsed.name || "Creator",
          role: parsed.role || "Visual Storyteller",
        });
        return;
      }

      setProfile(GENERIC_PROFILE);
    } catch {
      setProfile(GENERIC_PROFILE);
    }
  }, [isOpen]);

  const handleSaveCustomProfile = () => {
    if (typeof window === "undefined") return;

    localStorage.setItem("nuframe_custom_persona", JSON.stringify(profile));

    // Update user profile name if logged in
    try {
      const userSaved = localStorage.getItem("nuframe_user");
      if (userSaved) {
        const u = JSON.parse(userSaved);
        u.name = profile.name;
        u.role = profile.role;
        localStorage.setItem("nuframe_user", JSON.stringify(u));
      }
    } catch {}

    if (onProfileChange) {
      onProfileChange(profile);
    }

    window.dispatchEvent(new Event("nuframe_auth_changed"));

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleAdoptTemplate = (templateKey: string) => {
    const tmpl = PRESET_PROFILES[templateKey];
    if (!tmpl) return;

    // Keep the creator's own name, but adopt the niche, tone, pillars, and palette
    setProfile((prev) => ({
      ...tmpl,
      name: prev.name !== "Creator" ? prev.name : tmpl.name,
    }));
    setActiveTab("custom");
  };

  const handleAddPillar = () => {
    if (!newPillar.trim()) return;
    if (profile.pillars.includes(newPillar.trim())) return;
    setProfile({
      ...profile,
      pillars: [...profile.pillars, newPillar.trim()],
    });
    setNewPillar("");
  };

  const handleRemovePillar = (indexToRemove: number) => {
    setProfile({
      ...profile,
      pillars: profile.pillars.filter((_, idx) => idx !== indexToRemove),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1C1B19] border border-[#B85C43]/40 text-[#F7F4EE] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2926] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B85C43] flex items-center justify-center text-white shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Creator Persona & Brain Studio
                </h3>
              </div>
              <p className="text-xs text-[#9C9890] mt-0.5">
                Define your unique voice, niche, and aesthetic guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9C9890] hover:text-[#F7F4EE] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#242320] p-1 border border-[#33312C]">
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "custom"
                ? "bg-[#B85C43] text-white shadow-sm"
                : "text-[#9C9890] hover:text-[#F7F4EE]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>My Creator Persona</span>
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "templates"
                ? "bg-[#B85C43] text-white shadow-sm"
                : "text-[#9C9890] hover:text-[#F7F4EE]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Starter Templates (Optional)</span>
          </button>
        </div>

        {/* TAB 1: CUSTOM PERSONA BUILDER */}
        {activeTab === "custom" && (
          <div className="space-y-4">
            {/* Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#DBD2C7] mb-1">
                  Creator Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="e.g. Maya Patel"
                  className="w-full bg-[#242320] border border-[#33312C] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#DBD2C7] mb-1">
                  Creator Role / Title
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) =>
                    setProfile({ ...profile, role: e.target.value })
                  }
                  placeholder="e.g. Visual Storyteller & Photographer"
                  className="w-full bg-[#242320] border border-[#33312C] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>
            </div>

            {/* Niche & Audience */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#DBD2C7] mb-1">
                  Content Niche
                </label>
                <input
                  type="text"
                  value={profile.niche}
                  onChange={(e) =>
                    setProfile({ ...profile, niche: e.target.value })
                  }
                  placeholder="e.g. Travel, Architecture & Film Photography"
                  className="w-full bg-[#242320] border border-[#33312C] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#DBD2C7] mb-1">
                  Target Community & Audience
                </label>
                <input
                  type="text"
                  value={profile.audience}
                  onChange={(e) =>
                    setProfile({ ...profile, audience: e.target.value })
                  }
                  placeholder="e.g. Aesthetic-conscious creators & mindful travelers"
                  className="w-full bg-[#242320] border border-[#33312C] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>
            </div>

            {/* Aesthetic Tone & Strategic Goal */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#DBD2C7] mb-1">
                  Visual Style & Storytelling Tone
                </label>
                <input
                  type="text"
                  value={profile.tone}
                  onChange={(e) =>
                    setProfile({ ...profile, tone: e.target.value })
                  }
                  placeholder="e.g. Warm Terracotta & 35mm grain, reflective, unhurried"
                  className="w-full bg-[#242320] border border-[#33312C] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#DBD2C7] mb-1">
                  Primary Creative Goal
                </label>
                <input
                  type="text"
                  value={profile.goal}
                  onChange={(e) =>
                    setProfile({ ...profile, goal: e.target.value })
                  }
                  placeholder="e.g. High swipe-through completion & community saves"
                  className="w-full bg-[#242320] border border-[#33312C] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>
            </div>

            {/* Content Pillars */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#DBD2C7]">
                Content Pillars
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.pillars.map((pillar, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#242320] border border-[#33312C] text-xs text-[#F7F4EE]"
                  >
                    <span className="text-[#B85C43] font-bold">0{idx + 1}.</span>
                    <span>{pillar}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePillar(idx)}
                      className="text-[#9C9890] hover:text-[#EA4335] transition-colors ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newPillar}
                  onChange={(e) => setNewPillar(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPillar();
                    }
                  }}
                  placeholder="Add a new content pillar (e.g. Hidden City Corners)..."
                  className="flex-1 bg-[#242320] border border-[#33312C] rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
                <button
                  type="button"
                  onClick={handleAddPillar}
                  className="px-3 py-1.5 rounded-xl bg-[#242320] hover:bg-[#33312C] text-xs font-semibold text-[#F7F4EE] border border-[#33312C] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B85C43]" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Brand Palette Accent Selector */}
            <div className="space-y-2 pt-2 border-t border-[#2A2926]">
              <label className="block text-[11px] font-bold text-[#DBD2C7]">
                Visual Color Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PALETTE_OPTIONS.map((pal, idx) => {
                  const isSelected =
                    JSON.stringify(profile.paletteColors) ===
                    JSON.stringify(pal.colors);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setProfile({ ...profile, paletteColors: pal.colors })
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#B85C43]/15 border-[#B85C43]"
                          : "bg-[#242320] border-[#33312C] hover:border-[#6F6A62]"
                      }`}
                    >
                      <span className="text-[11px] font-medium text-[#DBD2C7] truncate max-w-[130px]">
                        {pal.name}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {pal.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OPTIONAL STARTER TEMPLATES */}
        {activeTab === "templates" && (
          <div className="space-y-3">
            <p className="text-xs text-[#9C9890] leading-relaxed">
              Want a head start? Select a starter archetype below to populate your
              persona fields. You can customize all settings anytime.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.entries(PRESET_PROFILES).map(([key, item]) => (
                <div
                  key={key}
                  className="p-4 rounded-2xl bg-[#242320] border border-[#33312C] hover:border-[#B85C43]/50 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#F7F4EE]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#71879A] font-medium">
                        {item.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.paletteColors.map((col, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#DBD2C7] leading-relaxed">
                    <strong>Niche:</strong> {item.niche}
                  </p>

                  <p className="text-xs text-[#9C9890] italic">
                    "{item.tone}"
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAdoptTemplate(key)}
                    className="w-full py-2 rounded-xl bg-[#2A2926] hover:bg-[#B85C43] hover:text-white text-xs font-bold text-[#DBD2C7] border border-[#33312C] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Adopt this Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2A2926]">
          <span className="text-xs font-semibold text-[#60735A]">
            {isSaved ? "✓ Persona Saved & Synced" : "Synced with AI Story Engine"}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#9C9890] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCustomProfile}
              className="px-5 py-2.5 rounded-xl bg-[#B85C43] hover:bg-[#9E4D36] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Save My Persona</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
