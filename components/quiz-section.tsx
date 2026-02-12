"use client"

import { ArrowLeft, ArrowRight, Brain, CheckCircle2, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { QuizQuestion } from "@/lib/quiz-data"

interface QuizSectionProps {
  title: string
  description: string
  icon: "brain" | "target"
  questions: QuizQuestion[]
  answers: Record<string, string>
  currentIndex: number
  onAnswer: (questionId: string, value: string) => void
  onNext: () => void
  onBack: () => void
  onSubmit: () => void
  canGoBack: boolean
  totalSteps: number
  currentStep: number
}

export function QuizSection({
  title,
  description,
  icon,
  questions,
  answers,
  currentIndex,
  onAnswer,
  onNext,
  onBack,
  onSubmit,
  canGoBack,
  totalSteps,
  currentStep,
}: QuizSectionProps) {
  const question = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const isAnswered = !!answers[question.id]
  const progress = ((currentStep) / totalSteps) * 100
  const Icon = icon === "brain" ? Brain : Target

  return (
    <section className="relative min-h-screen pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Overall: {Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-primary" />
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="mb-6 text-lg font-semibold text-foreground">{question.question}</h3>

          <div className="flex flex-col gap-3">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => onAnswer(question.id, option.value)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:bg-secondary"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {isLastQuestion ? (
            <button
              onClick={onSubmit}
              disabled={!isAnswered}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {icon === "brain" ? "Next Section" : "See Results"}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
