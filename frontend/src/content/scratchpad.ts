export interface WriteupEntry {
  id: string;
  slug: string;
  title: string;
  dek: string;
  date: string;
  tags: string[];
  readTime: string;
  body: string[];
}

export interface CollapsibleEntry {
  id: string;
  date: string;
  title: string;
  body: string;
}

export interface LinkEntry {
  id: string;
  date: string;
  title: string;
  url: string;
  domain: string;
  commentary: string;
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
  },
];

export const MILDLY_INTERESTING_STUFF: CollapsibleEntry[] = [
  {
    id: 'non-procrastinator-final-boss',
    date: '24/08/2026',
    title: 'non-procrastinator final boss',
    body: "Somewhere around 15th August, a fuse inside me tripped off, and I have been programming for over 12 hours every single day from that day. Surprisingly the most commits I ever did in Github in a single day was achieved on my birthday (18th August) this year. And today (24/08/2026) a friend gave me a silly title \"non-procrastinator final boss\". Weird but very cool.",
  },
];

export const RANDOM_IDEAS: CollapsibleEntry[] = [
  {
    id: 'trippy-secondary-screen-visualizer',
    date: '24/08/2026',
    title: 'trippy visualizer for the secondary screen',
    body: "A trippy visualizer for the secondary screen, which turns into shapes, patterns, abstract art, different colors, all by analyzing the current focused screen's content and audio. The challenge would be to not have each frame have totally discrete visuals, but smoothly turning from one to another in a few seconds or more.",
  },
  {
    id: 'small-model-big-model-behavior',
    date: '24/08/2026',
    title: 'a small language model that behaves like a large one',
    body: "Thinking of a way to create a small language model good enough as a large language model by changing the way it is trained or something else. Can even write a paper about it.",
  },
  {
    id: 'trotter-paper-trading-rl',
    date: '24/08/2026',
    title: 'paper trading + RL agent in Trotter',
    body: 'In trotter, have a paper trading system which works on real-time stock data. Further, design a reinforcement learning agent to do the paper trading.',
  },
  {
    id: 'open-source-python-library',
    date: '24/08/2026',
    title: 'open source a python library someday',
    body: "Create an open source python library someday.",
  },
];

export const LINKS: LinkEntry[] = [
  {
    id: 'big-lez-show',
    date: '24/08/2026',
    title: 'The Big Lez Show',
    url: 'https://www.youtube.com/@THEBIGLEZSHOWOFFICIAL/featured',
    domain: 'youtube.com',
    commentary: 'one of the best series of all time.',
  },
];
