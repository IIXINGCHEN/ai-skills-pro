# Data Schema Blueprint (APP_CONFIG)

## Principles

- Derive every factual value from the current brief. Ask for or omit missing names, metrics, prices, claims, and destinations.
- Keep one authoritative config value in an `application/json` script block. Executable module code parses it and never contains handwritten user-derived literals.
- Group keys by the confirmed page sections. Include only applicable groups such as `nav`, `hero`, `features`, `pricing`, `faq`, `form`, `states`, and `footer`.
- Give repeatable entries stable IDs for keys, ARIA wiring, filtering, and deep links.
- Keep meaning in config and pixels in tokens. Labels, destinations, media, status copy, and icon keys belong in config; layout offsets do not.

## Requirement-to-Config Map

| User input | Feeds | Missing-input behavior |
| :--- | :--- | :--- |
| Brand identity and positioning | `meta`, logo, hero copy | Ask for identity; distill wording only from supplied positioning |
| Confirmed section inventory | top-level groups | Include only confirmed or clearly recorded structural assumptions |
| Real data, stats, and prices | stats, plans, tables | Ask for facts or omit the unsupported item or section |
| Capabilities | repeated feature items | Distill only from supplied product capabilities |
| Approved media | media objects with `src` and `alt` | Ask for inspectable media or omit the media slot |
| Brand colors and tone | token derivation | Apply the documented domain fallback and record the rationale |
| Language | `meta.lang` and every visible string | Follow the brief |

Completion test: every factual leaf has a source in the brief, and every top-level group maps to a confirmed section or workflow.

## Structure Example

The fixture below demonstrates shape only. Every `EXAMPLE:` value is replaced before delivery, and inapplicable groups are removed.

```json
{
  "meta": {
    "lang": "EXAMPLE: document language",
    "title": "EXAMPLE: page title",
    "description": "EXAMPLE: page description"
  },
  "nav": {
    "logo": { "text": "EXAMPLE: brand", "href": "#top" },
    "links": [
      { "id": "features", "label": "EXAMPLE: features", "href": "#features" }
    ],
    "cta": { "id": "start", "label": "EXAMPLE: primary action", "href": "#start" }
  },
  "hero": {
    "badge": "EXAMPLE: verified status",
    "titleLines": ["EXAMPLE: positioning line"],
    "subtitle": "EXAMPLE: evidence-backed value proposition",
    "primaryCta": { "label": "EXAMPLE: primary action", "href": "#start" },
    "media": {
      "src": "https://example.invalid/approved-product-image.webp",
      "alt": "EXAMPLE: precise image description"
    },
    "stats": [
      { "value": "EXAMPLE: verified metric", "label": "EXAMPLE: metric definition" }
    ]
  },
  "features": {
    "heading": "EXAMPLE: capability heading",
    "items": [
      {
        "id": "example-capability",
        "icon": "bolt",
        "title": "EXAMPLE: capability",
        "description": "EXAMPLE: capability evidence"
      }
    ]
  },
  "states": {
    "loading": { "label": "EXAMPLE: loading label" },
    "empty": { "message": "EXAMPLE: empty message", "cta": { "label": "EXAMPLE: empty action", "href": "#create" } },
    "error": { "message": "EXAMPLE: error message", "retryLabel": "EXAMPLE: retry" },
    "success": { "message": "EXAMPLE: success message", "dismissLabel": "EXAMPLE: dismiss" }
  }
}
```

## Secure Serialization Boundary

Build the config with a structured object or parser, never by concatenating user strings into JavaScript source. At generation time, serialize once and encode every less-than sign so a closing script tag cannot terminate the JSON block:

```js
const serializedConfig = JSON.stringify(config).replaceAll('<', '\u003c');
```

Place that serialized string inside the delivered HTML, then parse it from executable code:

```html
<script type="application/json" id="app-config">{"meta":{"lang":"EXAMPLE: language"}}</script>
<script type="module">
  const APP_CONFIG = JSON.parse(document.querySelector('#app-config').textContent);
</script>
```

Required boundary checks:

1. The JSON block contains valid JSON and no literal `</script` sequence.
2. User-derived content never appears in a handwritten JavaScript object literal, template source, inline event handler, or style declaration.
3. Strings still cross a context-specific render boundary after parsing: text through `textContent`, destinations through `safeUrl()`, media through a media allow-list, and theme keys through registries.

## DOM Render Layer

Prefer DOM construction so content never becomes executable markup. Keep SVG icon geometry in a fixed registry of DOM factory functions rather than in config.

```js
const SVG_NS = 'http://www.w3.org/2000/svg';

const ICONS = {
  bolt() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M13 2 3 14h7l-1 8 12-14h-7z');
    svg.append(path);
    return svg;
  }
};

function renderFeatureCard(item) {
  const card = document.createElement('article');
  card.className = 'feature-card';
  card.dataset.id = String(item.id);

  const icon = document.createElement('div');
  icon.className = 'feature-card__icon';
  const iconFactory = ICONS[item.icon];
  if (iconFactory) icon.append(iconFactory());

  const title = document.createElement('h3');
  title.textContent = String(item.title);
  const description = document.createElement('p');
  description.textContent = String(item.description);
  card.append(icon, title, description);
  return card;
}

const featureGrid = document.querySelector('#features-grid');
featureGrid.replaceChildren(...APP_CONFIG.features.items.map(renderFeatureCard));
```

Destinations use an explicit allow-list:

```js
const safeUrl = (value) => {
  const raw = String(value ?? '').trim();
  if (/^#[A-Za-z][\w:.-]*$/.test(raw)) return raw;
  try {
    const parsed = new URL(raw, document.baseURI);
    return ['http:', 'https:'].includes(parsed.protocol) ? raw : '#';
  } catch {
    return '#';
  }
};
```

Completion test: malicious quotes, newlines, markup, and closing script tags remain inert data; unsafe schemes never reach `href` or `src`.

## Conditional Mapping Table

| Config key | Renderer | Include when |
| :--- | :--- | :--- |
| `nav` | `renderNav` | the confirmed architecture contains navigation |
| `hero` | `renderHero` | the page needs a hero or primary summary |
| `features.items` | `renderFeatures` | repeatable capabilities are supplied |
| `pricing.plans` | `renderPricing` | verified pricing exists |
| `faq.items` | `renderFaq` | FAQ content exists |
| `form` | `renderForm` | an input workflow is required |
| `states` | `renderStates` | asynchronous or mutable data needs loading, empty, error, and success states |
| `footer` | `renderFooter` | footer content is part of the confirmed architecture |
