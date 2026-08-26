export type Audience = 'technical' | 'non-technical';

export interface WriteupEntry {
  id: string;
  slug: string;
  title: string;
  dek: string;
  date: string;
  tags: string[];
  readTime: string;
  body: string[];
  audience: Audience;
}

export interface CollapsibleEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  audience: Audience;
}

export interface LinkEntry {
  id: string;
  date: string;
  title: string;
  url: string;
  domain: string;
  commentary: string;
  audience: Audience;
}

export const WRITEUPS: WriteupEntry[] = [
  {
    id: 'furthest-behind',
    slug: 'weird-but-cool-idea-for-a-story-i-will-write-someday',
    title: 'weird but cool idea for a story i will write someday',
    dek: 'a cool idea about how a boy discovers that humans are actually the furthest behind because of their own intelligence.',
    date: '24/08/2026',
    tags: ['fiction', 'worldbuilding'],
    readTime: '3 min',
    body: [
      "Been sitting with an idea for a novel. The premise: human intelligence isn't the top of the evolutionary ladder, it's a trap. Animals aren't dumb, they figured it out and chose to stay in nature instead of building cages for themselves out of taxes, mortgages, status, and existential dread. The whole book is one long answer to a riddle asked at the start and answered on the last page. Why do enlightened beings love everyone equally, never thinking anyone is lower than them. Because they already know they are the furthest behind, and everyone else is just letting us play our game.",
      "The structural idea is the part I like the most. The book is only narrated while the protagonist is high, or pushed into physical and mental collapse from altitude, exhaustion, hypothermia. Everything that happens while sober gets skipped, covered in two deadpan sentences at the start of the next trip. Something like: didn't answer my phone for three weeks, my sister called a search party, my landlord rented out my apartment, lost my job, minor inconveniences, anyway I'm under a rock overhang at 11,000 feet and the second hit is kicking in. That's basically the whole engine of the book. No hiking logistics, no filler. Sober life is too painful and stupid to sit in directly, so the truth only comes out sideways through the altered states, and physical strain becomes what unlocks a memory he's been sitting on for years without knowing it.",
      "Structurally it's four parts. A group of seven friends smoke weed on a trek and meet a saint on the mountain who says something none of them can hold onto afterward, most of them just forget it. Years later the protagonist's best friend goes and finds the saint alone, and comes back hollowed out, depressed, locked in his room, unable to fit whatever he learned back into a normal life. That's what pushes the protagonist to make the climb himself. On the solo climb the narration changes as he gets higher, melancholic and reflective lower down, paranoid and delirious in the middle, clear near the top, like the altitude is peeling back what he already half remembers the saint saying. At the summit the saint shows him his own climb replayed from the animals' side, crows, goats, stray dogs, watching this frantic human suffer and smoke and shiver, with something like pity for a species that trapped itself with its own intelligence.",
      "What's stuck with me isn't really the plot, it's the tone I want it in. Something like Bojack Horseman's dark humor meeting The Big Lez Show's stoner, psychedelic, weirdly philosophical chaos, but grounded in an actual survival mountain story instead of pure comedy. Not sure if this ever becomes a real novel or just stays a very detailed note to myself, but it's been rattling around enough that I wanted it written down.",
    ],
    audience: 'non-technical',
  },
  {
    id: 'spoin-throughput-tuning',
    slug: 'squeezing-218-cards-a-minute-out-of-free-tier-gemini',
    title: 'squeezing 499 items/min out of free-tier gemini',
    dek: 'how the spoin generation pipeline went from 16 cards/min to a 499/min peak (cards and questions combined) without paying for a single API key.',
    date: '25/08/2026',
    tags: ['spoin', 'llm', 'systems'],
    readTime: '5 min',
    body: [
      "Spoin generates knowledge cards with an LLM, but the read path can never touch one, cards have to come out of Postgres in under 50ms. So all the actual work happens in an async generation pipeline running behind a pile of free-tier Gemini keys, and free-tier keys are stingy: low requests-per-minute, low requests-per-day, per-model. The first version just round-robinned across keys and blocked on whichever one was free. That capped out around 16 cards/min, and a lot of that time was one call sitting idle waiting on rate limits while fifteen other keys sat unused.",
      "The fix in ADR-0028 was to stop thinking about it as a queue of calls and start thinking about it as a 2D grid: one axis is API keys, the other is models. Every (key, model) cell has its own quota state, and a fallback ladder lets a generation task walk sideways to a different model on the same key, or down to a different key entirely, the moment one cell looks close to its limit instead of waiting for a 429 to prove it. That alone was most of the jump to 130+ cards/min in the second benchmark run: the bottleneck stopped being 'wait for a key' and became 'find any open cell in the grid.'",
      "Opening up the grid exposed a second bug, though. Nothing stopped two calls from hitting the same cell at once, so a burst of concurrent requests against one (key, model) pair could poison it with cascading 429s, exactly the thing the grid was supposed to prevent. ADR-0040 fixed that with per-cell serialization, a lock around each cell so only one in-flight call touches a given (key, model) pair at a time, everything else in that cell queues instead of racing it. Combined with a cleaned-up 16-key pool and running five topics simultaneously instead of one, that's what pushed the corpus past 10,000 cards at 135+ cards/min in the third benchmark run.",
      "The next jump, 218 cards/min, came once the old global semaphore from the original implementation got ripped out entirely in ADR-0047, it was serializing generation across the whole pipeline instead of per-cell, which meant every cell was still fighting over one lock even after the quota grid existed. The peak since then is 499 items/min combined (315 cards, 184 questions, same minute), after fixing a quota governor bug that had been misreading per-minute throttles as full daily exhaustion and quietly discarding capacity the grid actually had. None of this needed a bigger model or a paid tier. It needed the rate limiter to know exactly where the free capacity actually was at any given moment, instead of finding out the hard way from a 429.",
    ],
    audience: 'technical',
  },
];

export const MILDLY_INTERESTING_STUFF: CollapsibleEntry[] = [
  {
    id: 'getting-into-homelabbing',
    date: '26/08/2026',
    title: 'getting into homelabbing',
    body: "I've been thinking about getting into homelabbing, mostly by turning my ThinkPad into a little server and splitting it into several virtual machines for different tasks. I want to run different services separately, mess around with networking and deployments, and basically see how much of my own infrastructure I can run on one machine. No real end goal yet, I just think it would be pretty fun to set up.",
    audience: 'technical',
  },
  {
    id: 'non-procrastinator-final-boss',
    date: '24/08/2026',
    title: 'non-procrastinator final boss',
    body: "Somewhere around 15th August, a fuse inside me tripped off, and I have been programming for over 12 hours every single day from that day. Surprisingly the most commits I ever did in Github in a single day was achieved on my birthday (18th August) this year. And today (24/08/2026) a friend gave me a silly title \"non-procrastinator final boss\". Weird but very cool.",
    audience: 'non-technical',
  },
];

export const RANDOM_IDEAS: CollapsibleEntry[] = [
  {
    id: 'context-filling-without-tokens',
    date: '26/08/2026',
    title: 'filling context in AI coding IDEs without consuming tokens',
    body: 'AI harness coding IDEs on every new chat use tokens to fetch all the required context. Can we make it such that that context is filled every time without consuming any tokens except for the first time?',
    audience: 'technical',
  },
  {
    id: 'trippy-secondary-screen-visualizer',
    date: '24/08/2026',
    title: 'trippy visualizer for the secondary screen',
    body: "A trippy visualizer for the secondary screen, which turns into shapes, patterns, abstract art, different colors, all by analyzing the current focused screen's content and audio. The challenge would be to not have each frame have totally discrete visuals, but smoothly turning from one to another in a few seconds or more.",
    audience: 'technical',
  },
  {
    id: 'small-model-big-model-behavior',
    date: '24/08/2026',
    title: 'a small language model that behaves like a large one',
    body: "Thinking of a way to create a small language model good enough as a large language model by changing the way it is trained or something else. Can even write a paper about it.",
    audience: 'technical',
  },
  {
    id: 'trotter-paper-trading-rl',
    date: '24/08/2026',
    title: 'paper trading + RL agent in Trotter',
    body: 'In trotter, have a paper trading system which works on real-time stock data. Further, design a reinforcement learning agent to do the paper trading.',
    audience: 'technical',
  },
  {
    id: 'open-source-python-library',
    date: '24/08/2026',
    title: 'open source a python library someday',
    body: "Create an open source python library someday.",
    audience: 'technical',
  },
];

export const LINKS: LinkEntry[] = [
  {
    id: 'anilist',
    date: '26/08/2026',
    title: 'Anilist',
    url: 'https://anilist.co/user/Ero/',
    domain: 'anilist.co',
    commentary: 'I have been watching anime and reading manga and light novels for a long time.',
    audience: 'non-technical',
  },
  {
    id: 'big-lez-show',
    date: '24/08/2026',
    title: 'The Big Lez Show',
    url: 'https://www.youtube.com/@THEBIGLEZSHOWOFFICIAL/featured',
    domain: 'youtube.com',
    commentary: 'one of the best series of all time.',
    audience: 'non-technical',
  },
];

