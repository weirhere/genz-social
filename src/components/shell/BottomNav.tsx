import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export type Tab = "today" | "discover" | "loops" | "me"

const tabs: { id: Tab; label: string; glyph: React.ReactNode }[] = [
  { id: "today", label: "Today", glyph: <TodayGlyph /> },
  { id: "discover", label: "Discover", glyph: <DiscoverGlyph /> },
  { id: "loops", label: "Loops", glyph: <LoopsGlyph /> },
  { id: "me", label: "Me", glyph: <MeGlyph /> },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (t: Tab) => void
}) {
  return (
    <div className="relative">
      {/* Soft top fade so content scrolls underneath */}
      <div className="absolute -top-6 inset-x-0 h-6 bg-gradient-to-t from-paper/95 to-transparent pointer-events-none" />
      <nav className="relative flex items-center justify-between px-6 pb-6 pt-3 bg-paper/85 backdrop-blur-md border-t border-paper-3/60">
        {tabs.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg group"
            >
              <span
                className={cn(
                  "w-6 h-6 flex items-center justify-center transition-colors",
                  isActive ? "text-ink" : "text-ink-3"
                )}
              >
                {t.glyph}
              </span>
              <span
                className={cn(
                  "text-[10.5px] font-medium tracking-wide transition-colors",
                  isActive ? "text-ink" : "text-ink-3"
                )}
              >
                {t.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-signal"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function TodayGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M11 5.5 v5.5 l3.5 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DiscoverGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14.5 7.5 L12 12 L7.5 14.5 L10 10 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LoopsGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M6 5.5 h7.5 a3.5 3.5 0 0 1 0 7 h-4 l-3 3 v-3 h-0.5 a3.5 3.5 0 0 1 0-7 z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MeGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 18.5 c1.5 -3.5 4 -5 7 -5 s5.5 1.5 7 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
