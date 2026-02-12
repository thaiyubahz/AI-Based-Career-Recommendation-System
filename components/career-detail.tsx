"use client"

import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Code2, ExternalLink, GraduationCap, Layers } from "lucide-react"
import type { CareerPath } from "@/lib/quiz-data"
import { skillRoadmaps } from "@/lib/quiz-data"

interface CareerDetailProps {
  career: CareerPath & { matchPercentage: number }
  onBack: () => void
  onStartPlanner: (skills: string[]) => void
}

export function CareerDetail({ career, onBack, onStartPlanner }: CareerDetailProps) {
  const matchedRoadmaps = career.requiredSkills
    .map((skill) => {
      const roadmap = skillRoadmaps[skill]
      return roadmap ? { skill, ...roadmap } : null
    })
    .filter(Boolean) as { skill: string; days: number; topics: string[]; resources: { name: string; url: string; type: string }[]; miniProjects: string[] }[]

  const totalDays = matchedRoadmaps.reduce((sum, r) => sum + r.days, 0)

  return (
    <section className="relative min-h-screen pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </button>

        {/* Career Header */}
        <div className="mb-8 rounded-2xl border border-primary/30 bg-card p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">{career.matchPercentage}% Match</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground">{career.title}</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">{career.description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Skills Required</p>
              <p className="font-heading text-lg font-bold text-foreground">{career.requiredSkills.length}</p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Estimated Duration</p>
              <p className="font-heading text-lg font-bold text-foreground">{totalDays} days</p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Learning Resources</p>
              <p className="font-heading text-lg font-bold text-foreground">{matchedRoadmaps.reduce((sum, r) => sum + r.resources.length, 0)}+</p>
            </div>
          </div>
        </div>

        {/* Skills Roadmap */}
        <h3 className="mb-6 font-heading text-2xl font-bold text-foreground">Skills You Need to Learn</h3>

        <div className="flex flex-col gap-6">
          {matchedRoadmaps.map((roadmap, index) => (
            <div key={roadmap.skill} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-heading text-base font-semibold text-foreground">{roadmap.skill}</h4>
                  <p className="text-xs text-muted-foreground">{roadmap.days} days to complete</p>
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  Topics to Cover
                </div>
                <div className="flex flex-wrap gap-2">
                  {roadmap.topics.map((topic) => (
                    <span key={topic} className="rounded-lg bg-secondary px-3 py-1.5 text-xs text-foreground">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  Recommended Resources
                </div>
                <div className="flex flex-col gap-2">
                  {roadmap.resources.map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm transition-colors hover:border-primary/30"
                    >
                      <span className="text-foreground">{resource.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{resource.type}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mini Projects */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Code2 className="h-3.5 w-3.5" />
                  Mini Project Ideas
                </div>
                <div className="flex flex-col gap-1.5">
                  {roadmap.miniProjects.map((project) => (
                    <div key={project} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary/60" />
                      <span>{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Also list skills without detailed roadmaps */}
        {career.requiredSkills.filter((s) => !skillRoadmaps[s]).length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h4 className="mb-3 font-heading text-base font-semibold text-foreground">Additional Skills</h4>
            <div className="flex flex-wrap gap-2">
              {career.requiredSkills.filter((s) => !skillRoadmaps[s]).map((skill) => (
                <span key={skill} className="rounded-lg bg-secondary px-3 py-1.5 text-xs text-foreground">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Start Planner CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onStartPlanner(matchedRoadmaps.map((r) => r.skill))}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start Learning Planner
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-3 text-sm text-muted-foreground">Begin your personalized daily learning schedule</p>
        </div>
      </div>
    </section>
  )
}
