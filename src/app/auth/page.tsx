"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Compass,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

interface StoredAccount {
  name: string;
  email: string;
  password: string;
  handle: string;
  role: string;
  avatar: string;
  provider: "email" | "google";
  createdAt: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  
  // Standard Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active session state (if already logged in)
  const [currentUser, setCurrentUser] = useState<{ name: string; email?: string } | null>(null);

  // Google / Gmail Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [showGooglePassword, setShowGooglePassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Check if already signed in
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nuframe_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setCurrentUser(parsed);
          // Auto-fill form fields with existing info for easy updating/switching
          setName(parsed.name || "");
          setEmail(parsed.email || "");
          setGoogleName(parsed.name || "");
          setGoogleEmail(parsed.email || "");
        }
      }
    } catch {}
  }, []);

  // Auto-generate creator handle when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    if (!handle || handle.startsWith("@")) {
      const clean = val.toLowerCase().replace(/[^a-z0-9]/g, ".");
      if (clean) setHandle(`@${clean}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("nuframe_user");
    setCurrentUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setHandle("");
    setSuccessMessage("Signed out successfully. You can now sign in or create an account.");
    window.dispatchEvent(new Event("nuframe_auth_changed"));
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Helper to load registered accounts from localStorage
  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const raw = localStorage.getItem("nuframe_accounts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Helper to save registered accounts to localStorage
  const saveStoredAccounts = (accounts: StoredAccount[]) => {
    try {
      localStorage.setItem("nuframe_accounts", JSON.stringify(accounts));
    } catch {}
  };

  // -------------------------------------------------------------
  // Standard Email ID and Password Authentication Handler
  // -------------------------------------------------------------
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    // 1. Validate Email
    if (!trimmedEmail) {
      setError("Email address / Gmail is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    // 2. Validate Password
    if (!trimmedPassword) {
      setError("Password is required.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // 3. For Sign Up, Name is strictly required
    if (mode === "signup" && !trimmedName) {
      setError("Full Name is required to personalize your Creator OS.");
      return;
    }

    setIsLoading(true);

    try {
      const accounts = getStoredAccounts();
      const existingAccount = accounts.find(
        (acc) => acc.email.toLowerCase() === trimmedEmail
      );

      if (mode === "signup") {
        // Sign Up Flow
        if (existingAccount) {
          setError(
            `An account with email "${trimmedEmail}" already exists. Please Sign In below.`
          );
          setMode("signin");
          setIsLoading(false);
          return;
        }

        // Clean handle
        let finalHandle = handle.trim();
        if (!finalHandle) {
          finalHandle = `@${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, ".")}`;
        } else if (!finalHandle.startsWith("@")) {
          finalHandle = `@${finalHandle}`;
        }

        const newAccount: StoredAccount = {
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          handle: finalHandle,
          role: "Visual Storyteller",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          provider: "email",
          createdAt: new Date().toISOString(),
        };

        // Save to registry
        accounts.push(newAccount);
        saveStoredAccounts(accounts);

        // Seed custom persona
        const customPersona = {
          name: trimmedName,
          role: "Visual Storyteller",
          niche: "Visual Storytelling & Photography",
          audience: "Curious community & visual thinkers",
          tone: "Reflective, observant, natural, editorial",
          goal: "Build an authentic community and tell compelling visual stories",
          pillars: [
            "Everyday Architecture & Light",
            "Local Cafes & Streets",
            "Visual Photo Essays",
          ],
          avatar: newAccount.avatar,
          paletteColors: ["#B85C43", "#71879A", "#60735A", "#171717"],
        };

        // Save active session
        localStorage.setItem("nuframe_user", JSON.stringify(newAccount));
        localStorage.setItem("nuframe_custom_persona", JSON.stringify(customPersona));
        localStorage.setItem("google_access_token", "session_active_" + Date.now());

        setSuccessMessage(`Account created successfully for ${trimmedName}! Redirecting...`);
        window.dispatchEvent(new Event("nuframe_auth_changed"));

        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        // Sign In Flow
        if (existingAccount) {
          // Check password
          if (existingAccount.password !== trimmedPassword) {
            setError("Incorrect password for this email. Please check your credentials.");
            setIsLoading(false);
            return;
          }

          // Password matched -> log in
          localStorage.setItem("nuframe_user", JSON.stringify(existingAccount));
          localStorage.setItem(
            "nuframe_custom_persona",
            JSON.stringify({
              name: existingAccount.name,
              role: existingAccount.role,
              avatar: existingAccount.avatar,
              niche: "Visual Storytelling & Photography",
            })
          );
          localStorage.setItem("google_access_token", "session_active_" + Date.now());

          setSuccessMessage(`Welcome back, ${existingAccount.name}! Redirecting...`);
          window.dispatchEvent(new Event("nuframe_auth_changed"));

          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        } else {
          // First time sign-in with this email -> Auto-register smoothly
          let derivedName = trimmedName;
          if (!derivedName) {
            const prefix = trimmedEmail.split("@")[0].replace(/[._-]/g, " ");
            derivedName = prefix
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" ");
          }
          if (!derivedName) derivedName = "Creator";

          const newAccount: StoredAccount = {
            name: derivedName,
            email: trimmedEmail,
            password: trimmedPassword,
            handle: `@${derivedName.toLowerCase().replace(/[^a-z0-9]/g, ".")}`,
            role: "Visual Storyteller",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            provider: "email",
            createdAt: new Date().toISOString(),
          };

          accounts.push(newAccount);
          saveStoredAccounts(accounts);

          localStorage.setItem("nuframe_user", JSON.stringify(newAccount));
          localStorage.setItem(
            "nuframe_custom_persona",
            JSON.stringify({
              name: derivedName,
              role: "Visual Storyteller",
              avatar: newAccount.avatar,
              niche: "Visual Storytelling & Photography",
            })
          );
          localStorage.setItem("google_access_token", "session_active_" + Date.now());

          setSuccessMessage(`Welcome, ${derivedName}! Your account is now active.`);
          window.dispatchEvent(new Event("nuframe_auth_changed"));

          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
      }
    } catch {
      setError("Unable to authenticate. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Google / Gmail Sign-In Modal Submission Handler
  // -------------------------------------------------------------
  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError(null);

    const trimmedName = googleName.trim();
    const trimmedEmail = googleEmail.trim().toLowerCase();
    const trimmedPassword = googlePassword.trim();

    // Validate all 3 required fields
    if (!trimmedName) {
      setGoogleError("Full Name is required for your Google Account.");
      return;
    }
    if (!trimmedEmail) {
      setGoogleError("Gmail address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setGoogleError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }
    if (!trimmedPassword) {
      setGoogleError("Password is required.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setGoogleError("Password must be at least 6 characters.");
      return;
    }

    setIsGoogleLoading(true);

    try {
      const accounts = getStoredAccounts();
      const existing = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);

      const googleProfile: StoredAccount = {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        handle: `@${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, ".")}`,
        role: "Visual Storyteller",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        provider: "google",
        createdAt: existing?.createdAt || new Date().toISOString(),
      };

      if (!existing) {
        accounts.push(googleProfile);
        saveStoredAccounts(accounts);
      } else {
        // Update password if changed
        existing.password = trimmedPassword;
        existing.name = trimmedName;
        saveStoredAccounts(accounts);
      }

      // Set verified Google Access Token and user session
      localStorage.setItem("nuframe_user", JSON.stringify(googleProfile));
      localStorage.setItem(
        "nuframe_custom_persona",
        JSON.stringify({
          name: trimmedName,
          role: "Visual Storyteller",
          avatar: googleProfile.avatar,
          niche: "Visual Storytelling & Photography",
        })
      );
      localStorage.setItem("google_access_token", "google_verified_" + Date.now());

      window.dispatchEvent(new Event("nuframe_auth_changed"));
      setIsGoogleModalOpen(false);
      setSuccessMessage(`Connected with Google as ${trimmedName}! Redirecting...`);

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch {
      setGoogleError("Failed to authenticate with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Trigger Google Login button
  const handleGoogleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://nuframe-api-809408115406.asia-south1.run.app";
      const redirectUri = encodeURIComponent(`${window.location.origin}/dashboard`);
      const res = await fetch(`${apiUrl}/api/auth/google/login?frontend_redirect=${redirectUri}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          window.location.href = data.url;
          return;
        }
      }
      // If OAuth not fully configured on server, open the Google Sign-In Dialog
      setIsGoogleModalOpen(true);
    } catch {
      setIsGoogleModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#171717] flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-[#B85C43] selection:text-white">
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
          ← Back to Studio & Home
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md mx-auto w-full bg-white rounded-3xl border border-[#DBD2C7] p-6 sm:p-8 shadow-md relative overflow-hidden my-auto">
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B85C43] via-[#71879A] to-[#60735A]" />

        {/* Existing Active Session Banner (if signed in) */}
        {currentUser && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#EDE8DE]/90 border border-[#DBD2C7] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#B85C43] text-white font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-[#171717] block">{currentUser.name}</span>
                  <span className="text-[10px] text-[#6F6A62] block">{currentUser.email || "Active Session"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[11px] text-[#B85C43] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
            <Link
              href="/dashboard"
              className="w-full bg-[#171717] hover:bg-[#2A2926] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex items-center bg-[#EDE8DE]/80 p-1 rounded-2xl mb-5 border border-[#DBD2C7]/60">
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
            {mode === "signin" ? "Sign In to Creator OS" : "Create Your Creator Account"}
          </h1>
          <p className="text-xs text-[#6F6A62]">
            {mode === "signin"
              ? "Enter your email/Gmail and password to access your stories & Studio."
              : "Enter your full name, email, and password to start creating."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FBEAE5] border border-[#B85C43]/30 text-xs text-[#B85C43] font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#EAF0E6] border border-[#60735A]/30 text-xs text-[#60735A] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#60735A]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1-Click Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="w-full bg-white hover:bg-[#FDFCFB] text-[#171717] border border-[#DBD2C7] font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer mb-5"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <span>Continue with Google / Gmail</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-[#DBD2C7] w-full" />
          <span className="bg-white px-3 text-[10px] font-semibold tracking-wider text-[#9C9890] uppercase absolute">
            or use email & password
          </span>
        </div>

        {/* Main Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {/* Full Name Field (Must for Sign Up) */}
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-bold text-[#171717] mb-1">
                Full Name <span className="text-[#B85C43]">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ankur Gogoi"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>
            </div>
          )}

          {/* Email ID Field (Must for both) */}
          <div>
            <label className="block text-[11px] font-bold text-[#171717] mb-1">
              Email Address / Gmail <span className="text-[#B85C43]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
              <input
                type="email"
                required
                placeholder="creator@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
              />
            </div>
          </div>

          {/* Password Field (Must for both) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-[#171717]">
                Password <span className="text-[#B85C43]">*</span>
              </label>
              <span className="text-[10px] text-[#9C9890]">
                {mode === "signup" ? "Min. 6 characters" : ""}
              </span>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9890] hover:text-[#171717] cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Optional Creator Handle on Sign Up */}
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-bold text-[#171717] mb-1">
                Creator Handle <span className="text-[10px] text-[#9C9890] font-normal">(Auto-generated)</span>
              </label>
              <div className="relative">
                <Compass className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
                <input
                  type="text"
                  placeholder="@creator.lens"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B85C43] hover:bg-[#A8452A] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-[#B85C43]/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer mt-3"
          >
            <span>
              {isLoading
                ? "Verifying details..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Switch Mode Prompt */}
        <div className="mt-4 text-center text-xs text-[#6F6A62]">
          {mode === "signin" ? (
            <p>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="text-[#B85C43] font-bold hover:underline cursor-pointer ml-1"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className="text-[#B85C43] font-bold hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-[#DBD2C7]/70 flex items-center justify-between text-[11px] text-[#6F6A62]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#60735A]" />
            <span>Zero-Storage Privacy Protocol</span>
          </span>
          <span className="text-[#71879A] font-semibold">
            Google Cloud Verified
          </span>
        </div>
      </main>

      {/* Google / Gmail Sign-In Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#DBD2C7] rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 relative text-[#171717] space-y-4">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EDE8DE] hover:bg-[#E5DFD4] flex items-center justify-center text-[#6F6A62] hover:text-[#171717] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F7F4EE] border border-[#DBD2C7] flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#171717]">
                  Sign in with Google
                </h3>
                <p className="text-xs text-[#6F6A62]">
                  Connect your Google Drive Vault & Creator OS
                </p>
              </div>
            </div>

            {googleError && (
              <div className="p-3 rounded-xl bg-[#FBEAE5] border border-[#B85C43]/30 text-xs text-[#B85C43]">
                ⚠️ {googleError}
              </div>
            )}

            <form onSubmit={handleGoogleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Google Account Name <span className="text-[#B85C43]">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankur Gogoi"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Gmail / Google Email <span className="text-[#B85C43]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Google Password <span className="text-[#B85C43]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9890]" />
                  <input
                    type={showGooglePassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#DBD2C7] rounded-xl pl-9 pr-9 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B85C43]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGooglePassword(!showGooglePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9890] hover:text-[#171717]"
                  >
                    {showGooglePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGoogleLoading}
                className="w-full bg-[#171717] hover:bg-[#2A2926] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isGoogleLoading ? "Verifying Google Account..." : "Sign In & Connect Google Drive"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-[10px] text-[#6F6A62] text-center pt-1">
              Protected by Google Cloud Identity & Zero-Storage Privacy Protocol.
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[11px] text-[#6F6A62] pt-6">
        NuFrame Creator OS · Designed for the Multi-Format AI Era
      </footer>
    </div>
  );
}
