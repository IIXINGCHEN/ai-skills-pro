# Copy Lock

Limits count Chinese characters, punctuation excluded.

| Field | Limit | Job | Example (phone recycling) |
| :--- | :--- | :--- | :--- |
| `TOP_TAG` | 4 to 8 | Name the pain or idle asset; spark curiosity | 闲置吃灰？秒变现！ |
| `MAIN_TITLE` | 1 to 2 lines, 6 per line | The reward, led by a strong verb; one reward word on the accent block | 烂手机 / 秒变现金 |
| `SUB_TITLE` | 8 to 14 | Widen scope, remove doubt | 碎屏·死机·报废机 统统收 |
| `HERO_BADGE` | 2 to 5, may use ¥ or % | The sharpest benefit, on the round badge | ¥当面到账 |
| `KEY_POINTS` | 3 lines, 6 to 9 each | Pain plus payoff, led by ✓, answering "do I qualify", "is it a hassle", "is it safe" | 碎屏不开机也能卖 |
| `CTA_BUTTON` | 5 to 8, plus → | A verb and the concrete result of the tap; repeats the reward word when the reward is a keepable promise | 免费估价 → |
| `TRUST_BADGES` | 3 groups split by `|` | Zero-risk promises the business keeps | 免费估价 | 不卖不收费 | 隐私保障 |

For a **single product for sale** (real-photo composite), the lock maps to the product layout instead: `TOP_TAG` becomes up to two tags, `MAIN_TITLE` is the model name, `SUB_TITLE` is the grade plus spec capsule, `HERO_BADGE` is the price, `KEY_POINTS` are the three ✓ rows, plus a `SELLING_POINTS` field of four official spec facts (fact 4 to 8, sub-line 2 to 6), a `TRUST_BADGE` (2 to 5) in the top-right corner, and three detail captions (2 to 4). Example (each bracketed term is conditional: verify against `ad-law-terms.md` before keeping): [今日特价: keep only if the price truly expires today] | [实物实拍: keep only if every product pixel is the user's own photo] / 小米15 / 九五新 12+256G / ¥2099 / 质保一年, 九五新成色 / 骁龙8至尊版 旗舰芯片 … / 二手优选 / 私聊锁定 · [先到先得: keep only for a single unit or a stated stock count].

The reward word appears in `MAIN_TITLE` and again in `HERO_BADGE` or `CTA_BUTTON`.

## Render prompt template

> ROUTE CONDITIONAL (hard rule): the collage elements in this template (washi tapes, the pointing-hand sticker, and every "3D offset shadow" / "hard offset shadow" phrase) belong ONLY to collage routes. For Swiss Grid, Bento, or any non-collage route, delete those phrases entirely before generating. Do not leave them in the prompt.

```text
A vertical 9:16 high-converting commercial poster, <ROUTE> style, premium editorial design, accent <ACCENT NAME> <HEX>. Background: <BASE> with real macro paper texture, generous margins, Swiss grid. <TEXTURE TERMS>.

TOP SECTION: a <ACCENT> pill tag with white bold Chinese text "<TOP_TAG>". Below, a huge ultra-heavy black geometric sans-serif Chinese headline on two lines: "<LINE 1>", "<LINE 2>", with "<REWARD WORD>" on a <ACCENT> block with a 3D offset shadow. Below, dark gray Chinese subtitle "<SUB_TITLE>".

MIDDLE SECTION: <HERO SCENE>. Slanted beside it, a bold <ACCENT> round badge with white heavy text "<HERO_BADGE>". Overlapping below, a white paper card with a thick black border and hard black offset shadow, held by two washi tapes, three rows of bold black Chinese text each with a green ✓ and <ACCENT> highlighter strokes: "<POINT 1>", "<POINT 2>", "<POINT 3>".

LOWER SECTION: a large glossy 3D <ACCENT> capsule button with black outline and hard offset shadow, white heavy Chinese text "<CTA_BUTTON>", a small pointing-hand sticker at its right edge. Below, one centered line of dark gray Chinese text: "<TRUST_BADGES>".

BOTTOM: empty paper texture with tiny crosshair marks in the corners.

<ONLY-TEXT CLAUSE>
```
