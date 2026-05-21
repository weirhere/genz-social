// Faux iOS-style status bar inside the phone frame.
// Minimal 2026 vibe — time + tiny indicators.

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[13px] font-medium tabular text-ink">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalDots />
        <WifiGlyph />
        <BatteryGlyph />
      </div>
    </div>
  )
}

function SignalDots() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
      <rect x="0" y="6" width="3" height="4" rx="0.5" fill="currentColor" />
      <rect x="5" y="4" width="3" height="6" rx="0.5" fill="currentColor" />
      <rect x="10" y="2" width="3" height="8" rx="0.5" fill="currentColor" />
      <rect x="15" y="0" width="3" height="10" rx="0.5" fill="currentColor" />
    </svg>
  )
}

function WifiGlyph() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
      <path
        d="M7.5 9.5 a1.2 1.2 0 1 1 0-2.4 a1.2 1.2 0 0 1 0 2.4z"
        fill="currentColor"
      />
      <path
        d="M2.8 5.4 C4.1 4.1 5.7 3.4 7.5 3.4 C9.3 3.4 10.9 4.1 12.2 5.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M0.7 3.3 C2.6 1.4 4.9 0.5 7.5 0.5 C10.1 0.5 12.4 1.4 14.3 3.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BatteryGlyph() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
      <rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" fillOpacity="0.4" />
    </svg>
  )
}
