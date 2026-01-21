"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Randomized success messages for personality
const successMessages = [
  { text: "Nailed it!", emoji: "🎯" },
  { text: "Exactly right!", emoji: "✨" },
  { text: "You got it!", emoji: "🔥" },
  { text: "Perfect!", emoji: "💯" },
  { text: "Spot on!", emoji: "🎉" },
  { text: "Nice work!", emoji: "👏" },
];

const incorrectMessages = [
  { text: "Not quite!", emoji: "🤔" },
  { text: "Close, but...", emoji: "💭" },
  { text: "Almost there!", emoji: "📚" },
  { text: "Keep learning!", emoji: "💪" },
];

const Quiz = ({ title, questions, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [lastFeedback, setLastFeedback] = useState<{ text: string; emoji: string; isCorrect: boolean } | null>(null);

  const handleAnswerSelect = (index: number) => {
    if (answeredQuestions[currentQuestion]) return;

    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctIndex;

    // Pick random feedback message
    const messages = isCorrect ? successMessages : incorrectMessages;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setLastFeedback({ ...randomMessage, isCorrect });

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setAnsweredQuestions((prev) => {
      const newAnswered = [...prev];
      newAnswered[currentQuestion] = true;
      return newAnswered;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setLastFeedback(null);
    } else {
      setShowResult(true);
      // Notify parent when quiz is completed
      if (onComplete) {
        onComplete(score, questions.length);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setLastFeedback(null);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        className="my-8 p-6 bg-bg-cream rounded-lg border border-text-charcoal/10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <h3 className="text-2xl font-serif text-text-charcoal mb-4">{title} - Results</h3>
        <div className="text-center py-8">
          <motion.div
            className="text-6xl font-serif text-accent-moss mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            {percentage}%
          </motion.div>
          <p className="text-xl text-text-taupe mb-2">
            You got {score} out of {questions.length} correct!
          </p>
          <p className="text-text-olive mb-6">
            {percentage >= 80
              ? "🎉 Excellent! You have a strong understanding of this phase."
              : percentage >= 60
              ? "👍 Good job! Review the concepts you missed."
              : "📚 Keep learning! Review this phase and try again."}
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-accent-moss text-white rounded-lg hover:bg-accent-moss/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = answeredQuestions[currentQuestion];

  return (
    <div className="my-8 p-6 bg-bg-cream rounded-lg border border-text-charcoal/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-serif text-text-charcoal">{title}</h3>
        <div className="flex items-center gap-3">
          {/* Streak counter */}
          <AnimatePresence>
            {streak >= 2 && (
              <motion.div
                className="flex items-center gap-1 text-sm font-mono"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-orange-500">🔥</span>
                <span className="text-accent-terracotta font-semibold">{streak}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-sm font-mono text-text-olive">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg text-text-charcoal mb-4">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctIndex;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  showCorrect
                    ? "bg-accent-moss/20 border-accent-moss text-text-charcoal"
                    : showWrong
                    ? "bg-accent-terracotta/20 border-accent-terracotta text-text-charcoal"
                    : isSelected
                    ? "bg-accent-moss/10 border-accent-moss"
                    : "bg-bg-paper border-text-charcoal/10 hover:border-accent-moss/50"
                } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
                whileTap={!isAnswered ? { scale: 0.98 } : undefined}
                animate={
                  showCorrect
                    ? { scale: [1, 1.02, 1] }
                    : showWrong
                    ? { x: [0, -5, 5, -5, 5, 0] }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm font-mono ${
                      showCorrect
                        ? "bg-accent-moss border-accent-moss text-white"
                        : showWrong
                        ? "bg-accent-terracotta border-accent-terracotta text-white"
                        : "border-text-charcoal/30"
                    }`}
                  >
                    {showCorrect ? "✓" : showWrong ? "✗" : String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Feedback message */}
      <AnimatePresence>
        {lastFeedback && (
          <motion.div
            className={`mb-4 p-3 rounded-lg text-center ${
              lastFeedback.isCorrect ? "bg-accent-moss/10" : "bg-accent-terracotta/10"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-2xl mr-2">{lastFeedback.emoji}</span>
            <span
              className={`font-semibold ${
                lastFeedback.isCorrect ? "text-accent-moss" : "text-accent-terracotta"
              }`}
            >
              {lastFeedback.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {isAnswered && (
        <div className="mb-4 p-4 bg-bg-paper rounded-lg border border-text-charcoal/10">
          <p className="text-sm text-text-taupe">
            <strong className="text-text-charcoal">Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isAnswered
              ? "bg-accent-moss text-white hover:bg-accent-moss/90"
              : "bg-text-charcoal/10 text-text-olive cursor-not-allowed"
          }`}
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
