"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import {
  Search,
  Bell,
  Sparkles,
  BookOpen,
  Layers,
  Smartphone,
  LayoutGrid,
  MapPin,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Compass,
  Home as HomeIcon,
  FolderOpen,
  Send,
  BarChart2,
  Globe,
  Settings,
  Sliders,
  Lightbulb,
} from "lucide-react";
import CreatorBrainModal, { PRESET_PROFILES, CreatorProfileData } from "@/components/CreatorBrainModal";
import GoogleAuthModal from "@/components/GoogleAuthModal";
import GoogleMapsModal from "@/components/GoogleMapsModal";

export default function NuFrameApp() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBrainModalOpen, setIsBrainModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState("Pondicherry, India");
  const [activeProfile, setActiveProfile] = useState<CreatorProfileData>(PRESET_PROFILES.ananya);
  const [rawIdea, setRawIdea] = useState("");

  const filters = ["All", "Travel", "Life", "Food", "Friends", "Work", "Unpublished"];

  const journals = [
    {
      id: "pondicherry",
      title: "Pondicherry",
      subtitle: "French Quarter & Promenade",
      date: "May 2026",
      photosCount: 24,
      storiesCount: 3,
      location: "Pondicherry, India",
      tag: "Travel",
      coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      featuredQuote: "Yellow walls, salty air and quiet alleyways.",
    },
    {
      id: "goa",
      title: "Goa Trip",
      subtitle: "Sunsets & Old Portuguese Mansions",
      date: "Apr 2026",
      photosCount: 42,
      storiesCount: 5,
      location: "Goa, India",
      tag: "Life",
      coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      featuredQuote: "Good food. Better company. Unforgettable sunsets.",
    },
    {
      id: "hyderabad",
      title: "Hyderabad",
      subtitle: "Charminar, Chai & Evening Lights",
      date: "Mar 2026",
      photosCount: 18,
      storiesCount: 2,
      location: "Hyderabad, India",
      tag: "Food",
      coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
      featuredQuote: "Irani chai, pearls and old city stories.",
    },
    {
      id: "ooty",
      title: "Ooty",
      subtitle: "Tea Estates & Nilgiri Mountain Rails",
      date: "Feb 2026",
      photosCount: 36,
      storiesCount: 4,
      location: "Tamil Nadu, India",
      tag: "Travel",
      coverImage: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
      featuredQuote: "Misty hills and eucalyptus breezes.",
    },
  ];

  const quickActions = [
    {
      label: "Journal",
      icon: BookOpen,
      href: "/studio?mode=journal",
      bg: "bg-[#F4ECE4]",
      textColor: "text-[#C96B4B]",
      borderColor: "border-[#C96B4B]/30",
    },
    {
      label: "Carousel",
      icon: Layers,
      href: "/studio?mode=carousel",
      bg: "bg-[#EAF0E6]",
      textColor: "text-[#60735A]",
      borderColor: "border-[#60735A]/30",
    },
    {
      label: "Story",
      icon: Smartphone,
      href: "/studio?mode=story",
      bg: "bg-[#F7F2E6]",
      textColor: "text-[#C6A15B]",
      borderColor: "border-[#C6A15B]/30",
    },
    {
      label: "Collage",
      icon: LayoutGrid,
      href: "/studio?mode=collage",
      bg: "bg-[#EBF2F7]",
      textColor: "text-[#4F6D85]",
      borderColor: "border-[#71879A]/30",
    },
  ];

  const sidebarLinks = [
    { label: "Home", href: "/", icon: HomeIcon, active: true },
    { label: "My Journals", href: "/", icon: BookOpen },
    { label: "Create", href: "/studio", icon: Plus, tourId: "studio-btn" },
    { label: "Templates", href: "/studio", icon: LayoutGrid },
    { label: "Publish", href: "/dashboard", icon: Send, tourId: "creator-vault" },
    { label: "Trends & Signals", href: "/trends", icon: Compass, tourId: "trend-radar" },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
    { label: "Explore", href: "/", icon: Globe },
  ];

  const filteredJournals = journals.filter((j) => {
    const matchesFilter = activeFilter === "All" || j.tag === activeFilter;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#171717] font-sans flex flex-col md:flex-row">
      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (Visible on md+ screens matching brand mockup) */}
      {/* ============================================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-[#EDE8DE] border-r border-[#DBD2C7] p-5 justify-between shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Brand Logo & Lockup */}
          <Link href="/" className="flex items-center gap-3" data-tour="brand-logo">
            <div className="w-8 h-8 relative">
              <Image
                src="/nuframe-infinite-frame-mark.svg"
                alt="NuFrame Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
                NuFrame
              </span>
              <p className="text-[10px] font-semibold tracking-wider text-[#6F6A62] uppercase">
                Creator OS
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  data-tour={item.tourId}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    item.active
                      ? "bg-[#C96B4B]/15 text-[#C96B4B] shadow-sm"
                      : "text-[#6F6A62] hover:text-[#171717] hover:bg-[#E5DFD4]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? "text-[#C96B4B]" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Re-trigger Interactive Tour */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("start-nuframe-tour"))}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#6F6A62] hover:text-[#C96B4B] hover:bg-[#E5DFD4] transition-all w-full text-left group"
            >
              <Sparkles className="w-4 h-4 text-[#C96B4B] group-hover:rotate-12 transition-transform" />
              <span>Interactive Tour</span>
            </button>
          </nav>
        </div>

        {/* User Profile Card at Sidebar Footer */}
        <div
          onClick={() => setIsBrainModalOpen(true)}
          className="pt-4 border-t border-[#DBD2C7] flex items-center justify-between cursor-pointer group hover:bg-[#E5DFD4]/60 p-2 rounded-xl transition-all"
          title="Inspect & Switch Creator Brain"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C96B4B]/40 relative">
              <Image
                src={activeProfile.avatar}
                alt={activeProfile.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#171717]">{activeProfile.name}</p>
              <p className="text-[10px] text-[#C96B4B] font-semibold">Brain Active ⚙️</p>
            </div>
          </div>
          <button className="text-[#6F6A62] group-hover:text-[#171717]" aria-label="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN VIEWPORT (Responsive: Mobile PWA on small, Webapp on md+) */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header (Hidden on md+) */}
        <header className="md:hidden sticky top-0 z-40 bg-[#F7F4EE]/90 backdrop-blur-md px-4 py-3 border-b border-[#DBD2C7]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 relative">
                <Image
                  src="/nuframe-infinite-frame-mark.svg"
                  alt="NuFrame Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#171717]">
                NuFrame
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Tour Button */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("start-nuframe-tour"))}
                className="w-9 h-9 rounded-full bg-[#EDE8DE] flex items-center justify-center text-[#C96B4B] hover:bg-[#E5DFD4] transition-colors"
                aria-label="Start interactive feature tour"
                title="Interactive Tour"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-full bg-[#EDE8DE] flex items-center justify-center text-[#6F6A62] hover:text-[#171717] transition-colors"
                aria-label="Vault"
              >
                <ImageIcon className="w-4 h-4" />
              </Link>
              {/* Google Cloud Identity Button */}
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-9 h-9 rounded-full bg-white border border-[#DBD2C7] flex items-center justify-center hover:bg-[#EDE8DE] transition-colors cursor-pointer"
                aria-label="Google Cloud Identity"
                title="Google Account"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </button>

              <button
                className="w-9 h-9 rounded-full bg-[#EDE8DE] flex items-center justify-center text-[#6F6A62] hover:text-[#171717] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C96B4B]" />
              </button>
              <div
                onClick={() => setIsBrainModalOpen(true)}
                className="w-9 h-9 rounded-full overflow-hidden border border-[#C96B4B]/40 relative cursor-pointer"
                title="Inspect Creator Brain"
              >
                <Image
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Webapp Header (Visible on md+) */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-[#DBD2C7]/60 bg-[#F7F4EE]/80 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
              Good morning, {activeProfile.name}
            </h1>
            <p className="text-xs text-[#6F6A62] mt-0.5">
              Turn your moments into visual stories · {activeProfile.role}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Search Bar */}
            <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6A62]" />
              <input
                type="text"
                placeholder="Search your journals, photos or templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#EDE8DE] border border-[#DBD2C7] rounded-full pl-9 pr-4 py-2 text-xs text-[#171717] placeholder-[#6F6A62] focus:outline-none focus:ring-1 focus:ring-[#C96B4B] transition-all"
              />
            </div>

            <button
              className="w-9 h-9 rounded-full bg-[#EDE8DE] flex items-center justify-center text-[#6F6A62] hover:text-[#171717] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C96B4B]" />
            </button>

            {/* Continue with Google Button */}
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FDFCFB] text-[#171717] text-xs font-semibold px-3.5 py-2 rounded-full border border-[#DBD2C7] transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Google Cloud Account Identity"
              title="Sign in with Google Cloud"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Google Maps Location Explorer CTA */}
            <button
              onClick={() => {
                setSelectedMapLocation("Pondicherry, India");
                setIsMapModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-[#EDE8DE] hover:bg-[#E5DFD4] text-[#171717] text-xs font-semibold px-3 py-2 rounded-full border border-[#DBD2C7] transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="Google Maps Location Explorer"
              title="Explore Creator Hotspots on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>Google Maps</span>
            </button>

            {/* "Take Tour" Interactive Guide CTA */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("start-nuframe-tour"))}
              className="inline-flex items-center gap-1.5 bg-[#EDE8DE] hover:bg-[#E5DFD4] text-[#171717] text-xs font-semibold px-3.5 py-2 rounded-full border border-[#DBD2C7] transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Start interactive feature tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C96B4B]" />
              <span>Take Tour</span>
            </button>

            {/* "+ Create Journal" Desktop CTA Button */}
            <Link
              href="/studio"
              data-tour="studio-btn"
              className="inline-flex items-center gap-2 bg-[#C96B4B] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md shadow-[#C96B4B]/20 hover:bg-[#B85C43] active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Journal
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-8 py-4 space-y-6 max-w-6xl w-full">
          {/* Mobile Search Bar (Only shown on mobile) */}
          <div className="md:hidden relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6A62]" />
            <input
              type="text"
              placeholder="Search your journals, photos or templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EDE8DE] border border-[#DBD2C7] rounded-full pl-9 pr-4 py-2.5 text-xs text-[#171717] placeholder-[#6F6A62] focus:outline-none focus:ring-1 focus:ring-[#C96B4B] transition-all"
            />
          </div>

          {/* AI Story Spark Card */}
          <section
            data-tour="ai-director-banner"
            className="bg-gradient-to-br from-[#EDE8DE] via-[#F4ECE4] to-[#F7F4EE] border border-[#C96B4B]/30 rounded-2xl p-5 shadow-sm relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 pr-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C96B4B]/15 text-[#C96B4B] text-[10px] font-bold tracking-wide uppercase">
                  <Sparkles className="w-3 h-3" />
                  Multimodal AI Director
                </div>
                <h2 className="font-serif text-lg font-bold text-[#171717]">
                  Have fresh photos to journal?
                </h2>
                <p className="text-xs text-[#6F6A62] max-w-xl leading-relaxed">
                  Upload 3–5 pictures from your camera roll. NuFrame AI analyzes lighting, mood, story angles, and directs your next multi-slide carousel.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/studio?action=upload"
                  className="inline-flex items-center gap-2 bg-[#C96B4B] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-md shadow-[#C96B4B]/20 hover:bg-[#B85C43] active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload & Auto-Direct
                </Link>
                <Link
                  href="/trends"
                  className="inline-flex items-center gap-1.5 bg-white/70 border border-[#DBD2C7] text-[#171717] text-xs font-medium px-3.5 py-2.5 rounded-full hover:bg-white transition-all"
                >
                  <Compass className="w-3.5 h-3.5 text-[#60735A]" />
                  Check Trends
                </Link>
              </div>
            </div>

            {/* Idea Inbox Row (PRD 5.2 & FR-02) */}
            <div className="mt-4 pt-3 border-t border-[#DBD2C7]/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#C96B4B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Idea Inbox: e.g. 48 hours in Pondicherry, slow chai notes..."
                  value={rawIdea}
                  onChange={(e) => setRawIdea(e.target.value)}
                  className="w-full bg-white/80 border border-[#DBD2C7] rounded-full pl-8 pr-3 py-2 text-xs text-[#171717] placeholder-[#9C9890] focus:outline-none focus:ring-1 focus:ring-[#C96B4B]"
                />
              </div>
              <Link
                href={`/studio?idea=${encodeURIComponent(rawIdea || "Visual storytelling reflections")}`}
                className="bg-[#1C1B19] hover:bg-[#2A2926] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                <Sparkles className="w-3 h-3 text-[#D97855]" />
                <span>Send to Studio</span>
              </Link>
            </div>
          </section>

          {/* Editorial Cloud-Native Architecture Showcase */}
          <section className="hidden md:flex items-center justify-between bg-white border border-[#DBD2C7] rounded-2xl p-5 shadow-sm gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2F7] text-[#4F6D85] border border-[#71879A]/30">
                  Cloud-Native Architecture
                </span>
                <span className="text-xs font-semibold text-[#6F6A62]">
                  Creator Operating System
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Seamless Visual Storytelling Across Studio, Vault & Cloud
              </h3>
              <p className="text-xs text-[#6F6A62] max-w-lg leading-relaxed">
                Connect your high-resolution photography directly from Google Drive Vault, let Gemini AI orchestrate your multi-slide narrative, and broadcast across social channels with automated panoramic alignment.
              </p>
              <div className="flex items-center gap-4 pt-1 text-xs font-semibold">
                <span className="flex items-center gap-1 text-[#C96B4B]">
                  ✓ Multi-Slide Carousels
                </span>
                <span className="flex items-center gap-1 text-[#4F6D85]">
                  ✓ Google Gemini Multimodal AI
                </span>
                <span className="flex items-center gap-1 text-[#60735A]">
                  ✓ Google Drive Vault
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 bg-[#71879A] hover:bg-[#5C7487] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Open Creative Studio
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 bg-[#EDE8DE] hover:bg-[#E5DFD4] text-[#171717] text-xs font-semibold px-3.5 py-2.5 rounded-full border border-[#DBD2C7] active:scale-95 transition-all"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#C96B4B]" />
                Open Vault
              </Link>
            </div>
          </section>

          {/* Quick Actions Row (Mobile PWA Grid) */}
          <section data-tour="quick-actions" className="md:hidden space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6F6A62]">
              Create Something New
            </h2>
            <div className="grid grid-cols-4 gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${action.bg} border ${action.borderColor} flex items-center justify-center ${action.textColor} shadow-sm group-hover:scale-105 active:scale-95 transition-all duration-200`}
                    >
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-medium text-[#171717] mt-1.5">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Filter Pills */}
          <section>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {filters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-semibold ${
                      isActive
                        ? "bg-[#C96B4B] text-white shadow-sm"
                        : "bg-[#EDE8DE] text-[#6F6A62] hover:text-[#171717] hover:bg-[#E5DFD4]"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Journals Cards Grid (Responsive 1-col on mobile, 2-col on md, 4-col on lg) */}
          <section className="space-y-4 pb-20 md:pb-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#171717]">
                My Journals
              </h2>
              <span className="text-xs font-semibold text-[#C96B4B] hover:underline cursor-pointer">
                See all ({journals.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredJournals.map((journal) => (
                <Link
                  key={journal.id}
                  href={`/studio?journalId=${journal.id}`}
                  className="block bg-white rounded-2xl overflow-hidden border border-[#DBD2C7] shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Photo Banner with Stamp Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#EDE8DE]">
                    <Image
                      src={journal.coverImage}
                      alt={journal.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Postal / Date Stamp Tag */}
                    <div className="absolute top-3 left-3 bg-[#F7F4EE]/90 backdrop-blur-sm border border-[#C96B4B]/40 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-[#171717] shadow-sm flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#C96B4B]" />
                      {journal.date}
                    </div>

                    {/* Location Tag - Clickable to Google Maps */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMapLocation(journal.location);
                        setIsMapModalOpen(true);
                      }}
                      className="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-xs font-medium drop-shadow bg-black/40 hover:bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-xs transition-all cursor-pointer group/loc border border-white/10"
                      title="View on Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#EA4335] group-hover/loc:scale-110 transition-transform" />
                      <span>{journal.location}</span>
                    </button>

                    {/* Story Count Pill */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                      {journal.photosCount} photos · {journal.storiesCount} stories
                    </div>
                  </div>

                  {/* Journal Details */}
                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-bold text-[#171717] group-hover:text-[#C96B4B] transition-colors">
                        {journal.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-[#6F6A62] group-hover:text-[#C96B4B] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-[#6F6A62] italic line-clamp-1">
                      "{journal.featuredQuote}"
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Mobile-Only Bottom Navigation Dock */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Creator Brain Persona Modal (FR-01) */}
      <CreatorBrainModal
        isOpen={isBrainModalOpen}
        onClose={() => setIsBrainModalOpen(false)}
        onProfileChange={(p) => setActiveProfile(p)}
      />

      {/* Google Cloud Identity Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        currentUser={{
          name: activeProfile.name,
          email: `${activeProfile.name.toLowerCase().replace(" ", ".")}@gmail.com`
        }}
      />

      {/* Google Maps Location Explorer & Tagger Modal */}
      <GoogleMapsModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        initialQuery={selectedMapLocation}
      />
    </div>
  );
}
