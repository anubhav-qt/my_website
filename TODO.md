# TODO

- Scratchpad: add "earlier"/"next" pointers between preexisting entries that connect to
  the same thing, so related posts link to each other.
- Periodically verify `content_log` is still capturing everything: after pushing new content,
  read back the latest rows and check the entry is there, `data` is the full object, and the
  git provenance columns are filled. It soft-fails on purpose, so a broken archive looks
  exactly like a working one from the build output.
- Spoin metrics: the live Supabase rows still read 13,926 items / 69 ADRs / 450 items/min
  from before the corpus rebuild. Run `python scripts/update_metrics.py` to replace them
  with the grounded-run numbers in `projects.ts`, and delete the orphaned `continuum` rows
  while you are in there. Until then the stale rows win at build time.
