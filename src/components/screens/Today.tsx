import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { today, editorsBrief, type Story } from "@/data/content"
import { cn } from "@/lib/utils"
import { EASE_CONTENT, STAGGER } from "@/lib/motion"
import { Sheet } from "@/components/ui/Sheet"
import { useAppState, type Settings } from "@/state/AppState"

function formatToday(date: Date = new Date()) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
  const month = date.toLocaleDateString("en-US", { month: "long" })
  return `${weekday} · ${month} ${date.getDate()}`
}

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

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pickerKey, setPickerKey] = useState<keyof Settings | null>(null)

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <SettingsSheets
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false)
          setPickerKey(null)
        }}
        pickerKey={pickerKey}
        onOpenPicker={setPickerKey}
        onClosePicker={() => setPickerKey(null)}
      />
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
            transition={{ duration: 0.45, delay: STAGGER * i, ease: EASE_CONTENT }}
          >
            <StoryCard
              story={story}
              isRead={readIds.has(story.id)}
              onOpen={() => onOpenStory(story.id)}
            />
          </motion.div>
        ))}
      </div>

      <FromYourLoops />

      {readCount === total ? (
        <CaughtUp />
      ) : (
        <CaughtUpGhost remaining={total - readCount} />
      )}
    </div>
  )
}

function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="px-5 pt-3 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LoopMark />
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-3">
            {formatToday()}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2 hover:text-ink transition-colors"
          aria-label="Settings"
        >
          <SettingsGlyph />
        </motion.button>
      </div>
      <h1 className="font-display text-[44px] leading-[1.02] tracking-tight text-ink mt-3">
        Morning, Olivia.
      </h1>
    </div>
  )
}

const SETTING_OPTIONS: Record<keyof Settings, string[]> = {
  storyCount: ["5", "7", "10", "12"],
  dropTime: ["5:30 AM", "6:00 AM", "7:00 AM", "8:00 AM"],
  tone: ["Conversational", "Newsroom", "Lean & dry"],
}

const SETTING_LABEL: Record<keyof Settings, string> = {
  storyCount: "Story count per day",
  dropTime: "Drop time",
  tone: "Tone",
}

function SettingsSheets({
  open,
  onClose,
  pickerKey,
  onOpenPicker,
  onClosePicker,
}: {
  open: boolean
  onClose: () => void
  pickerKey: keyof Settings | null
  onOpenPicker: (key: keyof Settings) => void
  onClosePicker: () => void
}) {
  const { settings, updateSetting, toast } = useAppState()
  return (
    <>
      <AnimatePresence>
        {open && (
          <Sheet
            title="Loop settings"
            subtitle="Quick controls. Full calibration lives on Me."
            onClose={onClose}
          >
            <div className="px-3 pb-4 pt-1">
              <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
                {(Object.keys(SETTING_OPTIONS) as (keyof Settings)[]).map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() => onOpenPicker(key)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-paper-3/40"
                    >
                      <div>
                        <div className="text-[14px] font-medium text-ink">
                          {SETTING_LABEL[key]}
                        </div>
                        <div className="text-[11.5px] text-ink-3 mt-0.5">
                          {SETTING_OPTIONS[key].length} options
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-ink-2">
                        {settings[key]}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className="text-ink-3"
                        >
                          <path
                            d="M4.5 3 L7.5 6 L4.5 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                  )
                )}
              </div>
              <p className="mt-3 px-2 text-[11.5px] text-ink-3 leading-snug">
                Loop is anti-notification by design. Settings stay quiet.
              </p>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pickerKey && (
          <Sheet
            title={SETTING_LABEL[pickerKey]}
            subtitle="Pick one. You can change this anytime."
            onClose={onClosePicker}
          >
            <div className="px-3 pb-4 pt-1">
              <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
                {SETTING_OPTIONS[pickerKey].map((opt) => {
                  const selected = settings[pickerKey] === opt
                  return (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => {
                        updateSetting(pickerKey, opt)
                        toast(`${SETTING_LABEL[pickerKey]} → ${opt}`)
                        onClosePicker()
                      }}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-paper-3/40"
                    >
                      <span className="text-[14.5px] text-ink">{opt}</span>
                      {selected && (
                        <span className="w-5 h-5 rounded-full bg-sage flex items-center justify-center">
                          <svg width="11" height="11" viewBox="0 0 11 11">
                            <path
                              d="M2 5.5 L4.5 8 L9 3"
                              stroke="white"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </>
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

function SettingsGlyph() {
  // A small "tune" icon — three horizontal lines with sliders.
  // Replaces the bell because Loop is anti-notification by design.
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.5 4 H13.5 M2.5 8 H13.5 M2.5 12 H13.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="6" cy="4" r="1.4" fill="var(--paper-2)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10.5" cy="8" r="1.4" fill="var(--paper-2)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5" cy="12" r="1.4" fill="var(--paper-2)" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function EditorsBrief({ brief }: { brief: string }) {
  return (
    <div className="mx-5 mt-4 mb-5 rounded-2xl bg-ink p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] bg-gradient-to-br from-signal via-transparent to-ember pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="block w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-paper/65">
            The day, briefly
          </span>
        </div>
        <p className="font-display text-[19px] leading-snug text-paper text-balance">
          {brief}
        </p>
        <div className="mt-2.5 text-[11.5px] text-paper/50">
          Written by Loop editorial · 6:00 AM
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
        <div className="text-[14px] font-medium text-ink">
          {read === total
            ? "You're caught up."
            : `${total - read} stories left · ${minutesLeft} min`}
        </div>
        <div className="text-[12px] text-ink-3 mt-0.5">
          {read === 0
            ? "Today's Loop ends when you finish it."
            : `${read} of ${total} done · keep going.`}
        </div>
      </div>
    </div>
  )
}

function StoryCard({
  story,
  isRead,
  onOpen,
}: {
  story: Story
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
        <span className="tabular text-[12px] font-medium text-ink-3">
          {story.readMinutes} min
        </span>
      </div>

      <h2 className="font-display text-[22px] leading-[1.12] tracking-tight text-ink text-balance">
        {story.headline}
      </h2>

      <p className="text-[14px] leading-snug text-ink-2 mt-2 text-pretty">
        {story.standfirst}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <PerspectiveChip
          sources={story.sources}
          summary={story.perspectiveSummary}
        />
        <ReadMoreButton />
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
  // Category chips are content metadata — keep them muted. Signal violet is
  // reserved for Margin/active/AI/focal CTA. Ember stays for "live."
  const styles: Record<Story["categoryColor"], string> = {
    signal: "bg-ink/5 text-ink-2",
    ember: "bg-ember-soft text-ember",
    sage: "bg-sage-soft text-ink-2",
    ink: "bg-ink/8 text-ink",
  }
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
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

// Source-lean palette: consumed from CSS tokens so dark mode + central edits work.
const LEAN_COLOR: Record<string, string> = {
  left: "var(--lean-left)",
  "center-left": "var(--lean-center-left)",
  center: "var(--lean-center)",
  "center-right": "var(--lean-center-right)",
  right: "var(--lean-right)",
  independent: "var(--lean-independent)",
}

function PerspectiveChip({
  sources,
  summary,
}: {
  sources: Story["sources"]
  summary: string
}) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex -space-x-1">
        {sources.map((s, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full ring-2 ring-paper-2"
            style={{ background: LEAN_COLOR[s.lean] }}
          />
        ))}
      </div>
      <span className="text-[12px] text-ink-3">{summary}</span>
    </div>
  )
}

function ReadMoreButton() {
  // The CTA pill on each story card. Signal-violet wash is the one place this
  // color earns its keep on the Today feed.
  return (
    <div className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-signal-soft px-2.5 py-1 text-[12px] font-medium text-signal">
      <SparkleGlyph />
      Read more
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
    <div className="mt-8 px-5">
      <div className="mb-1">
        <h3 className="font-display text-[22px] tracking-tight text-ink">
          From your Loops
        </h3>
        <p className="text-[12.5px] text-ink-3 mt-1">
          Stories your friends are talking about right now — context attached.
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {activeStories.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 overflow-hidden"
          >
            {/* The story is the primary block; the friend take attaches below. */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-medium text-ink">
                  {s.category}
                </span>
                <span className="text-[12px] text-ink-3 tabular">
                  {s.readMinutes} min
                </span>
              </div>
              <h4 className="font-display text-[18px] leading-[1.18] tracking-tight text-ink text-balance">
                {s.headline}
              </h4>
            </div>
            <div className="border-t border-paper-3/70 bg-paper/40 px-4 py-3 flex items-start gap-2.5">
              <Avatar letter={s.loopActivity!.avatar} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-ink-3">
                  <span className="text-ink-2 font-medium">
                    {s.loopActivity!.person}
                  </span>{" "}
                  in{" "}
                  <span className="text-ink-2 font-medium">
                    {s.loopActivity!.loopName}
                  </span>{" "}
                  · {s.loopActivity!.timeAgo}
                </div>
                <p className="text-[13.5px] text-ink mt-1 text-pretty">
                  "{s.loopActivity!.snippet}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Avatar({ letter }: { letter: string }) {
  // Friend avatars are not Margin and not the active state — keep them in the ink family.
  return (
    <div className="w-9 h-9 rounded-full bg-ink/8 ring-1 ring-ink/12 flex items-center justify-center text-ink font-semibold text-[13px]">
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
      <p className="text-[13.5px] text-ink-2 mt-1 max-w-[260px] mx-auto text-pretty">
        Tomorrow's Loop drops at 6:00 AM. Until then, send a Margin to a Loop or
        go explore Discover.
      </p>
    </motion.div>
  )
}

// Half-opacity preview of the Caught-Up moment, shown while stories remain
// unread. The Loop has a horizon; this lets Olivia see it from the start.
function CaughtUpGhost({ remaining }: { remaining: number }) {
  return (
    <div
      className="mx-5 mt-7 p-5 rounded-3xl bg-sage-soft/55 text-center"
      aria-hidden="true"
    >
      <div className="mx-auto w-10 h-10 rounded-full bg-sage/60 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <path
            d="M5 11 L9.5 15.5 L17 7"
            stroke="white"
            strokeOpacity="0.85"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="font-display text-[18px] tracking-tight text-ink/55 mt-2.5">
        {remaining} {remaining === 1 ? "story" : "stories"} until you're caught up.
      </p>
    </div>
  )
}
