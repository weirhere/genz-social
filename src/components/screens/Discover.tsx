import { motion } from "motion/react"
import { topics, voices, blindspots, type Topic } from "@/data/content"
import { cn } from "@/lib/utils"

export function DiscoverScreen() {
  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <DiscoverHeader />
      <TopicConstellation />
      <Voices />
      <Blindspot />
      <NearbyLoops />
    </div>
  )
}

function DiscoverHeader() {
  return (
    <div className="px-5 pt-3 pb-3">
      <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-3 mb-2">
        Discover
      </div>
      <h1 className="font-display text-[36px] leading-[1.04] tracking-tight text-ink text-balance">
        Look beyond your Loop.
      </h1>
      <p className="text-[13.5px] text-ink-2 mt-2 max-w-[300px] text-pretty">
        Topics you don't usually read. People your friends vouch for. What the
        algorithm's hiding.
      </p>
    </div>
  )
}

function TopicConstellation() {
  return (
    <div className="mx-5 mt-5 relative h-[360px] rounded-3xl bg-ink overflow-hidden">
      {/* Subtle gradient + grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-signal/15 via-transparent to-ember/10" />
      <ConstellationLines />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-paper/55">
          Topic map · this week
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-paper/55">
          <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
          live now
        </div>
      </div>

      {topics.map((t, i) => (
        <TopicNode key={t.id} topic={t} index={i} />
      ))}

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div className="text-[10.5px] text-paper/55 leading-snug max-w-[200px]">
          Size = volume this week.
          <br />
          Pulse = developing.
        </div>
        <button className="rounded-full bg-paper/10 backdrop-blur ring-1 ring-paper/15 px-3 py-1.5 text-[11px] font-medium text-paper">
          Edit my map
        </button>
      </div>
    </div>
  )
}

function ConstellationLines() {
  // Faint connecting lines between adjacent topics — adds the "map" feel
  const pairs: [string, string][] = [
    ["ai", "your-industry"],
    ["ai", "science"],
    ["climate", "your-city"],
    ["markets", "your-industry"],
    ["culture", "sports"],
    ["climate", "science"],
  ]
  const byId = Object.fromEntries(topics.map((t) => [t.id, t]))
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {pairs.map(([a, b], i) => {
        const ta = byId[a]
        const tb = byId[b]
        if (!ta || !tb) return null
        return (
          <line
            key={i}
            x1={ta.position.x}
            y1={ta.position.y}
            x2={tb.position.x}
            y2={tb.position.y}
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="0.15"
            strokeDasharray="0.6 0.6"
          />
        )
      })}
    </svg>
  )
}

function TopicNode({ topic, index }: { topic: Topic; index: number }) {
  const sizeMap = {
    xl: { dot: 80, font: "text-[13px]", pad: "px-3 py-1.5" },
    lg: { dot: 64, font: "text-[12px]", pad: "px-2.5 py-1.5" },
    md: { dot: 52, font: "text-[11.5px]", pad: "px-2.5 py-1" },
    sm: { dot: 42, font: "text-[11px]", pad: "px-2 py-1" },
  }
  const s = sizeMap[topic.size]
  const hueColor: Record<Topic["hue"], { bg: string; ring: string; text: string }> = {
    signal: {
      bg: "bg-signal/22",
      ring: "ring-signal/45",
      text: "text-signal",
    },
    ember: {
      bg: "bg-ember/22",
      ring: "ring-ember/45",
      text: "text-ember",
    },
    sage: {
      bg: "bg-sage/22",
      ring: "ring-sage/45",
      text: "text-paper",
    },
    ink: {
      bg: "bg-paper/12",
      ring: "ring-paper/25",
      text: "text-paper",
    },
  }
  const c = hueColor[topic.hue]

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.05 * index,
        type: "spring",
        stiffness: 240,
        damping: 22,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${topic.position.x}%`, top: `${topic.position.y}%` }}
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center relative",
          c.bg,
          "ring-1",
          c.ring,
          "backdrop-blur-sm"
        )}
        style={{ width: s.dot, height: s.dot }}
      >
        {topic.live && (
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn("absolute inset-0 rounded-full ring-2", c.ring)}
          />
        )}
        <span
          className={cn(
            "font-medium leading-tight text-paper",
            s.font,
            "text-center px-1"
          )}
        >
          {topic.label}
        </span>
      </div>
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -bottom-5 flex items-center gap-1",
          s.font
        )}
      >
        <span className="rounded-full bg-paper/15 px-1.5 py-px text-[9.5px] tabular text-paper/80 font-medium">
          +{topic.newCount}
        </span>
      </div>
    </motion.button>
  )
}

function Voices() {
  return (
    <div className="mt-9">
      <div className="px-5 flex items-baseline justify-between mb-3">
        <h2 className="font-display text-[24px] tracking-tight text-ink">
          Voices we trust
        </h2>
        <button className="text-[11.5px] font-medium text-ink-3">See all</button>
      </div>
      <div className="px-5 -mr-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2 pr-5">
          {voices.map((v) => (
            <div
              key={v.id}
              className="flex-shrink-0 w-[244px] rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-3.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-signal/15 ring-1 ring-signal/25 flex items-center justify-center text-signal font-display text-[18px]">
                  {v.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-ink leading-tight truncate">
                    {v.name}
                  </div>
                  <div className="text-[11px] text-ink-3 truncate">
                    @{v.handle} · {v.followers}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-signal-soft text-signal text-[10px] font-medium px-2 py-0.5">
                  <CheckGlyph />
                  Vetted
                </span>
                <span className="text-[10.5px] text-ink-3">
                  {v.vouchedBy} friends follow
                </span>
              </div>
              <div className="mt-2.5 text-[12px] text-ink-2 leading-snug line-clamp-3 text-pretty">
                "{v.latestTake}"
              </div>
              <div className="text-[10.5px] text-ink-3 mt-1.5">{v.beat}</div>
              <button className="mt-3 w-full rounded-full bg-ink text-paper text-[12px] font-medium py-1.5">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CheckGlyph() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path
        d="M1.5 4.5 L3.8 6.8 L7.5 2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Blindspot() {
  const bs = blindspots[0]
  return (
    <div className="mx-5 mt-9 rounded-3xl bg-ember-soft p-5 relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-ember/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-ember">
            Your blindspot
          </span>
          <span className="text-[10.5px] text-ember/60">·</span>
          <span className="text-[10.5px] text-ember/70">honest receipts</span>
        </div>
        <h3 className="font-display text-[22px] leading-tight text-ink text-balance">
          {bs.headline}
        </h3>
        <p className="text-[13px] text-ink-2 mt-2">{bs.takeaway}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-paper p-3 ring-1 ring-ember/20">
            <div className="text-[10.5px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1.5">
              On the left
            </div>
            <p className="text-[12.5px] text-ink leading-snug text-pretty">
              {bs.leftFraming}
            </p>
          </div>
          <div className="rounded-xl bg-paper p-3 ring-1 ring-ember/20">
            <div className="text-[10.5px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1.5">
              On the right
            </div>
            <p className="text-[12.5px] text-ink leading-snug text-pretty">
              {bs.rightFraming}
            </p>
          </div>
        </div>

        <div className="mt-3 text-[10.5px] text-ink-3">
          Generated by Margin. Sourced. Tap to compare.
        </div>
      </div>
    </div>
  )
}

function NearbyLoops() {
  const loops = [
    { name: "Tech & policy nerds", members: 8, glyph: "◆" },
    { name: "SF housing watch", members: 11, glyph: "✦" },
    { name: "Macro thread", members: 6, glyph: "▲" },
  ]
  return (
    <div className="mt-9 px-5">
      <h2 className="font-display text-[24px] tracking-tight text-ink mb-1">
        Loops you might like
      </h2>
      <p className="text-[12.5px] text-ink-3 mb-3">
        Small group chats your friends are in. Request to join.
      </p>
      <div className="space-y-2">
        {loops.map((l) => (
          <div
            key={l.name}
            className="flex items-center gap-3 p-3 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70"
          >
            <div className="w-10 h-10 rounded-2xl bg-signal-soft flex items-center justify-center text-signal text-[18px] font-display">
              {l.glyph}
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-ink">{l.name}</div>
              <div className="text-[11px] text-ink-3">{l.members} people · 2 friends</div>
            </div>
            <button className="rounded-full bg-ink text-paper text-[11.5px] font-medium px-3 py-1.5">
              Ask to join
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
