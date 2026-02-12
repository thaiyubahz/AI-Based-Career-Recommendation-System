"use client"

import { Compass, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar({ onNavigate }: { onNavigate: (step: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 text-foreground"
        >
          <Compass className="h-6 w-6 text-primary" />
          <span className="font-heading text-lg font-bold">PathFinder AI</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <button onClick={() => onNavigate("landing")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Home
          </button>
          <button onClick={() => onNavigate("behavioral")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Take Quiz
          </button>
          <button onClick={() => onNavigate("landing")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </button>
          <button
            onClick={() => onNavigate("behavioral")}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            <button onClick={() => { onNavigate("landing"); setMobileOpen(false) }} className="text-left text-sm text-muted-foreground">Home</button>
            <button onClick={() => { onNavigate("behavioral"); setMobileOpen(false) }} className="text-left text-sm text-muted-foreground">Take Quiz</button>
            <button onClick={() => { onNavigate("landing"); setMobileOpen(false) }} className="text-left text-sm text-muted-foreground">Features</button>
            <button
              onClick={() => { onNavigate("behavioral"); setMobileOpen(false) }}
              className="rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-primary-foreground"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
