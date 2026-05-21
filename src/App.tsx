import { motion } from "motion/react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Ready to build.
        </h1>
        <p className="text-muted-foreground max-w-md text-center">
          Vite + React + TypeScript + Tailwind v4 + shadcn/ui + Motion.
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button size="lg">
            <Sparkles />
            Get started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
