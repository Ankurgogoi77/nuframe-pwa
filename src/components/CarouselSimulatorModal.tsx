"use client";

import { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Smartphone, Heart, MessageCircle, Send, Bookmark, Sparkles } from "lucide-react";
import Image from "next/image";

interface CarouselSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  slideCount: number;
  aspectRatio: "4:5" | "1:1";
  title: string;
  caption: string;
  stampText: string;
  curvedText: string;
  pan: { x: number; y: number };
  zoom: number;
}

export default function CarouselSimulatorModal({
  isOpen,
  onClose,
  imageUrl,
  slideCount = 3,
  aspectRatio = "4:5",
  title,
  caption,
  stampText,
  curvedText,
  pan,
  zoom,
}: CarouselSimulatorModalProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleScroll = () => {
    if (trackRef.current) {
      const scrollLeft = trackRef.current.scrollLeft;
      const width = trackRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setActiveSlide(index);
    }
  };

  const scrollToSlide = (index: number) => {
    if (trackRef.current) {
      const width = trackRef.current.clientWidth;
      trackRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
      setActiveSlide(index);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#2A2926] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-[#F4F0E8] flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2926] bg-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#D97855]" />
            <div>
              <h2 className="font-serif font-bold text-sm text-[#F4F0E8]">
                Swipe-Test Simulator
              </h2>
              <p className="text-[11px] text-[#9C9890]">
                Simulating Instagram & LinkedIn carousel swipe flow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#20201E] hover:bg-[#2A2926] flex items-center justify-center text-[#9C9890] hover:text-[#F4F0E8] transition-colors cursor-pointer"
            aria-label="Close simulator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Smartphone Shell Viewport */}
        <div className="p-4 overflow-y-auto flex flex-col items-center">
          {/* Simulated Instagram Post Header */}
          <div className="w-full max-w-xs flex items-center justify-between py-2 px-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FBBC05] via-[#EA4335] to-[#9B51E0] p-0.5">
                <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center text-[10px] font-bold text-[#D97855]">
                  NF
                </div>
              </div>
              <span className="font-bold text-xs text-white">ananya.creates</span>
            </div>
            <span className="text-[10px] text-[#9C9890] font-mono">
              Slide {activeSlide + 1}/{slideCount}
            </span>
          </div>

          {/* Swipe Track Container with Relative Slices */}
          <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-[#2A2926] bg-black shadow-2xl group">
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
              style={{ scrollBehavior: "smooth" }}
            >
              {[...Array(slideCount)].map((_, index) => {
                // Calculate the horizontal offset window for seamless panorama slicing
                const offsetPercentage = -(index * 100);

                return (
                  <div
                    key={index}
                    className={`shrink-0 w-full snap-start relative overflow-hidden select-none ${
                      aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
                    }`}
                  >
                    {/* Seamless Panorama Window */}
                    <div
                      className="absolute inset-0"
                      style={{
                        width: `${slideCount * 100}%`,
                        transform: `translateX(${offsetPercentage / slideCount}%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: "center center",
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Slide slice ${index + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

                    {/* Stamp on Slide 1 */}
                    {index === 0 && (
                      <div className="absolute top-4 right-4 bg-[#F7F4EE]/95 border border-[#C96B4B] text-[#171717] px-2 py-0.5 rounded shadow text-[9px] font-extrabold uppercase pointer-events-none transform rotate-1">
                        {stampText}
                      </div>
                    )}

                    {/* Title on First Slide */}
                    {index === 0 && (
                      <div className="absolute top-14 left-4 right-4 text-center pointer-events-none">
                        <h3 className="font-serif text-2xl font-black text-white tracking-widest drop-shadow-md">
                          {title}
                        </h3>
                      </div>
                    )}

                    {/* Slide Number Watermark */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full pointer-events-none">
                      Slice {index + 1}
                    </div>

                    {/* Caption on Last Slide */}
                    {index === slideCount - 1 && (
                      <div className="absolute bottom-4 left-4 right-4 bg-[#F7F4EE]/90 backdrop-blur-xs text-[#171717] p-2.5 rounded-xl shadow-lg pointer-events-none">
                        <p className="font-sans text-[11px] italic leading-snug">
                          "{caption}"
                        </p>
                        <span className="text-[9px] text-[#C96B4B] font-bold block mt-1">
                          {curvedText}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Left / Right Arrow Overlays */}
            {activeSlide > 0 && (
              <button
                onClick={() => scrollToSlide(activeSlide - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {activeSlide < slideCount - 1 && (
              <button
                onClick={() => scrollToSlide(activeSlide + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Social Actions Simulation Bar */}
          <div className="w-full max-w-xs flex items-center justify-between py-2.5 px-1 text-white">
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 hover:text-[#EA4335] cursor-pointer transition-colors" />
              <MessageCircle className="w-4 h-4 cursor-pointer hover:text-gray-300" />
              <Send className="w-4 h-4 cursor-pointer hover:text-gray-300" />
            </div>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center gap-1">
              {[...Array(slideCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === i ? "w-4 bg-[#D97855]" : "w-1.5 bg-[#3A3833]"
                  }`}
                  aria-label={`Jump to slide ${i + 1}`}
                />
              ))}
            </div>

            <Bookmark className="w-4 h-4 cursor-pointer hover:text-gray-300" />
          </div>

          {/* Swipe Instructions Prompt */}
          <div className="text-center mt-2 space-y-1">
            <p className="text-xs text-[#9C9890] flex items-center justify-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D97855]" />
              Swipe or use arrows to test panoramic alignment
            </p>
            <p className="text-[10px] text-gray-500">
              Notice how the horizon line connects across slice boundaries without seams.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#2A2926] bg-[#1A1A1A] flex items-center justify-between">
          <span className="text-xs text-[#9C9890]">
            Format: {aspectRatio} · {slideCount} Seamless Slices
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#D97855] hover:bg-[#C96B4B] text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Done Testing
          </button>
        </div>
      </div>
    </div>
  );
}
