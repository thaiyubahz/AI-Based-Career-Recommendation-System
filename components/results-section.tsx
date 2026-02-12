"use client"

import { ArrowRight, BarChart3, CheckCircle, Star } from "lucide-react"
import type { CareerPath, SkillLevel } from "@/lib/quiz-data"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"

interface ResultsSectionProps {
  skillLevels: SkillLevel[]
  recommendedCareers: (CareerPath & { matchPercentage: number })[]
  onSelectCareer: (career: CareerPath & { matchPercentage: number }) => void
}

export function ResultsSection({ skillLevels, recommendedCareers, onSelectCareer }: ResultsSectionProps) {
  const radarData = skillLevels.map((s) => ({
    skill: s.skill,
    level: s.score,
    fullMark: 4,
  }))

  const topCareers = recommendedCareers.slice(0, 6)
  const barData = topCareers.map((c) => ({
    name: c.title.length > 15 ? c.title.slice(0, 15) + "..." : c.title,
    match: c.matchPercentage,
    fullName: c.title,
  }))

  const barColors = [
    "hsl(290, 80%, 55%)",
    "hsl(290, 70%, 50%)",
    "hsl(290, 60%, 45%)",
    "hsl(280, 55%, 42%)",
    "hsl(270, 50%, 40%)",
    "hsl(260, 45%, 38%)",
  ]

  return (
    <section className="relative min-h-screen pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <BarChart3 className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground">Your Career Assessment Results</h2>
          <p className="mt-2 text-muted-foreground">Based on your skills and behavioral analysis, here are your personalized recommendations</p>
        </div>

        {/* Charts Grid */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {/* Radar Chart - Skills */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Skills Profile</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(270, 30%, 18%)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(270, 10%, 60%)", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fill: "hsl(270, 10%, 60%)", fontSize: 10 }} />
                <Radar
                  name="Skill Level"
                  dataKey="level"
                  stroke="hsl(290, 80%, 55%)"
                  fill="hsl(290, 80%, 55%)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Career Match */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Career Match Alignment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 30%, 18%)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(270, 10%, 60%)", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "hsl(270, 10%, 60%)", fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(270, 40%, 8%)",
                    border: "1px solid hsl(270, 30%, 18%)",
                    borderRadius: "0.75rem",
                    color: "hsl(270, 10%, 95%)",
                  }}
                  formatter={(value: number, _name: string, props: { payload: { fullName: string } }) => [`${value}%`, props.payload.fullName]}
                />
                <Bar dataKey="match" radius={[0, 6, 6, 0]}>
                  {barData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alignment Score */}
        <div className="mb-12 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <h3 className="font-heading text-lg font-semibold text-foreground">Overall Skills-Interest Alignment</h3>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Star className="h-8 w-8 text-primary" />
            <span className="font-heading text-5xl font-bold text-primary">
              {topCareers[0]?.matchPercentage || 0}%
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your top career match aligns at {topCareers[0]?.matchPercentage || 0}% with your skills and interests
          </p>
        </div>

        {/* Career Cards */}
        <div>
          <h3 className="mb-6 font-heading text-2xl font-bold text-foreground">Recommended Career Paths</h3>
          <p className="mb-6 text-muted-foreground">Select a career to view a detailed learning roadmap and skill tracker</p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topCareers.map((career, index) => (
              <button
                key={career.id}
                onClick={() => onSelectCareer(career)}
                className="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    #{index + 1}
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {career.matchPercentage}% match
                  </span>
                </div>
                <h4 className="mb-2 font-heading text-base font-semibold text-foreground">{career.title}</h4>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{career.description}</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {career.requiredSkills.slice(0, 4).map((skill) => (
                    <span key={skill} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                  {career.requiredSkills.length > 4 && (
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                      +{career.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <CheckCircle className="h-3 w-3" />
                  <span>Select this path</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
