import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Maximize2, Minimize2, Play, X } from "lucide-react"

type Mode = "hero" | "pip" | "closed"

type LoomPlayerCtxValue = {
  mode: Mode
  setMode: (m: Mode) => void
  registerHeroSlot: (el: HTMLElement | null) => void
  expandToHero: () => void
  hasSlot: boolean
}

const LoomPlayerCtx = createContext<LoomPlayerCtxValue | null>(null)

export function useLoomPlayer() {
  const v = useContext(LoomPlayerCtx)
  if (!v) throw new Error("useLoomPlayer must be used inside <LoomPlayerProvider>")
  return v
}

const TRANSITION_MS = 380
const TRANSITION_EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)"

// The iframe is rendered at a fixed natural size and scaled visually with
// CSS `transform: scale()` so it never sees a `resize` event in its own
// document. This avoids cross-origin video players (like Loom) auto-pausing
// or muting when the embed window shrinks across PiP transitions.
const IFRAME_NATURAL_W = 1280
const IFRAME_NATURAL_H = 720

type PipDims = { width: number; height: number; marginX: number; marginY: number }

function pipDimsForViewport(): PipDims {
  if (typeof window === "undefined") return { width: 320, height: 180, marginX: 24, marginY: 24 }
  const w = window.innerWidth
  if (w >= 1024) return { width: 320, height: 180, marginX: 24, marginY: 24 }
  if (w >= 640) return { width: 260, height: 146, marginX: 18, marginY: 18 }
  return { width: 200, height: 113, marginX: 12, marginY: 12 }
}

export function LoomPlayerProvider({
  embedUrl,
  children,
}: {
  embedUrl: string
  children: ReactNode
}) {
  const [mode, setModeRaw] = useState<Mode>("hero")
  const [hasSlot, setHasSlot] = useState(false)
  const heroSlotRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isFirstMount = useRef(true)
  const [slotVersion, setSlotVersion] = useState(0)

  const setMode = useCallback((m: Mode) => setModeRaw(m), [])

  const registerHeroSlot = useCallback((el: HTMLElement | null) => {
    heroSlotRef.current = el
    setHasSlot(!!el)
    setSlotVersion((v) => v + 1)
    if (!el) {
      // Slot unmounted (e.g., navigated away from Landing). Drop to PiP
      // immediately so the iframe doesn't visibly lag at the old position.
      setModeRaw((m) => (m === "hero" ? "pip" : m))
    }
  }, [])

  const expandToHero = useCallback(() => {
    const slot = heroSlotRef.current
    if (slot) {
      const rect = slot.getBoundingClientRect()
      const ratioVisible =
        Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top)) /
        Math.max(1, rect.height)
      if (ratioVisible < 0.5) {
        const target = window.scrollY + rect.top - 80
        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" })
      }
    }
    setModeRaw("hero")
  }, [])

  // Auto-collapse to PiP when the hero slot scrolls out of view, and expand
  // back when it returns. If there's no slot at all (we're on /prototype),
  // stay in PiP.
  useEffect(() => {
    const slot = heroSlotRef.current
    if (!slot) {
      setModeRaw((m) => (m === "hero" ? "pip" : m))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e) return
        setModeRaw((current) => {
          if (current === "closed") return current
          return e.intersectionRatio >= 0.35 ? "hero" : "pip"
        })
      },
      { threshold: [0, 0.1, 0.35, 0.6, 0.9] }
    )
    obs.observe(slot)
    return () => obs.disconnect()
  }, [slotVersion])

  // Imperative positioning. CSS transitions handle mode changes;
  // rAF-driven style writes track the hero slot during scroll. The iframe
  // itself stays at IFRAME_NATURAL_W × IFRAME_NATURAL_H and is scaled with
  // transform — so Loom never observes a resize and keeps playing/unmuted.
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const setShape = (top: number, left: number, width: number, height: number) => {
      container.style.top = `${top}px`
      container.style.left = `${left}px`
      container.style.width = `${width}px`
      container.style.height = `${height}px`
      const iframe = iframeRef.current
      if (iframe) {
        const scale = width / IFRAME_NATURAL_W
        iframe.style.transform = `scale(${scale})`
      }
    }

    const shapeTransition =
      `top ${TRANSITION_MS}ms ${TRANSITION_EASE}, ` +
      `left ${TRANSITION_MS}ms ${TRANSITION_EASE}, ` +
      `width ${TRANSITION_MS}ms ${TRANSITION_EASE}, ` +
      `height ${TRANSITION_MS}ms ${TRANSITION_EASE}, ` +
      `opacity 220ms ease`
    const iframeTransition = `transform ${TRANSITION_MS}ms ${TRANSITION_EASE}`
    const opacityOnlyTransition = "opacity 220ms ease"
    const noTransition = "none"

    const setIframeTransition = (t: string) => {
      if (iframeRef.current) iframeRef.current.style.transition = t
    }

    if (mode === "closed") {
      container.style.transition = shapeTransition
      container.style.opacity = "0"
      container.style.pointerEvents = "none"
      return
    }

    container.style.pointerEvents = "auto"

    const wasFirstMount = isFirstMount.current

    if (mode === "pip") {
      const d = pipDimsForViewport()
      container.style.transition = wasFirstMount ? noTransition : shapeTransition
      setIframeTransition(wasFirstMount ? noTransition : iframeTransition)
      const top = Math.max(d.marginY, window.innerHeight - d.height - d.marginY)
      const left = Math.max(d.marginX, window.innerWidth - d.width - d.marginX)
      setShape(top, left, d.width, d.height)
      container.style.opacity = "1"
      isFirstMount.current = false

      const onResize = () => {
        const next = pipDimsForViewport()
        container.style.transition = noTransition
        setIframeTransition(noTransition)
        setShape(
          Math.max(next.marginY, window.innerHeight - next.height - next.marginY),
          Math.max(next.marginX, window.innerWidth - next.width - next.marginX),
          next.width,
          next.height
        )
      }
      window.addEventListener("resize", onResize)
      return () => window.removeEventListener("resize", onResize)
    }

    // mode === "hero"
    const slot = heroSlotRef.current
    if (!slot) {
      // Intersection observer will normalize on the next tick.
      container.style.opacity = "0"
      return
    }

    container.style.transition = wasFirstMount ? opacityOnlyTransition : shapeTransition
    setIframeTransition(wasFirstMount ? noTransition : iframeTransition)
    const initial = slot.getBoundingClientRect()
    setShape(initial.top, initial.left, initial.width, initial.height)
    container.style.opacity = "1"
    isFirstMount.current = false

    let canceled = false
    let raf = 0
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const startTracking = () => {
      if (canceled) return
      container.style.transition = opacityOnlyTransition
      setIframeTransition(noTransition)
      const tick = () => {
        if (canceled) return
        const s = heroSlotRef.current
        if (!s) return
        const rect = s.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          container.style.top = `${rect.top}px`
          container.style.left = `${rect.left}px`
          container.style.width = `${rect.width}px`
          container.style.height = `${rect.height}px`
          const iframe = iframeRef.current
          if (iframe) {
            const scale = rect.width / IFRAME_NATURAL_W
            iframe.style.transform = `scale(${scale})`
          }
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    if (wasFirstMount) {
      startTracking()
    } else {
      timeoutId = setTimeout(startTracking, TRANSITION_MS + 20)
    }

    return () => {
      canceled = true
      if (timeoutId) clearTimeout(timeoutId)
      cancelAnimationFrame(raf)
    }
  }, [mode, slotVersion])

  return (
    <LoomPlayerCtx.Provider
      value={{ mode, setMode, registerHeroSlot, expandToHero, hasSlot }}
    >
      {children}

      <div
        ref={containerRef}
        className={`group fixed z-40 overflow-hidden rounded-xl bg-ink ${
          mode === "pip"
            ? "shadow-[0_20px_60px_-12px_rgba(11,11,20,0.45)] ring-1 ring-ink/20"
            : "ring-1 ring-paper-3/70"
        }`}
        style={{
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
          willChange: "top, left, width, height",
        }}
        aria-hidden={mode === "closed"}
      >
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Loop — 10-minute walkthrough"
          allow="fullscreen; autoplay; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${IFRAME_NATURAL_W}px`,
            height: `${IFRAME_NATURAL_H}px`,
            transformOrigin: "0 0",
            transform: "scale(1)",
            willChange: "transform",
            border: 0,
          }}
        />
        <PlayerControls
          mode={mode}
          setMode={setMode}
          expandToHero={expandToHero}
          hasSlot={hasSlot}
        />
      </div>
    </LoomPlayerCtx.Provider>
  )
}

function PlayerControls({
  mode,
  setMode,
  expandToHero,
  hasSlot,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  expandToHero: () => void
  hasSlot: boolean
}) {
  if (mode === "closed") return null
  const isPip = mode === "pip"

  return (
    <div
      className={`pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1 transition-opacity duration-150 ${
        isPip ? "opacity-95" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
      }`}
    >
      {isPip
        ? hasSlot && (
            <ControlButton label="Expand walkthrough to hero" onClick={expandToHero}>
              <Maximize2 size={12} strokeWidth={2.2} />
            </ControlButton>
          )
        : (
            <ControlButton
              label="Collapse walkthrough to picture-in-picture"
              onClick={() => setMode("pip")}
            >
              <Minimize2 size={12} strokeWidth={2.2} />
            </ControlButton>
          )}
      <ControlButton label="Close walkthrough" onClick={() => setMode("closed")}>
        <X size={12} strokeWidth={2.2} />
      </ControlButton>
    </div>
  )
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-paper/95 text-ink ring-1 ring-ink/10 backdrop-blur-md transition-colors hover:bg-paper hover:text-signal"
    >
      {children}
    </button>
  )
}

export function LoomHeroSlot() {
  const { mode, setMode, registerHeroSlot, expandToHero } = useLoomPlayer()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerHeroSlot(ref.current)
    return () => registerHeroSlot(null)
  }, [registerHeroSlot])

  return (
    <div
      ref={ref}
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-paper-2 ring-1 ring-paper-3/70"
    >
      {mode === "pip" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="text-[12px] tracking-[0.2em] uppercase text-ink-3">
            Playing · picture-in-picture
          </div>
          <button
            onClick={expandToHero}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-signal"
          >
            <Maximize2 size={13} strokeWidth={2.2} />
            Bring it back here
          </button>
        </div>
      )}
      {mode === "closed" && (
        <button
          onClick={() => setMode("hero")}
          className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 transition-colors hover:bg-ink/5"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-signal">
            <Play size={13} strokeWidth={2.2} />
            Watch the 10-min walkthrough
          </span>
        </button>
      )}
    </div>
  )
}

