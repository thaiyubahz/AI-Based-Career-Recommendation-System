"use client"

import { ArrowRight, Brain, MapPin, Target, TrendingUp } from "lucide-react"

export function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered Career Guidance</span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="text-balance">Discover Your</span>
              <br />
              <span className="text-primary">Ideal Career</span>
              <br />
              <span className="text-balance">Path Today</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:text-lg">
              Take our AI-powered assessment to uncover career paths perfectly aligned with your skills, interests, and personality. Get a personalized roadmap to success.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onStart}
                className="group flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                Start Assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="rounded-full border border-border px-8 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="font-heading text-2xl font-bold text-foreground">12+</p>
                <p className="text-sm text-muted-foreground">Career Paths</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-foreground">15</p>
                <p className="text-sm text-muted-foreground">Skill Assessments</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Free to Use</p>
              </div>
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <Target className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">Skills Analysis</h3>
                  <p className="text-xs text-muted-foreground">Evaluate your current skill level across key technologies</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <MapPin className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">Career Roadmaps</h3>
                  <p className="text-xs text-muted-foreground">Step-by-step learning paths tailored for you</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-8">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <Brain className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">AI Matching</h3>
                  <p className="text-xs text-muted-foreground">Smart algorithm aligns your interests with top careers</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <TrendingUp className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">Progress Tracker</h3>
                  <p className="text-xs text-muted-foreground">Daily planner with milestones and achievement points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners / Trusted By */}
      <div className="relative mx-auto max-w-3xl px-6 pb-12">
        <div className="rounded-2xl border border-border bg-card/50 px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-muted-foreground">
            <span>Designed for students at</span>
            <span className="text-foreground">IITs</span>
            <span className="text-foreground">NITs</span>
            <span className="text-foreground">IIIT</span>
            <span className="text-foreground">Top Universities</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-6">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Key Features</h2>
            <p className="max-w-md leading-relaxed text-muted-foreground">
              Our platform uses AI and machine learning to analyze your skills, behavioral traits, and interests to recommend the most suitable career paths in tech.
            </p>
            <button
              onClick={onStart}
              className="w-fit rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Learn more
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, title: "Aggregate", desc: "Comprehensive skill and interest analysis within the platform" },
              { icon: TrendingUp, title: "Recommend", desc: "AI-powered career path recommendations tailored for you" },
              { icon: MapPin, title: "Guide", desc: "Structured roadmaps with free learning resources" },
              { icon: Brain, title: "Track", desc: "Daily planner and progress tracking with points" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Start Your Journey
            <br />
            <span className="text-primary">Today.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Take the first step towards your ideal career. Our AI assessment is completely free and takes less than 10 minutes.
          </p>
          <button
            onClick={onStart}
            className="mt-8 rounded-full bg-primary px-10 py-3.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Take the Quiz Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                <span className="font-heading font-bold text-foreground">PathFinder AI</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">AI-powered career guidance for the next generation.</p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>Home</span>
                <span>Quiz</span>
                <span>Careers</span>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Resources</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>Learning Paths</span>
                <span>Roadmaps</span>
                <span>FAQ</span>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
