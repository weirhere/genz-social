import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { today, type Loop, type LoopMessage } from "@/data/content"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/AppState"
import { Sheet } from "@/components/ui/Sheet"
import { ActionMenu, type ActionItem } from "@/components/ui/ActionMenu"

export function LoopsScreen() {
  const { loops } = useAppState()
  const [openLoopId, setOpenLoopId] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)
  const openLoop = openLoopId ? loops.find((l) => l.id === openLoopId) : null

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {openLoop ? (
          <motion.div
            key={`chat-${openLoop.id}`}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col h-full"
          >
            <LoopChat loop={openLoop} onBack={() => setOpenLoopId(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto pb-28"
          >
            <LoopsList
              onOpen={(id) => setOpenLoopId(id)}
              onNew={() => setNewOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newOpen && (
          <NewLoopSheet
            onClose={() => setNewOpen(false)}
            onCreated={(id) => {
              setNewOpen(false)
              setOpenLoopId(id)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function LoopsList({
  onOpen,
  onNew,
}: {
  onOpen: (id: string) => void
  onNew: () => void
}) {
  const { loops, pinnedLoopIds, mutedLoopIds } = useAppState()
  const sortedLoops = useMemo(() => {
    return [...loops].sort((a, b) => {
      const ap = pinnedLoopIds.has(a.id) ? 1 : 0
      const bp = pinnedLoopIds.has(b.id) ? 1 : 0
      return bp - ap
    })
  }, [loops, pinnedLoopIds])

  return (
    <>
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-3 mb-1">
            Loops
          </div>
          <h1 className="font-display text-[36px] leading-[1.04] tracking-tight text-ink">
            Small group, big takes.
          </h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onNew}
          className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center"
          aria-label="New Loop"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2 v10 M2 7 h10"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>
      </div>

      <p className="px-5 text-[13px] text-ink-2 mb-5 max-w-[300px] text-pretty">
        Up to 12 friends per Loop. Stories arrive with context. No public feed.
      </p>

      <div className="px-5 space-y-2.5">
        {sortedLoops.map((loop, i) => {
          const pinned = pinnedLoopIds.has(loop.id)
          const muted = mutedLoopIds.has(loop.id)
          return (
            <motion.button
              key={loop.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.35 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onOpen(loop.id)}
              className="w-full text-left flex items-center gap-3 p-3.5 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70"
            >
              <LoopGlyph loop={loop} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[15px] font-semibold text-ink truncate">
                      {loop.name}
                    </span>
                    {pinned && (
                      <span className="text-ink-3 flex-shrink-0" title="Pinned">
                        <PinGlyph small />
                      </span>
                    )}
                    {muted && (
                      <span
                        className="text-ink-3 flex-shrink-0"
                        title="Muted"
                      >
                        <MuteGlyph />
                      </span>
                    )}
                  </span>
                  <span className="text-[11.5px] text-ink-3 tabular flex-shrink-0 ml-2">
                    {loop.lastMessage.timeAgo}
                  </span>
                </div>
                <div className="text-[13px] text-ink-2 truncate mt-0.5">
                  <span className="text-ink-3">
                    {loop.lastMessage.person}:{" "}
                  </span>
                  {loop.lastMessage.snippet}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <MemberStack members={loop.members.slice(0, 4)} />
                  <span className="text-[11.5px] text-ink-3">
                    {loop.members.length} members
                  </span>
                  {loop.unread > 0 && (
                    <span
                      className={cn(
                        "ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[11px] font-semibold px-1.5 tabular",
                        muted
                          ? "bg-paper-3 text-ink-3"
                          : "bg-ink text-paper"
                      )}
                    >
                      {loop.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mx-5 mt-6 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-4">
        <div className="text-[11px] font-medium tracking-[0.16em] uppercase text-ink-3 mb-1.5">
          Why Loops are small
        </div>
        <p className="text-[13px] text-ink-2 leading-snug text-pretty">
          Capped at 12 people so the dynamic stays group-chat, not group-feed. No
          likes, no view counts. Stories travel with their sources attached.
        </p>
      </div>
    </>
  )
}

function LoopGlyph({ loop }: { loop: Loop }) {
  // Loops are brand objects, not Margin — keep them in the ink family so violet
  // continues to mean "AI" / "active state" / "focal CTA" elsewhere.
  return (
    <div className="w-12 h-12 rounded-2xl bg-ink/8 ring-1 ring-ink/10 flex items-center justify-center text-ink font-display text-[22px] leading-none">
      {loop.glyph}
    </div>
  )
}

function MemberStack({ members }: { members: { name: string; avatar: string }[] }) {
  return (
    <div className="flex -space-x-1.5">
      {members.map((m, i) => (
        <span
          key={i}
          className="w-5 h-5 rounded-full bg-ink/8 ring-2 ring-paper-2 text-ink text-[9.5px] font-semibold flex items-center justify-center"
        >
          {m.avatar}
        </span>
      ))}
    </div>
  )
}

function LoopChat({ loop, onBack }: { loop: Loop; onBack: () => void }) {
  const {
    loopChat,
    pinnedLoopIds,
    mutedLoopIds,
    togglePin,
    toggleMute,
    leaveLoop,
    toast,
  } = useAppState()
  const messages = loopChat[loop.id] ?? []
  const pinnedStory = loop.pinnedStoryId
    ? today.find((s) => s.id === loop.pinnedStoryId)
    : null

  const [overflowOpen, setOverflowOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isPinned = pinnedLoopIds.has(loop.id)
  const isMuted = mutedLoopIds.has(loop.id)

  const overflowItems: ActionItem[] = [
    {
      label: isPinned ? "Unpin from top" : "Pin to top",
      icon: <PinGlyph />,
      onSelect: () => {
        togglePin(loop.id)
        toast(isPinned ? "Unpinned" : "Pinned to top")
      },
    },
    {
      label: isMuted ? "Unmute notifications" : "Mute notifications",
      icon: <MuteGlyph />,
      onSelect: () => {
        toggleMute(loop.id)
        toast(isMuted ? "Unmuted" : "Muted")
      },
    },
    {
      label: "View members",
      icon: <PeopleGlyph />,
      hint: `${loop.members.length} in this Loop`,
      onSelect: () => setMembersOpen(true),
    },
    {
      label: "Loop settings",
      icon: <GearGlyph />,
      onSelect: () => setSettingsOpen(true),
    },
    {
      label: "Leave Loop",
      icon: <LeaveGlyph />,
      destructive: true,
      onSelect: () => {
        leaveLoop(loop.id)
        toast(`Left ${loop.name}`)
        onBack()
      },
    },
  ]

  return (
    <>
      <div className="px-4 pt-2 pb-3 flex items-center gap-3 border-b border-paper-3/60">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2.5 L4 7 L9 11.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-ink text-[14px] font-display">
              {loop.glyph}
            </span>
            <span className="font-display text-[18px] tracking-tight text-ink truncate">
              {loop.name}
            </span>
            {isPinned && (
              <span className="text-ink-3" title="Pinned">
                <PinGlyph small />
              </span>
            )}
            {isMuted && (
              <span className="text-ink-3" title="Muted">
                <MuteGlyph />
              </span>
            )}
          </div>
          <div className="text-[11.5px] text-ink-3">
            {loop.members.length} members ·{" "}
            {loop.members
              .filter((m) => m.name !== "You")
              .map((m) => m.name)
              .slice(0, 3)
              .join(", ")}
            {loop.members.length > 4 ? ` +${loop.members.length - 4}` : ""}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setOverflowOpen(true)}
          className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2"
          aria-label="More"
        >
          <svg width="14" height="3" viewBox="0 0 14 3" fill="none">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
            <circle cx="7" cy="1.5" r="1.5" fill="currentColor" />
            <circle cx="12.5" cy="1.5" r="1.5" fill="currentColor" />
          </svg>
        </motion.button>
      </div>

      {pinnedStory && (
        <div className="mx-4 mt-3 mb-1 p-3 rounded-2xl bg-paper-2 ring-1 ring-paper-3 flex items-start gap-2.5">
          <div className="mt-0.5 text-ink-2">
            <PinGlyph />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-0.5">
              What we're tracking
            </div>
            <div className="text-[13px] text-ink leading-snug font-medium text-pretty">
              {pinnedStory.headline}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-2.5">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center px-6">
            <div>
              <div className="font-display text-[20px] text-ink mb-1">
                Say hi to start your Loop.
              </div>
              <div className="text-[13px] text-ink-3 text-pretty">
                Up to 12 friends. Stories arrive with sources attached.
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <Message key={i} message={m} isYou={m.from === "You"} />
          ))
        )}
      </div>

      <ChatInput loopId={loop.id} />

      <AnimatePresence>
        {overflowOpen && (
          <ActionMenu
            title={loop.name}
            subtitle={`${loop.members.length} members`}
            items={overflowItems}
            onClose={() => setOverflowOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {membersOpen && (
          <MembersSheet
            loop={loop}
            onClose={() => setMembersOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {settingsOpen && (
          <LoopSettingsSheet
            loop={loop}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function MembersSheet({ loop, onClose }: { loop: Loop; onClose: () => void }) {
  return (
    <Sheet
      title={`${loop.name} · members`}
      subtitle={`${loop.members.length} of 12 max`}
      onClose={onClose}
    >
      <div className="px-3 pb-4 pt-1">
        <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
          {loop.members.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3.5"
            >
              <div className="w-9 h-9 rounded-full bg-ink/8 ring-1 ring-ink/12 flex items-center justify-center text-ink font-semibold text-[13px]">
                {m.avatar}
              </div>
              <div className="flex-1 text-[14px] font-medium text-ink">
                {m.name}
                {m.name === "You" && (
                  <span className="ml-1.5 text-[11.5px] text-ink-3 font-normal">
                    (you)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  )
}

function LoopSettingsSheet({
  loop,
  onClose,
}: {
  loop: Loop
  onClose: () => void
}) {
  return (
    <Sheet title="Loop settings" subtitle={loop.name} onClose={onClose}>
      <div className="px-5 pb-5 pt-1 space-y-3">
        <Field label="Loop name" value={loop.name} />
        <Field label="Glyph" value={loop.glyph} />
        <Field
          label="Member cap"
          value={`${loop.members.length} / 12`}
          hint="Loops are intentionally small. The cap stays."
        />
        <Field
          label="Pinned story"
          value={
            loop.pinnedStoryId
              ? today.find((s) => s.id === loop.pinnedStoryId)?.headline ?? "—"
              : "None"
          }
        />
      </div>
    </Sheet>
  )
}

function Field({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 px-4 py-3">
      <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1">
        {label}
      </div>
      <div className="text-[14px] text-ink font-medium text-pretty">{value}</div>
      {hint && <div className="text-[12px] text-ink-3 mt-1">{hint}</div>}
    </div>
  )
}

function PinGlyph({ small }: { small?: boolean }) {
  const size = small ? 11 : 14
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5 L7 6 L9.5 8.5 H4.5 L7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M7 8.5 V12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MuteGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 5 H5 L8 2.5 V11.5 L5 9 H3 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M10 5 L12.5 9 M12.5 5 L10 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PeopleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M1.5 12 a3.5 3.5 0 0 1 7 0"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="10" cy="5.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8.5 12 a3 3 0 0 1 4.5 -2.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function GearGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 1.5 v1.5 M7 11 v1.5 M1.5 7 h1.5 M11 7 h1.5 M3 3 l1 1 M10 10 l1 1 M3 11 l1 -1 M10 4 l1 -1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LeaveGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M9 2 H3 a1 1 0 0 0 -1 1 v8 a1 1 0 0 0 1 1 h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7 7 H12.5 M10 4.5 L12.5 7 L10 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StoryGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2.5" y="2" width="9" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4.5 5 H9.5 M4.5 7 H9.5 M4.5 9 H7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MarginSparkleGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1 L8.2 5.6 L13 6.8 L8.2 8.2 L7 13 L5.8 8.2 L1 6.8 L5.8 5.6 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PhotoGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3" width="11" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5" cy="6.5" r="1.1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2 10 L5.5 7.5 L8 9.5 L10.5 7 L12.5 9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function PollGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 11 V7 M7 11 V3 M11 11 V5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Message({ message, isYou }: { message: LoopMessage; isYou: boolean }) {
  if (message.kind === "text") {
    return (
      <div className={cn("flex gap-2", isYou && "flex-row-reverse")}>
        {!isYou && <AvatarSmall letter={message.avatar} />}
        <div
          className={cn(
            "max-w-[78%] rounded-2xl px-3.5 py-2",
            isYou
              ? "bg-ink text-paper rounded-tr-md"
              : "bg-paper-2 text-ink ring-1 ring-paper-3/70 rounded-tl-md"
          )}
        >
          {!isYou && (
            <div className="text-[11px] font-semibold text-ink-2 mb-0.5">
              {message.from}
            </div>
          )}
          <div className="text-[14px] leading-snug text-pretty">
            {message.text}
          </div>
        </div>
      </div>
    )
  }

  if (message.kind === "story-card") {
    const story = today.find((s) => s.id === message.storyId)
    if (!story) return null
    return (
      <div className="flex gap-2">
        <AvatarSmall letter={message.avatar} />
        <div className="max-w-[82%] rounded-2xl rounded-tl-md bg-paper-2 ring-1 ring-paper-3/70 p-3">
          <div className="text-[11px] font-semibold text-ink-2 mb-1">
            {message.from} shared
          </div>
          <div className="rounded-xl bg-paper p-3 ring-1 ring-paper-3/60">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1">
              {story.category}
            </div>
            <div className="font-display text-[15px] leading-tight text-ink text-balance">
              {story.headline}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-ink-3">
              <span>{story.sources.length} sources</span>
              <span>·</span>
              <span>{story.readMinutes} min</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (message.kind === "margin-card") {
    // Margin cards are the one place violet earns its keep inside chat —
    // they ARE the AI surface. Keep the soft tint + sparkle.
    return (
      <div className={cn("flex gap-2", isYou && "flex-row-reverse")}>
        {!isYou && <AvatarSmall letter={message.avatar} />}
        <div className="max-w-[88%] rounded-2xl bg-paper-2 ring-1 ring-signal/30 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-signal-soft px-1.5 py-0.5 text-[10.5px] font-bold tracking-[0.12em] uppercase text-signal">
              <MarginSparkle />
              Margin
            </span>
            <span className="text-[11.5px] text-ink-3">
              {message.from} asked
            </span>
          </div>
          <div className="text-[13px] font-medium text-ink mb-2 text-pretty">
            "{message.question}"
          </div>
          <div className="rounded-xl bg-paper p-2.5 ring-1 ring-paper-3/60">
            <div className="text-[13px] text-ink leading-snug text-pretty">
              {message.answer}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-3">
              <span className="inline-flex items-center gap-0.5 rounded bg-signal-soft px-1 py-0.5 text-signal font-semibold">
                {message.sourceCount} cites
              </span>
              <span>·</span>
              <span>sources attached</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

function MarginSparkle() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path
        d="M4 0.5 L4.7 3 L7 4 L4.7 5 L4 7.5 L3.3 5 L1 4 L3.3 3 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function AvatarSmall({ letter }: { letter: string }) {
  // Friend avatars in chat — keep them in the ink family. Violet stays Margin.
  return (
    <div className="w-7 h-7 rounded-full bg-ink/8 ring-1 ring-ink/12 flex items-center justify-center text-ink font-semibold text-[11.5px] flex-shrink-0 mt-auto">
      {letter}
    </div>
  )
}

function ChatInput({ loopId }: { loopId: string }) {
  const { sendMessage, attachStory, toast } = useAppState()
  const [value, setValue] = useState("")
  const [plusOpen, setPlusOpen] = useState(false)
  const [pickStoryOpen, setPickStoryOpen] = useState(false)

  const submit = () => {
    if (!value.trim()) return
    sendMessage(loopId, value)
    setValue("")
  }

  const plusItems: ActionItem[] = [
    {
      label: "Attach a story",
      icon: <StoryGlyph />,
      hint: "Share something from Today with sources",
      onSelect: () => setPickStoryOpen(true),
    },
    {
      label: "Ask Margin",
      icon: <MarginSparkleGlyph />,
      hint: "Add an AI-cited answer to the chat",
      onSelect: () => toast("Margin will join this thread"),
    },
    {
      label: "Photo",
      icon: <PhotoGlyph />,
      onSelect: () => toast("Photo picker opened"),
    },
    {
      label: "Poll",
      icon: <PollGlyph />,
      onSelect: () => toast("Poll composer opened"),
    },
  ]

  return (
    <div className="px-3 pb-4 pt-2 border-t border-paper-3/60 bg-paper">
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setPlusOpen(true)}
          className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2 hover:text-ink transition-colors"
          aria-label="Add"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2 v10 M2 7 h10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>
        <div className="flex-1 rounded-full bg-paper-2 ring-1 ring-paper-3 px-4 py-2.5">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder="Message"
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-3 outline-none"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={submit}
          disabled={!value.trim()}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            value.trim()
              ? "bg-signal text-paper"
              : "bg-paper-2 ring-1 ring-paper-3 text-ink-3"
          )}
          aria-label="Send"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6 L10 2 L7 10 L5.5 6.5 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {plusOpen && (
          <ActionMenu
            title="Add to message"
            items={plusItems}
            onClose={() => setPlusOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pickStoryOpen && (
          <Sheet
            title="Attach a story"
            subtitle="Pick from today's Loop. Sources travel with it."
            onClose={() => setPickStoryOpen(false)}
            maxHeightPct={72}
          >
            <div className="px-3 pb-4 pt-1">
              <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
                {today.map((s) => (
                  <motion.button
                    key={s.id}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      attachStory(loopId, s.id)
                      setPickStoryOpen(false)
                      toast("Story attached")
                    }}
                    className="w-full text-left px-4 py-3.5 hover:bg-paper-3/40"
                  >
                    <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1">
                      {s.category} · {s.readMinutes} min
                    </div>
                    <div className="font-display text-[15px] leading-tight text-ink text-balance">
                      {s.headline}
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

const SUGGESTED_INVITES = [
  "Maya",
  "Sam",
  "Priya",
  "Devon",
  "Jess",
  "Theo",
  "Quinn",
  "Em",
  "Reed",
  "Mia",
]

function NewLoopSheet({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const { createLoop, toast } = useAppState()
  const [name, setName] = useState("")
  const [picked, setPicked] = useState<Set<string>>(() => new Set())

  const togglePick = (n: string) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  const canCreate = name.trim().length > 0

  return (
    <Sheet
      title="New Loop"
      subtitle="Up to 12 friends. Tightly small on purpose."
      onClose={onClose}
      maxHeightPct={82}
    >
      <div className="px-5 pb-5 pt-1">
        <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 px-4 py-3">
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1">
            Loop name
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. AI policy folks"
            className="w-full bg-transparent text-[15px] text-ink placeholder:text-ink-3 outline-none"
          />
        </div>
        <div className="mt-4">
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-2">
            Invite friends · {picked.size} selected
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_INVITES.map((n) => {
              const on = picked.has(n)
              return (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => togglePick(n)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                    on
                      ? "bg-ink text-paper ring-1 ring-ink"
                      : "bg-paper ring-1 ring-paper-3 text-ink-2 hover:ring-ink/30"
                  )}
                >
                  <span className="w-5 h-5 rounded-full bg-ink/8 ring-1 ring-ink/12 flex items-center justify-center text-[10px] font-semibold text-ink">
                    {n[0]}
                  </span>
                  {n}
                  {on && <span className="text-sage">✓</span>}
                </motion.button>
              )
            })}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: canCreate ? 0.98 : 1 }}
          onClick={() => {
            if (!canCreate) return
            const id = createLoop(name, Array.from(picked))
            toast(`Loop "${name.trim()}" created`)
            onCreated(id)
          }}
          disabled={!canCreate}
          className={cn(
            "mt-5 w-full rounded-full text-[14px] font-medium py-3 transition-colors",
            canCreate
              ? "bg-ink text-paper"
              : "bg-paper-2 ring-1 ring-paper-3 text-ink-3"
          )}
        >
          Create Loop
        </motion.button>
      </div>
    </Sheet>
  )
}
