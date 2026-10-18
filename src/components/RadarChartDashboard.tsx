"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend
} from "recharts";
import {
  TrendingUp,
  Eye,
  Bookmark,
  Share2,
  Layers,
  MapPin,
  Sparkles,
  Calendar,
  Filter
} from "lucide-react";

interface TimeSeriesPoint {
  date: string;
  views: number;
  saves: number;
  shares: number;
  completion_pct: number;
}

interface FormatItem {
  format: string;
  posts_count: number;
  swipe_through_pct: number;
  save_rate_pct: number;
  fit_score: number;
  status: string;
}

interface LocationItem {
  location: string;
  posts: number;
  engagement_rate: number;
}

interface RadarChartDashboardProps {
  metrics: {
    summary?: {
      total_impressions?: number;
      total_saves?: number;
      total_shares?: number;
      avg_swipe_completion?: number;
      avg_engagement_rate?: number;
      completion_change_vs_static?: number;
    };
    time_series_7d?: TimeSeriesPoint[];
    format_comparison?: FormatItem[];
    top_locations?: LocationItem[];
  };
  timeframe?: string;
  onTimeframeChange?: (tf: string) => void;
}

// Custom Glassmorphic Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#171717]/95 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-xl text-xs space-y-1.5 min-w-[140px]">
        <p className="font-semibold text-gray-300 border-b border-white/10 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-gray-400 capitalize">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold font-mono text-white">
              {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
              {entry.name.includes("pct") || entry.name.includes("Rate") || entry.name.includes("Completion") ? "%" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RadarChartDashboard({
  metrics,
  timeframe = "7d",
  onTimeframeChange
}: RadarChartDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<"views" | "saves" | "completion">("views");

  const summary = metrics.summary || {
    total_impressions: 142850,
    total_saves: 26570,
    total_shares: 8940,
    avg_swipe_completion: 84.2,
    avg_engagement_rate: 14.2,
    completion_change_vs_static: 140.0
  };

  const timeSeries = metrics.time_series_7d || [
    { date: "Oct 11", views: 18200, saves: 3100, shares: 1100, completion_pct: 81.5 },
    { date: "Oct 12", views: 19400, saves: 3450, shares: 1250, completion_pct: 82.0 },
    { date: "Oct 13", views: 22100, saves: 4120, shares: 1480, completion_pct: 85.1 },
    { date: "Oct 14", views: 20800, saves: 3890, shares: 1390, completion_pct: 83.4 },
    { date: "Oct 15", views: 24500, saves: 4780, shares: 1650, completion_pct: 86.8 },
    { date: "Oct 16", views: 21800, saves: 4150, shares: 1420, completion_pct: 84.0 },
    { date: "Oct 17", views: 16050, saves: 3080, shares: 1050, completion_pct: 84.2 }
  ];

  const formatData = metrics.format_comparison || [
    { format: "4:5 Panoramic Cuts", posts_count: 14, swipe_through_pct: 84.2, save_rate_pct: 18.6, fit_score: 96, status: "High Fit" },
    { format: "1:1 Polaroid Stories", posts_count: 8, swipe_through_pct: 61.5, save_rate_pct: 9.2, fit_score: 78, status: "Moderate Fit" },
    { format: "Single Static Image", posts_count: 6, swipe_through_pct: 31.0, save_rate_pct: 4.1, fit_score: 22, status: "Poor Fit" }
  ];

  const locationData = metrics.top_locations || [
    { location: "Pondicherry, French Quarter", posts: 5, engagement_rate: 11.4 },
    { location: "Goa, Fontainhas", posts: 4, engagement_rate: 9.8 },
    { location: "Hyderabad, Old City", posts: 3, engagement_rate: 8.7 }
  ];

  const FORMAT_COLORS = ["#C96B4B", "#71879A", "#60735A"];

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* 1. WEEK 8 TUESDAY: KPI STAT METRICS CARDS                          */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reach & Impressions */}
        <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#C96B4B]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-xs text-[#6F6A62]">
            <span className="font-medium">Total Impressions</span>
            <span className="p-1.5 rounded-lg bg-[#F7F4EE] text-[#C96B4B]">
              <Eye className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#171717] mt-1">
            {(summary.total_impressions || 142850).toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center text-[11px] font-bold text-[#60735A] bg-[#EAF0E6] px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
            </span>
            <span className="text-[11px] text-[#6F6A62]">vs previous week</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#60735A]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-xs text-[#6F6A62]">
            <span className="font-medium">Engagement Rate</span>
            <span className="p-1.5 rounded-lg bg-[#EAF0E6] text-[#60735A]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#171717] mt-1">
            {summary.avg_engagement_rate || 14.2}%
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center text-[11px] font-bold text-[#60735A] bg-[#EAF0E6] px-1.5 py-0.5 rounded">
              4.1x Higher
            </span>
            <span className="text-[11px] text-[#6F6A62]">than 3.5% baseline</span>
          </div>
        </div>

        {/* Community Saves */}
        <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#C96B4B]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-xs text-[#6F6A62]">
            <span className="font-medium">Community Saves</span>
            <span className="p-1.5 rounded-lg bg-[#C96B4B]/10 text-[#C96B4B]">
              <Bookmark className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#C96B4B] mt-1">
            {(summary.total_saves || 26570).toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-[#60735A] font-semibold">18.6% Save Rate</span>
            <span className="text-[11px] text-[#6F6A62]">· Exceeds 15% Goal</span>
          </div>
        </div>

        {/* Swipe Retention */}
        <div className="bg-white rounded-2xl p-4 border border-[#DBD2C7] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#71879A]/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-xs text-[#6F6A62]">
            <span className="font-medium">Avg Swipe Completion</span>
            <span className="p-1.5 rounded-lg bg-[#EBF2F7] text-[#4F6D85]">
              <Layers className="w-4 h-4 text-[#71879A]" />
            </span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#171717] mt-1">
            {summary.avg_swipe_completion || 84.2}%
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center text-[11px] font-bold text-[#4F6D85] bg-[#EBF2F7] px-1.5 py-0.5 rounded">
              +{summary.completion_change_vs_static || 140}%
            </span>
            <span className="text-[11px] text-[#6F6A62]">vs single static images</span>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. WEEK 8 WEDNESDAY: TIME-SERIES PERFORMANCE TREND LINE CHART      */}
      {/* ================================================================== */}
      <div className="bg-white rounded-2xl p-5 border border-[#DBD2C7] shadow-sm space-y-4">
        {/* Chart Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDE8DE]">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C96B4B]" />
              <h2 className="font-serif text-base font-bold text-[#171717]">
                Historical Performance Trend (Radar Analytics)
              </h2>
            </div>
            <p className="text-xs text-[#6F6A62] mt-0.5">
              Time-series tracking of impressions, saves, and carousel swipe completion
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Metric Selector Pills */}
            <div className="bg-[#F7F4EE] p-1 rounded-xl border border-[#DBD2C7] flex items-center gap-1 text-[11px] font-semibold">
              <button
                onClick={() => setSelectedMetric("views")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedMetric === "views"
                    ? "bg-[#C96B4B] text-white shadow-xs"
                    : "text-[#6F6A62] hover:text-[#171717]"
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setSelectedMetric("saves")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedMetric === "saves"
                    ? "bg-[#C96B4B] text-white shadow-xs"
                    : "text-[#6F6A62] hover:text-[#171717]"
                }`}
              >
                Saves
              </button>
              <button
                onClick={() => setSelectedMetric("completion")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedMetric === "completion"
                    ? "bg-[#C96B4B] text-white shadow-xs"
                    : "text-[#6F6A62] hover:text-[#171717]"
                }`}
              >
                Swipe %
              </button>
            </div>

            {/* Timeframe Filter Buttons */}
            {onTimeframeChange && (
              <div className="flex items-center gap-1 bg-[#EDE8DE] p-1 rounded-xl text-[11px] font-semibold">
                {["7d", "30d", "90d"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => onTimeframeChange(tf)}
                    className={`px-2 py-1 rounded-lg transition-all uppercase ${
                      timeframe === tf
                        ? "bg-white text-[#171717] shadow-xs"
                        : "text-[#6F6A62] hover:text-[#171717]"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recharts Area Chart Container */}
        <div className="h-[260px] sm:h-[300px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C96B4B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C96B4B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="savesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60735A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#60735A" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#285AEB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#285AEB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFD4" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6F6A62" }}
                axisLine={{ stroke: "#DBD2C7" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6F6A62" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip content={<CustomChartTooltip />} />

              {selectedMetric === "views" && (
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Impressions"
                  stroke="#C96B4B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGrad)"
                />
              )}

              {selectedMetric === "saves" && (
                <Area
                  type="monotone"
                  dataKey="saves"
                  name="Community Saves"
                  stroke="#60735A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#savesGrad)"
                />
              )}

              {selectedMetric === "completion" && (
                <Area
                  type="monotone"
                  dataKey="completion_pct"
                  name="Completion %"
                  stroke="#285AEB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#completionGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. WEEK 8 THURSDAY: TEMPLATES & LOCATION CHARTS                    */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Carousel Templates Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-[#DBD2C7] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C96B4B]" />
              <h3 className="font-serif text-sm font-bold text-[#171717]">
                Top Performing Carousel Templates
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#60735A]">
              Swipe %
            </span>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formatData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5DFD4" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#6F6A62" }} unit="%" />
                <YAxis
                  type="category"
                  dataKey="format"
                  tick={{ fontSize: 10, fill: "#171717" }}
                  width={110}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="swipe_through_pct" name="Swipe-Through %" radius={[0, 6, 6, 0]}>
                  {formatData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={FORMAT_COLORS[index % FORMAT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6F6A62] pt-2 border-t border-[#EDE8DE]">
            <span>Highest conversion: <strong>4:5 Panoramic Cuts (84.2%)</strong></span>
            <span className="text-[#60735A] font-bold">96% NuFrame Fit</span>
          </div>
        </div>

        {/* Most Popular Locations Performance */}
        <div className="bg-white rounded-2xl p-5 border border-[#DBD2C7] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C96B4B]" />
              <h3 className="font-serif text-sm font-bold text-[#171717]">
                Most Popular Locations
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F7F4EE] text-[#C96B4B] border border-[#C96B4B]/20">
              Engagement %
            </span>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locationData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFD4" />
                <XAxis
                  dataKey="location"
                  tick={{ fontSize: 9, fill: "#6F6A62" }}
                  interval={0}
                  axisLine={{ stroke: "#DBD2C7" }}
                  tickLine={false}
                  tickFormatter={(val) => val.split(",")[0]}
                />
                <YAxis tick={{ fontSize: 10, fill: "#6F6A62" }} unit="%" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="engagement_rate" name="Engagement Rate %" fill="#C96B4B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6F6A62] pt-2 border-t border-[#EDE8DE]">
            <span>Top Hub: <strong>Pondicherry French Quarter</strong></span>
            <span className="text-[#60735A] font-bold">11.4% Eng Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
