import { motion } from "motion/react"
import { today, editorsBrief, type Story } from "@/data/content"
import { cn } from "@/lib/utils"

export function TodayScreen({
  readIds,
  onOpenStory,
}: {
  readIds: Set<string>
  onOpenStory: (storyId: string) => void
}) {
  const total = today.length
  const readCount = readIds.size
  const remainingMinutes = today
    .filter((s) => !readIds.has(s.id))
    .reduce((acc, s) => acc + s.readMinutes, 0)

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <Header />
      <EditorsBrief brief={editorsBrief} />
      <ProgressDial
        read={readCount}
        total={total}
        minutesLeft={remainingMinutes}
      />

      <div className="px-5 mt-2 space-y-3.5">
        {today.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.04 * i, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <StoryCard
              story={story}
              index={i + 1}
              isRead={readIds.has(story.id)}
              onOpen={() => onOpenStory(story.id)}
            />
          </motion.div>
        ))}
      </div>

      <FromYourLoops />

      {readCount === total ? <CaughtUp /> : <div className="h-12" />}
    </div>
  )
}

function Header() {
  return (
    <div className="px-5 pt-3 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LoopMark />
          <span className="text-[12px] font-medium tracking-[0.18em] uppercase text-ink-3">
            Thursday · May 21
          </span>
        </div>
        <button className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2">
          <BellGlyph />
        </button>
      </div>
      <h1 className="font-display text-[44px] leading-[1.02] tracking-tight text-ink mt-3">
        Morning, Olivia.
      </h1>
    </div>
  )
}

function LoopMark() {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="2.2" />
      </svg>
      <span className="font-display text-[16px] tracking-tight text-ink">
        Loop
      </span>
    </div>
  )
}

function BellGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 7 a4 4 0 0 1 8 0 v3 l1.5 2 h-11 l1.5 -2 V7z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 13 a1.5 1.5 0 0 0 3 0"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}

function EditorsBrief({ brief }: { brief: string }) {
  return (
    <div className="mx-5 mt-4 mb-5 rounded-2xl bg-ink p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] bg-gradient-to-br from-signal via-transparent to-ember pointer-events-none" />
      <div className="relative flex items-start gap-2.5">
        <div className="mt-1.5">
          <span className="block w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-paper/60">
              The day in 12 words
            </span>
            <span className="text-[10.5px] text-paper/40">·</span>
            <span className="text-[10.5px] text-paper/40 font-medium">
              written by Loop editorial, 6:00 AM
            </span>
          </div>
          <p className="font-display text-[18px] leading-snug text-paper text-balance">
            {brief}
          </p>
        </div>
      </div>
    </div>
  )
}

function ProgressDial({
  read,
  total,
  minutesLeft,
}: {
  read: number
  total: number
  minutesLeft: number
}) {
  const pct = (read / total) * 100
  return (
    <div className="mx-5 mb-5 flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="3"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 20}
            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - pct / 100) }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center tabular text-[12px] font-semibold text-ink">
          {read}/{total}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-[13.5px] font-medium text-ink">
          {read === total
            ? "You're caught up."
            : `${total - read} stories left · ${minutesLeft} min`}
        </div>
        <div className="text-[12px] text-ink-3 mt-0.5">
          {read === 0
            ? "Today's Loop ends when you finish."
            : "No infinite scroll. Just the loop."}
        </div>
      </div>
    </div>
  )
}

function StoryCard({
  story,
  index,
  isRead,
  onOpen,
}: {
  story: Story
  index: number
  isRead: boolean
  onOpen: () => void
}) {
  return (
    <motion.button
      onClick={onOpen}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "w-full text-left rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-4 transition-colors",
        isRead && "opacity-55"
      )}
    >
      <div className="flex items-center justify-between mb-2.5">
        <CategoryChip
          label={story.category}
          color={story.categoryColor}
          live={story.isLive}
        />
        <span className="tabular text-[11px] font-medium text-ink-3">
          {String(index).padStart(2, "0")} · {story.readMinutes} min
        </span>
      </div>

      <h2 className="font-display text-[22px] leading-[1.12] tracking-tight text-ink text-balance">
        {story.headline}
      </h2>

      <p className="text-[13.5px] leading-snug text-ink-2 mt-2 text-pretty">
        {story.standfirst}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <PerspectiveChip
          sources={story.sources}
          summary={story.perspectiveSummary}
        />
        <MarginButton />
      </div>
    </motion.button>
  )
}

function CategoryChip({
  label,
  color,
  live,
}: {
  label: string
  color: Story["categoryColor"]
  live?: boolean
}) {
  const styles: Record<Story["categoryColor"], string> = {
    signal: "bg-signal-soft text-signal",
    ember: "bg-ember-soft text-ember",
    sage: "bg-sage-soft text-ink-2",
    ink: "bg-ink/8 text-ink",
  }
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-medium tracking-wide",
        styles[color]
      )}
    >
      {live && (
        <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
      )}
      <span>{label}</span>
    </div>
  )
}

function PerspectiveChip({
  sources,
  summary,
}: {
  sources: Story["sources"]
  summary: string
}) {
  // Stack source dots representing the lean spectrum
  const leanColor: Record<string, string> = {
    left: "#3B82F6",
    "center-left": "#6E47FF",
    center: "#9BB89F",
    "center-right": "#FFB152",
    right: "#FF5C2E",
    independent: "#9CA3AF",
  }
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex -space-x-1">
        {sources.map((s, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full ring-2 ring-paper-2"
            style={{ background: leanColor[s.lean] }}
          />
        ))}
      </div>
      <span className="text-[11px] text-ink-3">{summary}</span>
    </div>
  )
}

function MarginButton() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink-2">
      <SparkleGlyph />
      Margin
    </div>
  )
}

function SparkleGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M5.5 0 L6.5 4.5 L11 5.5 L6.5 6.5 L5.5 11 L4.5 6.5 L0 5.5 L4.5 4.5 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FromYourLoops() {
  const activeStories = today.filter((s) => s.loopActivity)
  if (activeStories.length === 0) return null
  return (
    <div className="mt-7 px-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-[20px] tracking-tight text-ink">
          From your Loops
        </h3>
        <span className="text-[11px] text-ink-3">Friends talking right now</span>
      </div>
      <div className="space-y-2.5">
        {activeStories.map((s) => (
          <div
            key={s.id}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70"
          >
            <Avatar letter={s.loopActivity!.avatar} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-ink-3">
                <span className="text-ink-2 font-medium">
                  {s.loopActivity!.person}
                </span>{" "}
                in{" "}
                <span className="text-signal font-medium">
                  {s.loopActivity!.loopName}
                </span>{" "}
                · {s.loopActivity!.timeAgo}
              </div>
              <p className="text-[13.5px] text-ink mt-1 text-pretty">
                "{s.loopActivity!.snippet}"
              </p>
              <div className="mt-2 text-[12px] text-ink-3">
                quoting{" "}
                <span className="underline decoration-paper-3 underline-offset-2 text-ink-2">
                  {s.headline.slice(0, 56)}…
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Avatar({ letter }: { letter: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-signal/15 ring-1 ring-signal/30 flex items-center justify-center text-signal font-semibold text-[13px]">
      {letter}
    </div>
  )
}

function CaughtUp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-5 mt-7 p-6 rounded-3xl bg-sage-soft text-center"
    >
      <div className="mx-auto w-12 h-12 rounded-full bg-sage flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M5 11 L9.5 15.5 L17 7"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="font-display text-[26px] tracking-tight text-ink mt-3">
        You're caught up.
      </h3>
      <p className="text-[13px] text-ink-2 mt-1 max-w-[260px] mx-auto text-pretty">
        Tomorrow's Loop drops at 6:00 AM. Until then, send a Margin to a Loop or
        go explore Discover.
      </p>
    </motion.div>
  )
}
