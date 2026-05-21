# Loop — simulated usability findings

**Method:** Simulated moderated usability test. Three personas from the research brief (Tired Olivia, Hot Take Marcus, Quiet Aisha) walked through 5 task scenarios each in the live prototype at iPhone 14 Pro Max viewport (430×932). Findings combine direct interaction in the prototype (Today, Story, Margin prompt list — captured visually) and structural walkthrough of the Discover, Loops, and Me screens against the rendered component code.

**Caveats this is not.** No real users were tested. The personas are research-anchored sketches, not interviews. Treat severity ratings as design priorities, not statistical claims. The findings worth weighting hardest are those where *multiple personas independently hit the same friction*, not single-persona reactions.

---

## TL;DR

**What's working.** The core wedge — finite ritual + AI thinking partner + small-group social — reads correctly at first glance for all three personas. The Today screen feels like a ritual within 5 seconds. Margin's "I just read this story too" greeting plus a *Margin's pick* highlight is a small, specific design move that lands: it tells the user the AI is contextual, not generic, without removing their agency. Source-lean dots ship trust into peripheral vision. The "From your Loops" pattern is a quiet, defensible answer to "where's the social layer?" without becoming a feed.

**The five biggest friction points** — ranked by how many personas hit them and how load-bearing each is to the concept:

1. **The 12-word editor's brief is too clever for the audience that needs it most.** Olivia (low context) can't decode "Senate haggles over one word" without already knowing the AI bill exists. The trust gesture (humans wrote this) lands; the comprehension gesture doesn't. *P1, hits Olivia + Aisha.*
2. **"27 min" reads as a *lot* of news to someone with news avoidance.** The Loop is sized for the median user, not the exhausted one. The product positions itself as "respect your time" but the headline number doesn't reinforce it. *P1, hits Olivia hardest.*
3. **No visible way to send Margin into an existing group chat outside the app.** Marcus's whole job is winning arguments *in his existing group chats*. "Send to a Loop" assumes the friends he wants to argue with are already on Loop. *P1, hits Marcus, threatens viral loop.*
4. **Margin's ask-back is great in concept but easy to miss.** It renders as a small violet card below the answer. The Socratic-partner mechanic is the AI-native differentiator vs. Particle, but it's currently a footnote in the layout. *P2, hits all three.*
5. **Calibration in Me is a flat list, not a moment.** Aisha's whole reason to use Loop is that it learns *her* — industry, city, communities. The Me screen has a CalibrationRow for "Tone" and "Story count" but no place to set her actual interests. The personalization promise from the concept ("calibrated to Industry + my city + climate") is unbuilt. *P1, threatens Aisha's entire JTBD.*

The rest of the issues are smaller — copy nits, affordance gaps, missing states. Detailed list at the bottom.

---

## Personas, tasks, and what happened

### Tired Olivia — 22, college senior, news avoider

**JTBD:** Stay current without feeling consumed.

**Task O1 — First open, "what is this?"**

What happened: hero "Morning, Olivia." in display serif lands warm. Reads as a newspaper greeting, not a feed. Eyes go to the "THE DAY IN 12 WORDS" ink card next.

What she'd say: *"Wait, who wrote this? Oh — 'Loop editorial · 6:00 AM,' okay, real humans. That's chill."* Then she reads the 12 words: *"The Senate haggles over one word. California is underwater. Argentina, somehow, is winning."* Pause. *"What's the Senate thing? I don't know what bill. And what's happening in Argentina?"*

> **Finding #1 — the 12-word brief assumes more context than this persona has.** The brief is editorial flex — a haiku. It works as a tone signal ("humans wrote this, with personality"). It fails as a comprehension signal ("here's what's in today's Loop"). For a news-avoider, the cleverness reads as *I am being talked over.* The trust gesture survives; the orientation gesture doesn't.
>
> **Severity:** P1. The 12-word brief is one of three things on screen 1.
> **Fix direction:** Either keep the haiku as-is and add a 1-line subtitle ("3 stories on AI, 2 on your city, plus a peso plan and a movie") — or rewrite the brief itself to do both jobs (e.g., *"The AI bill stalls on one word. Bay Area is flooding. Argentina is somehow winning the peso war."* — proper nouns help). Honest preference: rewrite the brief; the subtitle is hedging.

**Task O2 — Read one story end-to-end.**

She taps the Bay Area atmospheric river story (3 min, local). The transition is clean. The source rail above the body is the standout — four source dots, all centrist, lean labels visible. She doesn't engage with it deeply but the *presence* of it as decoration calms her ("they're showing their work").

> **Finding #2 — the source rail is doing trust work even when not read.** Strong move. Borderline more important as a visual signature than as an interactive surface.

> **Finding #3 — "Mark as read" is a footer text link, requires scrolling past body.** Olivia reads the 3 paragraphs, hits the Margin dock, and never sees the Mark-as-read link. The system marks the story read on open already (see Prototype.tsx:openStory), so the explicit link is redundant *and* confusing — implies the auto-mark might not have worked.
>
> **Severity:** P3. Cosmetic.
> **Fix direction:** Either remove the Mark-as-read link entirely, or upgrade it to a *"You're done with this one"* affordance with a back-to-Loop secondary action.

**Task O3 — Use Margin once.**

She taps the bottom dock ("Ask Margin about this · Is this storm unusual? · What should I do about power outages?"). The panel slides up. The greeting *"I just read this story too. What do you want to figure out?"* is a small line doing big work — Olivia smiles. The four prompts:

1. Is this storm unusual? *(Margin's pick — highlighted)*
2. What should I do about power outages?
3. Why does PG&E always say 36 hours?
4. What's the climate context?

She taps the practical one — *What should I do about power outages?* — not Margin's pick.

> **Finding #4 — "Margin's pick" highlight is good. The non-pick prompts feel slightly diminished as a result.** When the violet pill says "Margin's pick" next to option 1, options 2-4 can read as "the other ones." Olivia picks the practical one anyway, but it requires a small assertion ("I know what I want") that a more passive user might not make.
>
> **Severity:** P3. Risk is low because the bar to override is one tap, not a setting.
> **Fix direction:** Consider whether *every* story needs a pick, or only some. If the AI doesn't have a strong preference, don't fake one.

> **Finding #5 — prompt copy "Why does PG&E always say 36 hours?" is the funniest line in the app.** Keep it. This is exactly the "smart friend, not assistant" voice the concept asked for. The risk is consistency — make sure the voice holds in production, not just the demo.

She gets the answer (per the prototype's seeded reply): a structured 2-paragraph response with citation chips ("[1] SF Chronicle", "[2] KQED"). The ask-back: *"Want me to pull up a map of where the outages are right now?"*

> **Finding #6 — the ask-back is the differentiator and it's underweighted in the layout.** The ask-back card is a small violet pill below the answer with the label "Margin asked back." It works once you see it. The issue is that Olivia's eyes go to the bigger action pills below ("Send to a Loop · Save · New question") and she's done before she registers it.
>
> **Severity:** P2 — concept-critical.
> **Fix direction:** Treat the ask-back as a *conversational turn*, not a card. Either: (a) render it as a quoted question above the action pills with a subtle "Margin asked back →" prefix and a tappable affordance, or (b) make the ask-back a tappable chip that becomes the next user turn ("Yes, show me" / "Not now"). The Socratic loop is the wedge — make it loud.

**Task O4 — Find out how much is left.**

The progress dial near the top updates. The "you're caught up" ghost preview at the bottom is a great touch (literally shows her the horizon).

> **Finding #7 — the CaughtUpGhost component is one of the most thoughtful design moves in the prototype.** A half-opacity preview of the celebration state, visible *from the start*, is a small ritual cue. Olivia knows where the end is. Newsreel's scarcity model gets credit in the brief; this preview is a Loop-specific extension worth highlighting in the writeup.

**Task O5 — Reduce volume (settings/calibration).**

She taps Me. Sees: profile card, "Calibrate my Loop" (3 rows: Story count, Drop time, Tone), Margin trust explainer, Receipts, Editorial team. She wants to set "5 stories instead of 7" and possibly disable the local Bay Area pings.

> **Finding #8 — story count is configurable (5/7/10/12) but not actionable in the prototype.** This isn't a usability finding per se — the row is a `<div>`, not a real control. Note it as a build-out gap, not a UX flaw.

> **Finding #9 — no way to filter or mute topics in Me.** Olivia's research-implied behavior is *muting keywords* on Threads. There's no equivalent here. Particle and Yahoo both let you block topics/publishers. Loop's anti-doomscroll wedge implies the user can shape *what counts as their Loop*.
>
> **Severity:** P2.
> **Fix direction:** Add a "Topics I want less of" calibration row, even just as an opt-out chip set. Pairs with the existing positive-calibration story.

---

### Hot Take Marcus — 19, freshman, argues for fun

**JTBD:** Have something credible to say in a group chat.

**Task M1 — Find AI-bill ammo.**

The AI bill story is first in the Loop. Standfirst is great: *"Bipartisan support held — until the definition of 'foundation model' came up."* Source spread chip: *"5 sources · center-left to center-right."*

> **Finding #10 — the perspective-spread chip is a Marcus magnet.** "5 sources · center-left to center-right" is exactly the credibility signal he needs. The chip itself is doing the work that Ground News has built a brand around. Keep prominent.

The friend take below ("Maya in Tech & policy · the parameter-count thing is going to age so badly") attached to the same story is excellent product surface. Marcus sees Maya's take *before* he opens the story and now has a hook ("Maya already thinks this; I want to know if she's right").

> **Finding #11 — the From-your-Loops pattern works because it surfaces *the take*, not the share count.** This is the explicit difference from a public feed. Maya's snippet ("the parameter-count thing is going to age so badly") is opinion, not engagement metric. Strong.

**Task M2 — Steelman the other side.**

He opens the AI story, hits Margin. The prompts:

1. What's at stake? *(Margin's pick)*
2. Steelman the other side
3. What's missing from this story?
4. Explain it to a college freshman
5. Why should I care?

He picks *Steelman the other side.* This is the headline AI feature for him.

The answer comes back. Strong. Citations attached. The ask-back: *"Want me to compare this to the EU AI Act fight, or pull up how each Senator has voted on tech regulation before?"* — Marcus would tap both.

> **Finding #12 — "Steelman the other side" + ask-back is Marcus's product-market fit moment.** The combination of (a) credible counter-argument, (b) sources he can verify, and (c) an offer for deeper context is exactly what he's currently doing manually across Perplexity + Ground News + Bluesky. If anything works in this prototype, it's this loop. Lean into it in the demo.

**Task M3 — Send a Margin reply to a Loop.**

He hits "Send to a Loop." (Code: visible as a primary violet pill in Margin answer state — `<ActionPill primary>Send to a Loop</ActionPill>`.) The prototype doesn't carry through to a "pick which Loop" UI in the build, but the affordance is clear.

> **Finding #13 — "Send to a Loop" is the right primary action, but Marcus's actual workflow is "send to my iMessage group with people who aren't on Loop yet."** This is the viral loop / cold-start question. Loop's social layer assumes friends are already in your Loops. Marcus's real-world need is to *quote a Margin reply into iMessage* — where the friend he wants to argue with currently lives.
>
> **Severity:** P1 — affects acquisition + virality, not just usability.
> **Fix direction:** Add a secondary share affordance ("Share outside Loop") that creates a clean iMessage-shaped card with the question, the answer (truncated), sources, and a "made on Loop · loop.app/m/xyz" footer. This is the *peer mode* the research called for and the only mechanism by which Loop spreads outside its own walls.

**Task M4 — Find his blindspot.**

He taps Discover. Sees the topic constellation map. He scrolls past Voices to the Blindspot card: *"You've been reading mostly centrist sources this week. Here's how the same three stories are getting framed at the edges."* Two framing cards: "Regulatory-capture lens" (left) and "Picking-winners lens" (right).

> **Finding #14 — the Blindspot card is conceptually right and visually under-built.** Only one Blindspot in the dataset, and it only covers the AI bill. For Marcus to trust this section as a regular habit, he needs to see *multiple* blindspots, and the framings need to be obviously his — *"You've been reading mostly centrist sources"* is great as a baseline but he'd want *"You've been heavy on tech, light on healthcare this week."*
>
> **Severity:** P2 for the demo; P1 for production.
> **Fix direction:** In the prototype, ship two more blindspots to communicate the breadth. In production, the personalization needs to surface *which* of his reading habits the blindspot is calling out.

**Task M5 — Find new creators.**

The Voices carousel shows V Spehar, Cleo Abram, Kyla Scanlon, Carlos Maza, Jemele Hill. Each card has: name, handle, beat, follower count, "Vetted by Loop editorial," n friends follow, latest take, Follow button.

> **Finding #15 — "Vetted by Loop editorial" + "n friends follow" is a strong dual-signal that beats algorithmic for-you.** Marcus sees Kyla Scanlon has 14 friends following. That's a much louder signal for him than her follower count.

> **Finding #16 — the Voices carousel renders only 5 creators. Marcus would want a deeper bench, fast.** Discover is the cold-start surface; sparseness here implies the editorial team isn't doing their job. Add a "see all" route or a deeper carousel.

---

### Quiet Aisha — 26, PM, suspicious of AI, daily ChatGPT user

**JTBD:** Make sense of what's happening.

**Task A1 — Form a take on the AI bill.**

Aisha sees the AI bill story in Today. The 5 min read-time is fine — she has 20 in the morning. She opens the story.

> **Finding #17 — the story body itself is short.** Four paragraphs, ~250 words. Aisha is used to The Daily (20+ min audio) and longer NYT pieces. The Loop story feels like a *summary*, not a piece. That's by design — Margin is where depth lives — but if Aisha doesn't open Margin, she leaves with a thin understanding.
>
> **Severity:** P2 — concept question more than usability bug.
> **Fix direction:** Either commit to "the story is the appetizer, Margin is the meal" and make Margin's affordance louder (it already is the AskMarginDock), or add a "Read deeper" option to each story that links out to the original sources without leaving Loop.

**Task A2 — Verify Margin's trustworthiness.**

She opens Margin. The greeting line, the citation chips, the "Margin is tuned to this story specifically — prompts change per article. Receipts on every answer. Says 'I don't know' out loud." footer all do their work. She'd then go to Me → How Margin Works to read the methodology.

> **Finding #18 — the "How Margin works" card in Me is the trust receipts page, and it's well-named.** Four bullet promises (sources linked, admits ignorance, text-first/no AI anchors, training scope published) are exactly the language an AI-skeptical user wants to see. The "Read Margin's full receipts →" link implies a deeper doc.

> **Finding #19 — citation chips need to be tappable, or the trust play is theater.** Code shows citation chips render as `<span>` with the source name (e.g., `[1] NYT`). For Aisha — who *will* spot-check — those need to be tappable links (even if just to a source-overview modal, since the prototype isn't shipping real articles).
>
> **Severity:** P1 for the trust contract.
> **Fix direction:** Make citation chips tappable. Tapping opens a source detail panel: outlet, lean, the specific quote/passage Margin used. Until they're tappable, "receipts on every answer" reads as marketing copy.

**Task A3 — Calibrate to her interests.**

She taps Me, looking for a way to tell Loop she cares about *fintech, SF, and climate*. Sees: Story count, Drop time, Tone. No topic calibration.

> **Finding #20 — Aisha's entire JTBD relies on Loop knowing her interests, and the Me screen doesn't let her tell it.** Her persona literally says *"set to Industry + my city + climate"* in the concept doc. The screen doesn't surface this. The Calibration section needs an interests row at minimum.
>
> **Severity:** P1 — concept-promise gap.
> **Fix direction:** Add a "What you care about" row in Calibrate my Loop. Pre-populated with editable chips: Industry, City, plus 3-5 inferred topics. Onboarding can set initial values; Me lets her revise. This is the Aisha killer feature.

**Task A4 — Connect the Argentina story to her startup runway question.**

She opens the Milei/peso story. Reads. Opens Margin. The prompts include "What's the bear case?" — *(Margin's pick)*. She'd want a prompt like "What does this mean for [my industry]?" or "How does this affect dollar-denominated debt?"

> **Finding #21 — Margin's prompts are story-specific (great) but not yet user-specific (the next bar).** The concept says *"Margin connects a story about Fed policy to her startup's runway question."* The prototype's prompts are generic-clever, not personalized. This is fine for the demo; it's a flag for the production pitch.

**Task A5 — Confirm who's picking stories.**

She taps Me. Sees the "Built by people" card: *"Eight humans pick what makes the Loop. An editorial team of eight in New York and Mexico City decides the 7 stories every day. Margin reads alongside them — never instead of them."* Editor initials. "Meet the team →"

> **Finding #22 — the "Built by people" card is the single most important trust gesture in the app for Aisha.** Promote it. Right now it's below Receipts. For an AI-suspicious user, the editorial provenance card should be one of the *first* things she sees in Me, not the fifth. Consider also: a smaller version near Today's editor's brief ("Today's 7 picked by Rena and Jules") would unify the gesture.

---

## Cross-persona themes

### Theme A — The Margin "ask-back" is the wedge, and it's currently a footnote.

The whole concept-doc claim against Particle is that Margin is *Socratic*, not extractive. Three personas, three different reactions to the same answer — but none of them gave the ask-back the weight it deserves in current layout. **This is the single highest-leverage layout fix:** raise the ask-back into the conversation flow as a follow-up that demands a tap (yes/no/show me), not a footer card.

### Theme B — The personalization promise outruns the personalization surface.

Aisha and Marcus both need Loop to know *who they are.* The Me screen has Tone, Story count, Drop time — none of which are the *content* dimensions. Topics, industries, location, and "less of this" are missing. The concept doc promises this; the prototype doesn't deliver it. Cheapest, highest-impact build: a chip-based interests row.

### Theme C — Trust is shown in static design; it needs interactive proof.

Source-lean dots, the "Built by people" card, the "How Margin Works" page — all good. But the citation chips don't link to sources, the "Meet the team" doesn't open a team page, the "Read Margin's full receipts" link doesn't go anywhere. Even one of those becoming clickable would dramatically harden the trust posture. Pick the citation chips first; they appear most often.

### Theme D — The Loop social model is right; the spillover surface is missing.

90% of Gen Z shares to group chats first. Loop's bet on small private groups is research-perfect. But "Send to a Loop" only works if the people you want to share with are already on Loop. The prototype needs a *share outside Loop* affordance that produces an iMessage-shaped card with question + answer + sources. Without it, the viral loop is closed.

### Theme E — The 12-word brief is exquisite copy, possibly mis-cast.

The brief reads beautifully for people who already know the news. It alienates the news-avoider it most wants to serve. Choose: either lean into editorial flex (and keep) with a comprehension subtitle, OR rewrite to do both jobs. Don't do nothing.

---

## Prioritized recommendations

| # | Fix | Why | Severity | Effort |
|---|-----|-----|----------|--------|
| 1 | Raise the Margin ask-back into a conversational turn (tappable chips for yes/no/show me) | The Socratic loop is the wedge vs. Particle | P1 | M |
| 2 | Add a "Topics & interests" row to Me → Calibrate | Aisha's JTBD is broken without it | P1 | M |
| 3 | Make citation chips tappable to a source detail panel | The trust contract requires it | P1 | S |
| 4 | Add a "Share outside Loop" affordance to Margin answers | The viral loop currently dead-ends | P1 | M |
| 5 | Add a 1-line comprehension subtitle under the 12-word brief OR rewrite the brief | Olivia can't decode the haiku | P1 | XS |
| 6 | Surface topic/keyword muting in Me | Anti-doomscroll requires negative shaping | P2 | S |
| 7 | Add 2-3 more Blindspots in the dataset; vary the framings | Marcus's habit-driver needs depth | P2 | XS |
| 8 | Promote "Built by people" higher in Me | Aisha's trust gesture | P2 | XS |
| 9 | Tighten or remove "Mark as read" in Story view | Redundant with auto-mark on open | P3 | XS |
| 10 | Audit "Margin's pick" usage — only assign one when truly preferred | Avoids "the other ones" effect | P3 | XS |

The first five would meaningfully improve the prototype's read in a real usability study. 1-3 are concept-defining; 4-5 are easy wins with outsized payoff.

---

## What I'd want from real user research next

This simulation is anchored on the existing personas. Three things real research should answer before this concept ships further:

1. **Does the ritual completion moment ("you're caught up") actually feel like a reward, or like an unfinished sentence?** Newsreel's streak data suggests it does. Borrow their measurement approach.
2. **Will users *actually* tap "Steelman the other side" — or do they only tell researchers they will?** Behavioral, not stated. Worth a small prototype-as-stimulus study with task scenarios that mimic real disagreements.
3. **Where does the small-group cap (12 people) break first?** Loops capped at 12 feels right in theory. In practice, three of Aisha's Discord servers already exceed that. Stress-test the cap with a diary study before locking it in.
