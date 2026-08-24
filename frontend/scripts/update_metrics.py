#!/usr/bin/env python3
"""Interactive CLI for updating a project's live metrics on the portfolio site.

Reads the Supabase URL/anon key from .env.local and the admin secret from
.secrets.local (both in this script's parent directory), shows you the
current metrics for a project, lets you pick one to update (or add a new
one), and calls the update-metric Edge Function. That upserts the row and,
if the value actually changed, triggers a Vercel redeploy automatically --
see frontend/supabase/functions/update-metric/index.ts.

Zero third-party dependencies -- stdlib only, so it runs with any Python 3.

Usage:
    python scripts/update_metrics.py
    (or double-click scripts/update-metrics.bat on Windows)
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

# Windows consoles default to a legacy codepage that can't print characters
# like the metrics' "≈" -- force UTF-8 so those don't crash the script.
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


def fetch_current_metrics(config: dict[str, str], project_id: str) -> list[dict]:
    url = f"{config['url']}/rest/v1/metrics?project_id=eq.{project_id}&select=label,value,detail&order=label"
    req = urllib.request.Request(
        url,
        headers={"apikey": config["anon_key"], "Authorization": f"Bearer {config['anon_key']}"},
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def call_update_metric(config: dict[str, str], project_id: str, label: str, value: str, detail: str | None) -> None:
    url = f"{config['url']}/functions/v1/update-metric"
    body = json.dumps({"projectId": project_id, "label": label, "value": value, "detail": detail}).encode()
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={"x-admin-secret": config["admin_secret"], "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"\nFailed ({e.code}): {e.read().decode()}")
        sys.exit(1)

    if result.get("deployed"):
        print("\nUpdated, and a Vercel redeploy was triggered -- the new value goes live in a minute or two.")
    else:
        print(f"\nUpdated, no redeploy needed ({result.get('reason', 'value unchanged')}).")


def prompt(label: str, default: str | None = None) -> str:
    suffix = f" [{default}]" if default else ""
    value = input(f"{label}{suffix}: ").strip()
    return value or (default or "")


def main() -> None:
    config = load_config()

    project_id = prompt("Project id", "spoin")

    try:
        current = fetch_current_metrics(config, project_id)
    except urllib.error.URLError as e:
        print(f"Could not reach Supabase: {e}")
        sys.exit(1)

    print(f"\nCurrent metrics for '{project_id}':")
    for i, m in enumerate(current, 1):
        detail_part = f" ({m['detail']})" if m.get("detail") else ""
        print(f"  {i}. {m['label']}: {m['value']}{detail_part}")
    print(f"  {len(current) + 1}. <add a new metric>")

    choice = prompt("\nWhich one are you updating (number)")
    try:
        idx = int(choice) - 1
    except ValueError:
        print("Not a number.")
        sys.exit(1)

    if 0 <= idx < len(current):
        existing = current[idx]
        label = existing["label"]
        new_value = prompt("New value", existing["value"])
        new_detail = prompt("New detail (blank to keep, '-' to clear)", existing.get("detail") or "")
        detail = None if new_detail == "-" else (new_detail or None)
    elif idx == len(current):
        label = prompt("New metric label (e.g. 'Corpus Size')")
        new_value = prompt("Value")
        detail_input = prompt("Detail (optional)")
        detail = detail_input or None
    else:
        print("Out of range.")
        sys.exit(1)

    print(f"\nAbout to set [{project_id}] {label} = {new_value}" + (f" ({detail})" if detail else ""))
    if prompt("Confirm? (y/n)", "y").lower() != "y":
        print("Cancelled.")
        return

    call_update_metric(config, project_id, label, new_value, detail)


if __name__ == "__main__":
    main()
