const SESSION_KEY = 'site-session-id';

// One id per browser, reused for likes/views so repeat visits within the
// same browser collapse to a single like/view no matter how many clicks.
export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
