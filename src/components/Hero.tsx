"use client";

import { motion } from "framer-motion";

type Props = {
  onStart: () => void;
};

export default function Hero({ onStart }: Props) {
  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center px-6 py-20">
      <div className="relative z-10 max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-3xl md:text-4xl text-[color:var(--ink-soft)]"
        >
          маленький сюрприз для
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-2 font-display text-7xl md:text-9xl leading-[0.95] shimmer-text"
        >
          Айзирек
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-4 text-lg md:text-xl text-[color:var(--ink-soft)] font-medium"
        >
          моё чудо{" "}
          <span className="inline-block animate-[pulse-soft_2s_ease-in-out_infinite]">
            ✿
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-10 glass rounded-3xl px-6 md:px-10 py-7 md:py-9"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)]">
            С Днём Рождения, любимая
          </h2>
          <p className="mt-3 text-base md:text-lg text-[color:var(--ink-soft)] leading-relaxed">
            Я создал для тебя маленький мир. Внутри него спрятана маленькая
            головоломка - собери сердце по кусочкам, и для тебя расцветёт
            сюрприз.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="btn-primary mt-7 text-base md:text-lg"
          >
            Начать сюрприз →
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-6 text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]/70"
        >
          листай · играй · улыбайся
        </motion.p>
      </div>
    </section>
  );
}
