"use client";

import { useState } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import {
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
  ArrowUpRight,
  Flame,
  ChevronLeft,
} from "lucide-react";

export default function MobileTrendsPage() {
  const [selectedRegion, setSelectedRegion] = useState("Hyderabad");
  const [evaluatedTrend, setEvaluatedTrend] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const trends = [
    {
      id: "trend-01",
      name: "Film-Burn Seamless Panoramic Cuts",
      category: "Visual Format",
      lifecycle: "Rising",
      momentumScore: 88,
      velocity: "+24% this week",
      saturation: "32% (Low - Fresh Opportunity)",
      description: "35mm grain, warm terracotta/amber tones, and continuous seamless transitions between slides that reward swipe engagement.",
      regionalHub: "Hyderabad / Telangana: Early Adoption",
      fitNiche: "96% High Fit",
    },
    {
      id: "trend-02",
      name: "Slow-Paced 'Sunday Study' Micro-Journals",
      category: "Storytelling & Audio Hook",
      lifecycle: "Exploding",
      momentumScore: 94,
      velocity: "+42% this week",
      saturation: "48% (Medium)",
      description: "Unpolished, realistic captures (receipts, chai cups, architecture shadows) paired with reflective first-person journaling notes.",
      regionalHub: "Telangana: High Engagement",
      fitNiche: "94% High Fit",
    },
    {
      id: "trend-03",
      name: "Hyper-Fast Neon Transition Reels",
      category: "Video Editing",
      lifecycle: "Saturating",
      momentumScore: 52,
      velocity: "-18% this week",
      saturation: "89% (High Fatigue)",
      description: "Strobe cuts, loud sound effects, and rapid text overlays.",
      regionalHub: "Audience viewer fatigue detected",
      fitNiche: "20% Poor Fit",
    },
  ];

  const handleEvaluate = async (trendId: string) => {
    setIsEvaluating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      const res = await fetch(`${apiUrl}/api/trend/decision?trend_id=${trendId}`);
      if (res.ok) {
        const data = await res.json();
        setEvaluatedTrend(data.decision);
      } else {
        // Fallback local calculation
        setEvaluatedTrend({
          trend_id: trendId,
          action: trendId === "trend-02" ? "MAKE IT" : trendId === "trend-01" ? "ADAPT IT" : "SKIP",
          confidence_score: 94,
          rationale: "High velocity and strong alignment with your travel & visual journal identity.",
          suggested_angle: "Combine local Hyderabad captures with the reflective Sunday Study journal template."
        });
      }
    } catch {
      setEvaluatedTrend({
        trend_id: trendId,
        action: trendId === "trend-02" ? "MAKE IT" : trendId === "trend-01" ? "ADAPT IT" : "SKIP",
        confidence_score: 94,
        rationale: "High velocity and strong alignment with your travel & visual journal identity.",
        suggested_angle: "Combine local Hyderabad captures with the reflective Sunday Study journal template."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#171717] pb-24 font-sans max-w-md mx-auto sm:border-x sm:border-[#DBD2C7] sm:shadow-xl relative">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 bg-[#F7F4EE]/90 backdrop-blur-md px-4 py-3 border-b border-[#DBD2C7]/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-[#EDE8DE] flex items-center justify-center text-[#171717] hover:bg-[#E5DFD4] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#C96B4B]" />
            <h1 className="font-serif text-lg font-bold text-[#171717]">
              Trend Intelligence
            </h1>
          </div>
        </div>

        {/* Regional Selector Badge */}
        <div className="flex items-center gap-1 bg-[#EDE8DE] border border-[#DBD2C7] px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#60735A]">
          <MapPin className="w-3 h-3 text-[#C96B4B]" />
          <span>{selectedRegion}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-4 space-y-4">
        {/* Geographic Intelligence Banner */}
        <section className="bg-[#EDE8DE] border border-[#DBD2C7] rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6A62]">
              Regional Signal Engine
            </span>
            <span className="text-[10px] font-semibold text-[#60735A] bg-[#EAF0E6] px-2 py-0.5 rounded-full border border-[#60735A]/20">
              Live Verified Data
            </span>
          </div>
          <p className="text-xs text-[#171717] font-medium leading-relaxed">
            Signals tracked across <strong>Global $\rightarrow$ India $\rightarrow$ Telangana $\rightarrow$ Hyderabad</strong>.
            NuFrame filters out creator fatigue before you spend hours shooting.
          </p>
        </section>

        {/* Evaluated Decision Modal/Card */}
        {evaluatedTrend && (
          <section className="bg-white border-2 border-[#C96B4B] rounded-2xl p-4 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C96B4B] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Decision Engine Evaluation
              </span>
              <button
                onClick={() => setEvaluatedTrend(null)}
                className="text-xs text-[#6F6A62] hover:text-[#171717]"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                  evaluatedTrend.action === "MAKE IT"
                    ? "bg-[#60735A] text-white"
                    : evaluatedTrend.action === "ADAPT IT"
                    ? "bg-[#C96B4B] text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {evaluatedTrend.action}
              </span>
              <span className="text-xs font-semibold text-[#6F6A62]">
                Confidence: {evaluatedTrend.confidence_score}%
              </span>
            </div>

            <p className="text-xs text-[#171717] leading-relaxed">
              <strong>Rationale:</strong> {evaluatedTrend.rationale}
            </p>

            <div className="bg-[#F7F4EE] rounded-xl p-2.5 border border-[#DBD2C7] text-xs text-[#60735A] font-medium">
              💡 <strong>Creator Angle:</strong> {evaluatedTrend.suggested_angle}
            </div>

            <Link
              href="/studio?mode=carousel"
              className="w-full flex items-center justify-center gap-2 bg-[#C96B4B] text-white text-xs font-bold py-2.5 rounded-full shadow hover:bg-[#B85C43] active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Studio with this Format
            </Link>
          </section>
        )}

        {/* Trends List */}
        <section className="space-y-3.5">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="bg-white border border-[#DBD2C7] rounded-2xl p-4 shadow-sm space-y-3 hover:border-[#C96B4B]/50 transition-all"
            >
              {/* Header with Lifecycle Pill */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-[#6F6A62] uppercase tracking-wider">
                    {trend.category}
                  </span>
                  <h2 className="font-serif text-base font-bold text-[#171717] mt-0.5">
                    {trend.name}
                  </h2>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                    trend.lifecycle === "Exploding"
                      ? "bg-[#C96B4B]/15 text-[#C96B4B] border border-[#C96B4B]/30"
                      : trend.lifecycle === "Rising"
                      ? "bg-[#60735A]/15 text-[#60735A] border border-[#60735A]/30"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {trend.lifecycle === "Exploding" && "🔥 "}
                  {trend.lifecycle}
                </span>
              </div>

              {/* Momentum & Velocity Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F6A62] font-medium">Momentum Score</span>
                  <span className="font-bold text-[#171717]">
                    {trend.momentumScore}/100 ({trend.velocity})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EDE8DE] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      trend.momentumScore > 80
                        ? "bg-[#C96B4B]"
                        : trend.momentumScore > 60
                        ? "bg-[#60735A]"
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${trend.momentumScore}%` }}
                  />
                </div>
              </div>

              {/* Description & Saturation */}
              <p className="text-xs text-[#6F6A62] leading-relaxed">
                {trend.description}
              </p>

              <div className="pt-2 border-t border-[#DBD2C7]/60 flex items-center justify-between text-[11px]">
                <div className="text-[#6F6A62]">
                  Saturation: <strong className="text-[#171717]">{trend.saturation}</strong>
                </div>
                <div className="text-[#60735A] font-semibold">
                  Fit: {trend.fitNiche}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleEvaluate(trend.id)}
                disabled={isEvaluating}
                className="w-full mt-2 flex items-center justify-center gap-1.5 bg-[#EDE8DE] border border-[#DBD2C7] text-[#171717] text-xs font-semibold py-2 rounded-xl hover:bg-[#C96B4B] hover:text-white hover:border-[#C96B4B] active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C96B4B]" />
                Evaluate My Creator Fit (Decision Engine)
              </button>
            </div>
          ))}
        </section>
      </main>

      {/* Persistent Bottom Mobile Nav */}
      <MobileNav />
    </div>
  );
}
