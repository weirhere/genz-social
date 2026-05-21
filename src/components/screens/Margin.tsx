import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { type Story, type Source } from "@/data/content"
import { cn } from "@/lib/utils"

type Phase = "prompt" | "thinking" | "answer"
type FollowUpState = "idle" | "thinking" | "shown" | "dismissed"

export function MarginPanel({
  story,
  onClose,
}: {
  story: Story
  onClose: () => void
}) {
  const [phase, setPhase] = useState<Phase>("prompt")
  const [activeQuestion, setActiveQuestion] = useState<string>("")
  const [inputValue, setInputValue] = useState<string>("")
  const [followUp, setFollowUp] = useState<FollowUpState>("idle")
  const [sourceDetailIdx, setSourceDetailIdx] = useState<number | null>(null)
  const [shareOpen, setShareOpen] = useState<boolean>(false)

  const askPrompt = (i: number) => {
    setActiveQuestion(story.margin.prompts[i])
    setPhase("thinking")
    setFollowUp("idle")
    setTimeout(() => setPhase("answer"), 850)
  }

  // The input fakes a real send: any non-empty question runs the same
  // thinking → answer sequence the prompt list uses, so the demo feels alive.
  const askCustom = (q: string) => {
    if (!q.trim()) return
    setActiveQuestion(q.trim())
    setInputValue("")
    setPhase("thinking")
    setFollowUp("idle")
    setTimeout(() => setPhase("answer"), 850)
  }

  const acceptAskBack = () => {
    setFollowUp("thinking")
    setTimeout(() => setFollowUp("shown"), 700)
  }

  const declineAskBack = () => setFollowUp("dismissed")

  const reset = () => {
    setPhase("prompt")
    setActiveQuestion("")
    setFollowUp("idle")
  }

  // Whether dragging the panel down should dismiss it. Lock the gesture while
  // a secondary sheet (source detail or share) is open — otherwise you can
  // accidentally close everything mid-tap.
  const dragLocked = sourceDetailIdx !== null || shareOpen

  return (
    <>
      {/* Scrim */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-30 bg-ink/35 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        drag={dragLocked ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.06}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 500) onClose()
        }}
        className="absolute inset-x-0 bottom-0 z-40 bg-paper rounded-t-[28px] ring-1 ring-paper-3 shadow-[0_-20px_60px_-10px_rgba(11,11,20,0.25)] overflow-hidden flex flex-col"
        style={{ height: "78%" }}
      >
        <DragHandle />
        <MarginHeader onClose={onClose} />

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <AnimatePresence mode="wait">
            {phase === "prompt" && (
              <PromptList
                key="prompt"
                story={story}
                onPick={askPrompt}
              />
            )}
            {phase === "thinking" && (
              <Thinking key="thinking" prompt={activeQuestion} />
            )}
            {phase === "answer" && (
              <Answer
                key="answer"
                story={story}
                promptText={activeQuestion}
                followUp={followUp}
                onAcceptAskBack={acceptAskBack}
                onDeclineAskBack={declineAskBack}
                onCiteTap={setSourceDetailIdx}
                onShareOutside={() => setShareOpen(true)}
                onReset={reset}
              />
            )}
          </AnimatePresence>
        </div>

        <MarginInput
          phase={phase}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={askCustom}
        />

        <AnimatePresence>
          {sourceDetailIdx !== null && (
            <SourceDetail
              key={`source-${sourceDetailIdx}`}
              source={story.sources[sourceDetailIdx]}
              // Find a paragraph that cited this source, to show the actual
              // claim Margin attributed to it. Receipts as first-class UI.
              quote={findClaimForSource(story, sourceDetailIdx)}
              onClose={() => setSourceDetailIdx(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {shareOpen && (
            <ShareOutsideLoop
              story={story}
              question={activeQuestion}
              answer={story.margin.sampleAnswer.paragraphs
                .map((p) => p.text)
                .join(" ")}
              onClose={() => setShareOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// Looks across the primary answer and the follow-up for any paragraph that
// cited this source, and returns that paragraph's text. Falls back to the
// first paragraph if the source wasn't cited (shouldn't happen, but safe).
function findClaimForSource(story: Story, sourceIdx: number): string {
  const all = [
    ...story.margin.sampleAnswer.paragraphs,
    ...story.margin.sampleAnswer.followUp.paragraphs,
  ]
  const hit = all.find((p) => p.cites.includes(sourceIdx))
  return hit?.text ?? all[0]?.text ?? ""
}

function DragHandle() {
  return (
    <div className="pt-2.5 flex justify-center">
      <div className="w-9 h-1 rounded-full bg-paper-3" />
    </div>
  )
}

function MarginHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-5 pt-2 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-full bg-ink flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-signal/50 to-ember/30 opacity-60" />
          <span className="relative text-paper">
            <Sparkle />
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-[20px] tracking-tight text-ink leading-none">
              Margin
            </span>
            <span className="text-[10.5px] font-medium tracking-[0.14em] uppercase text-signal bg-signal-soft px-1.5 py-0.5 rounded">
              AI
            </span>
          </div>
          <div className="text-[11.5px] text-ink-3 mt-0.5">
            Your thinking partner. Always with sources.
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 3 L9 9 M9 3 L3 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

function Sparkle() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 0.5 L7 4.5 L11 5.5 L7 6.5 L6 11.5 L5 6.5 L1 5.5 L5 4.5 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PromptList({
  story,
  onPick,
}: {
  story: Story
  onPick: (i: number) => void
}) {
  const suggestedIndex = story.margin.sampleAnswer.promptIndex
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-[13.5px] text-ink-2 mt-1 mb-4 text-pretty">
        I just read this story too. What do you want to figure out?
      </p>
      <div className="space-y-2.5">
        {story.margin.prompts.map((p, i) => {
          const isSuggested = i === suggestedIndex
          return (
            <motion.button
              key={p}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(i)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left",
                "bg-paper-2 ring-1 ring-paper-3/70 hover:ring-signal/40 transition-colors",
                isSuggested && "bg-signal-soft ring-signal/30"
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[12.5px] font-semibold tabular",
                  isSuggested ? "bg-signal text-paper" : "bg-paper-3 text-ink-2"
                )}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-[14.5px] text-ink font-medium">
                {p}
              </span>
              {isSuggested && (
                // Labeling the highlight so it reads as "Margin's pick for this
                // story" rather than "the right answer." Preserves Socratic posture.
                <span className="text-[11px] font-medium text-signal tracking-[0.06em]">
                  Margin's pick
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
      <p className="text-[12px] text-ink-3 mt-5 leading-snug">
        Margin is tuned to this story specifically — prompts change per article.
        Receipts on every answer. Says "I don't know" out loud.
      </p>
    </motion.div>
  )
}

function Thinking({ prompt }: { prompt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className="pt-2"
    >
      <UserBubble text={prompt} />
      <ThinkingDots label="reading 5 sources, comparing framing" />
    </motion.div>
  )
}

function ThinkingDots({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1 text-ink-3">
      <div className="flex gap-1">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          className="w-1.5 h-1.5 rounded-full bg-signal"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-signal"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          className="w-1.5 h-1.5 rounded-full bg-signal"
        />
      </div>
      <span className="text-[12px]">{label}</span>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-ink text-paper px-3.5 py-2.5 text-[14px] leading-snug">
        {text}
      </div>
    </div>
  )
}

function MarginAvatar() {
  return (
    <div className="flex-shrink-0">
      <div className="relative w-7 h-7 rounded-full bg-ink flex items-center justify-center text-paper">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-signal/50 to-ember/30 opacity-60" />
        <span className="relative">
          <Sparkle />
        </span>
      </div>
    </div>
  )
}

function ParagraphTurn({
  paragraphs,
  story,
  onCiteTap,
  delay = 0,
}: {
  paragraphs: { text: string; cites: number[] }[]
  story: Story
  onCiteTap: (idx: number) => void
  delay?: number
}) {
  return (
    <div className="mt-4 flex gap-2.5">
      <MarginAvatar />
      <div className="flex-1 space-y-2.5">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.05 * i, duration: 0.3 }}
            className="text-[14px] leading-[1.55] text-ink text-pretty"
          >
            {p.text}{" "}
            <span className="inline-flex gap-0.5 align-baseline">
              {p.cites.map((cite) => (
                <CitationChip
                  key={cite}
                  n={cite + 1}
                  source={story.sources[cite].name}
                  onClick={() => onCiteTap(cite)}
                />
              ))}
            </span>
          </motion.p>
        ))}
      </div>
    </div>
  )
}

function Answer({
  story,
  promptText,
  followUp,
  onAcceptAskBack,
  onDeclineAskBack,
  onCiteTap,
  onShareOutside,
  onReset,
}: {
  story: Story
  promptText: string
  followUp: FollowUpState
  onAcceptAskBack: () => void
  onDeclineAskBack: () => void
  onCiteTap: (sourceIdx: number) => void
  onShareOutside: () => void
  onReset: () => void
}) {
  const { paragraphs, askBack, followUp: followUpData } = story.margin.sampleAnswer

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-2"
    >
      <UserBubble text={promptText} />

      <ParagraphTurn
        paragraphs={paragraphs}
        story={story}
        onCiteTap={onCiteTap}
      />

      {/* The ask-back is now a real conversational turn: Margin's avatar +
          bubble, followed by tappable chips. The Socratic loop is the wedge
          vs. Particle — it gets layout weight, not a footnote. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-5"
      >
        <div className="flex gap-2.5">
          <MarginAvatar />
          <div className="flex-1">
            <div className="rounded-2xl rounded-tl-md bg-signal-soft ring-1 ring-signal/25 px-3.5 py-3">
              <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-signal mb-1">
                Margin asked back
              </div>
              <p className="text-[14px] leading-snug text-ink text-pretty">
                {askBack}
              </p>
            </div>
            {followUp === "idle" && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={onAcceptAskBack}
                  className="inline-flex items-center gap-1 rounded-full bg-signal text-paper text-[12.5px] font-medium px-3 py-1.5"
                >
                  Yes, do it
                </button>
                <button
                  onClick={onDeclineAskBack}
                  className="inline-flex items-center gap-1 rounded-full bg-paper-2 text-ink-2 ring-1 ring-paper-3 text-[12.5px] font-medium px-3 py-1.5"
                >
                  Not now
                </button>
              </div>
            )}
            {followUp === "dismissed" && (
              <div className="mt-2 text-[11.5px] text-ink-3 italic">
                Dismissed. Ask anything in the box below to keep going.
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {(followUp === "thinking" || followUp === "shown") && (
          <motion.div
            key="follow-up"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <UserBubble text={followUpData.userReply} />
            {followUp === "thinking" && (
              <ThinkingDots label="pulling that up" />
            )}
            {followUp === "shown" && (
              <ParagraphTurn
                paragraphs={followUpData.paragraphs}
                story={story}
                onCiteTap={onCiteTap}
                delay={0.1}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-center gap-2 flex-wrap"
      >
        <ActionPill primary>
          <SendGlyph />
          Send to a Loop
        </ActionPill>
        <ActionPill onClick={onShareOutside}>
          <ShareOutGlyph />
          Share outside Loop
        </ActionPill>
        <ActionPill>
          <SaveGlyph />
          Save
        </ActionPill>
        <button
          onClick={onReset}
          className="ml-auto text-[12px] font-medium text-ink-3"
        >
          New question
        </button>
      </motion.div>

      <div className="mt-6 mb-2 text-[11.5px] text-ink-3 leading-snug border-t border-paper-3/70 pt-3">
        Margin trained on the {story.sources.length} sources linked. Quotes are
        verbatim. Where sources disagree, Margin says so.{" "}
        <span className="text-ink-2">Tap any citation chip to see the receipts.</span>
      </div>
    </motion.div>
  )
}

function CitationChip({
  n,
  source,
  onClick,
}: {
  n: number
  source: string
  onClick?: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className="inline-flex items-center gap-0.5 rounded-md bg-signal-soft px-1.5 py-0.5 text-[10px] font-semibold text-signal tabular align-baseline mx-0.5 hover:bg-signal/15 transition-colors"
    >
      <span>{n}</span>
      <span className="text-signal/70 font-medium">{source}</span>
    </motion.button>
  )
}

function ActionPill({
  children,
  primary,
  onClick,
}: {
  children: React.ReactNode
  primary?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium",
        primary
          ? "bg-signal text-paper"
          : "bg-paper-2 text-ink-2 ring-1 ring-paper-3"
      )}
    >
      {children}
    </button>
  )
}

function SendGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M1 5.5 L10 1 L7 10 L5 6 L1 5.5 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function ShareOutGlyph() {
  // Arrow leaving a box — semantic "out of the app." Distinct from SendGlyph
  // so users can read the two actions side-by-side.
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M5.5 1 v6.5 M3 3.5 L5.5 1 L8 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.5 v3 a1 1 0 0 0 1 1 h5 a1 1 0 0 0 1 -1 v-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SaveGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M2.5 1.5 h6 v8 l-3 -2 l-3 2 z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function MarginInput({
  phase,
  value,
  onChange,
  onSubmit,
}: {
  phase: Phase
  value: string
  onChange: (v: string) => void
  onSubmit: (v: string) => void
}) {
  const disabled = phase === "thinking"
  return (
    <div className="px-4 pb-4 pt-3 border-t border-paper-3/60 bg-paper">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(value)
        }}
        className={cn(
          "flex items-center gap-2 rounded-full bg-paper-2 ring-1 ring-paper-3 px-4 py-2.5 transition-opacity",
          disabled && "opacity-60"
        )}
      >
        <SparkleSmall />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={
            phase === "answer"
              ? "Follow up — Margin remembers"
              : "Ask anything about this story"
          }
          className="flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink-3 outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="w-7 h-7 rounded-full bg-ink flex items-center justify-center text-paper disabled:opacity-40"
          aria-label="Send"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 8 V2 M2.5 4.5 L5 2 L7.5 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

function SparkleSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-signal">
      <path
        d="M6.5 1 L7.5 5 L11.5 6 L7.5 7 L6.5 12 L5.5 7 L1.5 6 L5.5 5 Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Source-lean tokens — pulled from CSS so dark mode + single-source-of-truth
// work. Kept here for the SourceDetail sheet.
const LEAN_LABEL: Record<Source["lean"], string> = {
  left: "Left",
  "center-left": "Center-left",
  center: "Center",
  "center-right": "Center-right",
  right: "Right",
  independent: "Independent",
}
const LEAN_COLOR_VAR: Record<Source["lean"], string> = {
  left: "var(--lean-left)",
  "center-left": "var(--lean-center-left)",
  center: "var(--lean-center)",
  "center-right": "var(--lean-center-right)",
  right: "var(--lean-right)",
  independent: "var(--lean-independent)",
}

export function SourceDetail({
  source,
  quote,
  onClose,
}: {
  source: Source
  quote: string
  onClose: () => void
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-50 bg-ink/45 backdrop-blur-[2px]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="absolute inset-x-0 bottom-0 z-50 bg-paper rounded-t-[24px] ring-1 ring-paper-3 shadow-[0_-20px_60px_-10px_rgba(11,11,20,0.3)] flex flex-col"
      >
        <div className="pt-2.5 flex justify-center">
          <div className="w-9 h-1 rounded-full bg-paper-3" />
        </div>
        <div className="px-5 pt-3 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-signal">
                Receipt
              </div>
              <h3 className="font-display text-[24px] tracking-tight text-ink mt-1">
                {source.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 3 L9 9 M9 3 L3 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-paper-2 ring-1 ring-paper-3 px-2.5 py-1 text-[12px] text-ink-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: LEAN_COLOR_VAR[source.lean] }}
            />
            {LEAN_LABEL[source.lean]} lean
            <span className="text-ink-3">·</span>
            <span className="text-ink-3">per AllSides + Ad Fontes</span>
          </div>

          <div className="mt-4 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-4">
            <div className="text-[10.5px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-2">
              What Margin pulled
            </div>
            <p className="text-[14px] leading-snug text-ink text-pretty">
              "{quote}"
            </p>
          </div>

          <button
            className="mt-4 w-full rounded-full bg-ink text-paper py-3 text-[13.5px] font-medium"
            // Placeholder — in production this opens the source.
            onClick={onClose}
          >
            Open original at {source.name}
          </button>
          <p className="mt-3 text-[11.5px] text-ink-3 text-pretty leading-snug">
            Margin attributes by paragraph. If a paragraph cites multiple
            sources, each chip opens that source's receipt.
          </p>
        </div>
      </motion.div>
    </>
  )
}

export function ShareOutsideLoop({
  story,
  question,
  answer,
  onClose,
}: {
  story: Story
  question: string
  answer: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const truncated =
    answer.length > 200 ? answer.slice(0, 197).trimEnd() + "…" : answer

  const handleCopy = async () => {
    const text = `${question}\n\n${truncated}\n\n— via Loop · ${story.sources.length} sources attached`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard may not be available in some preview contexts; the visual
      // confirmation still serves the demo's purpose.
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-50 bg-ink/45 backdrop-blur-[2px]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="absolute inset-x-0 bottom-0 z-50 bg-paper rounded-t-[24px] ring-1 ring-paper-3 shadow-[0_-20px_60px_-10px_rgba(11,11,20,0.3)] flex flex-col"
      >
        <div className="pt-2.5 flex justify-center">
          <div className="w-9 h-1 rounded-full bg-paper-3" />
        </div>
        <div className="px-5 pt-3 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-signal">
                Send outside Loop
              </div>
              <h3 className="font-display text-[22px] tracking-tight text-ink mt-1 text-pretty">
                Drop it in your group chat.
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 3 L9 9 M9 3 L3 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* iMessage-shaped preview. Blue bubble = the recipient sees this
              shape in their thread; sources and Loop attribution travel with
              the share. */}
          <div className="mt-4 rounded-3xl bg-[#E9E9EE] p-4">
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-[20px] bg-[#0A84FF] text-white px-3.5 py-2.5 text-[13.5px] leading-snug shadow-sm text-pretty">
                <div className="font-semibold mb-1">{question}</div>
                <div className="opacity-95">{truncated}</div>
                <div className="mt-2 pt-2 border-t border-white/25 flex items-center gap-1.5 text-[11px] opacity-85">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="3.6" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <span>Loop · {story.sources.length} sources attached</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-right text-[11px] text-ink-3">
              Preview
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                "flex-1 rounded-full py-3 text-[13.5px] font-medium transition-colors",
                copied
                  ? "bg-sage text-ink"
                  : "bg-ink text-paper"
              )}
            >
              {copied ? "Copied to clipboard" : "Copy as text"}
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-paper-2 ring-1 ring-paper-3 text-ink-2 px-4 py-3 text-[13.5px] font-medium"
            >
              Cancel
            </button>
          </div>
          <p className="mt-3 text-[11.5px] text-ink-3 leading-snug text-pretty">
            Sources travel with the share. Margin's full reply lives at the
            Loop link in the footer — friends without the app see the same
            receipts you do.
          </p>
        </div>
      </motion.div>
    </>
  )
}
