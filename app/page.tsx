"use client";

import Hero from "./components/Hero";
import ChatArea from "./components/ChatArea";
import Navbar from "./components/Navbar";
import BackgroundPattern from "./components/BackgroundPattern";
import { ThemeProvider } from "./components/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="relative flex min-h-screen flex-col bg-[var(--background)]">
        <BackgroundPattern />
        <Navbar />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-start">
          <div className="flex w-full max-w-4xl flex-1 flex-col items-center gap-8 px-4 py-6">
            <Hero />
            <ChatArea />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
