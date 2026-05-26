import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Agentation } from "agentation"
import { Analytics } from "@vercel/analytics/react"
import { Landing } from "@/pages/Landing"
import { Prototype } from "@/pages/Prototype"
import { LoomPlayerProvider, type LoomVideoConfig } from "@/components/LoomPlayer"
import { LOOM_VIDEOS } from "@/data/looms"
import { AppStateProvider } from "@/state/AppState"

const VIDEOS: LoomVideoConfig[] = LOOM_VIDEOS.map(
  ({ id, embedUrl, title, thumbnailUrl, displayMode }) => ({
    id,
    embedUrl,
    title,
    thumbnailUrl,
    displayMode,
  })
)

function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <LoomPlayerProvider videos={VIDEOS} defaultActiveId="hero">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/prototype" element={<Prototype />} />
            <Route path="*" element={<Landing />} />
          </Routes>
          {import.meta.env.DEV && <Agentation />}
          <Analytics />
        </LoomPlayerProvider>
      </AppStateProvider>
    </BrowserRouter>
  )
}

export default App
