"use client"

import { careerPaths, type CareerPath, type SkillLevel } from "./quiz-data"

export interface QuizState {
  currentStep: "landing" | "behavioral" | "skills" | "results" | "career-detail" | "planner"
  behavioralAnswers: Record<string, string>
  skillAnswers: Record<string, string>
  careerScores: Record<string, number>
  skillLevels: SkillLevel[]
  selectedCareer: CareerPath | null
  recommendedCareers: (CareerPath & { matchPercentage: number })[]
  plannerSkills: { skill: string; completed: boolean; daysTotal: number; daysCompleted: number; dailyTasks: { day: number; task: string; completed: boolean }[] }[]
  points: number
  currentQuestionIndex: number
}

export function createInitialState(): QuizState {
  return {
    currentStep: "landing",
    behavioralAnswers: {},
    skillAnswers: {},
    careerScores: {},
    skillLevels: [],
    selectedCareer: null,
    recommendedCareers: [],
    plannerSkills: [],
    points: 0,
    currentQuestionIndex: 0,
  }
}

export function calculateCareerScores(
  behavioralAnswers: Record<string, string>,
  skillAnswers: Record<string, string>,
  behavioralQuestions: { id: string; options: { value: string; weight: Record<string, number> }[] }[],
  skillsQuestions: { id: string; options: { value: string; weight: Record<string, number> }[] }[]
): { careerScores: Record<string, number>; skillLevels: SkillLevel[]; recommendedCareers: (CareerPath & { matchPercentage: number })[] } {
  const scores: Record<string, number> = {}
  const skillLevels: SkillLevel[] = []

  // Process behavioral answers
  for (const question of behavioralQuestions) {
    const answer = behavioralAnswers[question.id]
    if (!answer) continue
    const option = question.options.find((o) => o.value === answer)
    if (!option) continue
    for (const [career, weight] of Object.entries(option.weight)) {
      scores[career] = (scores[career] || 0) + weight
    }
  }

  // Process skill answers
  const skillMapping: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    databases: "Databases",
    html_css: "HTML/CSS",
    cloud: "Cloud",
    data_tools: "Data Tools",
    git: "Git",
    devops_tools: "DevOps Tools",
  }

  for (const question of skillsQuestions) {
    const answer = skillAnswers[question.id]
    if (!answer) continue
    const option = question.options.find((o) => o.value === answer)
    if (!option) continue
    for (const [skillKey, score] of Object.entries(option.weight)) {
      const levelMap: Record<number, "learning" | "beginner" | "intermediate" | "expert"> = {
        1: "learning",
        2: "beginner",
        3: "intermediate",
        4: "expert",
      }
      skillLevels.push({
        skill: skillMapping[skillKey] || skillKey,
        level: levelMap[score] || "learning",
        score,
      })
    }
  }

  // Boost career scores based on skills
  const careerSkillMap: Record<string, string[]> = {
    software_dev: ["python", "javascript", "databases", "git"],
    frontend_dev: ["javascript", "html_css", "git"],
    full_stack: ["javascript", "python", "databases", "html_css", "git", "cloud"],
    data_science: ["python", "data_tools", "databases"],
    ai_ml: ["python", "data_tools"],
    devops: ["devops_tools", "cloud", "git"],
    cloud_engineering: ["cloud", "devops_tools", "git"],
    cybersecurity: ["python", "cloud"],
    data_engineering: ["python", "databases", "cloud", "data_tools"],
    ui_ux: ["html_css", "javascript"],
    product_management: ["databases", "git"],
    project_management: ["git"],
  }

  for (const [careerId, relevantSkills] of Object.entries(careerSkillMap)) {
    for (const skillKey of relevantSkills) {
      const skillLevel = skillLevels.find((s) => s.skill === (skillMapping[skillKey] || skillKey))
      if (skillLevel) {
        scores[careerId] = (scores[careerId] || 0) + skillLevel.score
      }
    }
  }

  // Calculate max possible score and percentages
  const maxPossible = Math.max(...Object.values(scores), 1)
  const recommendedCareers = careerPaths
    .map((career) => ({
      ...career,
      matchPercentage: Math.round(((scores[career.id] || 0) / maxPossible) * 100),
    }))
    .sort((a, b) => b.matchPercentage - a.matchPercentage)

  return { careerScores: scores, skillLevels, recommendedCareers }
}
