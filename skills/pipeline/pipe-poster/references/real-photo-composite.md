# Real-photo composite

Use this render mode whenever the user supplies photos of **the exact item being sold** (used phones, second-hand goods, one-off stock). The buyer is judging this unit, so the poster shows only its own pixels: no AI-generated product, no stock render. Learned on the Xiaomi 15 resale run (2026-10-14, v1 to v12).

## What failed, and why

| Attempt | User verdict | Cause |
| :--- | :--- | :--- |
| AI render labelled 实物实拍 | Misleading | An AI image is never a real shot; the label breaks Advertising Law Art. 28 |
| Polaroid collage of raw photos | 不美观, 不真实 | Carpet backgrounds, tilted frames, and taped cards read as a flea market |
| Cut-outs with thick borders, stickers, big orange blocks | 突兀, 不和谐 | Editorial collage props fight with real photographic texture |
| Restrained studio layout | 不醒目 | Small title, grey price; nothing wins at thumbnail size |
| Raw cut-outs placed upright | 不真实 | Handheld shots are trapezoids; an upright trapezoid looks warped |

## The recipe that passed

1. **Cut and straighten** each hero photo with `scripts/cutout-rectify.py IN OUT --ratio <h/w from the official spec sheet>`. It removes the background (rembg `isnet-general-use`), fits the four edges while ignoring rounded corners and camera bumps, warps to a true rectangle, and applies a clean rounded mask. Pixels stay the user's own.
2. **Studio sweep**: warm-grey vertical gradient `#F6F5F2` to `#E8E5E0`; products stand on one floor line with a blurred contact shadow and a soft body shadow. No borders, tape, stickers, or glow.
3. **One accent** (`#FF5500`) on: the first tag, the grade word, the price, check marks, the shield, and the CTA. Everything else is ink `#1C1C1E`, grey, or white.
4. **Zone map** (1080x1920), fixed in `scripts/compose-product-poster.py`:

| Zone | y range | Contents |
| :--- | :--- | :--- |
| Top row | 80-140 | Accent tag + outline tag left; dark trust badge with accent shield right |
| Title | 150-360 | Model name Black 180px; grade in accent Black 62px; spec capsule (ink, white Black 44px) |
| Hero | 390-1150 | Back view (taller, left) and screen view (right) on one floor |
| Selling points | 1170-1256 | Four white tiles: bold fact + grey sub-line |
| Price panel | 1280-1514 | Ink panel; price in accent Black 146px; three white ✓ rows |
| Details | 1542-1740 | Three rounded real crops (system info, camera, frame) with grey captions |
| CTA | 1784-1888 | Full-width accent capsule, white text, white arrow disc |

5. **Fill `layout.json`** (see `layout-example.json`) and run `scripts/compose-product-poster.py layout.json poster-v<n>.png`. It also writes `poster-v<n>-thumb.png` at 270x480.

## Content rules

- **Selling points** come from the manufacturer's official spec page for the **region variant** of this unit (read the system build string: `CN` is the China model). Example: Xiaomi 15 China lists 5400mAh, global lists 5240mAh. Cite the page in `RUN.md`.
- **实物实拍** only when every product pixel is from the user's photos.
- **今日特价 / 仅限今天** only when the price is genuinely limited to that day.
- **先到先得** only for a single unit or stated stock.
- Real system screens (model, build, storage) stay unedited; ask before hiding anything.
- Moments has no buy button: the CTA asks for a chat or a comment (私聊锁定, 评论扣1), never 立即下单.

## Proofread for this mode

- Open the full render and the thumbnail. At 270px width the model, grade, spec, price, and CTA must each be readable.
- No element touches another: leave at least 8px between the hero shadow, the selling-point tiles, and the price panel.
- Every word on the canvas traces to `copy-lock.md` or to a cited spec fact.
