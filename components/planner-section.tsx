"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Award, Calendar, CheckCircle2, Flame, PartyPopper, Star, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { skillRoadmaps } from "@/lib/quiz-data"

interface PlannerProps {
  skills: string[]
  onBack: () => void
}

interface DailyTask {
  day: number
  topic: string
  completed: boolean
}

interface SkillPlan {
  skill: string
  days: number
  tasks: DailyTask[]
  completed: boolean
}

const milestoneMessages = [
  { threshold: 0.25, message: "Great start! You are building momentum!", icon: Flame },
  { threshold: 0.5, message: "Halfway there! Keep pushing forward!", icon: Star },
  { threshold: 0.75, message: "Almost done! You are crushing it!", icon: Award },
  { threshold: 1.0, message: "Skill mastered! You are amazing!", icon: Trophy },
]

const encouragements = [
  "Awesome work! Keep it up!",
  "You are on fire! Great progress!",
  "One step closer to mastery!",
  "Consistency is key. Well done!",
  "You are doing fantastic!",
  "Another day, another skill!",
  "Dedication pays off!",
  "You are building something great!",
]

export function PlannerSection({ skills, onBack }: PlannerProps) {
  const [skillPlans, setSkillPlans] = useState<SkillPlan[]>([])
  const [activeSkillIndex, setActiveSkillIndex] = useState(0)
  const [points, setPoints] = useState(0)
  const [showCelebration, setShowCelebration] = useState<string | null>(null)
  const [lastEncouragement, setLastEncouragement] = useState<string | null>(null)

  useEffect(() => {
    const plans = skills.map((skill) => {
      const roadmap = skillRoadmaps[skill]
      if (!roadmap) return null
      const tasksPerDay = Math.ceil(roadmap.topics.length / roadmap.days)
      const tasks: DailyTask[] = []
      for (let day = 1; day <= roadmap.days; day++) {
        const topicIndex = Math.floor((day - 1) / Math.max(1, Math.floor(roadmap.days / roadmap.topics.length)))
        const topic = roadmap.topics[Math.min(topicIndex, roadmap.topics.length - 1)]
        tasks.push({ day, topic: `Day ${day}: ${topic} (Practice ${tasksPerDay > 1 ? "& exercises" : ""})`, completed: false })
      }
      return { skill, days: roadmap.days, tasks, completed: false }
    }).filter(Boolean) as SkillPlan[]
    setSkillPlans(plans)
  }, [skills])

  const handleToggleTask = (skillIdx: number, taskIdx: number) => {
    setSkillPlans((prev) => {
      const updated = [...prev]
      const plan = { ...updated[skillIdx] }
      const tasks = [...plan.tasks]
      const wasCompleted = tasks[taskIdx].completed
      tasks[taskIdx] = { ...tasks[taskIdx], completed: !wasCompleted }
      plan.tasks = tasks

      const completedCount = tasks.filter((t) => t.completed).length
      plan.completed = completedCount === tasks.length

      updated[skillIdx] = plan

      if (!wasCompleted) {
        setPoints((p) => p + 10)
        setLastEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)])
        setTimeout(() => setLastEncouragement(null), 3000)

        // Check milestones
        const progress = completedCount / tasks.length
        for (const milestone of milestoneMessages) {
          const prevProgress = (completedCount - 1) / tasks.length
          if (prevProgress < milestone.threshold && progress >= milestone.threshold) {
            setShowCelebration(milestone.message)
            setPoints((p) => p + 50)
            setTimeout(() => setShowCelebration(null), 4000)
            break
          }
        }
      } else {
        setPoints((p) => Math.max(0, p - 10))
      }

      return updated
    })
  }

  if (skillPlans.length === 0) return null

  const activePlan = skillPlans[activeSkillIndex]
  const completedTasks = activePlan.tasks.filter((t) => t.completed).length
  const progressPercent = (completedTasks / activePlan.tasks.length) * 100
  const totalCompletedSkills = skillPlans.filter((p) => p.completed).length
  const totalProgress = skillPlans.reduce((sum, p) => sum + p.tasks.filter((t) => t.completed).length, 0)
  const totalTasks = skillPlans.reduce((sum, p) => sum + p.tasks.length, 0)

  return (
    <section className="relative min-h-screen pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Back */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Career Details
        </button>

        {/* Header Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <Trophy className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="font-heading text-2xl font-bold text-foreground">{points}</p>
            <p className="text-xs text-muted-foreground">Points Earned</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <Flame className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="font-heading text-2xl font-bold text-foreground">{totalCompletedSkills}/{skillPlans.length}</p>
            <p className="text-xs text-muted-foreground">Skills Completed</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="font-heading text-2xl font-bold text-foreground">{totalProgress}/{totalTasks}</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <Calendar className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="font-heading text-2xl font-bold text-foreground">{Math.round((totalProgress / totalTasks) * 100)}%</p>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </div>
        </div>

        {/* Celebration Banner */}
        {showCelebration && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/50 bg-primary/10 p-4 text-foreground animate-in fade-in slide-in-from-top-2">
            <PartyPopper className="h-6 w-6 text-primary" />
            <span className="font-medium">{showCelebration} (+50 bonus points!)</span>
          </div>
        )}

        {/* Encouragement */}
        {lastEncouragement && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm text-primary animate-in fade-in">
            <Star className="h-4 w-4" />
            <span>{lastEncouragement} (+10 points)</span>
          </div>
        )}

        {/* Skill Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {skillPlans.map((plan, index) => {
            const planCompleted = plan.tasks.filter((t) => t.completed).length
            const planProgress = Math.round((planCompleted / plan.tasks.length) * 100)
            return (
              <button
                key={plan.skill}
                onClick={() => setActiveSkillIndex(index)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                  index === activeSkillIndex
                    ? "bg-primary text-primary-foreground"
                    : plan.completed
                    ? "border border-primary/50 bg-primary/10 text-primary"
                    : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {plan.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                {plan.skill}
                <span className="text-[10px] opacity-70">{planProgress}%</span>
              </button>
            )
          })}
        </div>

        {/* Active Skill Planner */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">{activePlan.skill}</h3>
              <p className="text-sm text-muted-foreground">{activePlan.days} day learning plan</p>
            </div>
            <div className="text-right">
              <p className="font-heading text-2xl font-bold text-primary">{Math.round(progressPercent)}%</p>
              <p className="text-xs text-muted-foreground">{completedTasks}/{activePlan.tasks.length} tasks</p>
            </div>
          </div>

          <Progress value={progressPercent} className="mb-6 h-3 bg-secondary [&>div]:bg-primary [&>div]:transition-all" />

          {/* Daily Tasks */}
          <div className="flex flex-col gap-2">
            {activePlan.tasks.map((task, taskIdx) => (
              <button
                key={task.day}
                onClick={() => handleToggleTask(activeSkillIndex, taskIdx)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  task.completed
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-secondary/30 hover:border-primary/20"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                    task.completed ? "border-primary bg-primary" : "border-muted-foreground/30"
                  }`}
                >
                  {task.completed && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                </div>
                <span className={`text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {task.topic}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* All Skills Complete */}
        {totalCompletedSkills === skillPlans.length && (
          <div className="mt-8 rounded-2xl border border-primary bg-primary/10 p-8 text-center">
            <Trophy className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h3 className="font-heading text-2xl font-bold text-foreground">Congratulations!</h3>
            <p className="mt-2 text-muted-foreground">
              You have completed all skills in your learning plan! You earned {points} total points.
              You are now ready to start applying for roles and building real-world projects!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
