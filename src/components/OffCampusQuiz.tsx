"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Question = {
  q: string;
  options: string[];
  answer: number; // index of correct option
};

// Все вопросы основаны на книжной серии Off-Campus (Elle Kennedy):
// The Deal · The Mistake · The Score · The Goal.
// Сериал «Off-Campus» снят по этим книгам, так что почти всё совпадает.
// Можешь свободно править/удалять/добавлять - формат прозрачный.
const QUESTIONS: Question[] = [
  {
    q: "Где разворачивается история Off-Campus?",
    options: ["Briar University", "Harvard", "Yale", "MIT"],
    answer: 0,
  },
  {
    q: "Каким спортом занимаются главные герои?",
    options: ["Хоккей", "Американский футбол", "Баскетбол", "Бейсбол"],
    answer: 0,
  },
  {
    q: "Кто автор книжной серии?",
    options: ["Colleen Hoover", "Elle Kennedy", "Emily Henry", "Sarah J. Maas"],
    answer: 1,
  },
  {
    q: "Какая книга открывает серию?",
    options: ["The Mistake", "The Score", "The Deal", "The Goal"],
    answer: 2,
  },
  {
    q: "С кем Hannah заключает сделку в «The Deal»?",
    options: ["Logan", "Dean", "Garrett", "Tucker"],
    answer: 2,
  },
  {
    q: "Какая специальность у Hannah в университете?",
    options: ["Медицина", "Музыка", "Психология", "Журналистика"],
    answer: 1,
  },
  {
    q: "О ком вторая книга - «The Mistake»?",
    options: ["Dean", "Tucker", "Garrett", "Logan"],
    answer: 3,
  },
  {
    q: "Какая пара в центре «The Score»?",
    options: [
      "Garrett & Hannah",
      "Logan & Grace",
      "Dean & Allie",
      "Tuck & Sabrina",
    ],
    answer: 2,
  },
  {
    q: "Кем мечтает стать Allie?",
    options: ["Актрисой", "Врачом", "Юристом", "Певицей"],
    answer: 0,
  },
  {
    q: "Главный герой четвёртой книги «The Goal»?",
    options: ["Tucker (Tuck)", "Logan", "Dean", "Garrett"],
    answer: 0,
  },
  {
    q: "Где Sabrina работает, чтобы оплатить учёбу?",
    options: ["В библиотеке", "В баре", "В магазине", "В отеле"],
    answer: 1,
  },
  {
    q: "Сколько основных книг в серии Off-Campus?",
    options: ["3", "4", "5", "6"],
    answer: 2,
  },
  {
    q: "Какое неожиданное событие меняет жизнь Sabrina в «The Goal»?",
    options: [
      "Потеря стипендии",
      "Автомобильная авария",
      "Беременность",
      "Переезд в другой город",
    ],
    answer: 2,
  },
  {
    q: "Кем Sabrina мечтает стать после колледжа?",
    options: ["Врачом", "Учительницей", "Журналисткой", "Юристом"],
    answer: 3,
  },
  // Последний вопрос - и единственно правильный ответ ♡
  {
    q: "И самый важный вопрос - кто самый красивый парень?",
    options: ["Garrett", "Dean", "Logan", "Мой муж"],
    answer: 3,
  },
];

type Props = {
  onComplete: () => void;
};

export default function OffCampusQuiz({ onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const q = QUESTIONS[idx];

  const choose = useCallback(
    (i: number) => {
      if (picked !== null || done) return;
      setPicked(i);
      const isCorrect = i === q.answer;
      if (isCorrect) setScore((s) => s + 1);

      window.setTimeout(() => {
        if (idx + 1 < total) {
          setIdx(idx + 1);
          setPicked(null);
        } else {
          setDone(true);
          window.setTimeout(() => onComplete(), 1600);
        }
      }, 1100);
    },
    [picked, done, q.answer, idx, total, onComplete],
  );

  const progress = ((idx + (picked !== null ? 1 : 0)) / total) * 100;

  return (
    <section
      id="quiz"
      className="relative w-full px-6 py-20 md:py-24 flex flex-col justify-center items-center min-h-[100svh]"
    >
      <div className="text-center max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-6xl shimmer-text"
        >
          Мини-викторина · Off-Campus
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-3 text-[color:var(--ink-soft)] text-base md:text-lg"
        >
          {total} коротких вопросов о Briar University, Хоккее и Команде,
          которую ты так любишь. Правильные ответы не нужны - сюрприз будет в
          любом случае ♡
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-10 glass rounded-[2rem] p-6 md:p-8 w-full max-w-2xl"
      >
        {/* progress */}
        <div className="flex items-center justify-between text-sm text-[color:var(--ink-soft)]">
          <span>{done ? "Готово!" : `Вопрос ${idx + 1} из ${total}`}</span>
          <span>
            Счёт:&nbsp;
            <span className="font-semibold text-[color:var(--ink)]">
              {score}
            </span>
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-white/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #7aa7ff 0%, #b18cff 100%)",
            }}
            animate={{ width: `${done ? 100 : progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <div className="mt-6 min-h-[260px]">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={`q-${idx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-[color:var(--ink)] leading-snug">
                  {q.q}
                </h3>

                <div className="mt-5 grid gap-3">
                  {q.options.map((opt, i) => {
                    const isPicked = picked === i;
                    const isCorrectShown = picked !== null && i === q.answer;
                    const isWrongPicked =
                      picked !== null && isPicked && i !== q.answer;

                    let stateClasses =
                      "bg-white/60 hover:bg-white/85 text-[color:var(--ink)] border border-[color:var(--accent-soft)]/60";
                    if (isCorrectShown) {
                      stateClasses =
                        "bg-[color:var(--mint-soft)] text-[color:var(--ink)] border border-emerald-400/60 ring-2 ring-emerald-300/70";
                    } else if (isWrongPicked) {
                      stateClasses =
                        "bg-[color:var(--pink-soft)] text-[color:var(--ink)] border border-rose-400/60 ring-2 ring-rose-300/70";
                    } else if (picked !== null) {
                      stateClasses =
                        "bg-white/40 text-[color:var(--ink-soft)] border border-white/60 opacity-70";
                    }

                    return (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => choose(i)}
                        disabled={picked !== null}
                        whileHover={
                          picked === null ? { scale: 1.01 } : undefined
                        }
                        whileTap={picked === null ? { scale: 0.98 } : undefined}
                        className={`text-left rounded-2xl px-5 py-4 font-medium transition-colors duration-200 ${stateClasses}`}
                      >
                        <span className="inline-block w-6 text-[color:var(--accent-strong)] font-semibold">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="font-display text-7xl md:text-8xl shimmer-text">
                  {score}/{total}
                </div>
                <p className="mt-3 text-lg text-[color:var(--ink)] font-semibold">
                  {score === total
                    ? "Идеально! Ты знаешь каждого хоккеиста Briar по имени ♡"
                    : score >= Math.ceil(total * 0.75)
                      ? "Почти всё помнишь! Настоящая фанатка ♡"
                      : score >= Math.ceil(total * 0.5)
                        ? "Очень даже неплохо! 💙"
                        : "Счёт не главное - главное, что ты дошла до конца ♡"}
                </p>
                <p className="mt-2 text-sm text-[color:var(--ink-soft)]">
                  Открываю сюрприз…
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
