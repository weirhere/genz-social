import type { CSSProperties, ReactNode } from "react"

// Wraps content in a phone-shaped viewport for desktop demo.
// On small screens it falls back to full-bleed. On desktop the phone scales
// down via CSS transform when the browser is shorter than the natural 860px,
// so the bottom nav stays reachable on smaller laptops without changing the
// inner layout.

const PHONE_W = 400
const PHONE_H = 860
// Reserve space for top chrome (sm:pt-24 = 96) + fixed bottom footer (~64).
const RESERVED_CHROME = 160

export function PhoneShell({ children }: { children: ReactNode }) {
  // --phone-h is a length, derived from min() so it never exceeds the natural
  // 860px. --phone-w follows the aspect ratio. The inner shell is rendered at
  // natural 400×860 and visually scaled with transform: scale(h/860px), which
  // resolves to a unitless number because length/length = unitless.
  const wrapStyle = {
    "--phone-h": `min(${PHONE_H}px, calc(100svh - ${RESERVED_CHROME}px))`,
    "--phone-w": `calc(${PHONE_W}px * var(--phone-h) / ${PHONE_H}px)`,
  } as CSSProperties

  return (
    <div
      className="phone-shell-wrap relative w-full max-w-[400px] mx-auto h-[calc(100svh-44px)] sm:max-w-none sm:h-[var(--phone-h)] sm:w-[var(--phone-w)]"
      style={wrapStyle}
    >
      <div className="relative w-full h-full bg-paper overflow-hidden sm:absolute sm:top-0 sm:left-0 sm:w-[400px] sm:h-[860px] sm:origin-top-left sm:[transform:scale(calc(var(--phone-h)/860px))] sm:rounded-[44px] sm:shadow-[0_30px_80px_-20px_rgba(11,11,20,0.25),0_8px_24px_-8px_rgba(11,11,20,0.12)] sm:ring-1 sm:ring-ink/8">
        {/* Hairline notch — only visible on desktop */}
        <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-20 items-center justify-center">
          <div className="w-[110px] h-[28px] rounded-full bg-ink/85 ring-1 ring-ink/40" />
        </div>
        <div className="phone-inner relative flex flex-col h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
