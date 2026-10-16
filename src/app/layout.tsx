import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import InstallPrompt from "@/components/InstallPrompt";
import TutorialTour from "@/components/TutorialTour";
import Chatbot from "@/components/Chatbot";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NuFrame | Creator OS",
  description: "Capture · Journal · Create · Share — Your moments, beautifully framed.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NuFrame",
  },
};

export const viewport: Viewport = {
  themeColor: "#C96B4B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full font-sans antialiased bg-[#F7F4EE] text-[#171717] selection:bg-[#C96B4B] selection:text-white"
        suppressHydrationWarning
      >
        <PWARegister />
        <InstallPrompt />
        <TutorialTour />
        <Chatbot />
        {children}
      </body>
    </html>
  );
}
