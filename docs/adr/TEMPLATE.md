# ADR Template

One decision per file, named `NNNN-kebab-title.md` (zero-padded sequence). Copy this template, fill every section, delete the guidance lines.

```markdown
# ADR NNNN: <decision title>

Date: YYYY-MM-DD
Status: proposed | accepted | superseded by ADR NNNN

## Context

The forces at play: what problem demanded a decision, what constraints applied, and what would happen if no decision were made. Name the alternatives that were on the table here if they shaped the framing.

## Decision

One or two sentences, in the active voice and the present tense: "We do X." State the rule, not the reasoning (reasoning lives above and below).

## Consequences

What becomes true because of this decision: what gets easier, what gets harder, what we gave up. Include the enforcement point (which gate, test, or document catches violations).

## Alternatives considered

Each alternative with the reason it lost. Future agents re-litigating this decision must engage with this section, not just the title.
```

Rules:
- ADRs are immutable once accepted; a reversal supersedes via a new ADR that links back.
- An ADR states a rule someone could violate by accident. Anything enforced by tooling still deserves the ADR, naming the enforcing gate.
- Superseded ADRs stay in place with updated status headers; never delete.
