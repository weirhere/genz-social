// Loop — motion vocabulary.
// Three personalities, used consistently across every animated surface.
//   SPRING_PRIMARY  — soft spring for layout pills, panels, drawers.
//   SPRING_LAYOUT   — slightly snappier spring for nav dots, layout-id pills.
//   EASE_CONTENT    — distance/opacity easing for content arrival.
// If you need a fourth, you probably need to reuse an existing one.

export const SPRING_PRIMARY = {
  type: "spring" as const,
  stiffness: 320,
  damping: 34,
}

export const SPRING_LAYOUT = {
  type: "spring" as const,
  stiffness: 340,
  damping: 30,
}

export const EASE_CONTENT = [0.2, 0.7, 0.2, 1] as const

// Standard content-arrival animation. Stagger via `delay: STAGGER * i`.
export const CONTENT_ARRIVE = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: EASE_CONTENT },
}

export const STAGGER = 0.04
