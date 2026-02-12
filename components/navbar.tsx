"use client"

import { Compass, Menu, X, LogOut, User } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  onNavigate: (step: string) => void
  userName?: string
  onLogout?: () => void
}

export function Navbar({ onNavigate, userName, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

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

        <div className="hidden items-center gap-6 md:flex">
          <button onClick={() => onNavigate("landing")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Home
          </button>
          <button onClick={() => onNavigate("behavioral")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Take Quiz
          </button>
          <button onClick={() => onNavigate("landing")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </button>

          {userName && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {initials}
                </div>
                <span className="max-w-[120px] truncate text-sm text-foreground">{userName}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                aria-label="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          )}

          {!userName && (
            <button
              onClick={() => onNavigate("behavioral")}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </button>
          )}
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
            {userName && (
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{userName}</span>
                  <span className="text-xs text-muted-foreground">Signed in</span>
                </div>
              </div>
            )}
            <button onClick={() => { onNavigate("landing"); setMobileOpen(false) }} className="text-left text-sm text-muted-foreground">Home</button>
            <button onClick={() => { onNavigate("behavioral"); setMobileOpen(false) }} className="text-left text-sm text-muted-foreground">Take Quiz</button>
            <button onClick={() => { onNavigate("landing"); setMobileOpen(false) }} className="text-left text-sm text-muted-foreground">Features</button>
            {userName ? (
              <button
                onClick={() => { onLogout?.(); setMobileOpen(false) }}
                className="flex items-center gap-2 rounded-full border border-destructive/30 px-5 py-2 text-center text-sm font-medium text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => { onNavigate("behavioral"); setMobileOpen(false) }}
                className="rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-primary-foreground"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
