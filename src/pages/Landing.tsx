import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowUpRight, ArrowRight, Play, FileText, Palette } from "lucide-react"
import { LoomHeroSlot } from "@/components/LoomPlayer"

const LOOMS = [
  {
    label: "Part 1",
    title: "Research to scaffolded concept",
    duration: "~7 min",
    blurb:
      "Framing the brief, running user research, and standing up the React prototype.",
    embed: "https://www.loom.com/embed/5bb659a1ce3e4f0ca3531227c816b9da",
    href: "https://www.loom.com/share/5bb659a1ce3e4f0ca3531227c816b9da",
  },
  {
    label: "Part 2",
    title: "Review, critique, design system",
    duration: "~10 min",
    blurb:
      "First reaction to the build, a design critique pass, and bootstrapping the Figma design system from the code.",
    embed: "https://www.loom.com/embed/5993800c2a7148c0be252922e2e90273",
    href: "https://www.loom.com/share/5993800c2a7148c0be252922e2e90273",
  },
  {
    label: "Part 3",
    title: "Simulated usability test, fixes, Figma handoff",
    duration: "~12 min",
    blurb:
      "Running a persona-driven usability simulation, shipping the top P1 fixes live, and pulling all four core screens into Figma with Agentation feedback.",
    embed: "https://www.loom.com/embed/ee0e2f4ba80b497eb2e748732a109a97",
    href: "https://www.loom.com/share/ee0e2f4ba80b497eb2e748732a109a97",
  },
] as const

const BETS: { n: string; title: string; body: React.ReactNode }[] = [
  {
    n: "01",
    title: "The Daily Loop",
    body: "7 stories, ends with a “you're caught up” moment. Anti-doomscroll by construction, not by content moderation.",
  },
  {
    n: "02",
    title: "Margin",
    body: (
      <>
        An AI thinking partner that doesn't summarize{" "}
        <em className="font-display italic text-ink">at</em> you — it thinks{" "}
        <em className="font-display italic text-ink">with</em> you. Asks questions back, shows
        what's contested.
      </>
    ),
  },
  {
    n: "03",
    title: "Loops",
    body: "Small (3–12 person) group spaces where stories get quoted and debated. The unit of audience is the group chat, not the public feed.",
  },
]

export function Landing() {
  return (
    <div className="min-h-svh w-full bg-paper text-ink relative overflow-x-hidden">
      <TopBar />
      <Hero />
      <BetsSection />
      <WatchSection />
      <ReadSection />
      <DesignSystemSection />
      <Footer />
    </div>
  )
}

function TopBar() {
  return (
    <div className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md border-b border-paper-3/60">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9" stroke="var(--ink)" strokeWidth="2.4" />
          </svg>
          <span className="font-display text-[20px] tracking-tight leading-none">Loop</span>
        </div>
        <Link
          to="/prototype"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3.5 py-1.5 rounded-full bg-ink text-paper hover:bg-signal transition-colors"
        >
          Try the prototype
          <ArrowRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-6 sm:mb-8">
          LCA × Fortune 100 media brand · 2026 concept
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display text-balance text-[44px] leading-[1.02] sm:text-[72px] sm:leading-[0.98] tracking-tight"
        >
          A Gen Z news app that closes the loop instead of opening another tab.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-6 sm:mt-8 max-w-2xl text-[16px] sm:text-[18px] leading-[1.55] text-ink-2 text-pretty"
        >
          Gen Z is exhausted, not disengaged. <span className="text-ink">Loop</span> is a
          finite, ritual-based news experience for 18–26-year-olds — with an AI thinking
          partner woven into every story and a small-group social layer instead of a public feed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-9 sm:mt-12 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/prototype"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-paper text-[14px] font-medium hover:bg-signal transition-colors"
          >
            Try the prototype
            <ArrowRight
              size={16}
              strokeWidth={2.2}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
          <a
            href="#watch"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-paper-2 ring-1 ring-paper-3 text-[14px] font-medium hover:bg-paper-3/60 transition-colors"
          >
            <Play size={14} strokeWidth={2.2} />
            Watch the walkthroughs
          </a>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-ink-3">
            <span className="text-signal">The pitch</span>
            <span className="opacity-40">·</span>
            <span>10 min</span>
          </div>
          <div className="hidden sm:block text-[12px] text-ink-3">
            Auto-collapses to picture-in-picture so you can keep watching while you click around.
          </div>
        </div>
        <LoomHeroSlot />
      </div>
    </section>
  )
}

function BetsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
      <SectionLabel>The bet</SectionLabel>
      <h2 className="font-display text-[32px] sm:text-[40px] leading-[1.05] tracking-tight max-w-3xl text-balance">
        Three things make this monumental, not incremental.
      </h2>
      <div className="mt-10 sm:mt-12 grid sm:grid-cols-3 gap-4 sm:gap-5">
        {BETS.map((b) => (
          <article
            key={b.n}
            className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-6 sm:p-7 flex flex-col"
          >
            <div className="tabular text-[11px] tracking-[0.2em] text-signal mb-4">{b.n}</div>
            <h3 className="font-display text-[24px] leading-tight tracking-tight mb-3">
              {b.title}
            </h3>
            <p className="text-[14px] leading-[1.6] text-ink-2 text-pretty">{b.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function WatchSection() {
  return (
    <section id="watch" className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-20 scroll-mt-16">
      <SectionLabel>Watch first</SectionLabel>
      <h2 className="font-display text-[32px] sm:text-[40px] leading-[1.05] tracking-tight max-w-3xl text-balance">
        Three Looms — a real-time view of the process, not a polished demo.
      </h2>

      <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {LOOMS.map((l) => (
          <article key={l.embed} className="flex flex-col">
            <div className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-paper-3/70 bg-ink">
              <iframe
                src={l.embed}
                title={l.title}
                allow="fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="tabular text-[11px] tracking-[0.18em] text-signal uppercase">
                {l.label}
              </span>
              <span className="tabular text-[11px] text-ink-3">{l.duration}</span>
            </div>
            <h3 className="mt-1 font-display text-[22px] leading-tight tracking-tight">
              {l.title}
            </h3>
            <p className="mt-2 text-[14px] leading-[1.55] text-ink-2 text-pretty">{l.blurb}</p>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-2 hover:text-signal transition-colors w-fit"
            >
              Open in Loom
              <ArrowUpRight size={13} strokeWidth={2.2} />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function ReadSection() {
  const docs = [
    {
      n: "01",
      title: "Research brief",
      blurb:
        "What Gen Z actually does with news. Trust collapse, doomscroll fatigue, group-chat-as-network, three personas.",
      href: "https://github.com/weirhere/genz-social/blob/concept/01_research_brief.md",
      time: "~10 min read",
    },
    {
      n: "02",
      title: "Concept + UX rationale",
      blurb:
        "The product bet, the three monumental moves, personas → product, design system rationale, what we explicitly did not build.",
      href: "https://github.com/weirhere/genz-social/blob/concept/02_concept.md",
      time: "~12 min read",
    },
  ]

  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
      <SectionLabel>Read the work</SectionLabel>
      <h2 className="font-display text-[32px] sm:text-[40px] leading-[1.05] tracking-tight max-w-3xl text-balance">
        The thinking, in two short documents.
      </h2>

      <div className="mt-10 sm:mt-12 grid md:grid-cols-2 gap-4 sm:gap-5">
        {docs.map((d) => (
          <a
            key={d.n}
            href={d.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-6 sm:p-7 hover:ring-signal/60 hover:bg-paper transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="tabular text-[11px] tracking-[0.2em] text-signal">{d.n}</span>
                <FileText size={15} strokeWidth={1.8} className="text-ink-3" />
              </div>
              <ArrowUpRight
                size={18}
                strokeWidth={1.8}
                className="text-ink-3 group-hover:text-signal group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
              />
            </div>
            <h3 className="mt-5 font-display text-[26px] leading-tight tracking-tight">
              {d.title}
            </h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-ink-2 text-pretty">{d.blurb}</p>
            <div className="mt-5 text-[11px] tracking-wider uppercase text-ink-3">{d.time}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

function DesignSystemSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
      <div className="rounded-3xl bg-ink text-paper p-8 sm:p-12 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--signal)" }}
        />
        <div className="relative">
          <div className="text-[11px] tracking-[0.22em] uppercase text-paper/60 mb-4">
            Design system
          </div>
          <h2 className="font-display text-[32px] sm:text-[40px] leading-[1.05] tracking-tight text-balance max-w-2xl">
            Paper, ink, and a single electric violet — tokens live in Figma.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-[1.55] text-paper/75 text-pretty">
            Primitives and semantic variables, type styles, spacing, and radii — built from the
            code, not bolted on after.
          </p>
          <a
            href="https://www.figma.com/design/a5zdBghjOuSxbF4Bytn15v/Loop-Design-System?node-id=0-1&t=P6wwdZX2gxRVgFsu-1"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-paper text-ink text-[14px] font-medium hover:bg-signal hover:text-paper transition-colors"
          >
            <Palette size={15} strokeWidth={2} />
            Open the Figma file
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <div className="rounded-2xl bg-paper-2 ring-1 ring-paper-3/70 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="font-display text-[22px] leading-tight tracking-tight">
            Ready to try it?
          </div>
          <p className="mt-1 text-[13px] text-ink-2">
            4-screen interactive prototype. ~2 minutes to walk through.
          </p>
        </div>
        <Link
          to="/prototype"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-paper text-[14px] font-medium hover:bg-signal transition-colors"
        >
          Open the prototype
          <ArrowRight size={16} strokeWidth={2.2} />
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-3">
        <div className="flex items-center gap-2">
          <span>Loop</span>
          <span className="opacity-40">·</span>
          <span>LCA × Fortune 100 · 2026 concept</span>
        </div>
        <a
          href="https://github.com/weirhere/genz-social"
          target="_blank"
          rel="noreferrer"
          className="hover:text-ink transition-colors inline-flex items-center gap-1.5"
        >
          Source on GitHub
          <ArrowUpRight size={12} strokeWidth={2.2} />
        </a>
      </div>
    </footer>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-4">{children}</div>
  )
}
