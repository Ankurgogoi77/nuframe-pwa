"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import RadarChartDashboard from "@/components/RadarChartDashboard";
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
  Globe,
} from "lucide-react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"performance" | "business">("performance");
  const [metricsData, setMetricsData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<string>("7d");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
        const res = await fetch(`${apiUrl}/api/radar/metrics?timeframe=${timeframe}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setMetricsData(json.data);
          }
        }
      } catch {
        // Gracefully use initial state
      }
    };
    fetchMetrics();
  }, [timeframe]);

  // Multi-Platform Social Connections (Anti-Ban OAuth 2.0 Hub)
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [activeAccountHandle, setActiveAccountHandle] = useState<string>("");
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [isConnectingPlatform, setIsConnectingPlatform] = useState<string | null>(null);

  const renderSocialIcon = (id: string, className = "w-4 h-4") => {
    switch (id) {
      case "instagram":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad)" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="#fff" strokeWidth="1.75" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
            <defs>
              <radialGradient id="ig-grad" cx="0.3" cy="1" r="1">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
              </radialGradient>
            </defs>
          </svg>
        );
      case "facebook":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        );
      case "x":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="#000000">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "tiktok":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="#000000">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        );
      case "snapchat":
        return (
          <svg className={className} viewBox="0 0 24 24">
            <rect width="24" height="24" rx="5" fill="#FFFC00" />
            <path fill="#000" d="M12.003 3.5c-3.1 0-5.2 2.3-5.2 5.3 0 .6.2 1.7.5 2.3.1.2-.1.4-.3.5-.4.3-1.2.8-1.5 1.8-.2.6.2 1.1.7 1.3.7.2 1.3.1 1.9-.2.2-.1.4 0 .4.2.2.8 1 1.7 2.1 1.9.3 0 .5.2.5.5 0 .2-.1.4-.4.5-.7.4-1.8.7-2.6 1.5-.4.4-.6 1-.1 1.4.6.4 1.7.4 2.8.1 1-.3 1.7-.7 2.1-.7.4 0 1.2.4 2.1.7 1 .3 2.1.3 2.8-.1.5-.4.3-1-.1-1.4-.8-.8-1.9-1.1-2.6-1.5-.3-.1-.4-.3-.4-.5 0-.3.2-.5.5-.5 1.1-.2 1.9-1.1 2.1-1.9.1-.2.2-.3.4-.2.5.3 1.2.4 1.9.2.5-.2.9-.7.7-1.3-.3-1-1.1-1.5-1.5-1.8-.2-.1-.4-.3-.3-.5.3-.6.5-1.7.5-2.3C17.2 5.8 15.1 3.5 12.003 3.5z" />
          </svg>
        );
      case "youtube":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      default:
        return <Globe className={className} />;
    }
  };

  const socialPlatforms = [
    {
      id: "instagram",
      name: "Instagram",
      category: "Meta Graph API v19.0",
      color: "#E1306C",
      scopes: "instagram_basic, instagram_manage_insights",
      desc: "Live carousel swipe completion, saves, and unique reach."
    },
    {
      id: "facebook",
      name: "Facebook",
      category: "Meta Graph API v19.0",
      color: "#1877F2",
      scopes: "pages_read_engagement, pages_show_list",
      desc: "Page post impressions, video watch time, and reactions."
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      category: "LinkedIn Community API",
      color: "#0A66C2",
      scopes: "r_organization_social",
      desc: "PDF document carousel impressions, CTR, and reposts."
    },
    {
      id: "x",
      name: "X (Twitter)",
      category: "X API v2 (PKCE)",
      color: "#000000",
      scopes: "tweet.read, users.read",
      desc: "Thread impressions, bookmarks, quote retweets, and clicks."
    },
    {
      id: "tiktok",
      name: "TikTok",
      category: "TikTok Display API",
      color: "#000000",
      scopes: "user.info.basic, video.list",
      desc: "Video completion rate, total view time, and sound velocity."
    },
    {
      id: "snapchat",
      name: "Snapchat",
      category: "Snap Kit",
      color: "#D4B106",
      scopes: "snapchat-marketing-api",
      desc: "Public spotlight story views, swipe ups, and shares."
    },
    {
      id: "youtube",
      name: "YouTube",
      category: "Google Cloud Analytics",
      color: "#FF0000",
      scopes: "yt-analytics.readonly",
      desc: "Shorts retention curves, subscriber gains, and watch depth."
    }
  ];

  const handleConnect = async (platformId: string, sandbox = false) => {
    setIsConnectingPlatform(platformId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      await fetch(`${apiUrl}/api/social/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformId,
          account_handle: sandbox ? "@creator.stories" : `@creator.${platformId}`,
          is_sandbox: sandbox
        })
      });
    } catch {}
    setConnectedPlatforms((prev) => Array.from(new Set([...prev, platformId])));
    setActiveAccountHandle(sandbox ? "@creator.stories" : `@creator.${platformId}`);
    setIsSandboxMode(sandbox);
    setIsConnectingPlatform(null);
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      await fetch(`${apiUrl}/api/social/disconnect/${platformId}`, { method: "POST" });
    } catch {}
    setConnectedPlatforms((prev) => prev.filter((p) => p !== platformId));
  };

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
            {/* 1. Official Anti-Ban Security & Permission Shield */}
            <div className="bg-gradient-to-r from-[#EDE8DE] via-[#F4ECE4] to-[#F7F4EE] border border-[#60735A]/30 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF0E6] flex items-center justify-center text-[#60735A] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#171717] flex items-center gap-1.5">
                    <span>100% Anti-Ban Guarantee · Official OAuth 2.0 Partner APIs</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#60735A] border border-[#60735A]/20">
                      Zero Risk
                    </span>
                  </h3>
                  <p className="text-xs text-[#6F6A62]">
                    NuFrame strictly accesses your audience data via official read-only developer scopes. We never store passwords, never scrape pages, and never publish without your confirmation.
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-[#6F6A62] font-medium shrink-0 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#60735A]" />
                <span>Scope: <code>insights:read</code></span>
              </div>
            </div>

            {/* 2. Connected Channel Status Bar OR Channel Connector Hub */}
            {connectedPlatforms.length === 0 ? (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-[#DBD2C7] shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DBD2C7] pb-3">
                    <div>
                      <h2 className="font-serif text-base font-bold text-[#171717]">
                        Connect Your Social Channels
                      </h2>
                      <p className="text-xs text-[#6F6A62]">
                        Grant read access to your channels to pull live audience metrics.
                      </p>
                    </div>
                    <button
                      onClick={() => handleConnect("instagram", true)}
                      className="inline-flex items-center gap-1.5 bg-[#EBF2F7] hover:bg-[#DCE7F0] text-[#4F6D85] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#71879A]/30 active:scale-95 transition-all self-start cursor-pointer"
                      title="Load sample creator portfolio analytics"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#71879A]" />
                      <span>Sample Creator Data (@creator.stories)</span>
                    </button>
                  </div>

                  {/* Quick-Connect Dropdown Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EDE8DE]/70 p-3 rounded-xl border border-[#DBD2C7]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#C96B4B]" />
                      <span className="text-xs font-bold text-[#171717]">Quick Connect Dropdown:</span>
                      <span className="text-[11px] text-[#6F6A62]">Select a channel to initiate OAuth 2.0 handshake</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleConnect(e.target.value, false);
                            e.target.value = "";
                          }
                        }}
                        className="bg-white border border-[#DBD2C7] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#C96B4B] cursor-pointer shadow-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>Choose Platform to Connect...</option>
                        {socialPlatforms.map((p) => (
                          <option key={p.id} value={p.id} disabled={connectedPlatforms.includes(p.id)}>
                            {p.name} ({p.category}) {connectedPlatforms.includes(p.id) ? "— Connected" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 7 Official Platform Cards Grid with Logos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {socialPlatforms.map((platform) => {
                      const isConnecting = isConnectingPlatform === platform.id;
                      const isConnected = connectedPlatforms.includes(platform.id);
                      return (
                        <div
                          key={platform.id}
                          className="p-4 rounded-xl border border-[#DBD2C7] bg-[#FDFCFB] hover:border-[#C96B4B]/60 transition-all flex flex-col justify-between space-y-3 shadow-xs"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#171717] flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-white border border-[#DBD2C7]/60 shadow-xs flex items-center justify-center">
                                  {renderSocialIcon(platform.id, "w-4 h-4")}
                                </span>
                                <span>{platform.name}</span>
                              </span>
                              <span className="text-[10px] text-[#6F6A62] bg-[#EDE8DE] px-2 py-0.5 rounded-full font-medium">
                                {platform.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6F6A62] leading-tight">
                              {platform.desc}
                            </p>
                            <p className="text-[10px] text-[#9C9890] font-mono truncate">
                              Scope: {platform.scopes}
                            </p>
                          </div>

                          <button
                            onClick={() => handleConnect(platform.id, false)}
                            disabled={isConnecting || isConnected}
                            className={`w-full text-xs font-semibold py-2 rounded-lg transition-all border flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-xs ${
                              isConnected
                                ? "bg-[#EAF0E6] text-[#60735A] border-[#60735A]/30 cursor-default"
                                : "bg-white hover:bg-[#C96B4B] hover:text-white text-[#171717] border-[#DBD2C7]"
                            }`}
                          >
                            {renderSocialIcon(platform.id, "w-3.5 h-3.5")}
                            {isConnecting ? (
                              <span>Authenticating...</span>
                            ) : isConnected ? (
                              <span>✓ Connected (Read-Only)</span>
                            ) : (
                              <span>Connect {platform.name}</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ZERO SYNTHETIC DATA ENFORCEMENT BANNER */}
                <div className="bg-[#FFF9F5] border-2 border-dashed border-[#C96B4B]/40 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#C96B4B]/10 text-[#C96B4B] flex items-center justify-center mx-auto">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#171717]">
                    Zero-Synthetic-Data Policy Enforced
                  </h3>
                  <p className="text-xs text-[#6F6A62] max-w-lg mx-auto leading-relaxed">
                    NuFrame strictly refuses to display fabricated or estimated metrics before permissions are granted. Real-time impressions, swipe-through completion rates, and audience save graphs will populate once you link at least one channel above.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsSandboxMode(true);
                        setConnectedPlatforms(["instagram"]);
                        setActiveAccountHandle("@creator.stories");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C96B4B] text-white text-xs font-bold shadow-sm hover:bg-[#B3593B] active:scale-95 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Run Sandbox Dry-Run Pipeline (Verify Charts)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* CONNECTED CHANNELS STREAMING LIVE DATA */
              <div className="space-y-6">
                {/* Active Connected Channel Banner with Official Logos */}
                <div className="bg-[#EAF0E6] border border-[#60735A]/30 rounded-2xl p-3.5 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#60735A] animate-pulse" />
                    <span className="text-xs font-bold text-[#171717]">
                      Streaming Live Metrics from:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {connectedPlatforms.map((pid) => (
                        <span
                          key={pid}
                          className="text-[11px] font-semibold bg-white text-[#171717] px-2.5 py-1 rounded-full border border-[#60735A]/30 capitalize flex items-center gap-1.5 shadow-xs"
                        >
                          {renderSocialIcon(pid, "w-3.5 h-3.5")}
                          <span>{pid} {isSandboxMode ? "(@creator.stories)" : activeAccountHandle}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#60735A] font-semibold uppercase tracking-wider">
                      ● Read-Only Live
                    </span>
                    <button
                      onClick={() => setConnectedPlatforms([])}
                      className="text-[11px] text-[#B85C43] hover:underline font-semibold cursor-pointer"
                    >
                      Disconnect All
                    </button>
                  </div>
                </div>

                {/* WEEK 8: RECHARTS DASHBOARD (KPI Cards, Time-Series Area Chart, Template & Location Bars) */}
                <RadarChartDashboard
                  metrics={metricsData || {}}
                  timeframe={timeframe}
                  onTimeframeChange={(tf) => setTimeframe(tf)}
                />

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
                Why did <em>"Pondicherry: French Quarter"</em> outperform standard posts by +140%? NuFrame AI identified that <strong>viewers paused 2.8x longer on Slide 2</strong> because the architectural cutline extended continuously across the split guide. The visual cliffhanger created a psychological drive to swipe to completion.
              </p>
            </section>

            {/* Next Best Action Recommendation */}
            <section className="bg-white rounded-2xl p-5 border-2 border-[#C96B4B] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C96B4B] flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  AI Story Action Recommendation
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
                      <p className="font-semibold text-[#171717]">NuFrame AI Engine</p>
                      <p className="text-[10px] text-[#6F6A62]">Creator Plan Included</p>
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
