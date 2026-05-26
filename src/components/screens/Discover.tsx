import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  topics,
  voices,
  blindspots,
  today,
  type Topic,
  type Voice,
  type BlindspotFraming,
} from "@/data/content"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/AppState"
import { Sheet } from "@/components/ui/Sheet"
import type { Tab } from "@/components/shell/BottomNav"

// Lean labels for the Blindspot framing chips. Keep in sync with content.ts lean type.
const LEAN_LABEL: Record<BlindspotFraming["lean"], string> = {
  left: "Left-leaning critique",
  "center-left": "Center-left critique",
  center: "Centrist read",
  "center-right": "Center-right critique",
  right: "Right-leaning critique",
  independent: "Independent read",
}
const LEAN_COLOR_VAR: Record<BlindspotFraming["lean"], string> = {
  left: "var(--lean-left)",
  "center-left": "var(--lean-center-left)",
  center: "var(--lean-center)",
  "center-right": "var(--lean-center-right)",
  right: "var(--lean-right)",
  independent: "var(--lean-independent)",
}

export function DiscoverScreen({
  onOpenStory,
  onSwitchTab,
}: {
  onOpenStory: (id: string) => void
  onSwitchTab: (tab: Tab) => void
}) {
  const [allVoicesOpen, setAllVoicesOpen] = useState(false)
  const [editMapOpen, setEditMapOpen] = useState(false)
  const [topicSheet, setTopicSheet] = useState<Topic | null>(null)
  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <DiscoverHeader />
      <TopicConstellation
        onEditMap={() => setEditMapOpen(true)}
        onTopicTap={(t) => setTopicSheet(t)}
      />
      <Voices onSeeAll={() => setAllVoicesOpen(true)} />
      <Blindspot />
      <NearbyLoops />

      <AnimatePresence>
        {allVoicesOpen && (
          <AllVoicesSheet onClose={() => setAllVoicesOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editMapOpen && (
          <EditMapSheet
            onClose={() => setEditMapOpen(false)}
            onOpenMe={() => {
              setEditMapOpen(false)
              onSwitchTab("me")
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {topicSheet && (
          <TopicStoriesSheet
            topic={topicSheet}
            onClose={() => setTopicSheet(null)}
            onOpenStory={(id) => {
              setTopicSheet(null)
              onOpenStory(id)
            }}
          />
        )}
      </AnimatePresence>
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
      <p className="text-[14px] text-ink-2 mt-2 max-w-[300px] text-pretty">
        Topics you don't usually read. People your friends vouch for. What the
        algorithm's hiding.
      </p>
    </div>
  )
}

function TopicConstellation({
  onEditMap,
  onTopicTap,
}: {
  onEditMap: () => void
  onTopicTap: (t: Topic) => void
}) {
  return (
    <div className="mx-5 mt-5 relative h-[360px] rounded-3xl bg-ink overflow-hidden">
      {/* Subtle gradient + grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-signal/15 via-transparent to-ember/10" />
      <ConstellationLines />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="text-[11px] font-medium tracking-[0.16em] uppercase text-paper/65">
          Topic map · this week
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-paper/65">
          <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
          live now
        </div>
      </div>

      {topics.map((t, i) => (
        <TopicNode key={t.id} topic={t} index={i} onTap={() => onTopicTap(t)} />
      ))}

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div className="text-[11px] text-paper/65 leading-snug max-w-[200px]">
          Size = stories this week.
          <br />
          Pulse = developing right now.
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onEditMap}
          className="rounded-full bg-paper/10 backdrop-blur ring-1 ring-paper/15 px-3 py-1.5 text-[12px] font-medium text-paper hover:bg-paper/15 transition-colors"
        >
          Edit my map
        </motion.button>
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

function TopicNode({
  topic,
  index,
  onTap,
}: {
  topic: Topic
  index: number
  onTap: () => void
}) {
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
      onClick={onTap}
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
        <span
          className="rounded-full bg-paper/15 px-1.5 py-px text-[10.5px] tabular text-paper/85 font-medium"
          title={`${topic.newCount} new stories this week`}
        >
          +{topic.newCount} new
        </span>
      </div>
    </motion.button>
  )
}

function Voices({ onSeeAll }: { onSeeAll: () => void }) {
  return (
    <div className="mt-9">
      <div className="px-5 flex items-baseline justify-between mb-3">
        <h2 className="font-display text-[24px] tracking-tight text-ink">
          Voices we trust
        </h2>
        <button
          onClick={onSeeAll}
          className="text-[12px] font-medium text-ink-3 hover:text-ink transition-colors"
        >
          See all
        </button>
      </div>
      <div className="px-5 -mr-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2 pr-5">
          {voices.map((v) => (
            <VoiceCard key={v.id} voice={v} />
          ))}
        </div>
      </div>
    </div>
  )
}

function VoiceCard({ voice }: { voice: Voice }) {
  const { followedVoiceIds, toggleFollow, toast } = useAppState()
  const following = followedVoiceIds.has(voice.id)
  return (
    <div className="flex-shrink-0 w-[244px] rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-3.5">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-ink/8 ring-1 ring-ink/12 flex items-center justify-center text-ink font-display text-[18px]">
          {voice.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-ink leading-tight truncate">
            {voice.name}
          </div>
          <div className="text-[12px] text-ink-3 truncate">
            @{voice.handle} · {voice.followers}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft text-ink text-[11px] font-medium px-2 py-0.5">
          <span className="text-sage">
            <CheckGlyph />
          </span>
          Vetted
        </span>
        <span className="text-[11.5px] text-ink-3">
          {voice.vouchedBy} friends follow
        </span>
      </div>
      <div className="mt-2.5 text-[12.5px] text-ink-2 leading-snug line-clamp-3 text-pretty">
        "{voice.latestTake}"
      </div>
      <div className="text-[11.5px] text-ink-3 mt-1.5">{voice.beat}</div>
      <FollowButton
        following={following}
        onClick={() => {
          toggleFollow(voice.id)
          toast(following ? `Unfollowed ${voice.name}` : `Following ${voice.name}`)
        }}
      />
    </div>
  )
}

function FollowButton({
  following,
  onClick,
}: {
  following: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "mt-3 w-full rounded-full text-[13px] font-medium py-2 transition-colors inline-flex items-center justify-center gap-1.5",
        following
          ? "bg-paper ring-1 ring-paper-3 text-ink-2"
          : "bg-ink text-paper"
      )}
    >
      {following && (
        <span className="text-sage">
          <CheckGlyph />
        </span>
      )}
      {following ? "Following" : "Follow"}
    </motion.button>
  )
}

function AllVoicesSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet
      title="Voices we trust"
      subtitle="Vetted by Loop editorial. Tap to follow."
      onClose={onClose}
      maxHeightPct={82}
    >
      <div className="px-3 pb-4 pt-1">
        <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
          {voices.map((v) => (
            <VoiceRow key={v.id} voice={v} />
          ))}
        </div>
      </div>
    </Sheet>
  )
}

function VoiceRow({ voice }: { voice: Voice }) {
  const { followedVoiceIds, toggleFollow, toast } = useAppState()
  const following = followedVoiceIds.has(voice.id)
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-11 h-11 rounded-full bg-ink/8 ring-1 ring-ink/12 flex items-center justify-center text-ink font-display text-[19px] flex-shrink-0">
        {voice.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-semibold text-ink truncate">
          {voice.name}
        </div>
        <div className="text-[12px] text-ink-3 truncate">
          @{voice.handle} · {voice.beat}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          toggleFollow(voice.id)
          toast(following ? `Unfollowed ${voice.name}` : `Following ${voice.name}`)
        }}
        className={cn(
          "rounded-full px-3.5 py-1.5 text-[12.5px] font-medium inline-flex items-center gap-1.5 flex-shrink-0",
          following
            ? "bg-paper ring-1 ring-paper-3 text-ink-2"
            : "bg-ink text-paper"
        )}
      >
        {following && (
          <span className="text-sage">
            <CheckGlyph />
          </span>
        )}
        {following ? "Following" : "Follow"}
      </motion.button>
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
          <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-ember">
            Your blindspot
          </span>
          <span className="text-[11px] text-ember/60">·</span>
          <span className="text-[11px] text-ember/75">honest receipts</span>
        </div>
        <h3 className="font-display text-[22px] leading-tight text-ink text-balance">
          {bs.headline}
        </h3>
        <p className="text-[13.5px] text-ink-2 mt-2">{bs.takeaway}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {bs.framings.map((f) => (
            <FramingCard key={f.name} framing={f} />
          ))}
        </div>

        <div className="mt-3 text-[11.5px] text-ink-3">
          Generated by Margin. Sourced. Tap to compare.
        </div>
      </div>
    </div>
  )
}

function FramingCard({ framing }: { framing: BlindspotFraming }) {
  return (
    <div className="rounded-xl bg-paper p-3 ring-1 ring-ember/20">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: LEAN_COLOR_VAR[framing.lean] }}
        />
        <span
          className="text-[11px] font-medium tracking-[0.06em] text-ink"
          title={LEAN_LABEL[framing.lean]}
        >
          {framing.name}
        </span>
      </div>
      <p className="text-[12.5px] text-ink-2 leading-snug text-pretty">
        {framing.text}
      </p>
    </div>
  )
}

const NEARBY_LOOPS: { id: string; name: string; members: number; glyph: string }[] = [
  { id: "nearby-techpolicy", name: "Tech & policy nerds", members: 8, glyph: "◆" },
  { id: "nearby-housing", name: "SF housing watch", members: 11, glyph: "✦" },
  { id: "nearby-macro", name: "Macro thread", members: 6, glyph: "▲" },
]

function NearbyLoops() {
  const { requestedLoopIds, requestJoin, toast } = useAppState()
  return (
    <div className="mt-9 px-5">
      <h2 className="font-display text-[24px] tracking-tight text-ink mb-1">
        Loops you might like
      </h2>
      <p className="text-[13px] text-ink-3 mb-3">
        Small group chats your friends are in. Request to join.
      </p>
      <div className="space-y-2">
        {NEARBY_LOOPS.map((l) => {
          const requested = requestedLoopIds.has(l.id)
          return (
            <div
              key={l.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70"
            >
              <div className="w-10 h-10 rounded-2xl bg-ink/8 ring-1 ring-ink/10 flex items-center justify-center text-ink text-[18px] font-display">
                {l.glyph}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-ink">{l.name}</div>
                <div className="text-[12px] text-ink-3">
                  {l.members} people · 2 friends
                </div>
              </div>
              <motion.button
                whileTap={{ scale: requested ? 1 : 0.96 }}
                onClick={() => {
                  if (requested) return
                  requestJoin(l.id)
                  toast(`Asked to join ${l.name}`)
                }}
                disabled={requested}
                className={cn(
                  "rounded-full text-[12px] font-medium px-3 py-1.5 inline-flex items-center gap-1.5 transition-colors",
                  requested
                    ? "bg-paper ring-1 ring-paper-3 text-ink-3"
                    : "bg-ink text-paper"
                )}
              >
                {requested && (
                  <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                )}
                {requested ? "Requested" : "Ask to join"}
              </motion.button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EditMapSheet({
  onClose,
  onOpenMe,
}: {
  onClose: () => void
  onOpenMe: () => void
}) {
  const { interests, topicMutes, toggleInterest, toggleTopicMute } =
    useAppState()
  return (
    <Sheet
      title="Edit my map"
      subtitle="Tap once to follow. Tap again to mute. Tomorrow's drop adjusts."
      onClose={onClose}
      maxHeightPct={75}
    >
      <div className="px-5 pb-5 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => {
            const isOn = interests.has(t.id)
            const isMuted = topicMutes.has(t.id)
            const state: "on" | "off" | "muted" = isOn
              ? "on"
              : isMuted
                ? "muted"
                : "off"
            return (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (isOn) toggleTopicMute(t.id)
                  else if (isMuted) toggleTopicMute(t.id)
                  else toggleInterest(t.id)
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  state === "on" && "bg-ink text-paper ring-1 ring-ink",
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
                {t.label}
              </motion.button>
            )
          })}
        </div>
        <button
          onClick={onOpenMe}
          className="mt-4 text-[12.5px] font-medium text-ink underline underline-offset-4"
        >
          Open full settings on Me →
        </button>
      </div>
    </Sheet>
  )
}

function TopicStoriesSheet({
  topic,
  onClose,
  onOpenStory,
}: {
  topic: Topic
  onClose: () => void
  onOpenStory: (id: string) => void
}) {
  const matches = today.filter((s) =>
    s.category.toLowerCase().includes(topic.label.split(" ")[0]!.toLowerCase())
  )
  const fallback = matches.length > 0 ? matches : today.slice(0, 3)
  return (
    <Sheet
      title={topic.label}
      subtitle={`${topic.newCount} stories this week${
        topic.live ? " · developing now" : ""
      }`}
      onClose={onClose}
      maxHeightPct={72}
    >
      <div className="px-3 pb-4 pt-1">
        <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
          {fallback.map((s) => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => onOpenStory(s.id)}
              className="w-full text-left px-4 py-3.5 hover:bg-paper-3/40"
            >
              <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1">
                {s.category} · {s.readMinutes} min
              </div>
              <div className="font-display text-[16px] leading-tight text-ink text-balance">
                {s.headline}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </Sheet>
  )
}
