import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { PhoneShell } from "@/components/shell/PhoneShell"
import { StatusBar } from "@/components/shell/StatusBar"
import { BottomNav, type Tab } from "@/components/shell/BottomNav"
import { TodayScreen } from "@/components/screens/Today"
import { StoryScreen } from "@/components/screens/Story"
import { DiscoverScreen } from "@/components/screens/Discover"
import { LoopsScreen } from "@/components/screens/Loops"
import { MeScreen } from "@/components/screens/Me"
import { LoomSidecar } from "@/components/LoomPlayer"
import { ALL_LOOMS } from "@/data/looms"

// lg breakpoint matches Tailwind's 1024px — below it the phone owns the
// whole canvas and the sidecar would be cramped, so we fall through to the
// existing draggable PiP behavior.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    setIsDesktop(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return isDesktop
}

type View =
  | { kind: "tab"; tab: Tab }
  | { kind: "story"; id: string; from: Tab }

export function Prototype() {
  const [view, setView] = useState<View>({ kind: "tab", tab: "today" })
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set())
  const isDesktop = useIsDesktop()

  const activeTab = view.kind === "tab" ? view.tab : view.from

  const switchTab = (tab: Tab) => setView({ kind: "tab", tab })

  const openStory = (id: string) => {
    setView({ kind: "story", id, from: activeTab })
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const closeStory = () =>
    setView({
      kind: "tab",
      tab: view.kind === "story" ? view.from : "today",
    })

  return (
    <div className="min-h-svh w-full bg-paper sm:bg-[radial-gradient(ellipse_at_top_left,oklch(0.95_0.018_80)_0%,oklch(0.92_0.022_80)_50%,oklch(0.94_0.025_80)_100%)] relative overflow-x-hidden">
      <DesktopChrome activeTab={activeTab} onTabChange={switchTab} />
      <MobileTopBar />

      <div className="relative w-full flex justify-center sm:py-8 sm:pt-24">
        <div className="flex items-start gap-8 lg:gap-12 w-full lg:w-auto justify-center">
          {isDesktop && <LoomSidecar entries={ALL_LOOMS} />}
          <PhoneShell>
            <StatusBar />

            <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {view.kind === "tab" && view.tab === "today" && (
                <ScreenFrame key="today">
                  <TodayScreen
                    readIds={readIds}
                    onOpenStory={openStory}
                  />
                </ScreenFrame>
              )}
              {view.kind === "tab" && view.tab === "discover" && (
                <ScreenFrame key="discover">
                  <DiscoverScreen />
                </ScreenFrame>
              )}
              {view.kind === "tab" && view.tab === "loops" && (
                <ScreenFrame key="loops">
                  <LoopsScreen />
                </ScreenFrame>
              )}
              {view.kind === "tab" && view.tab === "me" && (
                <ScreenFrame key="me">
                  <MeScreen />
                </ScreenFrame>
              )}
              {view.kind === "story" && (
                <ScreenFrame key={`story-${view.id}`}>
                  <StoryScreen
                    storyId={view.id}
                    onBack={closeStory}
                    onMarkRead={(id) => {
                      setReadIds((prev) => {
                        const next = new Set(prev)
                        next.add(id)
                        return next
                      })
                    }}
                  />
                </ScreenFrame>
              )}
            </AnimatePresence>
          </div>

            {view.kind !== "story" && (
              <BottomNav active={activeTab} onChange={switchTab} />
            )}
          </PhoneShell>
        </div>
      </div>

      <DesktopFooter />
    </div>
  )
}

function ScreenFrame({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 flex flex-col"
    >
      {children}
    </motion.div>
  )
}

function MobileTopBar() {
  return (
    <div className="sm:hidden sticky top-0 inset-x-0 z-30 h-11 bg-paper/95 backdrop-blur-sm border-b border-paper-3/60 flex items-center justify-between px-3">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-ink-2 hover:text-ink active:text-ink transition-colors px-2.5 py-1.5 rounded-full ring-1 ring-paper-3/70 bg-paper-2"
      >
        <span aria-hidden>←</span> Project home
      </Link>
      <div className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="var(--ink)" strokeWidth="2.4" />
        </svg>
        <span className="font-display text-[14px] tracking-tight text-ink leading-none">
          Loop
        </span>
      </div>
    </div>
  )
}

function DesktopChrome({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab
  onTabChange: (t: Tab) => void
}) {
  return (
    <div className="hidden sm:block fixed top-0 inset-x-0 z-30 px-8 pt-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9" stroke="var(--ink)" strokeWidth="2.4" />
          </svg>
          <div>
            <div className="font-display text-[22px] tracking-tight text-ink leading-none group-hover:text-signal transition-colors">
              Loop
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-ink-3 mt-0.5">
              Fortune 100 · 2026 concept
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ScreenSwitcher activeTab={activeTab} onTabChange={onTabChange} />
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 text-[12px] text-ink-2 hover:text-ink transition-colors px-3 py-1.5 rounded-full ring-1 ring-paper-3/70 bg-paper-2"
          >
            ← Project home
          </Link>
        </div>
      </div>
    </div>
  )
}

function ScreenSwitcher({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab
  onTabChange: (t: Tab) => void
}) {
  // Mobile and desktop nav now share the same labels — no "01 · Today"
  // numbering only-on-desktop. The presentation-conceit numbering belonged
  // to the writeup, not the live UI.
  const items: { id: Tab; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "discover", label: "Discover" },
    { id: "loops", label: "Loops" },
    { id: "me", label: "Me" },
  ]
  return (
    <div className="flex items-center gap-1 rounded-full bg-paper-2 ring-1 ring-paper-3/70 p-1">
      {items.map((it) => {
        const active = activeTab === it.id
        return (
          <button
            key={it.id}
            onClick={() => onTabChange(it.id)}
            className={`relative px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-colors ${
              active ? "text-paper" : "text-ink-2 hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="desktop-switcher-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 340, damping: 32 }}
              />
            )}
            <span className="relative">{it.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function DesktopFooter() {
  return (
    <div className="hidden sm:block fixed bottom-6 inset-x-0 z-20 px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-ink-3">
        <div className="flex items-center gap-2">
          <span className="tabular">390×844</span>
          <span>·</span>
          <span>iPhone-class · light mode</span>
        </div>
        <div className="flex items-center gap-3">
          <Legend swatch="bg-signal" label="Signal · violet" />
          <Legend swatch="bg-ember" label="Ember · orange" />
          <Legend swatch="bg-sage" label="Sage · green" />
          <Legend swatch="bg-ink" label="Ink · #0B0B14" />
          <Legend swatch="bg-paper border border-ink/15" label="Paper · #F5F0E8" />
        </div>
      </div>
    </div>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${swatch}`} />
      <span>{label}</span>
    </span>
  )
}
