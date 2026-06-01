"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import Hero from "@/components/Hero";
import HeartPuzzle from "@/components/HeartPuzzle";
import Reveal from "@/components/Reveal";

// Three.js / R3F is browser-only; lazy-load it client-side.
const SceneBackground = dynamic(() => import("@/components/SceneBackground"), {
  ssr: false,
});

export default function Home() {
  const [solved, setSolved] = useState(false);

  const scrollToPuzzle = useCallback(() => {
    document
      .getElementById("puzzle")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSolved = useCallback(() => {
    setSolved(true);
  }, []);

  return (
    <main className="relative w-full">
      <SceneBackground />
      <Hero onStart={scrollToPuzzle} />
      <HeartPuzzle onSolved={handleSolved} />
      <Reveal visible={solved} />
    </main>
  );
}
