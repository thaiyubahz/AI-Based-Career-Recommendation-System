"use client"

import { useState, useCallback, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { QuizSection } from "@/components/quiz-section"
import { ResultsSection } from "@/components/results-section"
import { CareerDetail } from "@/components/career-detail"
import { PlannerSection } from "@/components/planner-section"
import { AuthPage } from "@/components/auth-page"
import { behavioralQuestions, skillsQuestions, type CareerPath } from "@/lib/quiz-data"
import { createInitialState, calculateCareerScores, type QuizState } from "@/lib/quiz-store"
import { getCurrentUser, logoutUser, type AuthSession } from "@/lib/auth-store"

export default function Home() {
  const [authUser, setAuthUser] = useState<AuthSession | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  const [state, setState] = useState<QuizState>(createInitialState)
  const [behavioralIndex, setBehavioralIndex] = useState(0)
  const [skillsIndex, setSkillsIndex] = useState(0)
  const [plannerSkills, setPlannerSkills] = useState<string[]>([])

  // Check for existing session on mount
  useEffect(() => {
    const user = getCurrentUser()
    if (user) setAuthUser(user)
    setAuthChecked(true)
  }, [])

  const handleLogout = useCallback(() => {
    logoutUser()
    setAuthUser(null)
    setState(createInitialState())
    setBehavioralIndex(0)
    setSkillsIndex(0)
    setPlannerSkills([])
  }, [])

  const navigate = useCallback((step: string) => {
    setState((prev) => ({ ...prev, currentStep: step as QuizState["currentStep"] }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleBehavioralAnswer = useCallback((questionId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      behavioralAnswers: { ...prev.behavioralAnswers, [questionId]: value },
    }))
  }, [])

  const handleSkillAnswer = useCallback((questionId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      skillAnswers: { ...prev.skillAnswers, [questionId]: value },
    }))
  }, [])

  const handleBehavioralNext = useCallback(() => {
    if (behavioralIndex < behavioralQuestions.length - 1) {
      setBehavioralIndex((i) => i + 1)
    }
  }, [behavioralIndex])

  const handleBehavioralBack = useCallback(() => {
    if (behavioralIndex > 0) {
      setBehavioralIndex((i) => i - 1)
    } else {
      navigate("landing")
    }
  }, [behavioralIndex, navigate])

  const handleBehavioralSubmit = useCallback(() => {
    setSkillsIndex(0)
    navigate("skills")
  }, [navigate])

  const handleSkillsNext = useCallback(() => {
    if (skillsIndex < skillsQuestions.length - 1) {
      setSkillsIndex((i) => i + 1)
    }
  }, [skillsIndex])

  const handleSkillsBack = useCallback(() => {
    if (skillsIndex > 0) {
      setSkillsIndex((i) => i - 1)
    } else {
      setBehavioralIndex(behavioralQuestions.length - 1)
      navigate("behavioral")
    }
  }, [skillsIndex, navigate])

  const handleSkillsSubmit = useCallback(() => {
    const results = calculateCareerScores(
      state.behavioralAnswers,
      state.skillAnswers,
      behavioralQuestions,
      skillsQuestions
    )
    setState((prev) => ({
      ...prev,
      ...results,
      currentStep: "results",
    }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [state.behavioralAnswers, state.skillAnswers])

  const handleSelectCareer = useCallback((career: CareerPath & { matchPercentage: number }) => {
    setState((prev) => ({ ...prev, selectedCareer: career, currentStep: "career-detail" }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleStartPlanner = useCallback((skills: string[]) => {
    setPlannerSkills(skills)
    navigate("planner")
  }, [navigate])

  const totalQuestions = behavioralQuestions.length + skillsQuestions.length

  // Loading state while checking auth
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Auth gate: show login/signup if not authenticated
  if (!authUser) {
    return <AuthPage onAuthenticated={(user) => setAuthUser(user)} />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        onNavigate={navigate}
        userName={authUser.name}
        onLogout={handleLogout}
      />

      {state.currentStep === "landing" && (
        <HeroSection onStart={() => { setBehavioralIndex(0); navigate("behavioral") }} />
      )}

      {state.currentStep === "behavioral" && (
        <QuizSection
          title="Behavioral Assessment"
          description="Part 1: Understanding your work style and interests"
          icon="brain"
          questions={behavioralQuestions}
          answers={state.behavioralAnswers}
          currentIndex={behavioralIndex}
          onAnswer={handleBehavioralAnswer}
          onNext={handleBehavioralNext}
          onBack={handleBehavioralBack}
          onSubmit={handleBehavioralSubmit}
          canGoBack={true}
          totalSteps={totalQuestions}
          currentStep={behavioralIndex + 1}
        />
      )}

      {state.currentStep === "skills" && (
        <QuizSection
          title="Skills Assessment"
          description="Part 2: Evaluating your technical proficiency"
          icon="target"
          questions={skillsQuestions}
          answers={state.skillAnswers}
          currentIndex={skillsIndex}
          onAnswer={handleSkillAnswer}
          onNext={handleSkillsNext}
          onBack={handleSkillsBack}
          onSubmit={handleSkillsSubmit}
          canGoBack={true}
          totalSteps={totalQuestions}
          currentStep={behavioralQuestions.length + skillsIndex + 1}
        />
      )}

      {state.currentStep === "results" && (
        <ResultsSection
          skillLevels={state.skillLevels}
          recommendedCareers={state.recommendedCareers}
          onSelectCareer={handleSelectCareer}
        />
      )}

      {state.currentStep === "career-detail" && state.selectedCareer && (
        <CareerDetail
          career={state.selectedCareer as CareerPath & { matchPercentage: number }}
          onBack={() => navigate("results")}
          onStartPlanner={handleStartPlanner}
        />
      )}

      {state.currentStep === "planner" && (
        <PlannerSection
          skills={plannerSkills}
          onBack={() => navigate("career-detail")}
        />
      )}
    </main>
  )
}
