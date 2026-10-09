"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Lightning, X } from "@phosphor-icons/react/dist/ssr";
import Button from "./Button";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

const correctLines = ["Correct.", "Exactly right.", "You got it.", "Spot on."];
const incorrectLines = ["Not quite.", "Close, but no.", "Not this one."];

const pickLine = (pool: string[]) => pool[Math.floor(Math.random() * pool.length)];

export default function Quiz({ title, questions, onComplete }: QuizProps) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(() => new Array(questions.length).fill(false));
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);

  const question = questions[current];
  const isAnswered = answered[current];

  const choose = (index: number) => {
    if (isAnswered) return;
    setSelected(index);
    const correct = index === question.correctIndex;
    const pool = correct ? correctLines : incorrectLines;
    setFeedback({ text: pickLine(pool), correct });
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setAnswered((prev) => prev.map((a, i) => (i === current ? true : a)));
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      setShowResult(true);
      onComplete?.(score, questions.length);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setAnswered(new Array(questions.length).fill(false));
  };

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const line = pct >= 80 ? "Strong understanding of this section." : pct >= 60 ? "Good. Review the questions you missed." : "Worth a second read before moving on.";
    return (
      <section aria-label={`${title} results`} className="my-8 rounded-lg border border-border bg-surface p-6 md:p-8">
        <h3 className="text-h3 text-fg">{title}</h3>
        <p className="mt-6 font-display text-figure tabular text-accent">{pct}%</p>
        <p className="mt-2 text-body text-fg-2">
          {score} of {questions.length} correct. {line}
        </p>
        <Button variant="secondary" size="sm" data-print-hide onClick={restart} className="mt-6">
          Try again
        </Button>
      </section>
    );
  }

  return (
    <section aria-label={title} className="my-8 rounded-lg border border-border bg-surface p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-h3 text-fg">{title}</h3>
        <div className="flex items-center gap-3 font-mono text-caption text-fg-3 tabular">
          {streak >= 2 && (
            <span className="inline-flex items-center gap-1 text-accent">
              <Lightning size={14} weight="fill" aria-hidden /> {streak}
            </span>
          )}
          <span>
            {current + 1} / {questions.length}
          </span>
        </div>
      </div>

      <p className="mt-5 text-body text-fg">{question.question}</p>

      <div className="mt-4 space-y-2" role="group" aria-label="Answers">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === question.correctIndex;
          const showCorrect = isAnswered && isCorrect;
          const showWrong = isAnswered && isSelected && !isCorrect;
          return (
            <button
              key={index}
              type="button"
              onClick={() => choose(index)}
              disabled={isAnswered}
              aria-pressed={isSelected}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-body transition-colors duration-150",
                showCorrect && "border-success bg-success-soft text-fg",
                showWrong && "border-danger bg-danger-soft text-fg",
                !isAnswered && "border-border bg-bg text-fg-2 hover:border-fg-3 hover:text-fg",
                isAnswered && !showCorrect && !showWrong && "border-border bg-bg text-fg-3",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border font-mono text-caption",
                  showCorrect ? "border-success text-success" : showWrong ? "border-danger text-danger" : "border-border-strong",
                )}
                aria-hidden
              >
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Always mounted, so the verdict is announced when it appears; a live region that arrives together with its text is often missed. */}
      <div role="status">
        <AnimatePresence>
          {feedback && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("mt-4 text-small font-medium", feedback.correct ? "text-success" : "text-danger")}
            >
              {feedback.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {isAnswered && (
        <p className="mt-3 rounded-md border border-border bg-bg p-4 text-small leading-relaxed text-fg-2">
          <strong className="text-fg">Why: </strong>
          {question.explanation}
        </p>
      )}

      <div data-print-hide className="mt-5 flex justify-end">
        <Button size="sm" onClick={next} disabled={!isAnswered}>
          {current < questions.length - 1 ? "Next question" : "See results"}
        </Button>
      </div>
    </section>
  );
}
