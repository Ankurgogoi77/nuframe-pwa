"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle2, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if running as installed standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Check if iOS
    const ua = window.navigator.userAgent;
    const isIPadOrIPhone = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIPadOrIPhone);

    // Capture Chrome/Edge beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsStandalone(true);
      setInstalledSuccessfully(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalledSuccessfully(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers where install prompt isn't directly triggered
      alert("To install NuFrame: Click your browser menu (⋮ or Share) and select 'Install app' or 'Add to Home Screen'.");
    }
  };

  // Don't render if not mounted (prevents SSR hydration mismatch), already in standalone mode, or dismissed
  if (!mounted || isStandalone || dismissed) {
    return null;
  }

  return (
    <>
      {/* Top / Floating Install Banner for Mobile & Web */}
      <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="bg-[#1C1B19]/95 backdrop-blur-md text-[#F4F0E8] p-3.5 rounded-2xl border border-[#C96B4B]/40 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C96B4B] flex items-center justify-center shrink-0 shadow-md">
              <Image
                src="/nuframe-infinite-frame-mark.svg"
                alt="NuFrame Logo"
                width={20}
                height={20}
                className="brightness-0 invert"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-[#F7F4EE]">Install NuFrame App</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C96B4B]/20 text-[#D97855] border border-[#C96B4B]/30">
                  PWA
                </span>
              </div>
              <p className="text-xs text-[#9C9890] mt-0.5">
                Full-screen experience · Works offline · Fast camera launch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-[#C96B4B] hover:bg-[#B3593B] text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-[#9C9890] hover:text-[#F4F0E8] transition-colors rounded-lg"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Install Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#1C1B19] border border-[#2A2926] text-[#F7F4EE] rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C96B4B] flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-serif font-bold text-lg">Install on iOS (Safari)</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-[#9C9890] hover:text-[#F7F4EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#DBD2C7]">
              Install NuFrame to your Home Screen for full-screen camera access, instant launches, and offline journals:
            </p>

            <div className="space-y-3 bg-[#242320] p-4 rounded-2xl border border-[#33312C] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#C96B4B]/20 text-[#D97855] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex items-center gap-1.5 text-[#E6E1D8]">
                  <span>Tap the</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#33312C] text-[#F7F4EE] font-medium">
                    <Share className="w-3.5 h-3.5 text-[#D97855]" /> Share
                  </span>
                  <span>icon below</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#C96B4B]/20 text-[#D97855] font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="flex items-center gap-1.5 text-[#E6E1D8]">
                  <span>Select</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#33312C] text-[#F7F4EE] font-medium">
                    <PlusSquare className="w-3.5 h-3.5 text-[#D97855]" /> Add to Home Screen
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#C96B4B]/20 text-[#D97855] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <span className="text-[#E6E1D8]">Tap <strong>Add</strong> in top-right corner. Done!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#C96B4B] text-white font-semibold text-xs text-center hover:bg-[#B3593B] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
