"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

// Меняй эти карточки как захочешь - это сообщения, которые она увидит,
// когда соберёт пазл.
const WISHES = [
  {
    title: "С Днём Рождения, моё чудо",
    body: "Каждый год рядом с тобой - это как мой мир нашёл более легкий способ вращаться. Пусть сегодняшний день будет таким же легким и ярким, как ты сама.",
  },
  {
    title: "Спасибо, что ты - это ты",
    body: "За тввою доброту, твой смех, то, как ты освещаешь комнату, даже не стараясь - я не воспринимаю как должное. Ни секунды.",
  },
  {
    title: "Пожелание на этот год",
    body: "Пусть каждая дверь, которую ты откроешь в этом году, ведёт к чему-то чуть более прекрасному, чем предыдущая.",
  },
  {
    title: "Что я в тебе люблю",
    body: "За то, как ты морщишь нос, когда недовольна. За то, как обычные утра рядом с тобой становятся нашими - особенными. За наши беседы обо всем и ни о чем. За всё это.",
  },
  {
    title: "Где бы я ни был",
    body: "Я твой. В маленькие дни и большие, в тихие и шумные. Всегда.",
  },
  {
    title: "P.S.",
    body: "Этот маленький сайт - благодарность, замаскированная под сюрприз. Я люблю тебя, Айзирек. Всегда моё чудо. ♡",
  },
];

type Props = {
  visible: boolean;
};

export default function Reveal({ visible }: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!visible || firedRef.current) return;
    firedRef.current = true;

    const end = Date.now() + 1800;
    const colors = ["#7aa7ff", "#b18cff", "#ffd6ec", "#c9eaff", "#ffffff"];
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors,
        scalar: 0.9,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
        scalar: 0.9,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // gentle scroll into the reveal
    setTimeout(() => {
      document
        .getElementById("reveal")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, [visible]);

  if (!visible) return null;

  return (
    <section
      id="reveal"
      className="relative w-full px-6 py-24 md:py-32 flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <p className="font-display text-3xl md:text-4xl text-[color:var(--ink-soft)]">
          у тебя получилось, чудо
        </p>
        <h2 className="mt-2 font-display text-6xl md:text-8xl shimmer-text leading-[0.95]">
          с днём рождения
        </h2>
        <p className="mt-5 text-base md:text-lg text-[color:var(--ink-soft)] max-w-xl mx-auto leading-relaxed">
          вот несколько строк, которые я хотел, чтобы ты прочитала сегодня. не
          торопись - всё это для тебя.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 max-w-4xl w-full">
        {WISHES.map((w, i) => (
          <motion.article
            key={w.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            className="glass rounded-2xl p-6 md:p-7"
          >
            <h3 className="font-display text-2xl md:text-3xl text-[color:var(--ink)]">
              {w.title}
            </h3>
            <p className="mt-2 text-[color:var(--ink-soft)] leading-relaxed">
              {w.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
