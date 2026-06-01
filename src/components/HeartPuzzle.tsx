"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIZE = 3; // 3x3
const TILE_COUNT = SIZE * SIZE;
const EMPTY = TILE_COUNT - 1; // index 8 represents the empty slot

type Props = {
  onSolved: () => void;
};

function shuffleSolvable(): number[] {
  // Start from solved and make random valid moves so the puzzle is always solvable.
  const tiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
  let emptyIdx = TILE_COUNT - 1;
  const moves = 120 + Math.floor(Math.random() * 40);
  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(emptyIdx);
    const swap = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIdx], tiles[swap]] = [tiles[swap], tiles[emptyIdx]];
    emptyIdx = swap;
  }
  // Ensure not already solved
  if (tiles.every((v, i) => v === i)) return shuffleSolvable();
  return tiles;
}

function getNeighbors(idx: number): number[] {
  const row = Math.floor(idx / SIZE);
  const col = idx % SIZE;
  const out: number[] = [];
  if (row > 0) out.push(idx - SIZE);
  if (row < SIZE - 1) out.push(idx + SIZE);
  if (col > 0) out.push(idx - 1);
  if (col < SIZE - 1) out.push(idx + 1);
  return out;
}

export default function HeartPuzzle({ onSolved }: Props) {
  const [tiles, setTiles] = useState<number[]>(() =>
    Array.from({ length: TILE_COUNT }, (_, i) => i),
  );
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [solved, setSolved] = useState(false);
  // Ensures the win callback fires exactly once per play-through.
  const triggeredRef = useRef(false);

  const emptyIdx = useMemo(() => tiles.indexOf(EMPTY), [tiles]);

  const shuffle = useCallback(() => {
    triggeredRef.current = false;
    setTiles(shuffleSolvable());
    setMoves(0);
    setStarted(true);
    setSolved(false);
  }, []);

  const tryMove = useCallback(
    (idx: number) => {
      if (solved) return;
      if (!getNeighbors(emptyIdx).includes(idx)) return;
      setTiles((prev) => {
        const next = [...prev];
        [next[emptyIdx], next[idx]] = [next[idx], next[emptyIdx]];
        return next;
      });
      setMoves((m) => m + 1);
    },
    [emptyIdx, solved],
  );

  // keyboard controls - arrow keys move the empty slot
  useEffect(() => {
    if (!started || solved) return;
    const handler = (e: KeyboardEvent) => {
      const row = Math.floor(emptyIdx / SIZE);
      const col = emptyIdx % SIZE;
      let target = -1;
      if (e.key === "ArrowUp" && row < SIZE - 1) target = emptyIdx + SIZE;
      if (e.key === "ArrowDown" && row > 0) target = emptyIdx - SIZE;
      if (e.key === "ArrowLeft" && col < SIZE - 1) target = emptyIdx + 1;
      if (e.key === "ArrowRight" && col > 0) target = emptyIdx - 1;
      if (target >= 0) {
        e.preventDefault();
        tryMove(target);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [emptyIdx, started, solved, tryMove]);

  // detect win - uses a ref instead of `solved` in deps so the cleanup
  // doesn't cancel the win timeout when `solved` flips true.
  useEffect(() => {
    if (!started || triggeredRef.current) return;
    if (tiles.every((v, i) => v === i)) {
      triggeredRef.current = true;
      setSolved(true);
      // small delay so the last tile animation finishes
      const t = setTimeout(() => onSolved(), 900);
      return () => clearTimeout(t);
    }
  }, [tiles, started, onSolved]);

  const cellPercent = 100 / SIZE;

  return (
    <section
      id="puzzle"
      className="relative w-full px-6 py-20 md:py-28 flex flex-col items-center"
    >
      <div className="text-center max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-6xl shimmer-text"
        >
          собери моё сердце
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-3 text-[color:var(--ink-soft)] text-base md:text-lg"
        >
          нажми на кусочек рядом с пустым местом, чтобы передвинуть его. стрелки
          на клавиатуре тоже работают.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-10 glass rounded-[2rem] p-5 md:p-6"
      >
        <div
          className="relative no-select rounded-2xl overflow-hidden"
          style={{
            width: "min(86vw, 420px)",
            height: "min(86vw, 420px)",
            background:
              "radial-gradient(circle at 30% 20%, #ffffff 0%, #e6efff 50%, #d0e0ff 100%)",
          }}
        >
          {tiles.map((tileValue, idx) => {
            const row = Math.floor(idx / SIZE);
            const col = idx % SIZE;
            if (tileValue === EMPTY) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="absolute"
                  style={{
                    width: `${cellPercent}%`,
                    height: `${cellPercent}%`,
                    top: `${row * cellPercent}%`,
                    left: `${col * cellPercent}%`,
                  }}
                />
              );
            }
            const srcRow = Math.floor(tileValue / SIZE);
            const srcCol = tileValue % SIZE;
            return (
              <motion.button
                key={tileValue}
                type="button"
                onClick={() => tryMove(idx)}
                layout
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute tile-shadow rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                style={{
                  width: `calc(${cellPercent}% - 6px)`,
                  height: `calc(${cellPercent}% - 6px)`,
                  top: `calc(${row * cellPercent}% + 3px)`,
                  left: `calc(${col * cellPercent}% + 3px)`,
                  backgroundImage: "url(/heart.svg)",
                  backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                  backgroundPosition: `${(srcCol / (SIZE - 1)) * 100}% ${(srcRow / (SIZE - 1)) * 100}%`,
                  cursor: getNeighbors(emptyIdx).includes(idx)
                    ? "pointer"
                    : "default",
                }}
                whileHover={
                  getNeighbors(emptyIdx).includes(idx)
                    ? { scale: 1.04 }
                    : undefined
                }
                whileTap={
                  getNeighbors(emptyIdx).includes(idx)
                    ? { scale: 0.96 }
                    : undefined
                }
                aria-label={`tile ${tileValue + 1}`}
              />
            );
          })}

          <AnimatePresence>
            {solved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className="font-display text-5xl md:text-6xl text-white drop-shadow-[0_4px_20px_rgba(80,110,200,0.7)]"
                >
                  ♡
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="text-sm text-[color:var(--ink-soft)]">
            {started ? (
              <>
                ходы:{" "}
                <span className="font-semibold text-[color:var(--ink)]">
                  {moves}
                </span>
              </>
            ) : (
              "когда будешь готова"
            )}
          </div>
          <button onClick={shuffle} className="btn-ghost text-sm">
            {started ? "перемешать снова" : "перемешать и играть"}
          </button>
        </div>
      </motion.div>

      {!started && (
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]/70">
          нажми «перемешать», чтобы начать
        </p>
      )}
    </section>
  );
}
