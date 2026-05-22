import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Agentation } from "agentation"
import { Analytics } from "@vercel/analytics/react"
import { Landing } from "@/pages/Landing"
import { Prototype } from "@/pages/Prototype"
import { LoomPlayerProvider } from "@/components/LoomPlayer"

const WALKTHROUGH_EMBED =
  "https://www.loom.com/embed/51fbce856eeb42788dba813d71b9d517"

function App() {
  return (
    <BrowserRouter>
      <LoomPlayerProvider embedUrl={WALKTHROUGH_EMBED}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/prototype" element={<Prototype />} />
          <Route path="*" element={<Landing />} />
        </Routes>
        {import.meta.env.DEV && <Agentation />}
        <Analytics />
      </LoomPlayerProvider>
    </BrowserRouter>
  )
}

export default App
