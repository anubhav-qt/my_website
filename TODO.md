# TODO

- Scratchpad: add "earlier"/"next" pointers between preexisting entries that connect to
  the same thing, so related posts link to each other.
- Periodically verify `content_log` is still capturing everything: after pushing new content,
  read back the latest rows and check the entry is there, `data` is the full object, and the
  git provenance columns are filled. It soft-fails on purpose, so a broken archive looks
  exactly like a working one from the build output.
- `to_know_thyself`: architecture doc. Storage and provenance layer first, graph on top.
  Generalized so anyone can point it at their own site and import their own LLM exports.
