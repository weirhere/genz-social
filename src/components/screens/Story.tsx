import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { today, type Story } from "@/data/content"
import { MarginPanel, SourceDetail } from "./Margin"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/AppState"
import { ActionMenu } from "@/components/ui/ActionMenu"
import { Sheet } from "@/components/ui/Sheet"

export function StoryScreen({
  storyId,
  onBack,
  onMarkRead,
  nextStoryId,
  onNextStory,
}: {
  storyId: string
  onBack: () => void
  onMarkRead: (id: string) => void
  nextStoryId: string | null
  onNextStory: () => void
}) {
  const story = today.find((s) => s.id === storyId) ?? today[0]
  const nextStory = nextStoryId
    ? today.find((s) => s.id === nextStoryId) ?? null
    : null
  const [marginOpen, setMarginOpen] = useState(false)
  const [sourceIdx, setSourceIdx] = useState<number | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [sendToLoopOpen, setSendToLoopOpen] = useState(false)
  const { isBookmarked, toggleBookmark, toast, loops, attachStory } =
    useAppState()
  const saved = isBookmarked(story.id)

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <StoryTopBar
        story={story}
        onBack={onBack}
        saved={saved}
        onToggleSave={() => {
          toggleBookmark(story.id)
          toast(saved ? "Removed from saved" : "Saved")
        }}
        onShare={() => setShareOpen(true)}
      />

      <div className="flex-1 overflow-y-auto pb-32">
        <StoryBody
          story={story}
          onMarkRead={onMarkRead}
          onSourceTap={setSourceIdx}
          nextStory={nextStory}
          onNextStory={onNextStory}
          onBack={onBack}
        />
      </div>

      <AskMarginDock onOpen={() => setMarginOpen(true)} story={story} />

      <AnimatePresence>
        {marginOpen && (
          <MarginPanel story={story} onClose={() => setMarginOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sourceIdx !== null && (
          <SourceDetail
            key={`story-source-${sourceIdx}`}
            source={story.sources[sourceIdx]}
            quote={story.standfirst}
            onClose={() => setSourceIdx(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareOpen && (
          <ActionMenu
            title="Share story"
            subtitle={story.headline}
            onClose={() => setShareOpen(false)}
            items={[
              {
                label: "Send to a Loop",
                icon: <PaperPlaneGlyph />,
                hint: "Share with one of your group chats",
                onSelect: () => setSendToLoopOpen(true),
              },
              {
                label: "Copy link",
                icon: <LinkGlyph />,
                onSelect: () => toast("Link copied"),
              },
              {
                label: saved ? "Remove from saved" : "Save story",
                icon: <BookmarkGlyph />,
                onSelect: () => {
                  toggleBookmark(story.id)
                  toast(saved ? "Removed from saved" : "Saved")
                },
              },
              {
                label: "Share to…",
                icon: <ShareGlyph />,
                onSelect: () => toast("Share sheet opened"),
              },
            ]}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sendToLoopOpen && (
          <Sheet
            title="Send to a Loop"
            subtitle="Story will appear in the chat with sources attached."
            onClose={() => setSendToLoopOpen(false)}
          >
            <div className="px-3 pb-4 pt-1">
              <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
                {loops.map((l) => (
                  <motion.button
                    key={l.id}
                    type="button"
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      attachStory(l.id, story.id)
                      setSendToLoopOpen(false)
                      setShareOpen(false)
                      toast(`Shared to ${l.name}`)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-paper-3/40"
                  >
                    <span className="w-9 h-9 rounded-xl bg-ink/8 ring-1 ring-ink/10 flex items-center justify-center text-ink font-display text-[18px] leading-none">
                      {l.glyph}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-ink truncate">
                        {l.name}
                      </div>
                      <div className="text-[12px] text-ink-3">
                        {l.members.length} members
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  )
}

function StoryTopBar({
  story,
  onBack,
  saved,
  onToggleSave,
  onShare,
}: {
  story: Story
  onBack: () => void
  saved: boolean
  onToggleSave: () => void
  onShare: () => void
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
      <div className="flex-1 text-center text-[11.5px] font-medium tracking-[0.16em] uppercase text-ink-3 truncate px-2">
        {story.category}
      </div>
      <div className="flex items-center gap-2">
        <IconButton onClick={onToggleSave} active={saved} aria-label="Save story">
          <BookmarkGlyph filled={saved} />
        </IconButton>
        <IconButton onClick={onShare} aria-label="Share">
          <ShareGlyph />
        </IconButton>
      </div>
    </div>
  )
}

function IconButton({
  children,
  onClick,
  active,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  "aria-label"?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      aria-label={ariaLabel}
      className={cn(
        "w-9 h-9 rounded-full ring-1 flex items-center justify-center transition-colors",
        active
          ? "bg-ink text-paper ring-ink"
          : "bg-paper-2 text-ink-2 ring-paper-3 hover:text-ink"
      )}
    >
      {children}
    </motion.button>
  )
}

function BookmarkGlyph({ filled }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3.5 2 h7 v10 l-3.5 -2.5 l-3.5 2.5 z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  )
}

function PaperPlaneGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7 L12 2 L9 12 L7 8 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LinkGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5.5 8.5 L8.5 5.5 M6 3.5 L7.5 2 a2 2 0 0 1 2.8 2.8 L8.5 6.5 M6 7.5 L4.5 9 a2 2 0 0 1 -2.8 -2.8 L3.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
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
  onSourceTap,
  nextStory,
  onNextStory,
  onBack,
}: {
  story: Story
  onMarkRead: (id: string) => void
  onSourceTap: (idx: number) => void
  nextStory: Story | null
  onNextStory: () => void
  onBack: () => void
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

      <SourceRail story={story} onSourceTap={onSourceTap} />

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

      <UpNext nextStory={nextStory} onNextStory={onNextStory} onBack={onBack} />
    </article>
  )
}

function UpNext({
  nextStory,
  onNextStory,
  onBack,
}: {
  nextStory: Story | null
  onNextStory: () => void
  onBack: () => void
}) {
  if (!nextStory) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        className="mt-10 rounded-2xl bg-sage-soft/55 px-4 py-3.5 flex items-center justify-between gap-3"
      >
        <div>
          <div className="text-[11.5px] font-medium tracking-[0.16em] uppercase text-ink-3">
            You're caught up
          </div>
          <div className="text-[13.5px] text-ink-2 mt-0.5">
            Last story in today's Loop.
          </div>
        </div>
        <button
          onClick={onBack}
          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-paper px-3 py-1.5 text-[12px] font-medium text-ink ring-1 ring-paper-3/70 hover:ring-ink/30 transition-colors"
        >
          Back to today
          <ArrowRightGlyph />
        </button>
      </motion.div>
    )
  }

  const categoryStyles: Record<Story["categoryColor"], string> = {
    signal: "bg-ink/5 text-ink-2",
    ember: "bg-ember-soft text-ember",
    sage: "bg-sage-soft text-ink-2",
    ink: "bg-ink/8 text-ink",
  }

  return (
    <motion.button
      type="button"
      onClick={onNextStory}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      whileTap={{ scale: 0.985 }}
      className="mt-10 block w-full text-left rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-4 hover:ring-ink/20 transition-colors"
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11.5px] font-medium tracking-[0.16em] uppercase text-ink-3">
          Up next
        </span>
        <span className="tabular text-[12px] font-medium text-ink-3">
          {nextStory.readMinutes} min
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide mb-2",
              categoryStyles[nextStory.categoryColor]
            )}
          >
            {nextStory.isLive && (
              <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            )}
            <span>{nextStory.category}</span>
          </div>
          <h3 className="font-display text-[22px] leading-[1.12] tracking-tight text-ink text-balance">
            {nextStory.headline}
          </h3>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-signal-soft px-2.5 py-1 text-[12px] font-medium text-signal">
          <SparkleGlyph />
          Read
        </span>
      </div>
    </motion.button>
  )
}

function ArrowRightGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6 H10 M7 3 L10 6 L7 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
    <div className="flex items-center gap-2 text-[11.5px] font-medium tracking-[0.16em] uppercase">
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

// Source-lean tokens — pulled from CSS so dark mode + single-source-of-truth work.
const LEAN_LABEL: Record<string, string> = {
  left: "Left",
  "center-left": "C-L",
  center: "Center",
  "center-right": "C-R",
  right: "Right",
  independent: "Indep.",
}
const LEAN_COLOR_VAR: Record<string, string> = {
  left: "var(--lean-left)",
  "center-left": "var(--lean-center-left)",
  center: "var(--lean-center)",
  "center-right": "var(--lean-center-right)",
  right: "var(--lean-right)",
  independent: "var(--lean-independent)",
}

function SourceRail({
  story,
  onSourceTap,
}: {
  story: Story
  onSourceTap: (idx: number) => void
}) {
  return (
    <div className="mt-5 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-ink-3">
          Sources · {story.sources.length}
        </span>
        <span className="text-[11.5px] text-ink-3">{story.perspectiveSummary}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {story.sources.map((s, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => onSourceTap(i)}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2 py-1 ring-1 ring-paper-3/70 text-[12px] font-medium text-ink hover:ring-signal/40 transition-colors"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: LEAN_COLOR_VAR[s.lean] }}
            />
            {s.name}
            <span className="text-[11px] text-ink-3 ml-0.5">
              {LEAN_LABEL[s.lean]}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="mt-2.5 text-[11px] text-ink-3">
        Tap any source for the receipt.
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
          <div className="text-[14.5px] font-medium text-paper">
            Ask Margin about this
          </div>
          <div className="text-[12px] text-paper/65 mt-0.5">
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
