// Mock content for the Loop prototype.
// Stories, voices, topics, loops, and Margin scripts.

export type Source = {
  name: string
  lean: "left" | "center-left" | "center" | "center-right" | "right" | "independent"
}

export type Story = {
  id: string
  category: string
  categoryColor: "signal" | "ember" | "sage" | "ink"
  headline: string
  standfirst: string
  readMinutes: number
  sources: Source[]
  perspectiveSummary: string
  body: string[]
  loopActivity?: {
    person: string
    avatar: string
    snippet: string
    timeAgo: string
    loopName: string
  }
  isLive?: boolean
  isLocal?: boolean
  margin: {
    prompts: string[]
    sampleAnswer: {
      promptIndex: number
      paragraphs: { text: string; cites: number[] }[]
      askBack: string
    }
  }
}

export const today: Story[] = [
  {
    id: "ai-senate",
    category: "Tech & policy",
    categoryColor: "signal",
    headline: "The AI bill landed in the Senate. Now everyone is haggling over one word.",
    standfirst:
      "Bipartisan support held — until the definition of 'foundation model' came up. Inside the markup that could decide who regulates Silicon Valley.",
    readMinutes: 5,
    sources: [
      { name: "NYT", lean: "center-left" },
      { name: "WSJ", lean: "center-right" },
      { name: "Politico", lean: "center" },
      { name: "The Verge", lean: "center-left" },
      { name: "Stratechery", lean: "independent" },
    ],
    perspectiveSummary: "5 sources · center-left to center-right",
    isLive: true,
    body: [
      "After eighteen months of hearings, the Senate Commerce Committee took up the American AI Act on Tuesday morning. By lunch, the bipartisan coalition that had carried it this far was at a standstill — not over compute thresholds or watermarking, but over a single line: how to define a 'foundation model.'",
      "Senators on both sides agreed the bill needed a clear scope. They could not agree on what that scope was. Senator Hassan (D-NH) pushed for a parameter-count threshold; Senator Young (R-IN) argued for a capabilities-based test. Industry lobbyists, anticipating the fight, had pre-filed comments on three different versions.",
      "The narrower the definition, the fewer companies regulated. That mathematics is the whole argument.",
      "A floor vote is now expected next week. Lobbyists for OpenAI, Anthropic, and Meta were all on the Hill by Tuesday afternoon. So were representatives from a half-dozen open-source advocacy groups.",
    ],
    loopActivity: {
      person: "Maya",
      avatar: "M",
      snippet: "the parameter-count thing is going to age so badly",
      timeAgo: "12 min ago",
      loopName: "Tech & policy",
    },
    margin: {
      prompts: [
        "What's at stake?",
        "Steelman the other side",
        "What's missing from this story?",
        "Explain it to a college freshman",
        "Why should I care?",
      ],
      sampleAnswer: {
        promptIndex: 0,
        paragraphs: [
          {
            text: "Two things are at stake. One: who counts as an 'AI company' under federal law. A parameter-count test is precise but ages badly — last year's threshold is this year's mid-tier model. A capabilities test is more durable but harder to enforce.",
            cites: [0, 1, 4],
          },
          {
            text: "Two: whether open-source models get carved out. The current draft treats them differently from closed APIs. That's a real fork in the road for the next five years of the industry.",
            cites: [2, 3],
          },
          {
            text: "Worth knowing: this exact debate happened in the EU AI Act in 2023, and the EU went with a hybrid approach. The Senate staff are reading those transcripts.",
            cites: [4],
          },
        ],
        askBack:
          "Want me to compare this to the EU AI Act fight, or pull up how each Senator has voted on tech regulation before?",
      },
    },
  },
  {
    id: "atmospheric-river",
    category: "Your city · Bay Area",
    categoryColor: "ember",
    headline: "An atmospheric river is stalling over the Bay. 80,000 people are without power.",
    standfirst:
      "The third major storm in a month, and PG&E is already saying the outages could last 36 hours.",
    readMinutes: 3,
    sources: [
      { name: "SF Chronicle", lean: "center-left" },
      { name: "KQED", lean: "center" },
      { name: "AP", lean: "center" },
      { name: "Bloomberg", lean: "center" },
    ],
    perspectiveSummary: "4 sources · centrist",
    isLocal: true,
    body: [
      "A slow-moving atmospheric river parked itself over the Bay Area Sunday night, dumping six inches of rain in twelve hours and knocking out power for an estimated 80,000 PG&E customers. The utility said early Monday that some outages could last 36 hours.",
      "This is the third major storm to hit Northern California in five weeks. State climatologists, speaking to KQED, said the back-to-back pattern is consistent with what models have predicted for a warming Pacific.",
      "Schools in Oakland, Berkeley and parts of San Francisco are closed Monday. BART is running on a delayed schedule.",
    ],
    margin: {
      prompts: [
        "Is this storm unusual?",
        "What should I do about power outages?",
        "Why does PG&E always say 36 hours?",
        "What's the climate context?",
      ],
      sampleAnswer: {
        promptIndex: 0,
        paragraphs: [
          {
            text: "It's unusually wet but not unprecedented. The Bay has seen atmospheric rivers like this before — the 1982 storm was bigger. What's new is the frequency: three in five weeks is in the top decile for the modern record.",
            cites: [0, 1],
          },
          {
            text: "State climatologists at Scripps say this pattern is consistent with their projections for a warming Pacific. They've been warning about this exact rhythm — fewer storms, but bigger ones — for about a decade.",
            cites: [1, 3],
          },
        ],
        askBack: "Want me to pull up a map of where the outages are right now?",
      },
    },
  },
  {
    id: "argentina-peso",
    category: "Markets",
    categoryColor: "sage",
    headline: "Milei's peso plan is somehow working. Economists are not sure how to feel.",
    standfirst:
      "Inflation is down from 211% to 36% in eighteen months. The cost has been brutal, and the politics are about to get harder.",
    readMinutes: 6,
    sources: [
      { name: "Bloomberg", lean: "center" },
      { name: "FT", lean: "center" },
      { name: "El País", lean: "center-left" },
      { name: "Reuters", lean: "center" },
    ],
    perspectiveSummary: "4 sources · centrist, plus one Spanish-language",
    body: [
      "When Javier Milei took office in December 2023 with a chainsaw on stage, most economists assumed Argentina was headed for another spectacular currency collapse. Eighteen months later, the peso has stabilized, foreign reserves are up, and annual inflation has fallen from 211% to 36%.",
      "The cost has been steep. Poverty hit 53% last year before falling back to 38% this year. Real wages took a sharp dip and have only partially recovered. Public sector employment is down 15%.",
      "The hard part is now: Milei needs to keep cutting without triggering a political backlash heading into mid-term elections. Markets are pricing in the assumption that he holds.",
    ],
    margin: {
      prompts: [
        "What's the actual mechanism?",
        "Who's getting hurt?",
        "How does this compare to other peso crises?",
        "What's the bear case?",
      ],
      sampleAnswer: {
        promptIndex: 3,
        paragraphs: [
          {
            text: "The bear case: this is the same pattern Argentina has run twice before, in 1991 and 2001. Stabilize the currency, run a hard fiscal adjustment, get praise from the IMF, then snap back when the political pain outruns the political will.",
            cites: [0, 1],
          },
          {
            text: "What's different this time: Milei was elected explicitly to do this, which gives him more mandate. And he's not trying to peg the peso, which is what broke the 2001 plan.",
            cites: [0, 3],
          },
        ],
        askBack: "Want me to pull the 2001 chart side-by-side with what's happening now?",
      },
    },
  },
  {
    id: "letterboxd-movie",
    category: "Culture",
    categoryColor: "signal",
    headline: "The year's biggest movie wasn't marketed on TV. It was marketed on Letterboxd.",
    standfirst:
      "How a $14M indie became the highest-grossing original film of the year by pretending the studio didn't exist.",
    readMinutes: 4,
    sources: [
      { name: "Vulture", lean: "center-left" },
      { name: "The Ringer", lean: "center" },
      { name: "Variety", lean: "center" },
    ],
    perspectiveSummary: "3 sources · culture press",
    body: [
      "There's a marketing tactic the studios are calling 'reverse premiere,' and it more or less invented itself on Letterboxd this winter.",
      "The strategy: skip the press junkets, skip the talk shows, plant the director in the comment sections of niche film accounts for three months before release, and let the reviews do the work. By the time the film opened wide, it had eight months of grassroots Letterboxd reviews and a verified meme economy.",
      "It opened to $24M and held the box office for four weeks. For an original-IP indie, that's not supposed to happen anymore.",
    ],
    margin: {
      prompts: [
        "How is this different from a normal indie release?",
        "Could the studios replicate this on purpose?",
        "What does this mean for film marketing?",
      ],
      sampleAnswer: {
        promptIndex: 1,
        paragraphs: [
          {
            text: "Probably not on purpose — at least not at scale. The thing that worked here was that the Letterboxd community could tell the director was actually in the comments, not a social team. The moment a studio tries to do this with a comms team, the audience smells it.",
            cites: [0, 1],
          },
          {
            text: "But: studios are already trying. Two majors have hired 'community leads' specifically for Letterboxd and Reddit in the last six months.",
            cites: [2],
          },
        ],
        askBack: "Want me to pull the actual Letterboxd reviews that broke this thing open?",
      },
    },
  },
  {
    id: "gene-therapy",
    category: "Science",
    categoryColor: "sage",
    headline: "The FDA just approved the first gene therapy for sickle cell. It costs $2.2M.",
    standfirst:
      "A genuine medical milestone meets the messiest pricing debate in U.S. healthcare. Both can be true.",
    readMinutes: 4,
    sources: [
      { name: "STAT", lean: "center" },
      { name: "NEJM", lean: "independent" },
      { name: "Nature", lean: "independent" },
    ],
    perspectiveSummary: "3 sources · independent science press",
    body: [
      "The FDA on Friday approved the first CRISPR-based gene therapy for sickle cell disease, calling it 'a foundational moment for genetic medicine.' The treatment, developed jointly by Vertex and CRISPR Therapeutics, is priced at $2.2 million per patient.",
      "The trial data are striking. 28 of 30 treated patients had no vaso-occlusive crises in the year following treatment. For a disease that hospitalizes tens of thousands of Americans every year, that's a category change.",
      "The pricing is the political fight. Medicaid covers most U.S. sickle cell patients. CMS is now negotiating an outcomes-based payment model that would let the federal government claw back costs if patients relapse.",
    ],
    margin: {
      prompts: [
        "Is $2.2M actually a fair price?",
        "How does CRISPR work, plainly?",
        "Who gets this first?",
        "What other diseases are next?",
      ],
      sampleAnswer: {
        promptIndex: 0,
        paragraphs: [
          {
            text: "It depends what you compare it to. Lifetime cost of treating severe sickle cell is estimated at $4-6M per patient, mostly hospitalizations. So $2.2M one-time is mathematically a deal — if it actually works for a lifetime.",
            cites: [0, 1],
          },
          {
            text: "Where it gets sticky: most U.S. sickle cell patients are on Medicaid. The federal government will pay for this whether they 'agree' to the price or not. CMS is negotiating an outcomes-based model to address that.",
            cites: [0],
          },
        ],
        askBack: "Want me to break down who's covered and who's likely to wait?",
      },
    },
  },
  {
    id: "rent-control",
    category: "Your city · Bay Area",
    categoryColor: "ember",
    headline: "A rent-control measure just qualified for the November ballot.",
    standfirst:
      "It would cap annual rent increases at 5% citywide. Landlord groups are already organizing.",
    readMinutes: 2,
    sources: [
      { name: "SF Standard", lean: "center" },
      { name: "Mission Local", lean: "center-left" },
      { name: "SF Chronicle", lean: "center" },
    ],
    perspectiveSummary: "3 sources · local press",
    isLocal: true,
    body: [
      "Organizers behind Measure J turned in 51,000 signatures Thursday — about 8,000 more than required to put the measure on the November ballot. If passed, it would cap annual rent increases at 5% for all units citywide.",
      "Currently, rent control covers only buildings built before 1979.",
      "Landlord and YIMBY groups have already filed counter-arguments with the city. A coalition called Homes For All is funding the yes campaign.",
    ],
    margin: {
      prompts: [
        "What does '5% cap' actually mean for me?",
        "Has this worked elsewhere?",
        "Who benefits, who doesn't?",
      ],
      sampleAnswer: {
        promptIndex: 1,
        paragraphs: [
          {
            text: "Mixed evidence. Berlin tried a similar cap in 2020 and the courts struck it down. Oregon enacted a statewide cap in 2019 — academic research found small effects on rents but a measurable drop in new construction.",
            cites: [1, 2],
          },
          {
            text: "Most economists are wary of citywide caps for that reason. Most renter advocacy groups argue the construction effect is overstated.",
            cites: [0, 2],
          },
        ],
        askBack: "Do you rent or own? I can pull what this would mean for your situation specifically.",
      },
    },
  },
  {
    id: "knicks-pistons",
    category: "Sports",
    categoryColor: "ink",
    headline: "The Knicks-Pistons trade everyone is whispering about is real, and it's almost done.",
    standfirst:
      "Two front offices, three teams in the cap math, one Eastern Conference rebuild on the line.",
    readMinutes: 3,
    sources: [
      { name: "The Athletic", lean: "center" },
      { name: "ESPN", lean: "center" },
      { name: "Bleacher Report", lean: "center" },
    ],
    perspectiveSummary: "3 sources · sports press",
    body: [
      "Sources close to both front offices confirmed late Sunday that the Knicks and Pistons are in advanced talks on a three-team trade that would reshape both rotations before the February deadline.",
      "The cap math requires a third team. Two are reportedly involved — the Hornets, who would absorb an expiring contract, and the Spurs, who'd take draft compensation.",
      "League sources caution: deals like this fall apart on physicals. But all three GMs were on the phone Sunday night.",
    ],
    margin: {
      prompts: [
        "What's the actual trade?",
        "How does this change the East?",
        "Who wins, who loses?",
      ],
      sampleAnswer: {
        promptIndex: 0,
        paragraphs: [
          {
            text: "Per Athletic, Knicks send a starting forward + a 2027 first; Pistons send a young scoring guard + matching salary; Hornets take an expiring; Spurs take the second-round picks. It's a cap dump dressed up as a basketball trade.",
            cites: [0],
          },
        ],
        askBack: "Want me to walk through what it means for the Knicks rotation specifically?",
      },
    },
  },
]

export type Voice = {
  id: string
  name: string
  handle: string
  beat: string
  followers: string
  vouch: string
  vouchedBy: number
  latestTake: string
}

export const voices: Voice[] = [
  {
    id: "v-spehar",
    name: "V Spehar",
    handle: "underthedesknews",
    beat: "Politics · daily",
    followers: "4.5M",
    vouch: "Vetted by Loop editorial",
    vouchedBy: 12,
    latestTake: "the senate ai bill markup was a real one. let me walk you through the one word fight.",
  },
  {
    id: "cleo-abram",
    name: "Cleo Abram",
    handle: "cleoabram",
    beat: "Tech · weekly",
    followers: "2.1M",
    vouch: "Vetted by Loop editorial",
    vouchedBy: 9,
    latestTake: "the FDA approving CRISPR for sickle cell is the moment gene therapy goes from 'someday' to 'now.'",
  },
  {
    id: "kyla-scanlon",
    name: "Kyla Scanlon",
    handle: "kylascan",
    beat: "Markets · daily",
    followers: "880K",
    vouch: "Vetted by Loop editorial",
    vouchedBy: 14,
    latestTake: "argentina is doing the thing economists said was impossible. let me explain the thing.",
  },
  {
    id: "carlos-watson",
    name: "Carlos Maza",
    handle: "carlosmazaa",
    beat: "Media criticism",
    followers: "320K",
    vouch: "Vetted by Loop editorial",
    vouchedBy: 6,
    latestTake: "five things the AI bill coverage is getting wrong, ranked.",
  },
  {
    id: "j-hill",
    name: "Jemele Hill",
    handle: "jemelehill",
    beat: "Sports · culture",
    followers: "1.7M",
    vouch: "Vetted by Loop editorial",
    vouchedBy: 8,
    latestTake: "this knicks-pistons trade tells you everything about the new east.",
  },
]

export type Topic = {
  id: string
  label: string
  size: "xl" | "lg" | "md" | "sm"
  hue: "signal" | "ember" | "sage" | "ink"
  live?: boolean
  newCount: number
  position: { x: number; y: number }
}

export const topics: Topic[] = [
  { id: "ai", label: "AI & policy", size: "xl", hue: "signal", live: true, newCount: 14, position: { x: 50, y: 28 } },
  { id: "climate", label: "Climate", size: "lg", hue: "sage", newCount: 9, position: { x: 22, y: 48 } },
  { id: "markets", label: "Markets", size: "lg", hue: "ink", newCount: 11, position: { x: 78, y: 50 } },
  { id: "your-city", label: "Your city", size: "lg", hue: "ember", live: true, newCount: 8, position: { x: 36, y: 70 } },
  { id: "culture", label: "Culture", size: "md", hue: "signal", newCount: 6, position: { x: 64, y: 73 } },
  { id: "science", label: "Science", size: "md", hue: "sage", newCount: 5, position: { x: 18, y: 22 } },
  { id: "sports", label: "Sports", size: "sm", hue: "ink", newCount: 4, position: { x: 82, y: 22 } },
  { id: "your-industry", label: "Your industry", size: "md", hue: "signal", newCount: 7, position: { x: 50, y: 88 } },
]

export type Blindspot = {
  id: string
  headline: string
  takeaway: string
  leftFraming: string
  rightFraming: string
}

export const blindspots: Blindspot[] = [
  {
    id: "bs-1",
    headline: "You've been reading mostly centrist sources this week.",
    takeaway:
      "Here's how the same three stories are getting framed at the edges.",
    leftFraming:
      "On the AI bill: 'a giveaway to the largest labs, dressed up as oversight.'",
    rightFraming:
      "On the AI bill: 'compute thresholds are a backdoor to picking winners.'",
  },
]

export type Loop = {
  id: string
  name: string
  glyph: string
  members: { name: string; avatar: string }[]
  lastMessage: { person: string; snippet: string; timeAgo: string }
  unread: number
  pinnedStoryId?: string
}

export const loops: Loop[] = [
  {
    id: "techpolicy",
    name: "Tech & policy",
    glyph: "◆",
    members: [
      { name: "Maya", avatar: "M" },
      { name: "Sam", avatar: "S" },
      { name: "Priya", avatar: "P" },
      { name: "Devon", avatar: "D" },
      { name: "You", avatar: "Y" },
    ],
    lastMessage: { person: "Maya", snippet: "the parameter-count thing is going to age so badly", timeAgo: "12m" },
    unread: 3,
    pinnedStoryId: "ai-senate",
  },
  {
    id: "house",
    name: "Roommates",
    glyph: "✦",
    members: [
      { name: "Jess", avatar: "J" },
      { name: "Theo", avatar: "T" },
      { name: "You", avatar: "Y" },
    ],
    lastMessage: { person: "Jess", snippet: "ok measure J just qualified — we need to talk", timeAgo: "1h" },
    unread: 2,
  },
  {
    id: "movies",
    name: "Cinema posting",
    glyph: "◐",
    members: [
      { name: "Quinn", avatar: "Q" },
      { name: "Em", avatar: "E" },
      { name: "Reed", avatar: "R" },
      { name: "Mia", avatar: "M" },
      { name: "You", avatar: "Y" },
    ],
    lastMessage: { person: "Quinn", snippet: "told you the letterboxd thing was real", timeAgo: "3h" },
    unread: 0,
  },
  {
    id: "fed",
    name: "Slow burn news",
    glyph: "▲",
    members: [
      { name: "Aisha", avatar: "A" },
      { name: "Wes", avatar: "W" },
      { name: "Cam", avatar: "C" },
      { name: "You", avatar: "Y" },
    ],
    lastMessage: { person: "Aisha", snippet: "the 2001 argentina chart someone send me", timeAgo: "yesterday" },
    unread: 0,
  },
]

export type LoopMessage =
  | { kind: "text"; from: string; avatar: string; text: string; time: string }
  | {
      kind: "story-card"
      from: string
      avatar: string
      storyId: string
      time: string
      note?: string
    }
  | {
      kind: "margin-card"
      from: string
      avatar: string
      time: string
      question: string
      answer: string
      sourceCount: number
      storyId: string
    }

export const loopChat: Record<string, LoopMessage[]> = {
  techpolicy: [
    {
      kind: "text",
      from: "Maya",
      avatar: "M",
      text: "ok so the markup just imploded over the definition of 'foundation model' lol",
      time: "9:14",
    },
    {
      kind: "story-card",
      from: "Maya",
      avatar: "M",
      storyId: "ai-senate",
      time: "9:14",
    },
    {
      kind: "text",
      from: "Sam",
      avatar: "S",
      text: "the parameter-count thing is going to age so badly. like immediately.",
      time: "9:18",
    },
    {
      kind: "text",
      from: "Priya",
      avatar: "P",
      text: "yeah the EU went through this exact fight and ended up with a hybrid",
      time: "9:19",
    },
    {
      kind: "margin-card",
      from: "You",
      avatar: "Y",
      time: "9:22",
      question: "What's at stake here, plainly?",
      answer:
        "Two things. Who counts as an 'AI company' under federal law — parameter-count is precise but ages fast; capabilities is durable but harder to enforce. And whether open-source models get carved out — that's a real fork for the next five years.",
      sourceCount: 5,
      storyId: "ai-senate",
    },
    {
      kind: "text",
      from: "Devon",
      avatar: "D",
      text: "ok this is exactly what i was trying to articulate, sending this to my prof",
      time: "9:24",
    },
  ],
}

export const editorsBrief = "The Senate haggles over one word. California is underwater. Argentina, somehow, is winning."
