#!/usr/bin/env python3
"""Interactive CLI for managing Spoin's live topics list on the portfolio site.

Visitors can only *suggest* a topic (inserted with status='suggested');
promoting one to live, adding one directly, or rejecting a suggestion needs
the service role key, which this script reaches through the manage-topic
Edge Function (see frontend/supabase/functions/manage-topic/index.ts).

Zero third-party dependencies -- stdlib only.

Usage:
    python scripts/manage_topics.py
    (or double-click scripts/manage-topics.bat on Windows)
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
sys.stdin.reconfigure(encoding="utf-8")

FRONTEND_DIR = Path(__file__).resolve().parent.parent


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip()
    return values


def load_config() -> dict[str, str]:
    env = load_env_file(FRONTEND_DIR / ".env.local")
    secrets = load_env_file(FRONTEND_DIR / ".secrets.local")

    supabase_url = env.get("VITE_SUPABASE_URL")
    anon_key = env.get("VITE_SUPABASE_ANON_KEY")
    admin_secret = secrets.get("ADMIN_SECRET")

    missing = [
        name
        for name, value in [
            ("VITE_SUPABASE_URL", supabase_url),
            ("VITE_SUPABASE_ANON_KEY", anon_key),
            ("ADMIN_SECRET", admin_secret),
        ]
        if not value
    ]
    if missing:
        print(f"Missing from .env.local / .secrets.local: {', '.join(missing)}")
        sys.exit(1)

    return {"url": supabase_url, "anon_key": anon_key, "admin_secret": admin_secret}


def fetch_topics(config: dict[str, str]) -> list[dict]:
    url = f"{config['url']}/rest/v1/topics?select=id,title,note,status,submitted_at&order=submitted_at.desc"
    req = urllib.request.Request(
        url,
        headers={"apikey": config["anon_key"], "Authorization": f"Bearer {config['anon_key']}"},
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def call_manage_topic(config: dict[str, str], body: dict) -> dict:
    url = f"{config['url']}/functions/v1/manage-topic"
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        method="POST",
        headers={"x-admin-secret": config["admin_secret"], "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"\nFailed ({e.code}): {e.read().decode()}")
        sys.exit(1)


def prompt(label: str, default: str | None = None) -> str:
    suffix = f" [{default}]" if default else ""
    value = input(f"{label}{suffix}: ").strip()
    return value or (default or "")


def main() -> None:
    config = load_config()

    try:
        topics = fetch_topics(config)
    except urllib.error.URLError as e:
        print(f"Could not reach Supabase: {e}")
        sys.exit(1)

    live = [t for t in topics if t["status"] == "in_production"]
    suggested = [t for t in topics if t["status"] == "suggested"]

    print(f"\nLive ({len(live)}):")
    for t in live:
        print(f"  - {t['title']}" + (f"  ({t['note']})" if t.get("note") else ""))

    print(f"\nSuggested, not yet live ({len(suggested)}):")
    for i, t in enumerate(suggested, 1):
        print(f"  {i}. {t['title']}" + (f"  ({t['note']})" if t.get("note") else ""))

    print("\nWhat do you want to do?")
    print("  1. Promote a suggestion to live")
    print("  2. Add a new topic directly as live")
    print("  3. Reject (delete) a suggestion")
    print("  4. Revert a live topic back to suggested")
    print("  5. Quit")

    action = prompt("Choice", "5")

    if action == "1":
        if not suggested:
            print("Nothing suggested right now.")
            return
        n = int(prompt("Which suggestion (number)"))
        topic = suggested[n - 1]
        if prompt(f"Promote '{topic['title']}' to live? (y/n)", "y").lower() != "y":
            return
        call_manage_topic(config, {"action": "promote", "id": topic["id"]})
        print("Promoted.")

    elif action == "2":
        title = prompt("Topic title")
        note = prompt("Note (optional)") or None
        if prompt(f"Add '{title}' as live? (y/n)", "y").lower() != "y":
            return
        call_manage_topic(config, {"action": "add", "title": title, "note": note})
        print("Added.")

    elif action == "3":
        if not suggested:
            print("Nothing suggested right now.")
            return
        n = int(prompt("Which suggestion (number)"))
        topic = suggested[n - 1]
        if prompt(f"Reject and delete '{topic['title']}'? (y/n)", "n").lower() != "y":
            return
        call_manage_topic(config, {"action": "reject", "id": topic["id"]})
        print("Rejected.")

    elif action == "4":
        if not live:
            print("Nothing live right now.")
            return
        for i, t in enumerate(live, 1):
            print(f"  {i}. {t['title']}")
        n = int(prompt("Which topic (number)"))
        topic = live[n - 1]
        if prompt(f"Revert '{topic['title']}' back to suggested? (y/n)", "n").lower() != "y":
            return
        call_manage_topic(config, {"action": "revert", "id": topic["id"]})
        print("Reverted.")

    else:
        return


if __name__ == "__main__":
    main()
