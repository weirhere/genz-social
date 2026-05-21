# LCA Assignment: Research Brief

**Project:** Gen Z news/social app for a Fortune 100 media brand
**Stage:** Research synthesis (pre-concept)
**Read time:** ~10 min

---

## The brief in one paragraph

A Fortune 100 media brand wants a social-meets-news app for Gen Z, with AI woven into the core experience. The two hard problems are trust (Gen Z doesn't believe traditional media) and fragmentation (the info they want is scattered across TikTok, group chats, Reddit, Substack, podcasts, and friends). The bar is "magical and monumental" — so the AI can't be a summarization bolt-on, and the UI has to feel like a 2026 consumer product, not a CMS skin.

---

## 1. What's actually happening with Gen Z and news

The behavior is more nuanced than "they don't read news." They consume news constantly, just not from outlets, and not in formats traditional media is built for.

**Where they get news (US, 18-24):**

- TikTok and Instagram are essentially tied as news sources (63% / 62%), both beating Facebook (48%)
- 25% say TikTok is their *primary* news platform
- 38% of under-30s regularly get news from "news influencers"
- 54% of 18-24s cite social and video as their primary news source
- 46% of Gen Z prefers social over search engines for finding info

**Trust and skepticism:**

- Only 28% of Gen Z trusts traditional media
- 70% of Gen Z is skeptical of info they read online
- When 756 US teens (13-18) were asked for a word that describes news media, 84% picked a negative one; the top five were "Fake," "Crazy," "Boring," "Biased," "Sad" (News Literacy Project, fielded April-May 2025)
- Roughly half of teens think reporters make up quotes
- But: under-30s trust info on social media *as much as* they trust national news orgs (this is a vacuum, not loyalty)

**The exhaustion problem:**

- 53% of Gen Z reports doomscrolling (vs 31% of US adults overall)
- 81% report digital fatigue
- 39% practice news avoidance to some degree (international, Reuters Institute)
- Gen Z averages 6h 27min on their phones daily; 46% have a formal mental health diagnosis
- 86% of Gen Z workers say they're burned out

**The shift to private:**

- 68% feel more comfortable sharing in Close Friends / group chats than publicly
- 79% share major life updates in group chats before their families
- 90% share with group chats before posting publicly
- Peer recommendations are replacing influencer recommendations

**The takeaway:** Gen Z isn't disengaged from news. They're engaged through a different stack: creators they trust, friends in group chats, and short video. They're exhausted by the public feed, distrustful of institutions, and hungry for someone (or something) to help them make sense of what's real.

---

## 2. What's been tried (competitor teardowns)

### Artifact (2023-2024, RIP)
Built by the Instagram co-founders. AI-powered news aggregator with personalization. Got 444K downloads, mostly at launch, then declined sharply. **Why it failed:** lost focus (kept bolting on Pinterest-style links, then text posts, then place recommendations), 44% of downloads were US-only, market opportunity was niche. Acquired by Yahoo in April 2024.

**Lesson:** A focused, sharp wedge beats a "news Twitter Pinterest" everything-app. Generic personalization isn't enough of a hook.

### Particle (active, well-loved)
Founded by ex-Twitter PM Sara Beykpour. 4.8 star App Store rating. The AI features are the actual product, not a sidebar.

- **Multi-perspective story spectrum:** every story shows a left-right "bubble map" of how outlets are framing it
- **"Explain it to me like I'm five"** and "5 Ws" modes
- **AI chatbot per story** so you can ask follow-up questions
- **Publisher partnerships** with Reuters and Fortune (paying licensors instead of scraping)

**Lesson:** Three AI moves that actually feel native: perspective comparison, on-demand explanation depth, conversational interrogation. All three reduce trust friction.

### Ground News (active)
Bias-aware aggregator. Famous for "Blindspot" feature surfacing stories one side of the spectrum is ignoring. Credibility ratings sourced from AllSides + Ad Fontes + Media Bias Fact Check. 4/5 on Trustpilot.

**Lesson:** Transparency about *coverage* (not just content) is itself a product. Showing what's *missing* is as valuable as showing what's there.

### Newsreel (2025, gaining traction)
Bet specifically on gamifying news consumption for 18-30s. Three curated stories a day, quiz after each, daily streak mechanic, no infinite scroll, no ads, real reporters. Sources from Reuters/AP/NYT/Guardian. Won the National Association for Media Literacy Education's "2025 Resource of the Year."

**Lesson:** Streak + scarcity (3 stories/day) flips the news consumption model from infinite scroll to ritual completion. Validates that Gen Z will accept curation if it respects their time.

### Yahoo News (post-Artifact)
Yahoo bought Artifact and folded its tech in. Now offers AI-generated key points on every article, keyword/publisher blocking, clickbait-flagging that auto-rewrites headlines, reading streaks, badges. Yahoo is top-5 with Gen Z, reaches 90% of US internet users monthly.

**Lesson:** Even legacy brands are converging on AI summarization + personalization + gamification. The bar is rising; "AI key points" alone won't differentiate.

### TikTok / news creators (V Spehar, Cleo Abram, etc.)
V Spehar's "Under the Desk News" has 4.5M followers across TikTok and IG. Conversational, non-anchor tone. Audience trusts the *person*, not the outlet. Pew defines "news influencer" as anyone with 100K+ followers regularly posting on current events; 38% of under-30s rely on them.

**Lesson:** The atomic unit of trust for Gen Z is a person, not a brand. Any product that wants to compete needs to either host creators well or feel like a person itself.

### Substack Notes / Threads / Bluesky
- Threads: 400M MAU but Mosseri explicitly said they won't "encourage" hard news
- Bluesky: 41M users, attracts journalists/news junkies, custom feeds work well for niche discovery
- Substack Notes: broadcast-style, tied to creator economy

**Lesson:** None of the major social-news experiments has cracked it. Threads abdicated. Bluesky is too niche. Substack is creator-distribution. There's an opening for a product purpose-built for news-as-social.

---

## 3. AI in news: what's actually useful

The category is crowded but converging on a few real patterns:

| AI move | Who does it | Why it works |
|---|---|---|
| **Multi-perspective comparison** | Particle, Ground News | Reduces "spin" anxiety; lets user calibrate |
| **Explain at my level** | Particle ("ELI5", "5Ws") | Lowers entry friction; respects time |
| **Conversational follow-up** | Particle, Perplexity | Treats news as an inquiry, not a broadcast |
| **Bias / source transparency** | Ground News, Biasly | Trust through visible methodology |
| **Auto-rewrite clickbait** | Yahoo (ex-Artifact) | Defends user attention from publisher games |
| **Personalized briefings** | Yahoo, Newsreel, Perplexity | Reduces noise, but only if user controls signal |

**What's gimmicky / hasn't landed:**

- AI "anchors" reading scripts (uncanny, audiences prefer humans)
- Generic AI summaries with no context (becomes another doomscroll layer)
- AI without source attribution (kills the trust play)
- Personalization with no user override (Spotify Wrapped flak in 2024 was about exactly this)

**The 2026 bar:** Particle has set the floor on AI-as-explainer. To go beyond, an AI feature would need to do one of these:

1. Connect what's happening *now* to the user's own life or world (situated, not generic)
2. Build trust visibly (sources, methodology, what's *not* in the story)
3. Make the user smarter or more skeptical, not just better-fed
4. Function as a *peer* — something they'd send to a group chat, not something they'd hide using

---

## 4. Patterns to steal from adjacent products

### Letterboxd — community without algorithmic feed
No algorithmic feed, no follower counts, no downvotes. Diary-driven structure encourages personal reflection over performance. Witty short reviews became a competitive sport. Aesthetic respects the medium (cinema). Lesson: **culture is a product decision.** If you don't want toxic engagement, don't build engagement loops that select for it.

### BeReal — ritual creates authenticity (sort of)
Daily push at a random time, 2-min window, dual-camera capture, friends-only. The ritual itself was the product. Then it stalled because the authenticity collapsed into performance anyway (the "online authenticity paradox"). Lesson: **rituals can replace feeds, but rituals also calcify.** Build one ritual but design for evolution, not lock-in.

### Discord — trust through structured community
Trust comes from clear server purpose, predictable moderation, and members understanding "where to go in under 30 seconds." Gen Z values community autonomy. Lesson: **moderation isn't a feature, it's an architecture.** Trust is built by visible structure, not invisible algorithms.

### Spotify Wrapped — personalization as gift
Personalization works when the user feels they got something meaningful back. The 2025 "Listening Lens" added the "why" behind the numbers (mood, time of day, emotional patterns). 2024 backlash was about over-claiming with no transparency. Lesson: **personalization is a value exchange, and transparency is the receipt.**

### Group chats — the real social network
79% of people share major news with group chats before family. 90% before public posting. This is where news already gets discussed, debated, and validated. Lesson: **the product should treat the group chat as the unit of audience, not the public feed.**

---

## 5. Jobs to be done

Three JTBDs emerged from the research, in priority order:

**JTBD 1 — Make sense of what's happening**
*When something big is happening and I'm seeing fragments on TikTok and in my group chat, I want to quickly understand what's actually going on and what's true, so I can form my own take without spending an hour scrolling.*

**JTBD 2 — Stay current without feeling consumed**
*When I want to be informed without doomscrolling for hours, I want a way to engage with news on my terms (short, ritual-based, finishable), so I feel like an adult without the cost of feeling like garbage.*

**JTBD 3 — Have something to say**
*When I'm in a group chat or with friends and a topic comes up, I want to have a credible perspective and something interesting to share, so I'm not the person who only learned about it from a meme.*

A weaker fourth JTBD that's worth flagging: *find people I trust to follow* — but creator-following is downstream of the first three. People don't open a news app to find creators; they open it to make sense of the world.

---

## 6. Three lightweight personas

These are sketches built from the research, not from interviews. Use them as design anchors, not as truth.

### "Tired Olivia" — 22, college senior
Reads news from Instagram reels and her friend Maya's group chat. Was on TikTok 4 hrs/day, deleted it, downloaded it again, now uses it 2 hrs/day. Has chronic news avoidance — last week she muted "Gaza" and "election" keywords on Threads. Wants to be informed but doesn't have bandwidth for 17 push notifications. Trusts: friends, V Spehar, NPR sometimes, Particle's "explain this." Doesn't trust: cable news, anonymous Twitter, any headline that uses the word "slams."

**Design implication:** Make engagement opt-in and finishable. No infinite scroll. No anxiety-inducing red badges. Show her what she missed without making her feel behind.

### "Hot Take Marcus" — 19, freshman
On Discord 6 hrs/day across 4 servers. Reads Bluesky, posts on Threads, lurks Substack Notes. Wants to win arguments in his group chat. Will read a 12-min Substack post if it'll give him ammunition. Currently uses Ground News for blindspots, Perplexity to fact-check during debates. Frustrated that no app lets him *quote* a news story into a chat with the context attached.

**Design implication:** Make sharing first-class. Quoted clips with context, "explain this for my friend who hasn't been following" mode, sharable arguments-against-the-argument.

### "Quiet Aisha" — 26, junior PM at a startup
Pays for Apple News+ and the NYT but rarely opens either. Reads The Cut, listens to The Daily on commute, has a Discord she's been in since college that's effectively her newsroom. Wants depth but only has 20 min in the morning. Highly suspicious of AI but uses ChatGPT every day for work. Would love a "what should I know today" briefing if it was actually her, not a generic morning email.

**Design implication:** AI personalization needs to feel like a human assistant who knows her, not an algorithm. Show its work. Let her correct it. Tie news to her actual interests (her industry, her city, her communities), not assumed demographic buckets.

---

## 7. What this means for the design (early signal, not commitment)

The research points toward a product shaped roughly like this:

- **An anti-feed home experience.** Not infinite scroll. Probably a finite daily set, maybe ritual-based, with depth on demand.
- **AI as a trusted explainer, not a content engine.** The AI helps the user *understand* the world (compare perspectives, ask follow-ups, see what's missing), it doesn't pretend to *be* the world.
- **Friends and creators as the social layer.** Group-chat-style mechanics, not public-feed mechanics. Borrow from Discord (structured community) and Letterboxd (taste-driven, low-performance).
- **Trust as a visible product surface.** Show source provenance, methodology, what the AI doesn't know. Steal from Ground News.
- **A daily ritual, not a habit loop.** Steal from BeReal and Newsreel. One thing per day that feels good to complete.

The most defensible AI-native feature angle (still to be stress-tested in concept):

> An AI that doesn't just summarize news, but acts as a *thinking partner* — surfacing what's at stake, what's contested, what's missing, and what the user's own circles are saying about it. Less "anchor reading a script," more "smart friend texting you back."

---

## 8. Open questions to resolve before concepting

1. **Is the product creator-led, AI-led, or peer-led?** All three have evidence. Pick a primary.
2. **Is the unit of audience the individual, the group chat, or the public?** The research says group chat is undervalued, but it's a hard sell to a Fortune 100 media brand.
3. **How does the Fortune 100 media brand's content actually show up?** The research suggests that "branded content" loses to creators. What's the bridge?
4. **Where does the product sit on the doomscroll-vs-finite spectrum?** Newsreel went all the way to "finite ritual." Is that the right move, or is it leaving engagement (and ad inventory) on the table?
5. **What's the one AI feature that gets demoed?** Particle has perspectives + ELI5 + chatbot. To beat that, we need a new primitive.

---

## Sources

**Gen Z behavior + trust:**
- [Pew Research: Young Adults and the Future of News](https://www.pewresearch.org/journalism/2025/12/03/young-adults-and-the-future-of-news/)
- [Reuters Institute: How Young People Consume News](https://reutersinstitute.politics.ox.ac.uk/our-research/how-young-people-consume-news-and-implications-mainstream-media)
- [Digital Content Next: Gen Z's News Habits](https://digitalcontentnext.org/blog/2025/06/23/get-to-know-gen-zs-news-habits-to-build-future-audiences/)
- [Fortune: Trust in media collapse since 1972](https://fortune.com/2025/10/02/gen-z-millennials-republicans-distrust-media-gallup-institutions-poll/)
- [News Literacy Project: "Biased," "Boring," "Bad" — teen perceptions of news media](https://newslit.org/news-and-research/teens-and-news-media/)
- [News Literacy Project: Misperceptions drive distrust](https://newslit.org/news-and-research/new-study-suggests-misperceptions-drive-distrust-of-news-media-among-gen-z-and-gen-alpha/)
- [Pew Research: News Influencers Fact Sheet](https://www.pewresearch.org/journalism/fact-sheet/news-influencers-fact-sheet/)
- [Fortune: Harvard Youth Poll on alienation](https://fortune.com/2025/12/04/gen-z-alienation-distrust-harvard-youth-poll-economic-anxiety-affordability/)
- [Sociallyin: Gen Z social media stats 2026](https://sociallyin.com/gen-z-social-media-usage-statistics/)
- [YPulse: Gen Z cutting doomscrolling](https://www.ypulse.com/newsfeed/2025/11/03/gen-z-is-cutting-down-on-doomscrolling-to-take-community-offline/)
- [WokeWaves: Gen Z nighttime doomscrolling burnout](https://www.wokewaves.com/posts/gen-z-nighttime-doomscrolling-burnout)
- [NCH Stats: Digital fatigue crisis](https://nchstats.com/digital-fatigue-crisis-gen-z/)
- [Axios: Group chats beat families as Gen Z's confidants](https://www.axios.com/2025/10/21/giphy-group-chats-gen-z-survey)

**Competitor teardowns:**
- [Failory: Why Artifact Failed](https://newsletter.failory.com/p/why-artifact-failed)
- [TechCrunch: What happened to Artifact](https://techcrunch.com/2024/01/18/why-artifact-from-instagrams-founders-failed-shut-down/)
- [TechCrunch: Particle AI news reader to web](https://techcrunch.com/2025/05/06/particle-brings-its-ai-powered-news-reader-to-the-web/)
- [Aadhunik AI: Particle News Review 2025](https://aadhunik.ai/blog/particle-news-review/)
- [Ground News Rating System](https://ground.news/rating-system)
- [Ground News Blindspot Feed](https://ground.news/blindspot)
- [Yahoo: How Yahoo built AI-driven content discovery](https://finance.yahoo.com/news/yahoo-built-ai-driven-content-090000992.html)
- [Yahoo: News app reimagined with Artifact](https://www.yahooinc.com/press/yahoo-news-app-reimagined-with-next-level-personalization-from-artifact)
- [NewscastStudio: Newsreel bets Gen Z will trade TikTok algorithm](https://www.newscaststudio.com/2025/12/17/newsreel-app-jack-brewster-tiktok-curated-news-gen-z/)
- [Press Gazette: Streak mechanism key with Gen Z on Newsreel](https://pressgazette.co.uk/news/streak-mechanism-key-gen-z-gamified-app-newsreel/)
- [Newsreel](https://newsreel.co/about/)
- [TIME100 Creators: V Spehar](https://time.com/collections/time100-creators-2025/7299181/under-the-desk-news/)
- [Lovable: Bluesky vs Threads 2026](https://lovable.dev/guides/bluesky-vs-threads)

**AI in news:**
- [Index.dev: Perplexity AI Features 2026](https://www.index.dev/blog/perplexity-statistics)
- [arXiv: AI-Powered Debiasing of Online News Articles](https://arxiv.org/html/2504.03520v1)
- [CHI 2025: Media Bias Detector tool](https://dl.acm.org/doi/10.1145/3706598.3713716)

**Analogous patterns:**
- [Blake Crosley: Letterboxd — Cinema as Social Object](https://blakecrosley.com/guides/design/letterboxd)
- [The Wrap: Letterboxd Unboxed](https://www.thewrap.com/letterboxd-social-media-platform-film-fans/)
- [ACM HCI: BeReal authentic self-presentation through design](https://dl.acm.org/doi/10.1145/3686909)
- [Frontiers Sociology: Gen Z values and BeReal](https://www.frontiersin.org/journals/sociology/articles/10.3389/fsoc.2023.1304093/full)
- [Influencers Time: Discord Community Playbook 2025](https://www.influencers-time.com/create-a-thriving-discord-community-2025-playbook-guide/)
- [Ingenium Space: Discord for building Gen Z communities](https://theingspace.medium.com/discord-the-best-tool-for-building-communities-for-genz-fdc4fb59b96b)
- [UX Playbook: Spotify Wrapped 2025 design lessons](https://uxplaybook.org/articles/spotify-wrapped-ux-design-lessons)
- [Spotify Engineering: Inside the 2025 Wrapped Archive](https://engineering.atspotify.com/2026/3/inside-the-archive-2025-wrapped)
