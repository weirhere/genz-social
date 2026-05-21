import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { today, type Story } from "@/data/content"
import { MarginPanel } from "./Margin"
import { cn } from "@/lib/utils"

export function StoryScreen({
  storyId,
  onBack,
  onMarkRead,
}: {
  storyId: string
  onBack: () => void
  onMarkRead: (id: string) => void
}) {
  const story = today.find((s) => s.id === storyId) ?? today[0]
  const [marginOpen, setMarginOpen] = useState(false)

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <StoryTopBar story={story} onBack={onBack} />

      <div className="flex-1 overflow-y-auto pb-32">
        <StoryBody story={story} onMarkRead={onMarkRead} />
      </div>

      <AskMarginDock onOpen={() => setMarginOpen(true)} story={story} />

      <AnimatePresence>
        {marginOpen && (
          <MarginPanel story={story} onClose={() => setMarginOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function StoryTopBar({
  story,
  onBack,
}: {
  story: Story
  onBack: () => void
}) {
  return (
    <div className="px-4 pt-3 pb-3 flex items-center justify-between bg-paper/85 backdrop-blur-md relative z-10">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3 L4.5 8 L10 13"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="flex-1 text-center text-[11px] font-medium tracking-[0.16em] uppercase text-ink-3 truncate px-2">
        {story.category}
      </div>
      <div className="flex items-center gap-2">
        <IconButton>
          <BookmarkGlyph />
        </IconButton>
        <IconButton>
          <ShareGlyph />
        </IconButton>
      </div>
    </div>
  )
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2">
      {children}
    </button>
  )
}

function BookmarkGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3.5 2 h7 v10 l-3.5 -2.5 l-3.5 2.5 z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShareGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5 v8 M3.5 5 L7 1.5 L10.5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 8 v3 a1 1 0 0 0 1 1 h7 a1 1 0 0 0 1 -1 v-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StoryBody({
  story,
  onMarkRead,
}: {
  story: Story
  onMarkRead: (id: string) => void
}) {
  return (
    <article className="px-5 pt-1">
      <CategoryHeader story={story} />

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className="font-display text-[36px] leading-[1.05] tracking-tight text-ink mt-3 text-balance"
      >
        {story.headline}
      </motion.h1>

      <p className="text-[15px] leading-snug text-ink-2 mt-3 text-pretty">
        {story.standfirst}
      </p>

      <SourceRail story={story} />

      <div className="mt-6 space-y-4">
        {story.body.map((para, i) => (
          <p
            key={i}
            className="text-[15.5px] leading-[1.55] text-ink text-pretty"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {para}
          </p>
        ))}
      </div>

      <button
        onClick={() => onMarkRead(story.id)}
        className="mt-8 text-[12px] font-medium text-ink-3 underline underline-offset-4 decoration-paper-3"
      >
        Mark as read
      </button>
    </article>
  )
}

function CategoryHeader({ story }: { story: Story }) {
  const colorClass: Record<Story["categoryColor"], string> = {
    signal: "text-signal",
    ember: "text-ember",
    sage: "text-ink-2",
    ink: "text-ink-2",
  }
  return (
    <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] uppercase">
      {story.isLive && (
        <span className="inline-flex items-center gap-1 text-ember">
          <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
          Live
        </span>
      )}
      <span className={colorClass[story.categoryColor]}>{story.category}</span>
      <span className="text-ink-3">·</span>
      <span className="text-ink-3">{story.readMinutes} min</span>
    </div>
  )
}

function SourceRail({ story }: { story: Story }) {
  const leanLabel: Record<string, string> = {
    left: "Left",
    "center-left": "C-L",
    center: "Center",
    "center-right": "C-R",
    right: "Right",
    independent: "Indep.",
  }
  const leanColor: Record<string, string> = {
    left: "#3B82F6",
    "center-left": "#6E47FF",
    center: "#9BB89F",
    "center-right": "#FFB152",
    right: "#FF5C2E",
    independent: "#9CA3AF",
  }
  return (
    <div className="mt-5 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-ink-3">
          Sources · {story.sources.length}
        </span>
        <span className="text-[10.5px] text-ink-3">{story.perspectiveSummary}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {story.sources.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2 py-1 ring-1 ring-paper-3/70 text-[11px] font-medium text-ink"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: leanColor[s.lean] }}
            />
            {s.name}
            <span className="text-[10px] text-ink-3 ml-0.5">
              {leanLabel[s.lean]}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

function AskMarginDock({
  story,
  onOpen,
}: {
  story: Story
  onOpen: () => void
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-5 pt-6 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/95 to-transparent pointer-events-none" />
      <motion.button
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpen}
        className={cn(
          "relative w-full pointer-events-auto rounded-2xl px-4 py-3.5 flex items-center gap-3",
          "bg-ink text-paper shadow-[0_10px_30px_-10px_rgba(110,71,255,0.6)]"
        )}
      >
        <div className="w-9 h-9 rounded-full bg-signal/25 flex items-center justify-center text-signal">
          <SparkleGlyph />
        </div>
        <div className="text-left flex-1">
          <div className="text-[14px] font-medium text-paper">
            Ask Margin about this
          </div>
          <div className="text-[11px] text-paper/60 mt-0.5">
            {story.margin.prompts.slice(0, 2).join(" · ")} · and more
          </div>
        </div>
        <ChevronUpGlyph />
      </motion.button>
    </div>
  )
}

function SparkleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 0.5 L8.2 5.4 L13 6.5 L8.2 7.8 L7 13.5 L5.8 7.8 L1 6.5 L5.8 5.4 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChevronUpGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-paper/70">
      <path
        d="M3 9 L7 5 L11 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
