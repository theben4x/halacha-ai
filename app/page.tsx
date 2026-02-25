"use client";

import { useState, useCallback } from "react";
import Hero from "./components/Hero";
import ChatArea from "./components/ChatArea";
import Navbar from "./components/Navbar";
import BackgroundPattern from "./components/BackgroundPattern";
import { ThemeProvider } from "./components/ThemeProvider";

export default function Home() {
  const [hasContent, setHasContent] = useState(false);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

  const handleLogoReset = useCallback(() => {
    setResetViewTrigger((k) => k + 1);
  }, []);

  return (
    <ThemeProvider>
      <div className="relative flex min-h-screen flex-col bg-[var(--background)]">
        <BackgroundPattern />
        <Navbar onResetView={handleLogoReset} />
        <div
          className={`relative z-10 flex min-h-0 flex-1 flex-col items-center px-4 py-6 ${
            hasContent ? "justify-start" : "justify-center"
          }`}
        >
          <div
            className={`flex w-full max-w-4xl flex-col items-center gap-8 transition-[flex] duration-300 ease-out ${
              hasContent ? "min-h-0 flex-1" : ""
            }`}
          >
            <Hero />
            <ChatArea onHasContentChange={setHasContent} resetViewTrigger={resetViewTrigger} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
