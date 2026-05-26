import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  loops as seedLoops,
  loopChat as seedLoopChat,
  type Loop,
  type LoopMessage,
} from "@/data/content"

// State is intentionally in-memory only — this is a prototype demo. Reloads
// reset to seed; see plan file for the rationale.

export type Settings = {
  storyCount: string
  dropTime: string
  tone: string
}

type AppStateValue = {
  // Reading
  readIds: Set<string>
  markRead: (id: string) => void

  // Saving
  bookmarkedIds: Set<string>
  toggleBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean

  // Social
  followedVoiceIds: Set<string>
  toggleFollow: (voiceId: string) => void
  requestedLoopIds: Set<string>
  requestJoin: (loopId: string) => void

  // Loop chat
  loops: Loop[]
  loopChat: Record<string, LoopMessage[]>
  sendMessage: (loopId: string, text: string) => void
  attachStory: (loopId: string, storyId: string) => void
  createLoop: (name: string, memberNames: string[]) => string
  pinnedLoopIds: Set<string>
  mutedLoopIds: Set<string>
  togglePin: (id: string) => void
  toggleMute: (id: string) => void
  leaveLoop: (id: string) => void

  // Interests (lifted out of Me.tsx)
  interests: Set<string>
  topicMutes: Set<string>
  toggleInterest: (id: string) => void
  toggleTopicMute: (id: string) => void

  // Settings
  settings: Settings
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void

  // Toast
  toast: (msg: string) => void
  currentToast: { id: number; message: string } | null
}

const AppStateContext = createContext<AppStateValue | null>(null)

const DEFAULT_INTERESTS = ["ai", "your-city", "climate"]
const DEFAULT_TOPIC_MUTES = ["sports"]

const DEFAULT_SETTINGS: Settings = {
  storyCount: "7",
  dropTime: "6:00 AM",
  tone: "Conversational",
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set())
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set()
  )
  const [followedVoiceIds, setFollowedVoiceIds] = useState<Set<string>>(
    () => new Set()
  )
  const [requestedLoopIds, setRequestedLoopIds] = useState<Set<string>>(
    () => new Set()
  )

  const [loops, setLoops] = useState<Loop[]>(() => seedLoops)
  const [loopChat, setLoopChat] = useState<Record<string, LoopMessage[]>>(
    () => ({ ...seedLoopChat })
  )
  const [pinnedLoopIds, setPinnedLoopIds] = useState<Set<string>>(
    () => new Set()
  )
  const [mutedLoopIds, setMutedLoopIds] = useState<Set<string>>(() => new Set())

  const [interests, setInterests] = useState<Set<string>>(
    () => new Set(DEFAULT_INTERESTS)
  )
  const [topicMutes, setTopicMutes] = useState<Set<string>>(
    () => new Set(DEFAULT_TOPIC_MUTES)
  )

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  const [currentToast, setCurrentToast] = useState<{
    id: number
    message: string
  } | null>(null)
  const toastTimer = useRef<number | null>(null)
  const toastSeq = useRef(0)

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isBookmarked = useCallback(
    (id: string) => bookmarkedIds.has(id),
    [bookmarkedIds]
  )

  const toggleFollow = useCallback((voiceId: string) => {
    setFollowedVoiceIds((prev) => {
      const next = new Set(prev)
      if (next.has(voiceId)) next.delete(voiceId)
      else next.add(voiceId)
      return next
    })
  }, [])

  const requestJoin = useCallback((loopId: string) => {
    setRequestedLoopIds((prev) => {
      if (prev.has(loopId)) return prev
      const next = new Set(prev)
      next.add(loopId)
      return next
    })
  }, [])

  const sendMessage = useCallback((loopId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const message: LoopMessage = {
      kind: "text",
      from: "You",
      avatar: "Y",
      text: trimmed,
      time: nowTime(),
    }
    setLoopChat((prev) => ({
      ...prev,
      [loopId]: [...(prev[loopId] ?? []), message],
    }))
    setLoops((prev) =>
      prev.map((l) =>
        l.id === loopId
          ? {
              ...l,
              lastMessage: { person: "You", snippet: trimmed, timeAgo: "now" },
            }
          : l
      )
    )
  }, [])

  const attachStory = useCallback((loopId: string, storyId: string) => {
    const message: LoopMessage = {
      kind: "story-card",
      from: "You",
      avatar: "Y",
      storyId,
      time: nowTime(),
    }
    setLoopChat((prev) => ({
      ...prev,
      [loopId]: [...(prev[loopId] ?? []), message],
    }))
    setLoops((prev) =>
      prev.map((l) =>
        l.id === loopId
          ? {
              ...l,
              lastMessage: {
                person: "You",
                snippet: "shared a story",
                timeAgo: "now",
              },
            }
          : l
      )
    )
  }, [])

  const createLoop = useCallback(
    (name: string, memberNames: string[]) => {
      const id = `loop-${Date.now()}`
      const members = [
        ...memberNames.map((n) => ({ name: n, avatar: n[0]?.toUpperCase() ?? "?" })),
        { name: "You", avatar: "Y" },
      ]
      const newLoop: Loop = {
        id,
        name: name.trim() || "New Loop",
        glyph: "✶",
        members,
        lastMessage: {
          person: "You",
          snippet: "Loop created",
          timeAgo: "now",
        },
        unread: 0,
      }
      setLoops((prev) => [newLoop, ...prev])
      setLoopChat((prev) => ({ ...prev, [id]: [] }))
      return id
    },
    []
  )

  const togglePin = useCallback((id: string) => {
    setPinnedLoopIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleMute = useCallback((id: string) => {
    setMutedLoopIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const leaveLoop = useCallback((id: string) => {
    setLoops((prev) => prev.filter((l) => l.id !== id))
    setLoopChat((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setPinnedLoopIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setMutedLoopIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const toggleInterest = useCallback((id: string) => {
    setInterests((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setTopicMutes((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const toggleTopicMute = useCallback((id: string) => {
    setTopicMutes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setInterests((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const toast = useCallback((message: string) => {
    toastSeq.current += 1
    const id = toastSeq.current
    setCurrentToast({ id, message })
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current)
    }
    toastTimer.current = window.setTimeout(() => {
      setCurrentToast((prev) => (prev && prev.id === id ? null : prev))
      toastTimer.current = null
    }, 2400)
  }, [])

  const value = useMemo<AppStateValue>(
    () => ({
      readIds,
      markRead,
      bookmarkedIds,
      toggleBookmark,
      isBookmarked,
      followedVoiceIds,
      toggleFollow,
      requestedLoopIds,
      requestJoin,
      loops,
      loopChat,
      sendMessage,
      attachStory,
      createLoop,
      pinnedLoopIds,
      mutedLoopIds,
      togglePin,
      toggleMute,
      leaveLoop,
      interests,
      topicMutes,
      toggleInterest,
      toggleTopicMute,
      settings,
      updateSetting,
      toast,
      currentToast,
    }),
    [
      readIds,
      markRead,
      bookmarkedIds,
      toggleBookmark,
      isBookmarked,
      followedVoiceIds,
      toggleFollow,
      requestedLoopIds,
      requestJoin,
      loops,
      loopChat,
      sendMessage,
      attachStory,
      createLoop,
      pinnedLoopIds,
      mutedLoopIds,
      togglePin,
      toggleMute,
      leaveLoop,
      interests,
      topicMutes,
      toggleInterest,
      toggleTopicMute,
      settings,
      updateSetting,
      toast,
      currentToast,
    ]
  )

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) {
    throw new Error("useAppState must be used inside <AppStateProvider>")
  }
  return ctx
}

function nowTime() {
  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes()
  return `${h}:${m.toString().padStart(2, "0")}`
}
