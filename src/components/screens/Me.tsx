import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

// Anchored on the JTBD: Aisha (and any persona) needs Loop to know what she
// cares about. Pre-populated with the personas' implied interests so the
// screen reads as already-calibrated, not as homework.
const INTEREST_OPTIONS = [
  { id: "ai", label: "AI & policy" },
  { id: "your-city", label: "Your city · Bay Area" },
  { id: "climate", label: "Climate" },
  { id: "markets", label: "Markets" },
  { id: "your-industry", label: "Your industry" },
  { id: "culture", label: "Culture" },
  { id: "science", label: "Science" },
  { id: "sports", label: "Sports" },
  { id: "media-criticism", label: "Media criticism" },
  { id: "housing", label: "Housing" },
]
const DEFAULT_INTERESTS = ["ai", "your-city", "climate"]
const DEFAULT_MUTES = ["sports"]

export function MeScreen() {
  const [interests, setInterests] = useState<Set<string>>(
    () => new Set(DEFAULT_INTERESTS)
  )
  const [mutes, setMutes] = useState<Set<string>>(() => new Set(DEFAULT_MUTES))

  const toggleInterest = (id: string) => {
    setInterests((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      // Adding to interests removes from mutes — mutually exclusive.
      setMutes((m) => {
        const nm = new Set(m)
        nm.delete(id)
        return nm
      })
      return next
    })
  }

  const toggleMute = (id: string) => {
    setMutes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      setInterests((i) => {
        const ni = new Set(i)
        ni.delete(id)
        return ni
      })
      return next
    })
  }

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <div className="px-5 pt-3 pb-2">
        <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-3 mb-1">
          Me
        </div>
        <h1 className="font-display text-[36px] leading-[1.04] tracking-tight text-ink">
          You, in receipts.
        </h1>
      </div>

      <UserCard />

      <InterestsCard
        interests={interests}
        mutes={mutes}
        onToggleInterest={toggleInterest}
        onToggleMute={toggleMute}
      />

      <Section title="Calibrate my Loop">
        <CalibrationRow
          label="Story count per day"
          value="7"
          options={["5", "7", "10", "12"]}
        />
        <CalibrationRow
          label="Drop time"
          value="6:00 AM"
        />
        <CalibrationRow
          label="Tone"
          value="Conversational"
          options={["Conversational", "Newsroom", "Lean & dry"]}
        />
      </Section>

      <HowMarginWorks />

      <Section title="Receipts on you">
        <ReceiptRow
          label="Stories read this month"
          value="142"
        />
        <ReceiptRow
          label="Source lean balance"
          value="62% center · 21% left · 17% right"
          chart
        />
        <ReceiptRow
          label="Most-read topic"
          value="AI & policy"
        />
        <ReceiptRow
          label="Margin questions asked"
          value="38"
        />
      </Section>

      <BuiltByPeople />

      <p className="px-5 mt-5 mb-2 text-[12px] text-ink-3 leading-snug">
        <span className="underline underline-offset-2">About</span> ·{" "}
        <span className="underline underline-offset-2">Privacy</span> ·{" "}
        <span className="underline underline-offset-2">How Margin works</span>
      </p>
    </div>
  )
}

function UserCard() {
  return (
    <div className="mx-5 mt-4 mb-6 rounded-3xl bg-ink p-5 relative overflow-hidden">
      {/* Warm cream glow instead of violet — violet stays reserved for Margin/AI. */}
      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-paper/12 blur-3xl" />
      <div className="relative flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-paper text-ink flex items-center justify-center font-display text-[28px]">
          O
        </div>
        <div>
          <div className="font-display text-[24px] text-paper leading-none">
            Olivia
          </div>
          {/* No streak. Loop is the anti-engagement-extraction product. */}
          <div className="text-[12px] text-paper/65 mt-1">
            Member since March · Loops finished this month: 12
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex gap-2">
        <Stat label="Loops" value="4" />
        <Stat label="Voices" value="11" />
        <Stat label="Saved" value="23" />
      </div>
    </div>
  )
}

function InterestsCard({
  interests,
  mutes,
  onToggleInterest,
  onToggleMute,
}: {
  interests: Set<string>
  mutes: Set<string>
  onToggleInterest: (id: string) => void
  onToggleMute: (id: string) => void
}) {
  // Active interests render first so the user sees their picks loaded.
  const ordered = [
    ...INTEREST_OPTIONS.filter((o) => interests.has(o.id)),
    ...INTEREST_OPTIONS.filter((o) => !interests.has(o.id) && !mutes.has(o.id)),
    ...INTEREST_OPTIONS.filter((o) => mutes.has(o.id)),
  ]
  return (
    <div className="mt-6 mx-5 rounded-3xl bg-paper-2 ring-1 ring-paper-3/70 p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-[22px] tracking-tight text-ink">
          What you care about
        </h2>
        <span className="text-[11px] text-ink-3 tabular">
          {interests.size} on · {mutes.size} muted
        </span>
      </div>
      <p className="text-[12.5px] text-ink-3 leading-snug mb-3 text-pretty">
        Tap once to follow. Tap again to mute. Loop calibrates tomorrow's drop
        around what's on.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ordered.map((opt) => {
          const isOn = interests.has(opt.id)
          const isMuted = mutes.has(opt.id)
          return (
            <InterestChip
              key={opt.id}
              label={opt.label}
              state={isOn ? "on" : isMuted ? "muted" : "off"}
              onClick={() => {
                if (isOn) onToggleMute(opt.id)
                else onToggleInterest(opt.id)
              }}
              onSecondary={() => {
                // Long-press equivalent — tap a muted chip to clear it back
                // to neutral. The pattern keeps mute reversible without a
                // separate UI for "actually I changed my mind."
                if (isMuted) onToggleMute(opt.id)
              }}
            />
          )
        })}
      </div>
      <p className="mt-3 text-[11.5px] text-ink-3 leading-snug">
        Muted topics still appear in Discover blindspots — Loop won't hide them
        from you, just won't push them into Today.
      </p>
    </div>
  )
}

function InterestChip({
  label,
  state,
  onClick,
  onSecondary,
}: {
  label: string
  state: "on" | "off" | "muted"
  onClick: () => void
  onSecondary: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={state === "muted" ? onSecondary : onClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
        state === "on" &&
          "bg-ink text-paper ring-1 ring-ink",
        state === "off" &&
          "bg-paper ring-1 ring-paper-3 text-ink-2 hover:ring-ink/30",
        state === "muted" &&
          "bg-paper ring-1 ring-paper-3 text-ink-3 line-through decoration-ember/70"
      )}
    >
      {state === "on" && (
        <span className="w-1.5 h-1.5 rounded-full bg-sage" />
      )}
      {state === "muted" && (
        <span className="w-1.5 h-1.5 rounded-full bg-ember/80" />
      )}
      {label}
    </motion.button>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-paper/10 backdrop-blur-sm px-3 py-2 ring-1 ring-paper/15">
      <div className="font-display text-[22px] text-paper leading-none tabular">
        {value}
      </div>
      <div className="text-[11.5px] text-paper/65 mt-1">{label}</div>
    </div>
  )
}

// The single most-loaded trust gesture in the brief: humans-in-the-loop.
// Promoted from 11px footer text to its own card with editor initials.
function BuiltByPeople() {
  const editors = [
    { initials: "RM", city: "NY" },
    { initials: "AL", city: "NY" },
    { initials: "JT", city: "CDMX" },
    { initials: "SP", city: "NY" },
  ]
  return (
    <div className="mt-7 mx-5 rounded-3xl bg-paper-2 ring-1 ring-paper-3/70 p-5">
      <div className="text-[11px] font-medium tracking-[0.16em] uppercase text-ink-3 mb-2">
        Built by people
      </div>
      <h3 className="font-display text-[22px] leading-tight text-ink text-balance">
        Eight humans pick what makes the Loop.
      </h3>
      <p className="text-[13px] text-ink-2 leading-snug mt-2 text-pretty">
        An editorial team of eight in New York and Mexico City decides the 7
        stories every day. Margin reads alongside them — never instead of them.
      </p>
      <div className="mt-4 flex items-center gap-1.5">
        {editors.map((e) => (
          <div
            key={e.initials}
            className="w-9 h-9 rounded-full bg-paper ring-1 ring-paper-3 flex items-center justify-center text-[11.5px] font-semibold text-ink"
            title={`${e.initials} · ${e.city}`}
          >
            {e.initials}
          </div>
        ))}
        <span className="ml-1.5 text-[12px] text-ink-3 tabular">+4</span>
      </div>
      <button className="mt-4 text-[12.5px] font-medium text-ink underline underline-offset-4">
        Meet the team →
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 px-5">
      <h2 className="font-display text-[22px] tracking-tight text-ink mb-2.5">
        {title}
      </h2>
      <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70">
        {children}
      </div>
    </div>
  )
}

function CalibrationRow({
  label,
  value,
  options,
}: {
  label: string
  value: string
  options?: string[]
}) {
  return (
    <div className="px-4 py-3.5 flex items-center justify-between">
      <div>
        <div className="text-[14px] font-medium text-ink">{label}</div>
        {options && (
          <div className="text-[11.5px] text-ink-3 mt-0.5">
            {options.length} options
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-ink-2">
        {value}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-ink-3">
          <path
            d="M4.5 3 L7.5 6 L4.5 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

function ReceiptRow({
  label,
  value,
  chart,
}: {
  label: string
  value: string
  chart?: boolean
}) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-ink-2">{label}</div>
        <div className="text-[13.5px] font-semibold text-ink tabular">
          {chart ? "" : value}
        </div>
      </div>
      {chart && (
        <>
          <div className="mt-2 flex h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "62%" }}
              transition={{ duration: 0.7 }}
              className="bg-sage"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "21%" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-ink/35"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "17%" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-ember"
            />
          </div>
          <div className="mt-2 text-[12px] text-ink-3">{value}</div>
        </>
      )}
    </div>
  )
}

function HowMarginWorks() {
  // Margin's own surface — violet earns its keep here.
  return (
    <div className="mt-6 mx-5 rounded-3xl bg-signal-soft p-5 relative overflow-hidden">
      <div className="text-[11px] font-medium tracking-[0.16em] uppercase text-signal mb-2">
        How Margin works
      </div>
      <h3 className="font-display text-[22px] leading-tight text-ink text-balance">
        Built to think with you, not for you.
      </h3>
      <div className="mt-3 space-y-2">
        <Promise text="Sources are always linked. Every claim has a citation chip." />
        <Promise text="Margin admits ignorance. If sources disagree, you'll see it." />
        <Promise text="Margin is text-first. No AI anchors. No fake quotes." />
        <Promise text="Trained on the sources Loop has licensed. Scope published below." />
      </div>
      <button className="mt-3 text-[13px] font-medium text-signal underline underline-offset-4">
        Read Margin's full receipts →
      </button>
    </div>
  )
}

function Promise({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 w-3 h-3 rounded-full bg-signal/30 flex-shrink-0 flex items-center justify-center">
        <span className="w-1 h-1 rounded-full bg-signal" />
      </span>
      <span className="text-[13px] text-ink leading-snug text-pretty">{text}</span>
    </div>
  )
}
