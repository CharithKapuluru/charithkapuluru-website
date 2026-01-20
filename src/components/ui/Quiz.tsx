"use client";

import { useState } from "react";

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

const Quiz = ({ title, questions, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const handleAnswerSelect = (index: number) => {
    if (answeredQuestions[currentQuestion]) return;

    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
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
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="my-8 p-6 bg-bg-cream rounded-lg border border-text-charcoal/10">
        <h3 className="text-2xl font-serif text-text-charcoal mb-4">{title} - Results</h3>
        <div className="text-center py-8">
          <div className="text-6xl font-serif text-accent-moss mb-4">{percentage}%</div>
          <p className="text-xl text-text-taupe mb-2">
            You got {score} out of {questions.length} correct!
          </p>
          <p className="text-text-olive mb-6">
            {percentage >= 80
              ? "Excellent! You have a strong understanding of this phase."
              : percentage >= 60
              ? "Good job! Review the concepts you missed."
              : "Keep learning! Review this phase and try again."}
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-accent-moss text-white rounded-lg hover:bg-accent-moss/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = answeredQuestions[currentQuestion];

  return (
    <div className="my-8 p-6 bg-bg-cream rounded-lg border border-text-charcoal/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-serif text-text-charcoal">{title}</h3>
        <span className="text-sm font-mono text-text-olive">
          {currentQuestion + 1} / {questions.length}
        </span>
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
              <button
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
              </button>
            );
          })}
        </div>
      </div>

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
