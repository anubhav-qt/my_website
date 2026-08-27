// Censor system that replaces NSFW words, profanity, and offensive slang with "weird".
// Supports English and Hindi/Hinglish slang with word-boundary awareness.

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

  // Hindi / Hinglish profanities & slurs
  'lodu',
  'loda',
  'lauda',
  'laude',
  'laudo',
  'lode',
  'chutiya',
  'chutiye',
  'chutiyap',
  'chutiyapa',
  'chootiya',
  'chutya',
  'chut',
  'choot',
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
  'bkl',
  'madarchod',
  'maderchod',
  'madarjaat',
  'gandu',
  'gaand',
  'gand',
  'ganduon',
  'randi',
  'raand',
  'randiwaala',
  'randirona',
  'harami',
  'haraami',
  'lavde',
  'lavda',
  'suar',
  'kamina',
  'kamine',
  'tatte',
  'tatta',
  'mutthal',
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
 * Replaces any NSFW / swear words with "weird", preserving casing.
 */
export function censorText(text: string): string {
  if (!text) return text;
  return text.replace(CENSOR_REGEX, (match) => formatReplacement(match));
}
