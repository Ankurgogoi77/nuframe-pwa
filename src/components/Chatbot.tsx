"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Compass,
  Layers,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "Hello! I'm your **NuFrame Creative Assistant**.\n\nI can help you brainstorm high-converting carousel hooks, plan your 4:5 seamless panoramic cuts, or explore rising regional trends. What are you framing today?",
      timestamp: "Just now",
      suggestedActions: [
        "Draft a 3-slide hook",
        "Check regional trends",
        "How to cut 4:5 panoramas?",
        "Start interactive tour",
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    // If user asked to take the tour, trigger it directly
    if (text.toLowerCase().includes("tour") || text.toLowerCase().includes("guide")) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("start-nuframe-tour"));
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "assistant",
            text: "I've started the **Interactive Spotlight Tour** for you! Follow the glowing markers to explore each feature.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsLoading(false);
        setIsOpen(false);
      }, 500);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      const res = await fetch(`${apiUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedActions: data.suggested_actions,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Backend response error");
      }
    } catch {
      // Intelligent fallback
      let fallbackReply = "";
      const t = text.toLowerCase();
      if (t.includes("hook") || t.includes("travel")) {
        fallbackReply = `Here are 3 high-converting hooks for your visual carousel:\n\n1. **Curiosity Hook:** *"The places we pass every single day without really looking."*\n2. **Relatable Hook:** *"Took 40 photos to capture what one quiet moment felt like."*\n3. **Cinematic Hook:** *"A Sunday study in shadows, chai, and terracotta walls."*\n\n💡 **Tip:** Place your boldest hook on **Slide 1** in serif typography, and use 4:5 panoramic continuity to pull viewers into Slide 2!`;
      } else if (t.includes("trend")) {
        fallbackReply = `📈 **Current Creator Signal Radar:**\n\n- **Rising Format:** *Film-Burn Seamless Panoramic Cuts* (+24% velocity, Low Saturation).\n- **Exploding Format:** *Slow-Paced 'Sunday Study' Micro-Journals* (+42% velocity). Unpolished moments with reflective notes.\n- **Fatigued Format:** *Hyper-fast neon strobe transitions* (-18% drop).\n\nTap **Trend Radar** to see live momentum metrics for Hyderabad, India & global hubs.`;
      } else if (t.includes("panoram") || t.includes("cut") || t.includes("4:5")) {
        fallbackReply = `📐 **Seamless Panoramic Carousels in NuFrame:**\n\n- **4:5 Ratio:** Occupies 92% of the mobile phone screen for maximum viewer retention.\n- **Cutline Guide:** Keep focal elements away from the dashed boundary lines.\n- **Pillow Splicer:** Tap **Export** in Studio to slice your panorama and download a ready-to-post ZIP bundle!`;
      } else {
        fallbackReply = `I'm here to assist with all your storytelling and creative direction!\n\nYou can ask me to draft carousel hooks, examine regional trends, or guide you through creating seamless 4:5 panoramic carousels in Studio.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedActions: ["Draft a 3-slide hook", "Check regional trends", "Take the Tour"],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div
        data-tour="chatbot-trigger"
        className="fixed bottom-20 md:bottom-6 right-4 z-40"
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-14 h-14 rounded-full bg-[#1C1B19] text-[#F7F4EE] border-2 border-[#C96B4B] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative"
          aria-label="Toggle AI Creative Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-[#F7F4EE]" />
          ) : (
            <>
              <div className="w-6 h-6 relative">
                <Image
                  src="/nuframe-infinite-frame-mark.svg"
                  alt="Assistant"
                  fill
                  className="brightness-0 invert object-contain group-hover:rotate-12 transition-transform"
                />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C96B4B] rounded-full border-2 border-[#1C1B19] flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-4 z-40 w-[92vw] max-w-[390px] h-[520px] bg-[#1C1B19] text-[#F7F4EE] border border-[#C96B4B]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-[#242320] border-b border-[#33312C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C96B4B] flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/nuframe-infinite-frame-mark.svg"
                  alt="NuFrame Logo"
                  width={18}
                  height={18}
                  className="brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#F7F4EE] flex items-center gap-1.5">
                  <span>NuFrame Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-[#60735A] inline-block" />
                </h3>
                <p className="text-[10px] text-[#9C9890]">
                  AI Creative Director & Trend Strategist
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#9C9890] hover:text-[#F7F4EE] transition-colors rounded-lg"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-6 h-6 rounded-lg bg-[#C96B4B]/20 text-[#D97855] border border-[#C96B4B]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[82%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-[#C96B4B] text-white rounded-br-sm"
                        : "bg-[#242320] text-[#E6E1D8] border border-[#33312C] rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((action) => (
                        <button
                          key={action}
                          onClick={() => handleSendMessage(action)}
                          className="px-2.5 py-1 rounded-full bg-[#2A2926] hover:bg-[#33312C] text-[#DBD2C7] hover:text-[#F7F4EE] text-[10px] font-medium border border-[#3A3833] transition-all"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-[#6F6A62] block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-6 h-6 rounded-lg bg-[#33312C] text-[#DBD2C7] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#9C9890] p-2 bg-[#242320] rounded-xl w-fit border border-[#33312C]">
                <RefreshCw className="w-3 h-3 animate-spin text-[#C96B4B]" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#242320] border-t border-[#33312C] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about hooks, trends, cuts..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#1C1B19] border border-[#33312C] rounded-xl px-3.5 py-2 text-xs text-[#F7F4EE] placeholder-[#6F6A62] focus:outline-none focus:ring-1 focus:ring-[#C96B4B] transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-[#C96B4B] hover:bg-[#B3593B] text-white disabled:opacity-50 transition-all active:scale-95 shadow-md"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
