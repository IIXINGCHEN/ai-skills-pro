## What it does

Audits UI code against the published web-interface-guidelines rule set (layout, typography, color, accessibility). It fetches the rules fresh before each review, reads the files under review, and reports violations in the rule set's compact `file:line` format.

## When to reach for it

Type /web-design-guidelines when asked to review UI, check accessibility, or audit a design.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Violations reported per the rule set's prescribed format.
- Rules always freshly fetched; the skill only orchestrates, the rules live upstream under MIT.

## Where it fits

UI review gates; pairs with review-animations for motion-specific checks.
