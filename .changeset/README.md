# Changesets

Every user-visible change ships with a changeset file in this directory (create one with `npx changeset`). CI consumes them into a Version PR via the Release workflow; `npm run version` applies them locally. Manifest and registry regeneration runs through `npm run generate:manifests` as part of the same change, never in a separate commit.
