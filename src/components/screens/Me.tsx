import { motion } from "motion/react"

export function MeScreen() {
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
