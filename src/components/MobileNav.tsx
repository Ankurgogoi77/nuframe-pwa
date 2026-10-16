"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderClosed, Plus, TrendingUp, BarChart2 } from "lucide-react";
import Image from "next/image";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Vault", href: "/dashboard", icon: FolderClosed, tourId: "creator-vault" },
    { label: "Studio", href: "/studio", icon: Plus, isPrimary: true, tourId: "studio-btn" },
    { label: "Trends", href: "/trends", icon: TrendingUp, tourId: "trend-radar" },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F7F4EE]/90 backdrop-blur-md border-t border-[#DBD2C7] pb-safe pt-1 px-4 sm:max-w-md sm:mx-auto">
      <div className="flex items-center justify-between h-14 max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                data-tour={item.tourId}
                className="relative -top-3 flex flex-col items-center group"
                aria-label="Create with Studio"
              >
                <div className="w-12 h-12 rounded-full bg-[#C96B4B] text-white flex items-center justify-center shadow-lg shadow-[#C96B4B]/30 group-hover:scale-105 active:scale-95 transition-all">
                  <Image
                    src="/nuframe-infinite-frame-mark.svg"
                    alt="Create"
                    width={22}
                    height={22}
                    className="brightness-0 invert"
                  />
                </div>
                <span className="text-[10px] font-semibold text-[#C96B4B] mt-0.5">
                  Create
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              data-tour={item.tourId}
              className={`flex flex-col items-center justify-center w-12 py-1 transition-colors ${
                isActive
                  ? "text-[#C96B4B] font-semibold"
                  : "text-[#6F6A62] hover:text-[#171717]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
