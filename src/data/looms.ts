// Single source of truth for the four walkthrough Looms — the hero on the
// landing page plus the three "Watch first" parts. App.tsx feeds the IDs and
// embed URLs to the LoomPlayer; Landing.tsx pulls the display metadata for
// the three sub-video tiles.

export type LoomEntry = {
  id: string
  embedUrl: string
  shareUrl: string
  // Loom poster frame shown in the slot before playback. Sourced from Loom's
  // oEmbed thumbnail_url (the hash suffix isn't derivable, so it's stored).
  thumbnailUrl: string
  title: string
  // How this video presents when expanded (i.e. not in PiP).
  // - "hero": fills its inline hero slot in the landing layout.
  // - "modal": centered overlay with a backdrop so detail is legible even
  //   though the inline slot is small.
  displayMode: "hero" | "modal"
}

export type LoomSubEntry = LoomEntry & {
  label: string
  duration: string
  blurb: string
}

export const HERO_LOOM: LoomSubEntry = {
  id: "hero",
  label: "The pitch",
  title: "Anti-Doomscrolling App",
  duration: "~2 min",
  blurb:
    "The 2-minute overview of Loop — the bet, the three monumental moves, and why this matters now.",
  embedUrl: "https://www.loom.com/embed/5b2c436ddc874cc08b1282ef5431e4a1",
  shareUrl: "https://www.loom.com/share/5b2c436ddc874cc08b1282ef5431e4a1",
  thumbnailUrl:
    "https://cdn.loom.com/sessions/thumbnails/5b2c436ddc874cc08b1282ef5431e4a1-89cf7ab310683e52.gif",
  displayMode: "hero",
}

export const SUB_LOOMS: readonly LoomSubEntry[] = [
  {
    id: "part-1",
    label: "Part 1",
    title: "Research to scaffolded concept",
    duration: "~4 min",
    blurb:
      "Framing the brief, running user research, and standing up the React prototype.",
    embedUrl: "https://www.loom.com/embed/5bb659a1ce3e4f0ca3531227c816b9da",
    shareUrl: "https://www.loom.com/share/5bb659a1ce3e4f0ca3531227c816b9da",
    thumbnailUrl:
      "https://cdn.loom.com/sessions/thumbnails/5bb659a1ce3e4f0ca3531227c816b9da-1e0c76fbfb512b84.jpg",
    displayMode: "modal",
  },
  {
    id: "part-2",
    label: "Part 2",
    title: "Review, critique, design system",
    duration: "~7 min",
    blurb:
      "First reaction to the build, a design critique pass, and bootstrapping the Figma design system from the code.",
    embedUrl: "https://www.loom.com/embed/5993800c2a7148c0be252922e2e90273",
    shareUrl: "https://www.loom.com/share/5993800c2a7148c0be252922e2e90273",
    thumbnailUrl:
      "https://cdn.loom.com/sessions/thumbnails/5993800c2a7148c0be252922e2e90273-4a19f0b83f6e791e.jpg",
    displayMode: "modal",
  },
  {
    id: "part-3",
    label: "Part 3",
    title: "Simulated usability test, fixes, Figma handoff",
    duration: "~9 min",
    blurb:
      "Running a persona-driven usability simulation, shipping the top P1 fixes live, and pulling all four core screens into Figma with Agentation feedback.",
    embedUrl: "https://www.loom.com/embed/ee0e2f4ba80b497eb2e748732a109a97",
    shareUrl: "https://www.loom.com/share/ee0e2f4ba80b497eb2e748732a109a97",
    thumbnailUrl:
      "https://cdn.loom.com/sessions/thumbnails/ee0e2f4ba80b497eb2e748732a109a97-0185ae65cf8f5d1a.jpg",
    displayMode: "modal",
  },
] as const

export const LOOM_VIDEOS: readonly LoomEntry[] = [HERO_LOOM, ...SUB_LOOMS]

// All four walkthroughs in the order viewers should encounter them. Used
// by the prototype sidecar so they can switch videos without going back
// to the landing page.
export const ALL_LOOMS: readonly LoomSubEntry[] = [HERO_LOOM, ...SUB_LOOMS]
