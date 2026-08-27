// Censor system that replaces NSFW words, profanity, and offensive slang with "weird".
// Supports English and Hindi/Hinglish slang with leetspeak/variation normalization,
// and persistent WeirdName{x} numbering for offensive nicknames.

const SWEAR_WORDS: string[] = [
  // English profanities & slurs
  'fuck',
  'fucking',
  'fucked',
  'fucker',
  'fuckers',
  'fucks',
  'fuckin',
  'fck',
  'fuk',
  'fugg',
  'shit',
  'shits',
  'shitting',
  'shitty',
  'shitted',
  'bitch',
  'bitches',
  'bitching',
  'bitchy',
  'asshole',
  'assholes',
  'dumbass',
  'jackass',
  'bastard',
  'bastards',
  'cunt',
  'cunts',
  'dick',
  'dicks',
  'dickhead',
  'dickheads',
  'cock',
  'cocks',
  'cocksucker',
  'pussy',
  'pussies',
  'dildo',
  'dildos',
  'slut',
  'sluts',
  'slutty',
  'whore',
  'whores',
  'porn',
  'porno',
  'pornography',
  'nsfw',
  'hentai',
  'milf',
  'nigger',
  'niggers',
  'nigga',
  'niggas',
  'nigg',
  'faggot',
  'faggots',
  'fag',
  'fags',
  'retard',
  'retarded',
  'retards',
  'penis',
  'penises',
  'vagina',
  'vaginas',
  'tits',
  'titties',
  'boobs',
  'boobies',
  'blowjob',
  'handjob',
  'cum',
  'cumming',
  'jerkoff',
  'masturbate',
  'masturbation',
  'orgasm',
  'wank',
  'wanker',
  'twat',
  'prick',
  'pedophile',
  'pedo',
  'rapist',
  'rape',

  // Hindi / Hinglish profanities & slurs
  'lodu',
  'loda',
  'lauda',
  'laude',
  'laudo',
  'lode',
  'lund',
  'chutiya',
  'chutiye',
  'chutiyap',
  'chutiyapa',
  'chootiya',
  'chutya',
  'chut',
  'choot',
  'chudai',
  'chudwa',
  'chudap',
  'chod',
  'choda',
  'chode',
  'chootmarike',
  'chutmarike',
  'bhenchod',
  'behenchod',
  'bhenchodd',
  'bhenchods',
  'bsdk',
  'bhosdike',
  'bhosadike',
  'bhosadi',
  'bhosdi',
  'bhosda',
  'bhosada',
  'bhosdiwala',
  'bhosadiwala',
  'bkl',
  'madarchod',
  'maderchod',
  'madarjaat',
  'gandu',
  'gaand',
  'gand',
  'gandfat',
  'ganduon',
  'randi',
  'raand',
  'randiwaala',
  'randirona',
  'randwa',
  'harami',
  'haraami',
  'lavde',
  'lavda',
  'bhadwa',
  'bhadwe',
  'chinal',
  'jhant',
  'jhaant',
  'suar',
  'kamina',
  'kamine',
  'kameena',
  'tatte',
  'tatta',
  'muth',
  'mutthal',
];

// Additional substrings/roots specifically checked for nickname detection
const NAME_OFFENSIVE_ROOTS: string[] = [
  'nige',
  'nigg',
  'nigga',
  'nigger',
  'fag',
  'chutiya',
  'chut',
  'choot',
  'lodu',
  'lauda',
  'laude',
  'loda',
  'lode',
  'lund',
  'bhenchod',
  'behenchod',
  'bsdk',
  'bhosd',
  'bkl',
  'madarchod',
  'maderchod',
  'gandu',
  'gaand',
  'randi',
  'randwa',
  'harami',
  'lavde',
  'lavda',
  'bhadwa',
  'bhadwe',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'cunt',
  'dick',
  'cock',
  'pussy',
  'slut',
  'whore',
  'porn',
  'retard',
  'pedo',
  'rapist',
];

// Sort longer words first to avoid partial word collisions in regex
const SORTED_WORDS = [...SWEAR_WORDS].sort((a, b) => b.length - a.length);

// Escape regex special chars
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build regex with word boundary \b
const CENSOR_REGEX = new RegExp(
  `\\b(${SORTED_WORDS.map(escapeRegex).join('|')})\\b`,
  'gi'
);

function formatReplacement(match: string): string {
  if (match === match.toUpperCase() && match.length > 1) {
    return 'WEIRD';
  }
  if (match[0] === match[0].toUpperCase()) {
    return 'Weird';
  }
  return 'weird';
}

/**
 * Normalizes leetspeak and repeated letters to catch disguised swear words:
 * e.g. "l000du" -> "lodu", "f*ck" -> "fck", "b!tch" -> "bitch"
 */
function normalizeLeetspeak(text: string): string {
  return text
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/@/g, 'a')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/(.)\1{2,}/g, '$1$1'); // collapse 3+ repeated characters to 2
}

/**
 * Replaces any NSFW / swear words in comments with "weird", preserving casing.
 */
export function censorText(text: string): string {
  if (!text) return text;
  return text.replace(CENSOR_REGEX, (match) => formatReplacement(match));
}

// Persistent storage key for mapping offensive names to exact integer index x
const STORAGE_KEY = 'censor:offensive-names';

function loadPersistedMap(): Map<string, number> {
  const map = new Map<string, number>();
  if (typeof localStorage === 'undefined') return map;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      for (const [name, id] of Object.entries(parsed)) {
        if (typeof id === 'number') map.set(name, id);
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return map;
}

function savePersistedMap(map: Map<string, number>) {
  if (typeof localStorage === 'undefined') return;
  try {
    const obj: Record<string, number> = {};
    for (const [name, id] of map.entries()) {
      obj[name] = id;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore storage write errors
  }
}

const offensiveNameMap = loadPersistedMap();

function getNextOffensiveId(): number {
  let maxId = 0;
  for (const id of offensiveNameMap.values()) {
    if (id > maxId) maxId = id;
  }
  return maxId + 1;
}

function isOffensiveName(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  const normalized = normalizeLeetspeak(name);

  // Check if it matches censor regex directly
  CENSOR_REGEX.lastIndex = 0;
  if (CENSOR_REGEX.test(name) || CENSOR_REGEX.test(normalized)) return true;

  // Check if any offensive root is contained in the name or normalized name
  return NAME_OFFENSIVE_ROOTS.some((root) => lower.includes(root) || normalized.includes(root));
}

/**
 * Censoring for usernames/nicknames. If a name contains offensive roots/words,
 * replaces it with WeirdName{x} (1, 2, 3...), where identical names (exact casing)
 * always receive the same x integer across all threads and visits.
 */
export function censorNickname(name: string): string {
  if (!name) return name;

  if (isOffensiveName(name)) {
    if (!offensiveNameMap.has(name)) {
      const nextId = getNextOffensiveId();
      offensiveNameMap.set(name, nextId);
      savePersistedMap(offensiveNameMap);
    }
    const id = offensiveNameMap.get(name)!;
    return `WeirdName${id}`;
  }

  return name;
}
