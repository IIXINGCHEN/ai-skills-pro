# Self-Review Gate

Run after implementation, before delivery. Fix findings first; ship only after every lens passes. Any failed item returns to implementation.

## Lens 1: Product

- Is the core goal unmistakable within seconds of landing?
- Is the primary action obvious and reachable?
- Does primary information dominate visually while secondary and supporting content rank correctly?

## Lens 2: UI

- Are hierarchy, proportion, and spacing deliberate and consistent?
- Does the visual language feel premium, branded, and uniform?
- Is there any template smell, decoration without purpose, or AI-generated feel to remove?

## Lens 3: UX

- Do interactions feel natural with immediate, clear feedback?
- Are applicable states complete: loading, empty, error, success?
- Is mobile genuinely usable after recomposition rather than merely smaller?

## Lens 4: Motion

- Does every animation serve feedback, hierarchy, state, navigation, data change, or atmosphere?
- Is motion restrained enough to never interrupt reading?
- Does the reduced-motion downgrade work?

## Lens 5: Engineering

- Does data drive the UI with zero hardcoded business values?
- Do design tokens cover all visual constants without duplicated definitions?
- Do components reuse rendering paths instead of copy-pasted markup?
- Does layout recompose correctly at desktop, tablet, and mobile breakpoints?
- Is the console clean and does the delivered code run directly?

## Verdict Rule

All five lenses pass: deliver. Any lens fails: optimize, then rerun the gate before final output.
