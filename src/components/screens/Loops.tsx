import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { loops, loopChat, today, type Loop, type LoopMessage } from "@/data/content"
import { cn } from "@/lib/utils"

export function LoopsScreen() {
  const [openLoopId, setOpenLoopId] = useState<string | null>(null)
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
            <LoopsList onOpen={(id) => setOpenLoopId(id)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LoopsList({ onOpen }: { onOpen: (id: string) => void }) {
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
        <button className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2 v10 M2 7 h10"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <p className="px-5 text-[12.5px] text-ink-2 mb-5 max-w-[300px] text-pretty">
        Up to 12 friends per Loop. Stories arrive with context. No public feed.
      </p>

      <div className="px-5 space-y-2.5">
        {loops.map((loop, i) => (
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
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-semibold text-ink truncate">
                  {loop.name}
                </span>
                <span className="text-[10.5px] text-ink-3 tabular flex-shrink-0 ml-2">
                  {loop.lastMessage.timeAgo}
                </span>
              </div>
              <div className="text-[12.5px] text-ink-2 truncate mt-0.5">
                <span className="text-ink-3">{loop.lastMessage.person}: </span>
                {loop.lastMessage.snippet}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <MemberStack members={loop.members.slice(0, 4)} />
                <span className="text-[10.5px] text-ink-3">
                  {loop.members.length} members
                </span>
                {loop.unread > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-signal text-paper text-[10px] font-semibold px-1.5 tabular">
                    {loop.unread}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mx-5 mt-6 rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-4">
        <div className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-ink-3 mb-1.5">
          Why Loops are small
        </div>
        <p className="text-[12.5px] text-ink-2 leading-snug text-pretty">
          Capped at 12 people so the dynamic stays group-chat, not group-feed. No
          likes, no view counts. Stories travel with their sources attached.
        </p>
      </div>
    </>
  )
}

function LoopGlyph({ loop }: { loop: Loop }) {
  return (
    <div className="w-12 h-12 rounded-2xl bg-signal-soft flex items-center justify-center text-signal font-display text-[22px] leading-none">
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
          className="w-5 h-5 rounded-full bg-ember-soft ring-2 ring-paper-2 text-ember text-[9px] font-semibold flex items-center justify-center"
        >
          {m.avatar}
        </span>
      ))}
    </div>
  )
}

function LoopChat({ loop, onBack }: { loop: Loop; onBack: () => void }) {
  const messages = loopChat[loop.id] ?? []
  const pinnedStory = loop.pinnedStoryId
    ? today.find((s) => s.id === loop.pinnedStoryId)
    : null

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
            <span className="text-signal text-[14px] font-display">
              {loop.glyph}
            </span>
            <span className="font-display text-[18px] tracking-tight text-ink truncate">
              {loop.name}
            </span>
          </div>
          <div className="text-[11px] text-ink-3">
            {loop.members.length} members ·{" "}
            {loop.members
              .filter((m) => m.name !== "You")
              .map((m) => m.name)
              .slice(0, 3)
              .join(", ")}
            {loop.members.length > 4 ? ` +${loop.members.length - 4}` : ""}
          </div>
        </div>
        <button className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2">
          <svg width="14" height="3" viewBox="0 0 14 3" fill="none">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
            <circle cx="7" cy="1.5" r="1.5" fill="currentColor" />
            <circle cx="12.5" cy="1.5" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {pinnedStory && (
        <div className="mx-4 mt-3 mb-1 p-3 rounded-2xl bg-signal-soft ring-1 ring-signal/20 flex items-start gap-2.5">
          <div className="mt-0.5 text-signal">
            <PinGlyph />
          </div>
          <div className="flex-1">
            <div className="text-[10.5px] font-medium tracking-[0.14em] uppercase text-signal mb-0.5">
              What we're tracking
            </div>
            <div className="text-[12.5px] text-ink leading-snug font-medium text-pretty">
              {pinnedStory.headline}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-2.5">
        {messages.map((m, i) => (
          <Message key={i} message={m} isYou={m.from === "You"} />
        ))}
      </div>

      <ChatInput />
    </>
  )
}

function PinGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            <div className="text-[10.5px] font-semibold text-signal mb-0.5">
              {message.from}
            </div>
          )}
          <div className="text-[13.5px] leading-snug text-pretty">
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
          <div className="text-[10.5px] font-semibold text-signal mb-1">
            {message.from} shared
          </div>
          <div className="rounded-xl bg-paper p-3 ring-1 ring-paper-3/60">
            <div className="text-[10px] font-medium tracking-[0.14em] uppercase text-ink-3 mb-1">
              {story.category}
            </div>
            <div className="font-display text-[15px] leading-tight text-ink text-balance">
              {story.headline}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-ink-3">
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
    return (
      <div className={cn("flex gap-2", isYou && "flex-row-reverse")}>
        {!isYou && <AvatarSmall letter={message.avatar} />}
        <div className="max-w-[88%] rounded-2xl bg-paper-2 ring-1 ring-signal/30 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-signal-soft px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.12em] uppercase text-signal">
              <MarginSparkle />
              Margin
            </span>
            <span className="text-[10.5px] text-ink-3">
              {message.from} asked
            </span>
          </div>
          <div className="text-[12.5px] font-medium text-ink mb-2 text-pretty">
            "{message.question}"
          </div>
          <div className="rounded-xl bg-paper p-2.5 ring-1 ring-paper-3/60">
            <div className="text-[12px] text-ink leading-snug text-pretty">
              {message.answer}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-ink-3">
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
  return (
    <div className="w-7 h-7 rounded-full bg-signal/15 ring-1 ring-signal/30 flex items-center justify-center text-signal font-semibold text-[11px] flex-shrink-0 mt-auto">
      {letter}
    </div>
  )
}

function ChatInput() {
  return (
    <div className="px-3 pb-4 pt-2 border-t border-paper-3/60 bg-paper">
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-paper-2 ring-1 ring-paper-3 flex items-center justify-center text-ink-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2 v10 M2 7 h10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="flex-1 rounded-full bg-paper-2 ring-1 ring-paper-3 px-4 py-2.5">
          <input
            type="text"
            placeholder="Message"
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-3 outline-none"
          />
        </div>
        <button className="w-9 h-9 rounded-full bg-signal text-paper flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6 L10 2 L7 10 L5.5 6.5 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
