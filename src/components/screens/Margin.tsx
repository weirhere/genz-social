import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { type Story } from "@/data/content"
import { cn } from "@/lib/utils"

type Phase = "prompt" | "thinking" | "answer"

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

  const askPrompt = (i: number) => {
    setActiveQuestion(story.margin.prompts[i])
    setPhase("thinking")
    setTimeout(() => setPhase("answer"), 850)
  }

  // The input fakes a real send: any non-empty question runs the same
  // thinking → answer sequence the prompt list uses, so the demo feels alive.
  const askCustom = (q: string) => {
    if (!q.trim()) return
    setActiveQuestion(q.trim())
    setInputValue("")
    setPhase("thinking")
    setTimeout(() => setPhase("answer"), 850)
  }

  const reset = () => {
    setPhase("prompt")
    setActiveQuestion("")
  }

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
        drag="y"
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
      </motion.div>
    </>
  )
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
        <span className="text-[12px]">reading 5 sources, comparing framing</span>
      </div>
    </motion.div>
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

function Answer({
  story,
  promptText,
  onReset,
}: {
  story: Story
  promptText: string
  onReset: () => void
}) {
  const { paragraphs, askBack } = story.margin.sampleAnswer
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-2"
    >
      <UserBubble text={promptText} />

      <div className="mt-4 flex gap-2.5">
        <div className="flex-shrink-0">
          <div className="relative w-7 h-7 rounded-full bg-ink flex items-center justify-center text-paper">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-signal/50 to-ember/30 opacity-60" />
            <span className="relative">
              <Sparkle />
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className="text-[14px] leading-[1.55] text-ink text-pretty"
            >
              {p.text}{" "}
              <span className="inline-flex gap-0.5 align-baseline">
                {p.cites.map((cite) => (
                  <CitationChip
                    key={cite}
                    n={cite + 1}
                    source={story.sources[cite].name}
                  />
                ))}
              </span>
            </motion.p>
          ))}
        </div>
      </div>

      {/* The ask-back is the heart of the thinking-partner concept. Render it as
          its own contained moment, not a footnote — and delay slightly so it
          feels considered rather than batched. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-5 ml-9 rounded-2xl bg-signal-soft/80 ring-1 ring-signal/25 px-3.5 py-3"
      >
        <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-signal mb-1.5">
          Margin asked back
        </div>
        <p className="text-[14px] leading-snug text-ink text-pretty">
          {askBack}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-5 flex items-center gap-2"
      >
        <ActionPill primary>
          <SendGlyph />
          Send to a Loop
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
        verbatim. Where sources disagree, Margin says so.
      </div>
    </motion.div>
  )
}

function CitationChip({ n, source }: { n: number; source: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-md bg-signal-soft px-1.5 py-0.5 text-[10px] font-semibold text-signal tabular align-baseline mx-0.5">
      <span>{n}</span>
      <span className="text-signal/70 font-medium">{source}</span>
    </span>
  )
}

function ActionPill({
  children,
  primary,
}: {
  children: React.ReactNode
  primary?: boolean
}) {
  return (
    <button
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
