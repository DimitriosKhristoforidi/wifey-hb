"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "@/components/Hero";
import HeartPuzzle from "@/components/HeartPuzzle";
import OffCampusQuiz from "@/components/OffCampusQuiz";
import Reveal from "@/components/Reveal";

// Three.js / R3F is browser-only; lazy-load it client-side.
const SceneBackground = dynamic(() => import("@/components/SceneBackground"), {
  ssr: false,
});

type Mode = "puzzle" | "quiz";

export default function Home() {
  const [mode, setMode] = useState<Mode>("puzzle");
  const [solved, setSolved] = useState(false);

  const scrollToGame = useCallback(() => {
    document
      .getElementById("game")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSolved = useCallback(() => {
    setSolved(true);
  }, []);

  const handleWantsQuiz = useCallback(() => {
    setMode("quiz");
    // Give the swap animation a moment, then re-center on the new section.
    setTimeout(() => {
      document
        .getElementById("game")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  return (
    <main className="relative w-full">
      <SceneBackground />
      <Hero onStart={scrollToGame} />

      <div id="game">
        <AnimatePresence mode="wait">
          {mode === "puzzle" ? (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <HeartPuzzle
                onSolved={handleSolved}
                onWantsQuiz={handleWantsQuiz}
              />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <OffCampusQuiz onComplete={handleSolved} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Reveal visible={solved} />
    </main>
  );
}
