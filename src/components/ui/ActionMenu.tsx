import { motion } from "motion/react"
import type { ReactNode } from "react"
import { Sheet } from "./Sheet"
import { cn } from "@/lib/utils"

export type ActionItem = {
  label: string
  icon?: ReactNode
  hint?: string
  destructive?: boolean
  disabled?: boolean
  onSelect: () => void
}

export function ActionMenu({
  title,
  subtitle,
  items,
  onClose,
}: {
  title?: string
  subtitle?: string
  items: ActionItem[]
  onClose: () => void
}) {
  return (
    <Sheet onClose={onClose} title={title} subtitle={subtitle}>
      <div className="px-3 pb-4 pt-1">
        <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 divide-y divide-paper-3/70 overflow-hidden">
          {items.map((it, i) => (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: it.disabled ? 1 : 0.985 }}
              disabled={it.disabled}
              onClick={() => {
                if (it.disabled) return
                it.onSelect()
                onClose()
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors",
                it.disabled && "opacity-40",
                !it.disabled && "hover:bg-paper-3/40 active:bg-paper-3/60"
              )}
            >
              {it.icon && (
                <span
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                    it.destructive
                      ? "bg-ember/10 text-ember"
                      : "bg-paper ring-1 ring-paper-3 text-ink-2"
                  )}
                >
                  {it.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "text-[14.5px] font-medium",
                    it.destructive ? "text-ember" : "text-ink"
                  )}
                >
                  {it.label}
                </div>
                {it.hint && (
                  <div className="text-[12px] text-ink-3 mt-0.5">{it.hint}</div>
                )}
              </div>
              {!it.destructive && (
                <ChevronRight className="w-3 h-3 text-ink-3 flex-shrink-0" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </Sheet>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className}>
      <path
        d="M4.5 3 L7.5 6 L4.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
