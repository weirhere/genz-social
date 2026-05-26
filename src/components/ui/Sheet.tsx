import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Sheet({
  onClose,
  title,
  subtitle,
  children,
  height = "auto",
  maxHeightPct = 78,
}: {
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  /** "auto" hugs content; or pass a fixed % string like "78%". */
  height?: "auto" | string
  /** Cap on content area when height is "auto". */
  maxHeightPct?: number
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-30 bg-ink/35 backdrop-blur-[2px]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.06}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 500) onClose()
        }}
        className={cn(
          "absolute inset-x-0 bottom-0 z-40 bg-paper rounded-t-[28px] ring-1 ring-paper-3 shadow-[0_-20px_60px_-10px_rgba(11,11,20,0.25)] overflow-hidden flex flex-col"
        )}
        style={
          height === "auto"
            ? { maxHeight: `${maxHeightPct}%` }
            : { height }
        }
      >
        <DragHandle />
        {(title || subtitle) && (
          <div className="px-5 pt-1 pb-3">
            {title && (
              <div className="font-display text-[20px] tracking-tight text-ink leading-tight">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-[12.5px] text-ink-3 mt-1 text-pretty">
                {subtitle}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    </>
  )
}

function DragHandle() {
  return <div className="w-9 h-1 rounded-full bg-paper-3 mx-auto mt-3 mb-2" />
}
