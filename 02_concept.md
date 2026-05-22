# Loop — concept

**A Gen Z news app that closes the loop instead of opening another tab.**

*Fortune 100 media brand. May 2026.*

---

## TL;DR

**Product:** Loop — a finite, ritual-based news experience for 18-26-year-olds, with an AI thinking partner woven into every story and a small-group social layer instead of a public feed.

**Tagline:** *Catch up. Not catch fire.*

**The bet:** Gen Z is exhausted, not disengaged. The winning product isn't a smarter feed — it's a finishable ritual, a credible explainer, and a way to bring news into the group chats where they actually talk.

**Three things make this monumental, not incremental:**
1. **The Daily Loop** — 7 stories, ends with a "you're caught up" moment. Anti-doomscroll by construction, not by content moderation.
2. **Margin** — an AI thinking partner that doesn't summarize at you, it thinks *with* you. Asks you questions back. Shows what's contested, what's missing, what your circles are saying.
3. **Loops** — small (3-12 person) group spaces where stories get quoted, debated, and resolved. The unit of audience is the group chat, not the public feed.

---

## Approach

### What the research told us to optimize for

From [01_research_brief.md](01_research_brief.md), four signals dominated:

- **Trust collapse + influencer trust.** 28% trust traditional media. 38% of under-30s rely on news influencers. The atomic unit of trust is a person, not a brand. So Loop never speaks as an institution; it always shows the human voice and the receipts.
- **Doomscroll exhaustion.** 53% of Gen Z doomscrolls. 81% report digital fatigue. So Loop is finite by design — the home screen has a beginning and an end.
- **Fragmentation as the lived experience.** They piece news together from TikTok, group chats, Substack, Discord. So Loop's job is *synthesis*, not aggregation — and the synthesis has to be honest about what it doesn't know.
- **Group chat as the real social network.** 90% share with group chats before posting publicly. So the social primitive is the small Loop (3-12 people), not the follower graph.

### What we explicitly did not build

- **No infinite feed.** Engagement metrics are a trap; finite engagement is the product.
- **No public timeline.** No likes, no quote-tweets, no main character of the day.
- **No AI anchor reading scripts.** Uncanny, low-trust, and the research is clear that audiences prefer humans on camera. AI in Loop is text-first and assistive.
- **No "personalization" without override.** Every recommendation is editable. Every AI claim is sourced. Every algorithm is named.

### Why this beats the field

| Product | What it nails | What Loop adds |
|---|---|---|
| Particle | AI explainer, perspective spectrum | A *social* layer (Loops) + ritual completion + AI that asks you back |
| Ground News | Bias transparency, "blindspot" | A native Gen Z aesthetic + AI as thinking partner, not just bias chart |
| Newsreel | Finite ritual, streaks | AI explainer + group chats + creator voices |
| Yahoo News | Scale, AI key points | A product Gen Z would actually open without being embarrassed |
| TikTok creators | Trust through person | Receipts, sourcing, finiteness — without losing the voice |

The wedge: *finite ritual + AI thinking partner + group-chat social*. No competitor does all three.

---

## Personas → product moves

Anchored on the three personas from research:

**Tired Olivia** opens Loop in the morning. Sees "7 stories, 6 min." She reads 3, opens Margin on one to ask "what's at stake?", screenshots the Margin reply into her group chat. Closes the app. Comes back tomorrow. Loop has built trust by *respecting her time*.

**Hot Take Marcus** is in 4 Loops with friends. He sees a story in his Daily Loop, opens it, taps "Steelman the other side" in Margin, and gets a credible counter-argument with sources. Quotes it into his Hot Takes Loop with the receipts attached. Wins the argument honestly. Comes back because Loop made him sharper.

**Quiet Aisha** has Loop set to "Industry + my city + climate." Her Daily Loop is calibrated, depth on demand. Margin connects a story about Fed policy to her startup's runway question. She trusts it because it shows its sources and tells her when it doesn't know. Loop is the only AI she trusts for news because it doesn't pretend.

---

## Product UX

### Information architecture

Four surfaces. No more.

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   TODAY     │  DISCOVER   │    LOOPS    │     ME      │
│  (Home)     │             │ (group      │             │
│             │             │  chats)     │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Margin** (the AI thinking partner) isn't a tab. It's a layer you can summon on any story, any time. That's the point — it's *integral*, not a destination.

### Screen 1 — Today (Home)

**Idea:** A finite daily Loop you can finish. A ritual, not a feed.

**Layout:**
1. **Hero greeting** — "Good morning, Olivia" + today's date + a one-line "the day in 12 words" written by the editorial team. Sets the tone.
2. **Progress dial** — "3 of 7 read · 4 min left." Quietly persistent. No streak shaming.
3. **The Loop** — 7 story cards, vertically stacked, each with:
   - Headline (display serif, big)
   - 1-2 line standfirst (sans, smaller)
   - **Source row** — outlet logos + a Margin chip showing perspective spread ("4 sources · left-leaning to centrist")
   - Read time + a single-tap Margin button
4. **From your Loops** — a small section below: "Maya quoted this in Group Chat 2 hrs ago" — friends' takes surfaced as social proof, not as a feed.
5. **You're caught up** — when all 7 are read, a celebratory moment. No "5 more stories" prompt. The Loop closes.

**Rationale:**
- The **count** (7) and the **completion state** are the product. Borrowed from Newsreel's scarcity + Spotify Wrapped's "gift" feeling.
- **Editorial framing in 12 words** is human, not AI-generated, and signals that humans are still in the loop. This is a trust gesture.
- **Margin chips on every card** show that perspective transparency is the default, not buried.
- **"From your Loops"** is the *only* social surface on Home — because friends' takes are the highest-trust signal Gen Z has.

### Screen 2 — Story + Margin

**Idea:** Every story is a starting point for thinking, not an end state.

**Layout:**
1. **Article view** — clean reader mode, big display headline, byline, sources cited inline.
2. **Bottom bar (always visible)** — "Ask Margin →" — a single tap opens the panel.
3. **Margin panel** — slides up from the bottom 60% of the screen. Inside:
   - **Smart prompts** — pre-canned questions tuned to *this* story: "What's at stake?", "Who disagrees?", "Steelman the other side", "What's missing?", "Explain it to a freshman", "Why should I care?"
   - **Free-form input** — ask anything.
   - **Margin's reply** — short, structured, sourced. Every claim has a citation chip.
   - **"Send to a Loop"** — turn the reply into a shareable card for a group chat.

**Rationale — why Margin feels native, not bolted on:**
- **Smart prompts are story-specific**, not generic. The product knows this is a Supreme Court ruling, so the prompts are about precedent, dissents, what changes. The product knows this is a market story, so prompts are about exposure, history, follow-the-money. Generic AI = bolt-on. Specific AI = native.
- **Margin asks you back.** When you ask "What's at stake?", Margin's reply ends with: *"Quick question — do you want this framed for [your industry] or for someone outside it?"* This is the "thinking partner" wedge. AI as Socratic, not as oracle.
- **Receipts are first-class UI.** Citations aren't footnotes; they're chips you can tap to jump to the source. The AI says "I don't know" out loud when sources disagree. Transparency is the product surface.
- **Margin in Loops.** When you "Send to a Loop," your friends see *your* question + Margin's answer + sources, not a pre-summarized clip. The context travels with the share. This is the Hot Take Marcus killer feature.

### Screen 3 — Discover

**Idea:** Exploration as cartography, not as endless feed.

**Layout:**
1. **Header:** "Look beyond your Loop"
2. **Topic constellations** — a 2D map of topic clusters. Each cluster is a node (politics, climate, tech, culture, sports, your city, your industry). Size = volume. A subtle pulse on clusters with new developments.
3. **Voices** — a horizontal scroll of trusted creators + journalists + ground-truth sources Loop has vetted. Each card shows their last take + a follow option.
4. **Blindspots** — a section borrowed from Ground News: *"You've been reading mostly centrist sources this week. Here's what the right and the left are saying about the same stories."* Margin generates a 3-line comparison.
5. **A few Loops you might like** — small public-ish Loops (e.g., "Tech & policy", "Your city beat") you can request to join.

**Rationale:**
- **The map metaphor** replaces the for-you feed. Discovery is *yours*, not pushed. Spatial > infinite scroll for memorability.
- **Voices are vetted, not algorithmic.** Loop's editorial team curates the pool. Trust comes from named gatekeepers.
- **Blindspots are honest about you.** "You've been reading mostly centrist sources" is direct, not preachy. The AI is your accountability buddy, not your filter bubble.

### Screen 4 — Loops (the social layer)

**Idea:** The group chat as the unit of audience.

**Layout:**
- List of your Loops (3-12 people each) — group chats with a name and an emoji-ish glyph.
- Inside a Loop: feels like iMessage, but stories drop in as rich cards with the Margin context, and you can pin "what we're tracking" at the top.
- A Loop has a vibe: structured, low-stakes. No likes. No view counts. Reactions are emoji.

**Rationale:**
- Loops are explicitly small (capped at 12) so they don't become public-feed dynamics.
- News + Margin replies enter Loops as *cards*, preserving sources. No screenshot game-of-telephone.
- Loop never broadcasts. There's no public posting surface at all. This is the most counter-intuitive product call, and it's the one that builds trust fastest with this audience.

---

## The AI-native feature: Margin

(I'm naming the deliverable here because the brief asks for *one* AI feature that feels integral. Margin is that feature, with four moves.)

**1. Smart prompts tuned to the story.**
Not generic ELI5. The product knows the story's domain (politics, markets, science, culture) and generates *contextual* questions. This is what makes the AI feel like it read the story, not a template.

**2. AI that asks you back.**
After every answer, Margin asks one short follow-up: *"Want me to compare this to the 2018 ruling?"* or *"Do you want this framed for someone outside the field?"* The thinking partner experience is in the dialogue, not the monologue.

**3. Receipts as first-class UI.**
Every Margin claim has a citation chip. Tap → source. When sources disagree, Margin says so visibly. When Margin doesn't know, Margin says "I don't know — here's what's contested."

**4. Margin in your group chat.**
The "Send to a Loop" button turns a Margin reply into a shareable card. Your friends see your question + the answer + the sources. This is the *peer* mode the research called for — Margin becomes the thing you'd send to your group chat, not the thing you'd hide using.

**Why this beats Particle's AI:**
- Particle's AI is a *content* layer (summaries, perspectives, ELI5). Margin is a *thinking* layer that's social by default. The shareability of a Margin card is the viral loop traditional AI features lack.

**Trust scaffolding (so the AI doesn't undermine the brand):**
- Margin never invents quotes.
- Margin attributes everything.
- Margin admits ignorance.
- Margin's training scope is published in-product (in Me → How Margin works).
- Editorial team reviews flagged Margin outputs weekly.

---

## Design system

The visual identity has to do three jobs at once: feel youthful and 2026, feel credible and trustworthy, and feel memorable enough to build affinity. Most news apps pick credibility and lose youth; most social apps pick youth and lose credibility. The move is to pull from editorial typography (credibility) and consumer-tech color and motion (2026).

**Palette:**
- **Paper** `#F5F0E8` — warm cream background. References newspaper without being twee.
- **Ink** `#0B0B14` — near-black with a blue cast. Reads as ink, not as Material Design grey.
- **Signal** `#6E47FF` — electric violet. The primary accent. Used sparingly: Margin moments, key CTAs, "live" indicators.
- **Ember** `#FF5C2E` — hot orange. Secondary accent for breaking/contested/new.
- **Sage** `#9BB89F` — soft green for "you're caught up" / completion moments.

**Type:**
- **Display:** Instrument Serif — for headlines, hero moments, story titles. Modern serif with personality, free, well-supported.
- **UI:** Geist Sans (or system) — clean, neutral, modern. For body, UI labels, navigation.

**Motion:**
- Soft springs (Motion library) on entry. Nothing bouncy or "iOS-y."
- Story cards lift on press, not on hover. (Touch-first.)
- Margin slides up from the bottom with a 320ms ease. Feels like a drawer, not a modal.
- "You're caught up" moment uses a subtle gradient bloom + checkmark stroke animation. Reward without being childish.

**Voice and copy:**
- Sentence case in UI ("Today", "Discover", not "TODAY", "DISCOVER").
- Editorial framing in 12 words is the only place we let the brand "talk." Everywhere else: spare, specific, low-key.
- Margin's voice is the smart friend, not the assistant. No "I'd be happy to help!" — just answers, with sources.

---

## Success measures (what we'd ship and watch)

The brief asked how the design maps to the brand's standard. Here's how we'd measure whether Loop is working:

**Retention without engagement extraction:**
- D30 retention > 35% (vs. Artifact's struggle here)
- *No* attempt to maximize sessions/day. The goal is *complete the Loop*.

**Trust velocity:**
- "I trust Loop more than my main news source" — survey item, 60% within 90 days.
- Margin reply share rate (sent to Loop or off-platform) — proxy for "would send to a friend." Target 25%+ of Margin sessions.

**The social wedge:**
- % of users in ≥1 Loop within 14 days. Target: 50%.
- Cross-Loop story citations — does news travel across Loops? Network effect proxy.

**The AI signal:**
- Margin sessions/active user/week. We expect 4-7. Not 50.
- "Margin asked me a good question this week" — survey item, 70% agreement.

---

## What's in the prototype

This repo contains a working React prototype of:
1. **Today (Home)** — the Daily Loop with 7 stories, progress, friends' takes, completion state.
2. **Story + Margin** — a story view with the AI panel demonstrating smart prompts, receipts, and "send to Loop."
3. **Discover** — topic constellations, voices, blindspots.
4. **Loops** — a small-group chat view showing how stories travel.

Built with React 19, Vite, Tailwind v4, shadcn/ui, Motion. All decisions documented inline.
