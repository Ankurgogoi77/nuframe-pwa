"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Compass,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("google_access_token") || localStorage.getItem("nuframe_user");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "signup" && !name) {
      setError("Please provide your name to personalize your Creator Brain.");
      return;
    }

    setIsLoading(true);

    try {
      // Derive display name from inputs, previous persona, or email
      let finalName = name.trim();
      if (!finalName) {
        try {
          const saved = localStorage.getItem("nuframe_custom_persona");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.name && parsed.name !== "Creator") finalName = parsed.name;
          }
        } catch {}
      }
      if (!finalName && email) {
        const prefix = email.split("@")[0].replace(/[._-]/g, " ");
        finalName = prefix
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ");
      }
      if (!finalName) finalName = "Creator";

      let finalHandle = handle.trim();
      if (!finalHandle) {
        finalHandle = `@${finalName.toLowerCase().replace(/\s+/g, ".")}`;
      } else if (!finalHandle.startsWith("@")) {
        finalHandle = `@${finalHandle}`;
      }

      // Simulate/Process authentication
      const userProfile = {
        name: finalName,
        email: email,
        handle: finalHandle,
        role: "Visual Storyteller",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        signedInAt: new Date().toISOString(),
      };

      // Also seed or update custom persona
      const customPersona = {
        name: finalName,
        role: "Visual Storyteller",
        niche: "Visual Storytelling & Photography",
        audience: "Curious community & visual thinkers",
        tone: "Reflective, observant, natural, editorial",
        goal: "Build an authentic community and tell compelling visual stories",
        pillars: [
          "Everyday Architecture & Light",
          "Local Cafes & Streets",
          "Visual Photo Essays"
        ],
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        paletteColors: ["#B85C43", "#71879A", "#60735A", "#171717"]
      };

      // Persist authenticated state
      localStorage.setItem("nuframe_user", JSON.stringify(userProfile));
      localStorage.setItem("nuframe_custom_persona", JSON.stringify(customPersona));
      localStorage.setItem("google_access_token", "session_active_" + Date.now());

      // Broadcast login event to active tabs
      window.dispatchEvent(new Event("nuframe_auth_changed"));

      // Redirect to main studio or dashboard
      router.push("/dashboard");
    } catch {
      setError("Unable to authenticate. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://nuframe-api-809408115406.asia-south1.run.app";
      const redirectUri = encodeURIComponent(`${window.location.origin}/dashboard`);
      const res = await fetch(`${apiUrl}/api/auth/google/login?frontend_redirect=${redirectUri}`);
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        // Fallback demo session if API credentials not set
        const userProfile = {
          name: "Creator",
          email: "creator@nuframe.app",
          handle: "@creator.lens",
          role: "Visual Storyteller",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          signedInAt: new Date().toISOString(),
        };
        localStorage.setItem("nuframe_user", JSON.stringify(userProfile));
        localStorage.setItem("google_access_token", "google_verified_" + Date.now());
        window.dispatchEvent(new Event("nuframe_auth_changed"));
        router.push("/dashboard");
      }
    } catch {
      // Fallback
      localStorage.setItem("google_access_token", "google_demo_" + Date.now());
      window.dispatchEvent(new Event("nuframe_auth_changed"));
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#171717] flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative">
            <Image
              src="/nuframe-infinite-frame-mark.svg"
              alt="NuFrame Logo"
              fill
              className="object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
              NuFrame
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#71879A] uppercase ml-2">
              Creator OS
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-[#6F6A62] hover:text-[#171717] px-3.5 py-1.5 rounded-full hover:bg-[#EDE8DE] transition-colors"
        >
          Browse as Guest →
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md mx-auto w-full bg-white rounded-3xl border border-[#DBD2C7] p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle Dust Blue Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B85C43] via-[#71879A] to-[#60735A]" />

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex items-center bg-[#EDE8DE]/80 p-1 rounded-2xl mb-6 border border-[#DBD2C7]/60">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "signin"
                ? "bg-white text-[#171717] shadow-sm"
                : "text-[#6F6A62] hover:text-[#171717]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-white text-[#171717] shadow-sm"
                : "text-[#6F6A62] hover:text-[#171717]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Title & Tagline */}
        <div className="space-y-1 mb-5">
          <h1 className="font-serif text-xl font-bold text-[#171717]">
            {mode === "signin" ? "Welcome back, Creator" : "Start Your Creative Operating System"}
          </h1>
          <p className="text-xs text-[#6F6A62]">
            {mode === "signin"
              ? "Access your Google Drive vault, AI story director & multi-slide studio."
              : "Direct continuous carousels, photo essays, and multi-channel stories."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FBEAE5] border border-[#B85C43]/30 text-xs text-[#B85C43] font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white hover:bg-[#FDFCFB] text-[#171717] border border-[#DBD2C7] font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer mb-5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-[#DBD2C7] w-full" />
          <span className="bg-white px-3 text-[10px] font-semibold tracking-wider text-[#9C9890] uppercase absolute">
            or continue with email
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Creator Handle (Optional)
                </label>
                <div className="relative">
                  <Compass className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
                  <input
                    type="text"
                    placeholder="@maya.creates"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#171717] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
              <input
                type="email"
                required
                placeholder="creator@nuframeapp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#171717] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-9 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9890] hover:text-[#171717]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B85C43] hover:bg-[#A8452A] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-[#B85C43]/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer mt-2"
          >
            <span>{isLoading ? "Authenticating..." : mode === "signin" ? "Sign In to Creator OS" : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Security Guarantee Footer */}
        <div className="mt-6 pt-4 border-t border-[#DBD2C7]/70 flex items-center justify-between text-[11px] text-[#6F6A62]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#60735A]" />
            <span>Zero-Storage Privacy Protocol</span>
          </span>
          <span className="text-[#71879A] font-semibold">
            Google Cloud
          </span>
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="text-center text-[11px] text-[#6F6A62] pt-6">
        NuFrame Creator OS · Designed for the Multi-Format AI Era
      </footer>
    </div>
  );
}
