# V3 data build (B7 brief)

Run from the repo root, in order:

```
python3 scripts/hdfc_v3/public_v3.py         # products.json, store_series.json, responses.json (public)
python3 scripts/hdfc_v3/seed_internal_v3.py  # data/seed/internal_v3/* (synthetic internal layer, seed 20260928)
```

- `common.py`: products, deliverables and TATs (RBI-published where marked `rbi`; otherwise "Bank TAT: confirm in discovery").
- `personas.py`: 12 fictional priority personas and 20 hand-written L2 escalation emails.
- The screens read only `data/seed/internal_v3/aggregates.json` from the internal layer. The record-level files are
  there for reconcile checks and for anyone who wants to re-cut the sample.
- The seed script asserts that product and channel dials reconcile to the overall dial and that every deliverable
  row's met + outside = measured, and it checks theme shares per product against the public mix (±20%).
