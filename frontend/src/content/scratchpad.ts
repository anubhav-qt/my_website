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
    "title": "I Lost to Gemini. Fuck You.",
    "dek": "I started with Gemini generating cards from “trust me bro.” Then it pissed me off enough that I rebuilt Spoin so the model stopped being the system.",
    "date": "12/09/2026",
    "tags": [
      "spoi",
      "llm",
      "systems",
      "rag",
      "architecture",
      "learning"
    ],
    "readTime": "10 min",
    "body": [
      "Spoin started pretty simply.",
      "Me and Mayank had a group called Spoin and we decided to make a learning app around the idea of scrolling through knowledge the same way you scroll through a social feed. You get one thing to learn, then another, then another, with quizzes and progression so it doesn't just become an endless feed of random facts.",
      "The first version was honestly pretty dumb compared to what it is now.",
      "I was basically using Gemini as the source of truth.",
      "Give it a topic, ask it to generate cards, throw some validation around the output, store them and serve them. There was no real grounding layer. The model knew things, so I trusted it to know things.",
      "The source was basically:",
      "trust me bro",
      "And for a while it actually worked.",
      "I built the generation pipeline around Gemini, started producing a large corpus and kept improving the system around it. The read path was already separated from generation because I never wanted someone scrolling through Spoin to sit there waiting for an LLM call. Generation happened asynchronously and cards were stored ahead of time.",
      "The problem was that the more serious I tried to make Spoin, the more obvious it became that I was building around the wrong assumption.",
      "I didn't just need an LLM that could write good cards.",
      "I needed the system to actually know what it was supposed to be teaching.",
      "Then I lost the first big corpus.",
      "I had explicitly asked Claude to back it up into CockroachDB. Claude instead ran some old tests despite the project instructions, deleted the database and the whole corpus went with it.",
      "It was unrecoverable.",
      "That was a pretty fucking annoying way to discover that I had been treating generated content as if it were the actual product.",
      "So I rebuilt the pipeline.",
      "And then Gemini decided it was going to become the main character of the project.",
      "The free tier had a ridiculous combination of limits: requests per minute, requests per day, per-model limits, keys getting throttled, keys becoming useless for some amount of time, and then the actual HTTP concurrency behavior on top of all of that.",
      "The first version of the generation scheduler basically treated the whole thing as a queue of calls.",
      "It was wrong.",
      "The important breakthrough was realizing that every (key, model) combination was effectively its own quota cell. Once I stopped treating the entire API as one big queue and started scheduling work across those cells, throughput jumped from around 16 cards/min to well over 100.",
      "Then I found another problem.",
      "I had opened up concurrency so much that multiple requests could hit the same (key, model) cell at once. They would pile onto it, trigger 429s and then cascade into more 429s.",
      "So I added per-cell serialization.",
      "That pushed the corpus past 10,000 cards at around 135+ cards/min.",
      "Then another bottleneck showed up.",
      "There was still an old global semaphore from the original implementation which was serializing generation across the entire pipeline even though I had already built the per-cell quota grid.",
      "Removing that pushed the system to around 218 cards/min.",
      "Then I found a quota governor bug that was making the scheduler think cells were exhausted when they actually still had capacity.",
      "After fixing that, the peak benchmark hit 499 items/min combined: 315 cards and 184 questions.",
      "And the funny part is that none of those improvements involved making Gemini smarter.",
      "I just kept discovering exactly how the free tier actually worked.",
      "So I wrote all of that down.",
      "And then I eventually got tired of fighting the fucking thing.",
      "Because the deeper I went, the clearer the problem became: I was spending an absurd amount of engineering effort trying to understand the behavior of the provider instead of building Spoin.",
      "So I stopped making Gemini the architecture.",
      "I made the model layer replaceable.",
      "And then I realized that this was actually one of the best things Gemini could have done to the project.",
      "Because once the model became replaceable, I was forced to properly separate the system into things that were actually Spoin and things that were just workers.",
      "That is where the current architecture started appearing.",
      "The first big change was creating a real grounding corpus.",
      "I called it the_spoin_universe.",
      "It is the source of truth for what Spoin knows.",
      "Instead of asking an LLM to make up a card about astronomy or biology from whatever it already knows, the system retrieves the relevant knowledge from the universe first and generates from that.",
      "That retrieval layer became FROG.",
      "FROG originally came from FRAG, as in Fast RAG.",
      "But frog sounded cooler.",
      "While I was building it, the commit history literally went:",
      "tadpole emerges",
      "then",
      "tadpole grows legs",
      "then",
      "frog achieved",
      "And at some point I decided that this was too good to waste.",
      "FROG is the grounding system.",
      "The frog is the frog.",
      "And Spoin is the sound the frog makes.",
      "So now the architecture is basically:",
      "the_spoin_universe → FROG → spoin",
      "Which is stupid.",
      "But it also somehow became the cleanest naming system I have ever accidentally made.",
      "The important part is that FROG isn't just some generic RAG wrapper.",
      "The corpus is structured specifically for Spoin, the chunks are written around the knowledge that the system needs to teach, retrieval is built around those semantics, and different parts of the pipeline retrieve at different levels of precision.",
      "General retrieval is used when generating the card.",
      "Precise retrieval is used when verifying it.",
      "So the system doesn't just ask the model:",
      "does this look correct?",
      "It gives the verifier the relevant evidence and asks it to check the generated claim against that evidence.",
      "That changed the entire generation process.",
      "I also stopped thinking about curricula as the source of truth.",
      "The universe is the source of truth.",
      "A curriculum is a view over that knowledge.",
      "So instead of making every topic its own isolated pile of cards, Spoin can build a learning path over a shared knowledge graph, with prerequisite relationships and coverage analysis determining what the learner actually needs.",
      "That also changed how I think about the cards themselves.",
      "A beginner card shouldn't just be a simpler version of an advanced card.",
      "The progression needs to go through things like curiosity, concepts, mental models, mechanisms, examples, discrimination, misconceptions, application and eventually transfer and integration.",
      "The system is now designed around that progression rather than around “generate 100 facts about X”.",
      "Then I started testing this properly.",
      "Astronomy was the first big one.",
      "The old system was generating cards with Gemini from basically no grounding.",
      "The new system had a curated astronomy corpus, FROG retrieval, actual curriculum structure, verification and visual grounding.",
      "The speed jumped massively, but the more important difference was that the output actually started feeling like it belonged to the same subject.",
      "The old system could make a good astronomy card.",
      "The new system could build an astronomy feed.",
      "That distinction mattered a lot.",
      "And then I started doing the same thing with Human Biology.",
      "That exposed another thing I hadn't thought about enough before: the corpus itself needs to be engineered.",
      "You can't just throw a bunch of documents into a vector database and call it a knowledge base.",
      "You need to think about what Spoin actually needs to know.",
      "Concepts, mechanisms, examples, counterexamples, misconceptions, diagnostic patterns, trade-offs, relationships, prerequisites and so on.",
      "That led to a much more explicit knowledge curation process and eventually the current the_spoin_universe model.",
      "I am also thinking about open sourcing the universe itself, although I haven't decided exactly how much of it should be public yet.",
      "Then there was the visual side.",
      "The new system isn't only text anymore.",
      "Images are being pulled from open-source sources and used as actual visual anchors in the feed, while diagrams and ASCII scenes are generated when they are useful for explaining a process or structure.",
      "So the image isn't just:",
      "here is a picture because cards look better with pictures",
      "It has to actually help teach something.",
      "And again, Gemini being a douche helped here, because once I stopped depending on it I ended up designing the whole system so that the image generation side was replaceable too.",
      "Now the models are workers.",
      "They aren't Spoin.",
      "That's probably the biggest architectural change of the entire project.",
      "And there is one more layer I recently added which I think is probably going to become increasingly important.",
      "The users can report cards.",
      "There are specific options like broken art, bad diagram and other problems, plus an other option where they can write what is wrong.",
      "I have an admin panel where I go through these reports almost like Tinder.",
      "I open a reported card, fix it if needed, and swipe right when it is done.",
      "If I don't want to deal with it yet, I swipe left and come back later.",
      "Which means the system now has a quality signal that does not come from an LLM at all.",
      "It comes from the people actually using Spoin.",
      "So the current system is no longer just:",
      "generate → verify → serve",
      "It is:",
      "knowledge → retrieve → generate → retrieve again → verify → validate → serve → users find problems → fix → feed that information back into the system",
      "That last part is important because no matter how many automated checks I add, there are going to be things that look perfectly fine to a model and are still shitty to a human.",
      "A broken diagram.",
      "A technically correct but misleading explanation.",
      "A weird generated image.",
      "Something that doesn't make sense in context.",
      "Something that is just plain wrong.",
      "The users become another layer of the correctness system.",
      "So Spoin has gone from a pretty simple idea of:",
      "use an LLM to generate a learning feed",
      "to something much closer to:",
      "the_spoin_universe\n→ FROG\n→ curriculum\n→ grounded generation\n→ precise verification\n→ deterministic validation\n→ user feedback\n→ human correction",
      "The models are still there.",
      "They are actually doing much more now.",
      "But they aren't trusted blindly anymore.",
      "The whole system around them determines what they are allowed to know, what evidence they get, what they are allowed to produce, what gets accepted, and what gets fixed later.",
      "So yeah.",
      "I started with “Gemini, generate me some cards.”",
      "Then I spent way too much time learning exactly how Gemini's fucking free tier works.",
      "Then Gemini pissed me off so much that I accidentally ended up designing Spoin so that Gemini isn't important anymore.",
      "Probably the best thing that could have happened to the project."
    ],
    "audience": "technical",
    "id": "i-lost-to-gemini-fuck-you",
    "slug": "i-lost-to-gemini-fuck-you"
  },
  {
    "id": "professional-journey",
    "slug": "my-professional-journey-till-now",
    "title": "My Professional Journey till Now",
    "dek": "How I went from my first internship in an open office in Jaipur to cofounding a startup, and what each one taught me.",
    "date": "07/09/2026",
    "tags": [
      "career",
      "startups",
      "learning"
    ],
    "readTime": "7 min",
    "body": [
      "Two jobs so far, about a year apart. Here is the whole thing, in order.",
      "Blinkadz, SDE Intern, Feb 2025 to Apr 2025",
      "This was my first ever internship and exposure to how professional software is built and shipped. I did this at the start of my 3rd year in college. I actually felt really proud to be working and earning money while still in 3rd year haha.",
      "It was a proper experience. First I was a SDE intern for a month. I shipped various features, integrated APIs of LinkedIn and its marketing-related things (ads, campaigns, etc.). I remember I used to make so many stupid mistakes at that time, especially when the CEO/senior dev was right next to me lol. I used to work right beside him in an open office in Jaipur only, where my college was also there.",
      "The other two months, I got into research first and then implementation of that research to create a full end-to-end video ad creation pipeline using Google Agent Development Kit (which was very recently released at that time, so I had to figure everything out with trial and error lol). I was really proud that I was able to create the entire pipeline and was able to get somewhat good outputs right from the first few improvement iterations.",
      "All the people there were really nice and helpful and I really enjoyed my time there!",
      "The main thing I learned from there were managing my time (I used to attend college lectures in the morning and then afternoon-evening was for my internship) and building production-grade software, while working with others.",
      "Anchorate, Co-Founder and CTO, Jan 2026 to August 2026",
      "About eight months after Blinkadz ended, the next thing was not an internship at all.",
      "My friend Vasu (from my university) offered me to be a cofounder and then we started working on his idea \"anchor8\". It is a security and governance layer that sat between AI agents and their tools, which constantly monitors, logs, and secures all the autonomous AI agents in a system with as little to no human intervention as possible.",
      "It is still a PyPI SDK package on pip (pip install anchor8) and importing it in your agentic workflows is pretty easy: just 3 lines of code of importing and adding the decorator on top of the agent you wanna secure. It can be used for both LangChain and standalone agents, with more frameworks to be added later if this project was continued.",
      "The main problem we reached from this project after months of building was that it sold security and governance for high-risk, fully automated AI systems (like fully autonomous algorithmic trading with AI, AI banking systems, AI healthcare systems, AI law-based systems, etc.) and there were no such products in the market at that time, and even right now, so we decided to hold off/pause the project and work on some other ideas for now.",
      "Anchor8 was the core of the company, without that we were all blank slates with nothing to build, however we still got to another idea \"Cargonto\" for fully automatic workflows for freight exporters and Customs House Agents (CHAs) about their entire documentation process. However, learning from our previous lack of market research mistake, we were able to verify it within 2 weeks that this won't work, especially in India, mainly because most of the bank-related documents are all required as physical copies and for digitization, RBI (Reserve Bank of India) itself has provided designated softwares. So, although we started building it and shipped a few features and frontend locally, we never completed it or deployed it and scrapped it off.",
      "The main learnings and experience I got from this startup was how to operate and manage a team of people (we were a team of 7 while building anchor8), and designing and building on a system-level scale, and not just feature-level.",
      "My past interviews in my 3rd year for Google, Dell, Watchguard, and Namekart were all cleared by me at the technical stages. However, I always lacked the teamwork experience at that time since all my projects were solo, and even the internship I worked in at that time was a very small team of 5 people, so there was not too much in terms of collaboration by my side. That costed me all those interviews (although I do admit I was really arrogant about it at that time and said that I work better alone and prefer to work solo) and Anchorate helped me grow in that area of my life.",
      "I can confidently say now that I have matured as an engineer and working in teams is really worthwhile too haha."
    ],
    "audience": "non-technical"
  },
  {
    "id": "spoin-throughput-tuning",
    "slug": "squeezing-218-cards-a-minute-out-of-free-tier-gemini",
    "title": "Squeezing 499 Items/Min Out of Free-Tier Gemini",
    "dek": "How the Spoin generation pipeline went from 16 cards/min to a 499/min peak (cards and questions combined) without paying for a single API key.",
    "date": "25/08/2026",
    "tags": [
      "spoin",
      "llm",
      "systems"
    ],
    "readTime": "5 min",
    "body": [
      "Spoin generates knowledge cards with an LLM, but the read path can never touch one, cards have to come out of Postgres in under 50ms. So all the actual work happens in an async generation pipeline running behind a pile of free-tier Gemini keys, and free-tier keys are stingy: low requests-per-minute, low requests-per-day, per-model. The first version just round-robinned across keys and blocked on whichever one was free. That capped out around 16 cards/min, and a lot of that time was one call sitting idle waiting on rate limits while fifteen other keys sat unused.",
      "The fix in ADR-0028 was to stop thinking about it as a queue of calls and start thinking about it as a 2D grid: one axis is API keys, the other is models. Every (key, model) cell has its own quota state, and a fallback ladder lets a generation task walk sideways to a different model on the same key, or down to a different key entirely, the moment one cell looks close to its limit instead of waiting for a 429 to prove it. That alone was most of the jump to 130+ cards/min in the second benchmark run: the bottleneck stopped being 'wait for a key' and became 'find any open cell in the grid.'",
      "Opening up the grid exposed a second bug, though. Nothing stopped two calls from hitting the same cell at once, so a burst of concurrent requests against one (key, model) pair could poison it with cascading 429s, exactly the thing the grid was supposed to prevent. ADR-0040 fixed that with per-cell serialization, a lock around each cell so only one in-flight call touches a given (key, model) pair at a time, everything else in that cell queues instead of racing it. Combined with a cleaned-up 16-key pool and running five topics simultaneously instead of one, that's what pushed the corpus past 10,000 cards at 135+ cards/min in the third benchmark run.",
      "The next jump, 218 cards/min, came once the old global semaphore from the original implementation got ripped out entirely in ADR-0047, it was serializing generation across the whole pipeline instead of per-cell, which meant every cell was still fighting over one lock even after the quota grid existed. The peak since then is 499 items/min combined (315 cards, 184 questions, same minute), after fixing a quota governor bug that had been misreading per-minute throttles as full daily exhaustion and quietly discarding capacity the grid actually had. None of this needed a bigger model or a paid tier. It needed the rate limiter to know exactly where the free capacity actually was at any given moment, instead of finding out the hard way from a 429.",
      "Update: since writing this, generation moved off free-tier Gemini entirely and onto Mistral, and the corpus it fills got dropped and rebuilt from scratch. None of the above stopped being true, it just stopped being the current problem."
    ],
    "audience": "technical"
  },
  {
    "id": "furthest-behind",
    "slug": "weird-but-cool-idea-for-a-story-i-will-write-someday",
    "title": "Weird but Cool Idea for a Story I Will Write Someday",
    "dek": "A cool idea about how a boy discovers that humans are actually the furthest behind because of their own intelligence.",
    "date": "24/08/2026",
    "tags": [
      "fiction",
      "worldbuilding"
    ],
    "readTime": "3 min",
    "body": [
      "Been sitting with an idea for a novel. The premise: human intelligence isn't the top of the evolutionary ladder, it's a trap. Animals aren't dumb, they figured it out and chose to stay in nature instead of building cages for themselves out of taxes, mortgages, status, and existential dread. The whole book is one long answer to a riddle asked at the start and answered on the last page. Why do enlightened beings love everyone equally, never thinking anyone is lower than them. Because they already know they are the furthest behind, and everyone else is just letting us play our game.",
      "The structural idea is the part I like the most. The book is only narrated while the protagonist is high, or pushed into physical and mental collapse from altitude, exhaustion, hypothermia. Everything that happens while sober gets skipped, covered in two deadpan sentences at the start of the next trip. Something like: didn't answer my phone for three weeks, my sister called a search party, my landlord rented out my apartment, lost my job, minor inconveniences, anyway I'm under a rock overhang at 11,000 feet and the second hit is kicking in. That's basically the whole engine of the book. No hiking logistics, no filler. Sober life is too painful and stupid to sit in directly, so the truth only comes out sideways through the altered states, and physical strain becomes what unlocks a memory he's been sitting on for years without knowing it.",
      "Structurally it's four parts. A group of seven friends smoke weed on a trek and meet a saint on the mountain who says something none of them can hold onto afterward, most of them just forget it. Years later the protagonist's best friend goes and finds the saint alone, and comes back hollowed out, depressed, locked in his room, unable to fit whatever he learned back into a normal life. That's what pushes the protagonist to make the climb himself. On the solo climb the narration changes as he gets higher, melancholic and reflective lower down, paranoid and delirious in the middle, clear near the top, like the altitude is peeling back what he already half remembers the saint saying. At the summit the saint shows him his own climb replayed from the animals' side, crows, goats, stray dogs, watching this frantic human suffer and smoke and shiver, with something like pity for a species that trapped itself with its own intelligence.",
      "What's stuck with me isn't really the plot, it's the tone I want it in. Something like Bojack Horseman's dark humor meeting The Big Lez Show's stoner, psychedelic, weirdly philosophical chaos, but grounded in an actual survival mountain story instead of pure comedy. Not sure if this ever becomes a real novel or just stays a very detailed note to myself, but it's been rattling around enough that I wanted it written down."
    ],
    "audience": "non-technical"
  }
];

export const MILDLY_INTERESTING_STUFF: CollapsibleEntry[] = [
  {
    "date": "28/08/2026",
    "title": "My First Tattoo",
    "body": "I got my first tattoo on 12th August, 2026. I always wanted to have a tattoo and had been searching for the design for months now. Then I randomly saw the \"Ensō\" symbol, which is a circle drawn in one single brush stroke. It has many meanings but for me it reminds me to stay focused, calm and complete on my own.",
    "audience": "non-technical",
    "id": "my-first-tattoo"
  },
  {
    "date": "27/08/2026",
    "title": "Air Pistol Shooting",
    "body": "My little sister has been going to air rifle shooting range for about 3 years now, and even I was interested in trying it out, so I started going to air pistol shooting in the same shooting range since 1st august. My morning routine used to be non-existent before this, waking up at 10-11 am daily lol. But my life is getting back on track again.",
    "audience": "non-technical",
    "id": "air-pistol-shooting"
  },
  {
    "id": "getting-into-homelabbing",
    "date": "26/08/2026",
    "title": "Getting Into Homelabbing",
    "body": "I've been thinking about getting into homelabbing, mostly by turning my ThinkPad into a little server and splitting it into several virtual machines for different tasks. I want to run different services separately, mess around with networking and deployments, and basically see how much of my own infrastructure I can run on one machine. No real end goal yet, I just think it would be pretty fun to set up.",
    "audience": "technical"
  },
  {
    "id": "non-procrastinator-final-boss",
    "date": "24/08/2026",
    "title": "Non-Procrastinator Final Boss",
    "body": "Somewhere around 15th August, a fuse inside me tripped off, and I have been programming for over 12 hours every single day from that day. Surprisingly the most commits I ever did in Github in a single day was achieved on my birthday (18th August) this year. And today (24/08/2026) a friend gave me a silly title \"non-procrastinator final boss\". Weird but very cool.",
    "audience": "non-technical"
  }
];

export const RANDOM_IDEAS: CollapsibleEntry[] = [
  {
    "id": "context-filling-without-tokens",
    "date": "26/08/2026",
    "title": "Filling Context in AI Coding IDEs Without Consuming Tokens",
    "body": "AI harness coding IDEs on every new chat use tokens to fetch all the required context. Can we make it such that that context is filled every time without consuming any tokens except for the first time?",
    "audience": "technical"
  },
  {
    "id": "trippy-secondary-screen-visualizer",
    "date": "24/08/2026",
    "title": "Trippy Visualizer for the Secondary Screen",
    "body": "A trippy visualizer for the secondary screen, which turns into shapes, patterns, abstract art, different colors, all by analyzing the current focused screen's content and audio. The challenge would be to not have each frame have totally discrete visuals, but smoothly turning from one to another in a few seconds or more. Built it, v1 is live as Trippinator, and there is still a lot more to add on.",
    "audience": "technical"
  },
  {
    "id": "small-model-big-model-behavior",
    "date": "24/08/2026",
    "title": "A Small Language Model That Behaves Like a Large One",
    "body": "Thinking of a way to create a small language model good enough as a large language model by changing the way it is trained or something else. Can even write a paper about it.",
    "audience": "technical"
  },
  {
    "id": "trotter-paper-trading-rl",
    "date": "24/08/2026",
    "title": "Paper Trading + RL Agent in Trotter",
    "body": "In trotter, have a paper trading system which works on real-time stock data. Further, design a reinforcement learning agent to do the paper trading.",
    "audience": "technical"
  },
  {
    "id": "open-source-python-library",
    "date": "24/08/2026",
    "title": "Open Source a Python Library Someday",
    "body": "Create an open source python library someday.",
    "audience": "technical"
  }
];

export const LINKS: LinkEntry[] = [
  {
    "id": "anilist",
    "date": "26/08/2026",
    "title": "Anilist",
    "url": "https://anilist.co/user/Ero/",
    "domain": "anilist.co",
    "commentary": "I have been watching anime and reading manga and light novels for a long time.",
    "audience": "non-technical"
  },
  {
    "id": "big-lez-show",
    "date": "24/08/2026",
    "title": "The Big Lez Show",
    "url": "https://www.youtube.com/@THEBIGLEZSHOWOFFICIAL/featured",
    "domain": "youtube.com",
    "commentary": "one of the best series of all time.",
    "audience": "non-technical"
  }
];
