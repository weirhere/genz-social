import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Maximize2, Minimize2, Play, X } from "lucide-react"

type DisplayMode = "hero" | "modal"
type Mode = DisplayMode | "pip"
type Corner = "tl" | "tr" | "bl" | "br"

export type LoomVideoConfig = {
  id: string
  embedUrl: string
  title: string
  // Poster frame shown in the slot before playback.
  thumbnailUrl?: string
  // How this video presents when expanded (i.e. not in PiP). "hero" docks
  // it into its inline slot; "modal" floats it centered with a backdrop so
  // detail is legible even though the inline slot is small.
  displayMode?: DisplayMode
}

type LoomPlayerCtxValue = {
  videos: LoomVideoConfig[]
  activeId: string | null
  mode: Mode
  pipCorner: Corner
  hasActiveSlot: boolean
  sidecarActive: boolean
  registerSlot: (id: string, el: HTMLElement | null) => void
  setSidecarActive: (active: boolean) => void
  playVideo: (id: string) => void
  expand: () => void
  popToPip: () => void
  close: () => void
}

const LoomPlayerCtx = createContext<LoomPlayerCtxValue | null>(null)

export function useLoomPlayer() {
  const v = useContext(LoomPlayerCtx)
  if (!v) throw new Error("useLoomPlayer must be used inside <LoomPlayerProvider>")
  return v
}

const TRANSITION_MS = 380
const TRANSITION_EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)"

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

function cornerPos(corner: Corner, dims: PipDims): { top: number; left: number } {
  const W = window.innerWidth
  const H = window.innerHeight
  const right = Math.max(dims.marginX, W - dims.width - dims.marginX)
  const left = dims.marginX
  const top = dims.marginY
  const bottom = Math.max(dims.marginY, H - dims.height - dims.marginY)
  switch (corner) {
    case "tl":
      return { top, left }
    case "tr":
      return { top, left: right }
    case "bl":
      return { top: bottom, left }
    case "br":
    default:
      return { top: bottom, left: right }
  }
}

type ModalDims = { width: number; height: number; top: number; left: number }

function modalDimsForViewport(): ModalDims {
  if (typeof window === "undefined") return { width: 960, height: 540, top: 40, left: 40 }
  const W = window.innerWidth
  const H = window.innerHeight
  const horizontalPad = W >= 1024 ? 96 : W >= 640 ? 56 : 24
  const verticalPad = W >= 1024 ? 96 : W >= 640 ? 80 : 96
  const maxW = Math.min(1200, W - horizontalPad)
  const maxH = H - verticalPad
  let width = maxW
  let height = (width * IFRAME_NATURAL_H) / IFRAME_NATURAL_W
  if (height > maxH) {
    height = maxH
    width = (height * IFRAME_NATURAL_W) / IFRAME_NATURAL_H
  }
  return {
    width,
    height,
    top: Math.max(verticalPad / 2, (H - height) / 2),
    left: (W - width) / 2,
  }
}

function nearestCorner(cx: number, cy: number): Corner {
  const W = window.innerWidth
  const H = window.innerHeight
  const isRight = cx > W / 2
  const isBottom = cy > H / 2
  if (isRight && isBottom) return "br"
  if (!isRight && isBottom) return "bl"
  if (isRight && !isBottom) return "tr"
  return "tl"
}

function withAutoplay(url: string): string {
  return url + (url.includes("?") ? "&" : "?") + "autoplay=1"
}

export function LoomPlayerProvider({
  videos,
  defaultActiveId,
  children,
}: {
  videos: LoomVideoConfig[]
  defaultActiveId?: string
  children: ReactNode
}) {
  const initialId = defaultActiveId ?? videos[0]?.id ?? null
  const [activeId, setActiveIdRaw] = useState<string | null>(initialId)
  const [mode, setModeRaw] = useState<Mode>(() => {
    const v = videos.find((vv) => vv.id === initialId)
    return v?.displayMode ?? "hero"
  })
  const [pipCorner, setPipCornerRaw] = useState<Corner>("br")
  const [autoplayActive, setAutoplayActive] = useState(false)
  const [iframeBumpKey, setIframeBumpKey] = useState(0)
  const [slotVersion, setSlotVersion] = useState(0)
  // When the prototype sidecar mounts it becomes the slot host for all
  // videos, regardless of their declared displayMode. This flag flips the
  // mode resolution so SUB_LOOMS (declared "modal") play inline in the
  // sidecar slot instead of popping a centered overlay on the prototype
  // page.
  const [sidecarActive, setSidecarActive] = useState(false)

  const slotsRef = useRef<Map<string, HTMLElement | null>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isFirstMount = useRef(true)
  // Mirror state into refs so callbacks below can stay referentially stable
  // even as activeId changes. Without this, registerSlot would change
  // identity each turn — and the LoomVideoSlot useEffect that calls it would
  // re-fire, transiently unregistering the slot during cleanup and pushing
  // the player back to PiP every time playVideo runs.
  const activeIdRef = useRef(activeId)
  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  const dragStateRef = useRef<{
    dragging: boolean
    offsetX: number
    offsetY: number
    pointerId: number | null
  }>({ dragging: false, offsetX: 0, offsetY: 0, pointerId: null })
  const [isDragging, setIsDragging] = useState(false)

  const getDisplayMode = useCallback(
    (id: string | null): DisplayMode => {
      if (sidecarActive) return "hero"
      if (!id) return "hero"
      const v = videos.find((vv) => vv.id === id)
      return v?.displayMode ?? "modal"
    },
    [videos, sidecarActive]
  )

  const registerSlot = useCallback((id: string, el: HTMLElement | null) => {
    const map = slotsRef.current
    if (el) map.set(id, el)
    else map.delete(id)
    setSlotVersion((v) => v + 1)
    if (!el) {
      // Active video's slot just unmounted (e.g., user navigated away).
      // Drop to PiP whether we were in hero or modal.
      setModeRaw((m) =>
        (m === "hero" || m === "modal") && activeIdRef.current === id ? "pip" : m
      )
    }
  }, [])

  const playVideo = useCallback(
    (id: string) => {
      const video = videos.find((v) => v.id === id)
      if (!video) return
      setActiveIdRaw(id)
      setAutoplayActive(true)
      setIframeBumpKey((k) => k + 1)
      const dm = sidecarActive ? "hero" : video.displayMode ?? "modal"
      if (dm === "hero") {
        const slot = slotsRef.current.get(id)
        if (slot) {
          const rect = slot.getBoundingClientRect()
          const ratioVisible =
            Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top)) /
            Math.max(1, rect.height)
          if (ratioVisible < 0.5) {
            const target = window.scrollY + rect.top - 80
            window.scrollTo({ top: Math.max(0, target), behavior: "smooth" })
          }
          setModeRaw("hero")
        } else {
          setModeRaw("pip")
        }
      } else {
        setModeRaw("modal")
      }
    },
    [videos, sidecarActive]
  )

  const expand = useCallback(() => {
    if (!activeId) return
    const dm = getDisplayMode(activeId)
    if (dm === "hero") {
      const slot = slotsRef.current.get(activeId)
      if (slot) {
        const rect = slot.getBoundingClientRect()
        const ratioVisible =
          Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top)) /
          Math.max(1, rect.height)
        if (ratioVisible < 0.5) {
          const target = window.scrollY + rect.top - 80
          window.scrollTo({ top: Math.max(0, target), behavior: "smooth" })
        }
        setModeRaw("hero")
      }
    } else {
      setModeRaw("modal")
    }
  }, [activeId, getDisplayMode])

  const popToPip = useCallback(() => setModeRaw("pip"), [])

  const close = useCallback(() => {
    setActiveIdRaw(null)
    setAutoplayActive(false)
  }, [])

  // When the sidecar takes over (e.g., on /prototype) lift any currently
  // visible modal or PiP into the sidecar slot so the experience feels
  // continuous. The slot is registered alongside this flag flip in the
  // sidecar component, so by the time the layout effect re-runs, the slot
  // exists in the DOM.
  useEffect(() => {
    if (!sidecarActive) return
    if (!activeId) return
    setModeRaw((m) => (m === "hero" ? m : "hero"))
  }, [sidecarActive, activeId])

  // Hero auto-collapse: only watch the active video's slot if it uses hero
  // display mode. Modal-mode videos don't auto-collapse on scroll — the
  // modal stays open until the user dismisses it.
  useEffect(() => {
    if (!activeId) return
    if (getDisplayMode(activeId) !== "hero") return
    const slot = slotsRef.current.get(activeId)
    if (!slot) {
      setModeRaw((m) => (m === "hero" ? "pip" : m))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e) return
        if (dragStateRef.current.dragging) return
        setModeRaw((current) => {
          if (current === "modal") return current
          return e.intersectionRatio >= 0.35 ? "hero" : "pip"
        })
      },
      { threshold: [0, 0.1, 0.35, 0.6, 0.9] }
    )
    obs.observe(slot)
    return () => obs.disconnect()
  }, [activeId, slotVersion, getDisplayMode])

  // ESC closes the modal back to PiP (preserves playback position).
  useEffect(() => {
    if (mode !== "modal") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        popToPip()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, popToPip])

  // Scroll-lock body while the modal is open.
  useEffect(() => {
    if (mode !== "modal") return
    const orig = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = orig
    }
  }, [mode])

  // Imperative positioning + scaling. Same approach as before: the iframe
  // keeps its natural dimensions and we scale with `transform` so Loom never
  // sees a resize event (which would pause/mute it).
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

    if (!activeId) {
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
      const { top, left } = cornerPos(pipCorner, d)
      setShape(top, left, d.width, d.height)
      container.style.opacity = "1"
      isFirstMount.current = false

      const onResize = () => {
        const next = pipDimsForViewport()
        container.style.transition = noTransition
        setIframeTransition(noTransition)
        const pos = cornerPos(pipCorner, next)
        setShape(pos.top, pos.left, next.width, next.height)
      }
      window.addEventListener("resize", onResize)
      return () => window.removeEventListener("resize", onResize)
    }

    if (mode === "modal") {
      const d = modalDimsForViewport()
      container.style.transition = wasFirstMount ? noTransition : shapeTransition
      setIframeTransition(wasFirstMount ? noTransition : iframeTransition)
      setShape(d.top, d.left, d.width, d.height)
      container.style.opacity = "1"
      isFirstMount.current = false

      const onResize = () => {
        const next = modalDimsForViewport()
        container.style.transition = noTransition
        setIframeTransition(noTransition)
        setShape(next.top, next.left, next.width, next.height)
      }
      window.addEventListener("resize", onResize)
      return () => window.removeEventListener("resize", onResize)
    }

    // mode === "hero" — track the inline slot via rAF.
    const slot = slotsRef.current.get(activeId)
    if (!slot) {
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
        const s = slotsRef.current.get(activeId)
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
  }, [mode, activeId, pipCorner, slotVersion])

  // Drag handlers — PiP only.
  const onDragPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (mode !== "pip") return
      const container = containerRef.current
      if (!container) return
      e.preventDefault()
      e.stopPropagation()
      const rect = container.getBoundingClientRect()
      dragStateRef.current = {
        dragging: true,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        pointerId: e.pointerId,
      }
      setIsDragging(true)
      try {
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      } catch {}
      container.style.transition = "none"
      if (iframeRef.current) iframeRef.current.style.transition = "none"
    },
    [mode]
  )

  const onDragPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current
    if (!s.dragging || s.pointerId !== e.pointerId) return
    const container = containerRef.current
    if (!container) return
    e.preventDefault()
    container.style.left = `${e.clientX - s.offsetX}px`
    container.style.top = `${e.clientY - s.offsetY}px`
  }, [])

  const onDragPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current
    if (!s.dragging || s.pointerId !== e.pointerId) return
    dragStateRef.current = { dragging: false, offsetX: 0, offsetY: 0, pointerId: null }
    setIsDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setPipCornerRaw(nearestCorner(cx, cy))
  }, [])

  const activeVideo = videos.find((v) => v.id === activeId) ?? null
  const hasActiveSlot = !!(activeId && slotsRef.current.get(activeId))
  const activeDisplayMode = getDisplayMode(activeId)
  // From PiP we can always re-expand a modal video (the modal is centered,
  // it doesn't need a slot). A hero-mode video can only re-expand if its
  // slot is currently mounted in the page.
  const canExpand = activeDisplayMode === "modal" ? !!activeId : hasActiveSlot
  const embedSrc = activeVideo
    ? autoplayActive
      ? withAutoplay(activeVideo.embedUrl)
      : activeVideo.embedUrl
    : ""

  return (
    <LoomPlayerCtx.Provider
      value={{
        videos,
        activeId,
        mode,
        pipCorner,
        hasActiveSlot,
        sidecarActive,
        registerSlot,
        setSidecarActive,
        playVideo,
        expand,
        popToPip,
        close,
      }}
    >
      {children}

      {/* Modal backdrop. Click to send the video back to PiP (preserves
          playback) — the X button is the explicit close. */}
      <div
        onClick={popToPip}
        aria-hidden={mode !== "modal"}
        className={`fixed inset-0 z-30 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
          mode === "modal"
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        ref={containerRef}
        className={`group fixed z-40 overflow-hidden rounded-xl bg-ink ${
          mode === "pip"
            ? "shadow-[0_20px_60px_-12px_rgba(11,11,20,0.45)] ring-1 ring-ink/20"
            : mode === "modal"
            ? "shadow-[0_30px_80px_-20px_rgba(11,11,20,0.6)] ring-1 ring-paper/10"
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
        aria-hidden={!activeId}
      >
        {activeVideo && (
          <iframe
            key={`${activeVideo.id}-${iframeBumpKey}`}
            ref={iframeRef}
            src={embedSrc}
            title={activeVideo.title}
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
        )}
        {mode === "pip" && activeId && (
          <DragHandle
            isDragging={isDragging}
            onPointerDown={onDragPointerDown}
            onPointerMove={onDragPointerMove}
            onPointerUp={onDragPointerUp}
            onPointerCancel={onDragPointerUp}
          />
        )}
        {(mode === "pip" || mode === "modal") && activeId && <PipPrototypeLink />}
        <PlayerControls
          mode={mode}
          activeId={activeId}
          activeDisplayMode={activeDisplayMode}
          expand={expand}
          popToPip={popToPip}
          close={close}
          canExpand={canExpand}
        />
      </div>
    </LoomPlayerCtx.Provider>
  )
}

function DragHandle({
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  isDragging: boolean
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void
  onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      role="button"
      aria-label="Drag picture-in-picture to a different corner"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={`absolute left-0 right-0 top-0 z-10 flex h-6 items-center justify-center bg-gradient-to-b from-ink/55 via-ink/25 to-transparent backdrop-blur-[2px] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ touchAction: "none" }}
    >
      <div className="h-1 w-8 rounded-full bg-paper/70" />
    </div>
  )
}

function PipPrototypeLink() {
  return (
    <Link
      to="/prototype"
      onPointerDown={(e) => e.stopPropagation()}
      aria-label="Jump straight into the prototype"
      title="Jump straight into the prototype"
      className="group/cta pointer-events-auto absolute bottom-2 left-2 z-20 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-medium text-ink ring-1 ring-ink/10 backdrop-blur-md transition-colors hover:bg-paper hover:text-signal"
    >
      Try prototype
      <ArrowRight
        size={11}
        strokeWidth={2.4}
        className="transition-transform group-hover/cta:translate-x-0.5"
      />
    </Link>
  )
}

function PlayerControls({
  mode,
  activeId,
  activeDisplayMode,
  expand,
  popToPip,
  close,
  canExpand,
}: {
  mode: Mode
  activeId: string | null
  activeDisplayMode: DisplayMode
  expand: () => void
  popToPip: () => void
  close: () => void
  canExpand: boolean
}) {
  if (!activeId) return null
  const isPip = mode === "pip"
  const isModal = mode === "modal"
  const expandLabel =
    activeDisplayMode === "modal" ? "Reopen modal" : "Expand to inline"
  const minimizeLabel = "Collapse to picture-in-picture"

  // Controls stay opaque in PiP and modal modes; in hero mode they fade in
  // on hover so they don't fight the inline content.
  const opacityClass =
    isPip || isModal
      ? "opacity-95"
      : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"

  return (
    <div
      className={`pointer-events-none absolute right-2 top-2 z-20 flex items-center gap-1 transition-opacity duration-150 ${opacityClass}`}
    >
      {isPip ? (
        canExpand && (
          <ControlButton label={expandLabel} onClick={expand}>
            <Maximize2 size={12} strokeWidth={2.2} />
          </ControlButton>
        )
      ) : (
        <ControlButton label={minimizeLabel} onClick={popToPip}>
          <Minimize2 size={12} strokeWidth={2.2} />
        </ControlButton>
      )}
      <ControlButton label="Close walkthrough" onClick={close}>
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
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={label}
      title={label}
      className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-paper/95 text-ink ring-1 ring-ink/10 backdrop-blur-md transition-colors hover:bg-paper hover:text-signal"
    >
      {children}
    </button>
  )
}

export function LoomVideoSlot({
  id,
  playLabel,
}: {
  id: string
  playLabel?: string
}) {
  const { videos, activeId, mode, registerSlot, playVideo, expand } = useLoomPlayer()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerSlot(id, ref.current)
    return () => registerSlot(id, null)
  }, [id, registerSlot])

  const thisVideo = videos.find((v) => v.id === id)
  const thisDisplayMode: DisplayMode = thisVideo?.displayMode ?? "modal"
  const thumbnailUrl = thisVideo?.thumbnailUrl
  const isActive = activeId === id
  const showPipState = isActive && mode === "pip"
  // When the active video is in modal mode, its slot is covered by the
  // backdrop — render nothing so the page stays clean if the user scrolls
  // (which they can't right now, body is locked, but still).
  const showPlayState = !isActive

  const bringBackLabel =
    thisDisplayMode === "modal" ? "Open the modal" : "Bring it back here"

  return (
    <div
      ref={ref}
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-paper-2 ring-1 ring-paper-3/70"
    >
      {showPipState && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="text-[12px] tracking-[0.2em] uppercase text-ink-3">
            Playing · picture-in-picture
          </div>
          <button
            onClick={expand}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-signal"
          >
            <Maximize2 size={13} strokeWidth={2.2} />
            {bringBackLabel}
          </button>
        </div>
      )}
      {showPlayState && (
        <button
          onClick={() => playVideo(id)}
          className="group/play absolute inset-0 flex items-center justify-center"
        >
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <span
            aria-hidden
            className={`absolute inset-0 transition-colors ${
              thumbnailUrl
                ? "bg-ink/15 group-hover/play:bg-ink/25"
                : "bg-ink/0 group-hover/play:bg-ink/5"
            }`}
          />
          <span
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
              thumbnailUrl
                ? "bg-paper text-ink shadow-[0_8px_24px_-8px_rgba(11,11,20,0.6)] group-hover/play:bg-signal group-hover/play:text-paper"
                : "bg-ink text-paper group-hover/play:bg-signal"
            }`}
          >
            <Play size={13} strokeWidth={2.2} />
            {playLabel ?? "Play"}
          </span>
        </button>
      )}
    </div>
  )
}

export function LoomHeroSlot() {
  return <LoomVideoSlot id="hero" playLabel="Watch the walkthrough" />
}

export type LoomSidecarEntry = {
  id: string
  label: string
  title: string
  duration: string
  thumbnailUrl?: string
}

// Desktop-only panel that hosts the active Loom alongside the phone mockup
// on /prototype. Registers a single slot under every video id so the
// active video always docks here, and flips the provider into "sidecar
// mode" so SUB_LOOMS (declared "modal") play inline instead of popping a
// modal over the prototype.
export function LoomSidecar({ entries }: { entries: readonly LoomSidecarEntry[] }) {
  const { activeId, registerSlot, setSidecarActive, playVideo } = useLoomPlayer()
  const slotRef = useRef<HTMLDivElement>(null)

  const idKey = entries.map((e) => e.id).join(",")
  useEffect(() => {
    const ids = idKey.split(",")
    const el = slotRef.current
    setSidecarActive(true)
    ids.forEach((id) => registerSlot(id, el))
    return () => {
      ids.forEach((id) => registerSlot(id, null))
      setSidecarActive(false)
    }
  }, [idKey, registerSlot, setSidecarActive])

  const activeEntry = entries.find((e) => e.id === activeId) ?? null
  const fallbackEntry = activeEntry ?? entries[0] ?? null

  return (
    <aside className="w-[480px] flex-shrink-0 flex flex-col gap-5 sticky top-24">
      <div>
        <div className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-2">
          <span className="text-signal">{activeEntry?.label ?? "Walkthrough"}</span>
          {activeEntry && (
            <>
              <span className="opacity-40">·</span>
              <span>{activeEntry.duration}</span>
            </>
          )}
        </div>
        <h2 className="font-display text-[22px] leading-tight tracking-tight text-balance">
          {activeEntry?.title ?? "Pick a walkthrough to watch"}
        </h2>
      </div>

      <div
        ref={slotRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-paper-2 ring-1 ring-paper-3/70"
      >
        {!activeId && fallbackEntry && (
          <button
            onClick={() => playVideo(fallbackEntry.id)}
            aria-label={`Play ${fallbackEntry.label}`}
            className="group/play absolute inset-0 flex items-center justify-center"
          >
            {fallbackEntry.thumbnailUrl && (
              <img
                src={fallbackEntry.thumbnailUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <span
              aria-hidden
              className={`absolute inset-0 transition-colors ${
                fallbackEntry.thumbnailUrl
                  ? "bg-ink/15 group-hover/play:bg-ink/25"
                  : "bg-ink/0 group-hover/play:bg-ink/5"
              }`}
            />
            <span
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                fallbackEntry.thumbnailUrl
                  ? "bg-paper text-ink shadow-[0_8px_24px_-8px_rgba(11,11,20,0.6)] group-hover/play:bg-signal group-hover/play:text-paper"
                  : "bg-ink text-paper group-hover/play:bg-signal"
              }`}
            >
              <Play size={13} strokeWidth={2.2} />
              Watch
            </span>
          </button>
        )}
      </div>

      <div>
        <div className="text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-3">
          All walkthroughs
        </div>
        <div className="grid grid-cols-4 gap-2">
          {entries.map((e) => {
            const isActive = e.id === activeId
            return (
              <button
                key={e.id}
                onClick={() => {
                  if (isActive) return
                  playVideo(e.id)
                }}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? "bg-ink text-paper ring-1 ring-ink"
                    : "bg-paper-2 ring-1 ring-paper-3/70 hover:bg-paper-3/40 hover:ring-paper-3"
                }`}
              >
                <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-signal">
                  {e.label}
                </span>
                <span
                  className={`text-[10px] tabular ${
                    isActive ? "text-paper/65" : "text-ink-3"
                  }`}
                >
                  {e.duration}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
