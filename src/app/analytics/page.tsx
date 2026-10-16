"use client";

import { useState } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import {
  ChevronLeft,
  BarChart2,
  TrendingUp,
  DollarSign,
  PieChart,
  Users,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Server,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Layers,
  Eye,
  Bookmark,
} from "lucide-react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"performance" | "business">("performance");

  // SaaS Simulator States
  const [starterCount, setStarterCount] = useState(25);
  const [growthCount, setGrowthCount] = useState(12);
  const [proCount, setProCount] = useState(5);

  const [marketingSpend, setMarketingSpend] = useState(2500);
  const [miscSpend, setMiscSpend] = useState(1500);

  // Pricing constants (INR ₹)
  const PRICE_STARTER = 999;
  const PRICE_GROWTH = 2499;
  const PRICE_PRO = 5999;

  // Infrastructure cost (Cloudflare R2 10GB free, AI engine free tier, Supabase free tier)
  const infraCost = 0;

  // Calculations
  const grossMRR =
    starterCount * PRICE_STARTER +
    growthCount * PRICE_GROWTH +
    proCount * PRICE_PRO;

  const totalExpenses = marketingSpend + miscSpend + infraCost;
  const netProfit = grossMRR - totalExpenses;
  const profitMargin = grossMRR > 0 ? Math.round((netProfit / grossMRR) * 100) : 0;
  const totalSubscribers = starterCount + growthCount + proCount;
  const arpu = totalSubscribers > 0 ? Math.round(grossMRR / totalSubscribers) : 0;

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#171717] font-sans pb-24 md:pb-12 selection:bg-[#C96B4B] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#F7F4EE]/90 backdrop-blur-md px-4 py-3.5 border-b border-[#DBD2C7]/60 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-[#EDE8DE] flex items-center justify-center text-[#171717] hover:bg-[#E5DFD4] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#C96B4B]" />
            <h1 className="font-serif text-lg font-bold text-[#171717]">
              Analytics & Next Best Action
            </h1>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#60735A] bg-[#EAF0E6] px-2.5 py-1 rounded-full border border-[#60735A]/20">
          ● Closed Learning Loop
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Dual Tab Navigation (FR-10 vs SaaS Model) */}
        <div className="flex items-center justify-center">
          <div className="bg-[#EDE8DE] p-1 rounded-2xl border border-[#DBD2C7] flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === "performance"
                  ? "bg-[#C96B4B] text-white shadow-sm"
                  : "text-[#6F6A62] hover:text-[#171717]"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Content Performance & Learning (PRD)</span>
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === "business"
                  ? "bg-[#C96B4B] text-white shadow-sm"
                  : "text-[#6F6A62] hover:text-[#171717]"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>SaaS Economics & R2 Model</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: CONTENT PERFORMANCE & NEXT BEST ACTION (FR-10, 11, 12)    */}
        {/* ================================================================ */}
        {activeTab === "performance" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Avg Swipe Completion</span>
                  <span className="p-1 rounded bg-[#EAF0E6] text-[#60735A]">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#171717]">84.2%</p>
                <p className="text-[11px] text-[#60735A] font-medium">+140% vs single photos</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Community Save Rate</span>
                  <span className="p-1 rounded bg-[#C96B4B]/10 text-[#C96B4B]">
                    <Bookmark className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#C96B4B]">18.6%</p>
                <p className="text-[11px] text-[#60735A] font-medium">Exceeds 15% Goal</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Slide Consumption Depth</span>
                  <span className="p-1 rounded bg-[#EDE8DE] text-[#6F6A62]">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#171717]">3.2 / 3.4</p>
                <p className="text-[11px] text-[#6F6A62]">Avg slides viewed per session</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Learning Feedback Loop</span>
                  <span className="p-1 rounded bg-[#EAF0E6] text-[#60735A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#60735A]">Active</p>
                <p className="text-[11px] text-[#60735A]">Learns from past performance</p>
              </div>
            </div>

            {/* Format Comparison Table (FR-10) */}
            <section className="bg-white rounded-2xl p-5 border border-[#DBD2C7] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-base font-bold text-[#171717]">
                    Content Format Performance Comparison
                  </h2>
                  <p className="text-xs text-[#6F6A62]">
                    Normalized metrics across your recent visual content experiments
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#60735A]">
                  FR-10 Verified
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DBD2C7] text-[#6F6A62] font-semibold">
                      <th className="pb-2.5">Format</th>
                      <th className="pb-2.5">Posts</th>
                      <th className="pb-2.5">Swipe-Through</th>
                      <th className="pb-2.5">Save Rate</th>
                      <th className="pb-2.5">Audience Retention</th>
                      <th className="pb-2.5 text-right">NuFrame Fit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE8DE]">
                    <tr className="font-medium text-[#171717]">
                      <td className="py-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#60735A]" />
                        <strong>4:5 Seamless Panoramic Cuts</strong>
                      </td>
                      <td className="py-3">14</td>
                      <td className="py-3 text-[#60735A] font-bold">84.2%</td>
                      <td className="py-3 text-[#C96B4B] font-bold">18.6%</td>
                      <td className="py-3">High (92% screen)</td>
                      <td className="py-3 text-right text-[#60735A] font-bold">96% High Fit</td>
                    </tr>
                    <tr className="text-[#6F6A62]">
                      <td className="py-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C96B4B]" />
                        <span>1:1 Retro Polaroid Stories</span>
                      </td>
                      <td className="py-3">8</td>
                      <td className="py-3">61.5%</td>
                      <td className="py-3">9.2%</td>
                      <td className="py-3">Medium</td>
                      <td className="py-3 text-right text-[#C96B4B]">78% Moderate</td>
                    </tr>
                    <tr className="text-[#9C9890]">
                      <td className="py-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                        <span>Single Static Image</span>
                      </td>
                      <td className="py-3">6</td>
                      <td className="py-3">31.0%</td>
                      <td className="py-3">4.1%</td>
                      <td className="py-3">Low</td>
                      <td className="py-3 text-right text-gray-500">22% Poor Fit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* AI Performance Pattern Explanation (FR-11) */}
            <section className="bg-gradient-to-br from-[#EDE8DE] via-[#F4ECE4] to-[#F7F4EE] rounded-2xl p-5 border border-[#C96B4B]/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C96B4B]" />
                <h3 className="font-serif text-sm font-bold text-[#171717]">
                  Performance Pattern Explanation (AI Reasoner)
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#C96B4B] border border-[#C96B4B]/20">
                  FR-11
                </span>
              </div>
              <p className="text-xs text-[#6F6A62] leading-relaxed">
                Why did <em>"Pondicherry: French Quarter"</em> outperform standard posts by +140%? Our Multimodal Content Director identified that <strong>viewers paused 2.8x longer on Slide 2</strong> because the architectural cutline extended continuously across the split guide. The visual cliffhanger created a psychological drive to swipe to completion.
              </p>
            </section>

            {/* Next Best Action Recommendation (FR-12) */}
            <section className="bg-white rounded-2xl p-5 border-2 border-[#C96B4B] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C96B4B] flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Next Best Action Recommendation (FR-12)
                </span>
                <span className="text-xs font-semibold text-[#60735A] bg-[#EAF0E6] px-2.5 py-0.5 rounded-full">
                  94% Confidence
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-[#171717]">
                Experiment: Post a Slow-Paced Hyderabad Micro-Journal
              </h3>

              <p className="text-xs text-[#6F6A62] leading-relaxed">
                Combine your high-retention 4:5 seamless cut format with the exploding regional trend: <strong>"Sunday Study Micro-Journals"</strong>. Focus on warm shadows, quiet morning chai, and handwritten reflections.
              </p>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-[#9C9890]">
                  Target Timing: Sunday Morning (8:30 AM – 10:00 AM)
                </span>
                <Link
                  href="/studio?mode=carousel&template=sunday-study"
                  className="inline-flex items-center gap-1.5 bg-[#C96B4B] hover:bg-[#B3593B] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md active:scale-95 transition-all"
                >
                  <span>Launch This Experiment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: SAAS BUSINESS MODEL & R2 ECONOMICS                        */}
        {/* ================================================================ */}
        {activeTab === "business" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Hero Financial KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Monthly Recurring Revenue</span>
                  <span className="p-1 rounded bg-[#EAF0E6] text-[#60735A]">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#171717]">
                  ₹{grossMRR.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-[#60735A] font-medium">
                  ARR: ₹{(grossMRR * 12).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Net Monthly Profit</span>
                  <span className="p-1 rounded bg-[#C96B4B]/10 text-[#C96B4B]">
                    <DollarSign className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#C96B4B]">
                  ₹{netProfit.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-[#60735A] font-medium">
                  {profitMargin}% Profit Margin
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Active Creators</span>
                  <span className="p-1 rounded bg-[#EDE8DE] text-[#6F6A62]">
                    <Users className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#171717]">
                  {totalSubscribers} Creators
                </p>
                <p className="text-[11px] text-[#6F6A62]">
                  Avg ARPU: ₹{arpu.toLocaleString("en-IN")}/mo
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6F6A62]">
                  <span>Infra Costs (R2 + Cloud AI)</span>
                  <span className="p-1 rounded bg-[#EAF0E6] text-[#60735A]">
                    <Server className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-[#60735A]">₹0 / mo</p>
                <p className="text-[11px] text-[#60735A]">
                  Cloudflare R2 10GB & AI Free Tier
                </p>
              </div>
            </div>

            {/* Live Simulator & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscriber Mix Simulator */}
              <section className="bg-white rounded-2xl p-5 border border-[#DBD2C7] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-[#171717]">
                    Subscriber Tier Distribution
                  </h2>
                  <span className="text-xs text-[#6F6A62]">Interactive Simulator</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Starter (₹999/mo)</span>
                      <span className="text-[#C96B4B]">
                        {starterCount} subs (₹{(starterCount * PRICE_STARTER).toLocaleString("en-IN")})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={starterCount}
                      onChange={(e) => setStarterCount(Number(e.target.value))}
                      className="w-full accent-[#C96B4B] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Growth (₹2,499/mo)</span>
                      <span className="text-[#C96B4B]">
                        {growthCount} subs (₹{(growthCount * PRICE_GROWTH).toLocaleString("en-IN")})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={growthCount}
                      onChange={(e) => setGrowthCount(Number(e.target.value))}
                      className="w-full accent-[#C96B4B] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Pro / Agency (₹5,999/mo)</span>
                      <span className="text-[#C96B4B]">
                        {proCount} subs (₹{(proCount * PRICE_PRO).toLocaleString("en-IN")})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={proCount}
                      onChange={(e) => setProCount(Number(e.target.value))}
                      className="w-full accent-[#C96B4B] cursor-pointer"
                    />
                  </div>
                </div>
              </section>

              {/* Operational Expenses & Unit Economics */}
              <section className="bg-white rounded-2xl p-5 border border-[#DBD2C7] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-[#171717]">
                    Monthly Operational Outflows
                  </h2>
                  <span className="text-xs text-[#6F6A62]">Zero Fixed Infra Cost</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EE] border border-[#DBD2C7]">
                    <div>
                      <p className="font-semibold text-[#171717]">Cloudflare R2 Object Storage</p>
                      <p className="text-[10px] text-[#6F6A62]">10 GB free forever + $0 egress fees</p>
                    </div>
                    <span className="font-bold text-[#60735A]">₹0</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EE] border border-[#DBD2C7]">
                    <div>
                      <p className="font-semibold text-[#171717]">Multimodal AI Engine</p>
                      <p className="text-[10px] text-[#6F6A62]">Multimodal free tier quota</p>
                    </div>
                    <span className="font-bold text-[#60735A]">₹0</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EE] border border-[#DBD2C7]">
                    <div>
                      <p className="font-semibold text-[#171717]">Targeted Creator Ads / Sponsorships</p>
                      <p className="text-[10px] text-[#6F6A62]">Community growth & Instagram promos</p>
                    </div>
                    <span className="font-bold text-[#C96B4B]">₹{marketingSpend.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EE] border border-[#DBD2C7]">
                    <div>
                      <p className="font-semibold text-[#171717]">Domain & Compliance Reserve</p>
                      <p className="text-[10px] text-[#6F6A62]">SSL, DNS & legal safeguards</p>
                    </div>
                    <span className="font-bold text-[#6F6A62]">₹{miscSpend.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Dock */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
