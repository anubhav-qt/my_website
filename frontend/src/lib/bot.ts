// Best-effort filter for well-behaved crawlers (link-preview unfurlers,
// search engines) that identify themselves honestly and usually run stock
// headless Chrome without hiding it. Catches the common, polite case --
// not real bot detection, and trivially bypassed by anything that wants to
// look like a real browser. See README's "Views, two scopes" section.
const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|linkedinbot|slackbot|twitterbot|discordbot|telegrambot|whatsapp|pinterest|embedly|quora link preview|outbrain|w3c_validator|redditbot|applebot|bingpreview|duckduckbot|baiduspider|yandexbot|headlesschrome/i;

export function isLikelyBot(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (navigator.webdriver) return true;
  return BOT_UA_PATTERN.test(navigator.userAgent);
}
