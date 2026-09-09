# TODO

- Scratchpad: add "earlier"/"next" pointers between preexisting entries that connect to
  the same thing, so related posts link to each other.
- Periodically verify `content_log` is still capturing everything: after pushing new content,
  read back the latest rows and check the entry is there, `data` is the full object, and the
  git provenance columns are filled. It soft-fails on purpose, so a broken archive looks
  exactly like a working one from the build output.
- Delete the dead `metrics` rows in the Supabase SQL editor. The update-metric Edge
  Function only upserts, so the pre-rebuild Spoin rows (`Peak Throughput`, `AVG
  THROUGHPUT`, `Corpus Size`, `Unique Topics`) and every `continuum` row are still in the
  table. Nothing renders them any more, since live rows are matched to authored metrics by
  label, but they are clutter that the label matching is currently hiding:
  `delete from metrics where project_id = 'continuum';`
  `delete from metrics where project_id = 'spoin' and label in ('Peak Throughput', 'AVG THROUGHPUT', 'Corpus Size', 'Unique Topics');`
- Record real demo video for Spoin (and any other featured project once there's something worth
  filming): a landscape desktop screen capture and a separate portrait phone-in-hand capture of
  the actual app, not a re-recorded screen mirror. The featured project detail page (see the
  `/design` projects-section canvas) already has a reserved video slot on both the desktop and
  mobile layouts, sized for exactly this, currently a placeholder. Swap the placeholder for the
  real embed once the footage exists; don't ship a stock/staged clip in the meantime.
