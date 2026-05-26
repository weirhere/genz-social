import { AnimatePresence, motion } from "motion/react"
import { useAppState } from "@/state/AppState"

export function ToastViewport() {
  const { currentToast } = useAppState()
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <AnimatePresence>
        {currentToast && (
          <motion.div
            key={currentToast.id}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="pointer-events-auto rounded-full bg-ink text-paper text-[13px] font-medium px-4 py-2.5 shadow-[0_12px_30px_-10px_rgba(11,11,20,0.5)] ring-1 ring-ink/10"
          >
            {currentToast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
