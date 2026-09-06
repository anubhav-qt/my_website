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
