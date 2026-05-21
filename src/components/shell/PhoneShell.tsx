import type { ReactNode } from "react"

// Wraps content in a phone-shaped viewport for desktop demo.
// On small screens it falls back to full-bleed.

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="phone-shell relative w-full max-w-[400px] sm:w-[400px] sm:h-[860px] mx-auto bg-paper sm:rounded-[44px] overflow-hidden sm:shadow-[0_30px_80px_-20px_rgba(11,11,20,0.25),0_8px_24px_-8px_rgba(11,11,20,0.12)] sm:ring-1 sm:ring-ink/8 h-[100svh]">
      {/* Hairline notch — only visible on desktop */}
      <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-20 items-center justify-center">
        <div className="w-[110px] h-[28px] rounded-full bg-ink/85 ring-1 ring-ink/40" />
      </div>
      <div className="phone-inner relative flex flex-col h-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}
