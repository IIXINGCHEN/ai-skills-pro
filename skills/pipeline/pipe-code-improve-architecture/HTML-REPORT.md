# HTML Report Format

The architectural review is rendered as a single self-contained HTML file in the OS temp directory - zero external requests: all CSS is inlined in a `<style>` block, all diagrams are hand-built inline SVG. Never load Tailwind, Mermaid, or any other asset from a CDN or remote URL. Hand-built divs and inline SVG handle every visual (call graphs, dependencies, sequences, mass diagrams, cross-sections) - don't lean on one diagram style for everything, it'll start to look generic.

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review - {{repo name}}</title>
    <style>
      /* inlined minimal CSS layer: page layout, candidate cards, badges,
         callouts, dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      body { background: #fafaf9; color: #1c1917; font-family: system-ui, sans-serif; margin: 0; }
      main { max-width: 64rem; margin: 0 auto; padding: 3rem 1.5rem; }
      article.card { background: #fff; border: 1px solid #e7e5e4; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2.5rem; }
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
      .mono { font-family: ui-monospace, monospace; font-size: 0.875rem; }
      .badge-strong { background: #059669; color: #fff; }
      .badge-explore { background: #d97706; color: #fff; }
      .badge-speculative { background: #64748b; color: #fff; }
    </style>
  </head>
  <body>
    <main>
      <header>...</header>
      <section id="candidates">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## Header

Repo name, date, and a compact legend: solid box = module, dashed line = seam, red arrow = leakage, thick dark box = deep module. No introduction paragraph - straight into the candidates.

## Candidate card

The diagrams carry the weight. Prose is sparse, plain, and uses the design vocabulary glossary terms without ceremony.

Each candidate is one `<article>`:

- **Title** - short, names the deepening (e.g. "Collapse the Order intake pipeline").
- **Badge row** - recommendation strength (`Strong` = emerald, `Worth exploring` = amber, `Speculative` = slate), plus a tag for the dependency category (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **Files** - monospaced list, styled with the `.mono` class.
- **Before / After diagram** - the centrepiece. Two columns, side by side. See patterns below.
- **Problem** - one sentence. What hurts.
- **Solution** - one sentence. What changes.
- **Wins** - bullets, ≤6 words each. e.g. "Tests hit one interface", "Pricing logic stops leaking", "Delete 4 shallow wrappers".
- **ADR callout** (if applicable) - one line in an amber-tinted box.

No paragraphs of explanation. If the diagram needs a paragraph to be understood, redraw the diagram.

## Diagram patterns

Pick the pattern that fits the candidate. Mix them. Don't make every diagram look the same - variety is part of the point.

### SVG boxes-and-arrows (the workhorse for dependencies / call flow)

Use hand-built inline SVG when the point is "X calls Y calls Z, and look at the mess." Modules as `<rect>`s with labels, calls as `<line>`/`<path>` arrows. Colour leakage edges red and the deep module dark via the `.leak` / `.deep` styles. Sequence-style layouts work well for "before: 6 round-trips; after: 1."

```html
<svg viewBox="0 0 600 200" class="diagram">
  <rect x="20" y="70" width="120" height="60" rx="8" fill="#fff" stroke="#94a3b8"/>
  <text x="80" y="105" text-anchor="middle" font-size="12">OrderHandler</text>
  <line x1="140" y1="100" x2="220" y2="100" stroke="#94a3b8" marker-end="url(#arr)"/>
  <rect x="220" y="70" width="120" height="60" rx="8" fill="#fff" stroke="#94a3b8"/>
  <text x="280" y="105" text-anchor="middle" font-size="12">OrderValidator</text>
  <line x1="340" y1="100" x2="420" y2="100" class="leak" stroke-width="2" marker-end="url(#arr)"/>
</svg>
```

### Editorial boxes-and-arrows (for the "after" weight)

Modules as `<div>`s with borders and labels. Arrows as inline SVG `<line>` or `<path>` elements positioned absolutely over a relative container. Reach for this when you want the "after" diagram to feel like one thick-bordered deep module with greyed-out internals - hand-built SVG gives it the right weight.

### Cross-section (good for layered shallowness)

Stack horizontal bands (`h-12 border-l-4`) to show layers a call passes through. Before: 6 thin layers each doing nothing. After: 1 thick band labelled with the consolidated responsibility.

### Mass diagram (good for "interface as wide as implementation")

Two rectangles per module - one for interface surface area, one for implementation. Before: interface rectangle is nearly as tall as the implementation rectangle (shallow). After: interface rectangle is short, implementation rectangle is tall (deep).

### Call-graph collapse

Before: a tree of function calls rendered as nested boxes. After: the same tree collapsed into one box, with the now-internal calls shown faded inside it.

## Style guidance

- Lean editorial, not corporate-dashboard. Generous whitespace. Serif optional for headings (`font-serif` works well with stone/slate).
- Colour sparingly: one accent (emerald or indigo) plus red for leakage and amber for warnings.
- Keep diagrams ~320px tall so before/after sits comfortably side by side without scrolling.
- Use small uppercase letter-spaced labels for module labels inside diagrams - they should read as schematic, not as UI.
- There are no scripts at all. The report is fully static - no app code, no interactivity, no external requests.

## Top recommendation section

One larger card. Candidate name, one sentence on why, anchor link to its card. That's it.

## Tone

Plain English, concise - but the architectural nouns and verbs come straight from the design vocabulary. Concision is not an excuse to drift.

**Use exactly:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Never substitute:** component, service, unit (for module) · API, signature (for interface) · boundary (for seam) · layer, wrapper (for module, when you mean module).

**Phrasings that fit the style:**

- "Order intake module is shallow - interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins bullets** name the gain in glossary terms: *"locality: bugs concentrate in one module"*, *"leverage: one interface, N call sites"*, *"interface shrinks; implementation absorbs the wrappers"*. Don't write *"easier to maintain"* or *"cleaner code"* - those terms aren't in the glossary and don't earn their place.

No hedging, no throat-clearing, no "it's worth noting that…". If a sentence could be a bullet, make it a bullet. If a bullet could be cut, cut it. If a term isn't in the design vocabulary glossary, reach for one that is before inventing a new one.
