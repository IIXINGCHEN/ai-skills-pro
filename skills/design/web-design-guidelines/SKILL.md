---
name: web-design-guidelines
description: "1. Fetch the latest guidelines from the source URL below 2. Read the specified files (or prompt user for files/pattern) 3. Check against all rules in the fetched guidelines 4. Output findings in the terse file:line format"
---



# Web Interface Guidelines

Audit UI code against a published rule set for web interfaces (layout, typography, color, accessibility, and related checks).

## Flow

1. Pull the current rule set from the source below, always fetch fresh before a review so you're checking against the latest rules.
2. Read the files under review (from the user's file or glob argument; if none was given, ask which files to check).
3. Evaluate every file against every rule in the fetched rule set.
4. Report violations in the compact `file:line` style the rule set prescribes.

## Rule Source

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Retrieve it with WebFetch. That document is the authority: it holds the full rule list and the exact output format to use. This skill only orchestrates the fetch-read-check-report loop; the rules themselves live upstream under their own MIT license.
