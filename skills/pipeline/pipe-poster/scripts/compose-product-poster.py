#!/usr/bin/env python3
"""Compose a 1080x1920 real-photo product poster from a JSON layout file.

Usage: python3 compose-product-poster.py layout.json OUT.png

Every product picture comes from the user's own photos (run cutout-rectify.py first).
No AI imagery, so "实物实拍" stays true. See ../references/real-photo-composite.md for the
layout and the layout.json fields. Fonts: Noto Sans SC Black / Bold / Medium (.otf).
"""
import json, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps

W, H, M = 1080, 1920, 84
INK = (28, 28, 30); GRAY = (120, 117, 112); WHITE = (255, 255, 255)

def hexrgb(h):
    h = h.lstrip('#')
    if len(h) != 6 or any(ch not in '0123456789abcdefABCDEF' for ch in h):
        sys.exit(f"颜色格式错误，应为 #RRGGBB: {h!r}")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def main(cfg_path, out):
    try:
        with open(cfg_path, encoding='utf-8') as f:
            c = json.load(f)
    except OSError as e:
        sys.exit(f"打不开 layout 文件: {cfg_path} ({e})")
    except json.JSONDecodeError as e:
        sys.exit(f"layout.json 不是合法 JSON: {e}")
    for k in ('fonts', 'title', 'price', 'cta', 'hero'):
        if k not in c:
            sys.exit(f"layout.json 缺少必填字段: '{k}'")
    A = hexrgb(c.get('accent', '#FF5500'))
    F = lambda w, s: ImageFont.truetype(f"{c['fonts']}/NotoSansSC-{w}.otf", s)
    cv = Image.new('RGBA', (W, H)); g = ImageDraw.Draw(cv)
    top, bot = (246, 245, 242), (232, 229, 224)  # warm-grey studio sweep
    for y in range(H):
        t = y / H; g.line([(0, y), (W, y)], fill=tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3)) + (255,))
    d = ImageDraw.Draw(cv)

    def pill(x, y, txt, f, fill, fg, outline=None, padx=24, h=60):
        tw = d.textlength(txt, font=f); bb = f.getbbox(txt)
        d.rounded_rectangle([x, y, x + tw + 2 * padx, y + h], radius=h // 2, fill=fill, outline=outline, width=3)
        d.text((x + padx, y + (h - (bb[3] - bb[1])) / 2 - bb[1]), txt, font=f, fill=fg); return x + tw + 2 * padx

    # top row: tags left, trust badge right
    x = M
    for k, tag in enumerate(c.get('tags', [])):
        x = pill(x, 80, tag, F('Black' if k == 0 else 'Bold', 34), A if k == 0 else None,
                 WHITE if k == 0 else INK, outline=None if k == 0 else INK) + 14
    if c.get('badge'):
        f = F('Bold', 32); t = c['badge']; tw = d.textlength(t, font=f); bh, ic = 60, 40
        bw = int(18 + ic + 10 + tw + 26); bx = W - M - bw
        d.rounded_rectangle([bx, 80, bx + bw, 140], radius=30, fill=INK)
        S = ic * 4; sh = Image.new('RGBA', (S, S)); q = ImageDraw.Draw(sh)
        q.polygon([(S*.5, S*.04), (S*.92, S*.18), (S*.88, S*.58), (S*.5, S*.96), (S*.12, S*.58), (S*.08, S*.18)], fill=A)
        q.line([(S*.30, S*.50), (S*.45, S*.65), (S*.72, S*.35)], fill=WHITE, width=int(S*.09), joint='curve')
        cv.alpha_composite(sh.resize((ic, ic), Image.LANCZOS), (bx + 18, 90))
        bb = f.getbbox(t); d.text((bx + 18 + ic + 10, 80 + (bh - (bb[3] - bb[1])) / 2 - bb[1]), t, font=f, fill=WHITE)

    def fit_text(txt, max_w, start=180, minimum=72, lh=1.12, max_lines=2):
        """Shrink-to-fit, then wrap to at most max_lines. Returns (lines, size)."""
        size = start
        while size >= minimum:
            f = F('Black', size)
            if d.textlength(txt, font=f) <= max_w:
                return [txt], size
            size -= 12
        f = F('Black', minimum)
        lines, cur = [], ''
        for ch in txt:
            if d.textlength(cur + ch, font=f) <= max_w:
                cur += ch
            else:
                lines.append(cur); cur = ch
        if cur:
            lines.append(cur)
        lines = [ln for ln in lines if ln] or ['']
        if len(lines) > max_lines:
            lines = lines[:max_lines]
            lines[-1] = (lines[-1][:-1] + '…') if len(lines[-1]) > 1 else '…'
        return lines, minimum

    # title block: model huge, grade in accent, spec capsule
    title_lines, tsize = fit_text(c['title'], W - 2 * M - 12)
    ty = 150
    for ln in title_lines:
        d.text((M - 6, ty), ln, font=F('Black', tsize), fill=INK)
        ty += int(tsize * 1.12)
    tx = M + d.textlength(title_lines[0], font=F('Black', tsize)) + 30
    if c.get('grade'): d.text((tx, 200 if len(title_lines) == 1 else 150), c['grade'], font=F('Black', 62), fill=A)
    if c.get('spec'): pill(tx, 292 if len(title_lines) == 1 else ty + 12, c['spec'], F('Black', 44), INK, WHITE, padx=22, h=68)

    # hero: straightened real photos standing on the floor with contact shadows
    def clean(im):
        a = im.split()[-1]
        r = ImageEnhance.Brightness(im.convert('RGB')).enhance(1.06); r = ImageEnhance.Contrast(r).enhance(1.05)
        r = r.filter(ImageFilter.UnsharpMask(2, 80, 2)).convert('RGBA'); r.putalpha(a); return r
    def place(im, h, x, ground):
        im = im.resize((int(im.width * h / im.height), h), Image.LANCZOS); y = ground - h
        sh = Image.new('RGBA', (W, H)); ImageDraw.Draw(sh).ellipse([x + im.width * .08, ground - 18, x + im.width * .92, ground + 22], fill=(0, 0, 0, 120))
        cv.alpha_composite(sh.filter(ImageFilter.GaussianBlur(16)))
        pad = 60; b = Image.new('RGBA', im.size); b.putalpha(im.split()[-1].point(lambda v: v * 45 // 255))
        bb = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad)); bb.alpha_composite(b, (pad + 14, pad + 20))
        cv.alpha_composite(bb.filter(ImageFilter.GaussianBlur(26)), (int(x) - pad, y - pad)); cv.alpha_composite(im, (int(x), y))
    G = 1150
    for h in c['hero']:  # draw back-most first
        place(clean(Image.open(h['image'])), h['height'], h['x'], G - h.get('lift', 0))

    # selling-point strip (official spec facts only)
    specs = c.get('selling_points', [])
    if specs:
        sx0, sx1, gap = M - 24, W - M + 24, 12; cw = (sx1 - sx0 - (len(specs) - 1) * gap) / len(specs)
        for k, (v, l) in enumerate(specs):
            x0 = sx0 + k * (cw + gap); d.rounded_rectangle([x0, 1170, x0 + cw, 1256], radius=20, fill=WHITE)
            f1 = F('Black', 32); d.text((x0 + (cw - d.textlength(v, font=f1)) / 2, 1178), v, font=f1, fill=INK)
            f2 = F('Medium', 22); d.text((x0 + (cw - d.textlength(l, font=f2)) / 2, 1220), l, font=f2, fill=GRAY)

    # price panel: price_label gets its own dedicated band above the price text,
    # so the 146px price can never cover it
    px, py, pw = M - 24, 1280, W - 2 * (M - 24)
    d.rounded_rectangle([px, py, px + pw, py + 234], radius=34, fill=INK)
    price_y = py + 30
    if c.get('price_label'):
        d.text((px + 40, py + 16), c['price_label'], font=F('Bold', 36), fill=(200, 196, 190))
        price_y = py + 62
    d.text((px + 32, price_y), c['price'], font=F('Black', 146), fill=A)
    for k, t in enumerate(c.get('checks', [])[:3]):
        x, y = px + pw - 300, price_y + k * 60
        d.ellipse([x, y + 6, x + 36, y + 42], fill=A)
        d.line([(x + 9, y + 24), (x + 16, y + 32), (x + 27, y + 17)], fill=WHITE, width=5)
        d.text((x + 52, y - 2), t, font=F('Bold', 38), fill=WHITE)

    # three real detail crops, rounded, no borders
    cw, ch = 290, 160; gap = (W - 2 * M - 3 * cw) // 2
    for i, it in enumerate(c.get('details', [])[:3]):
        im = Image.open(it['image']).convert('RGBA')
        def tight(m):
            bb = m.split()[-1].point(lambda v: 255 if v > 128 else 0).getbbox()
            if bb is None:
                sys.exit(f"detail 图全透明，无法裁剪: {it.get('image', '?')}")
            return m.crop(bb)
        im = tight(im)
        if it.get('rotate'): im = tight(im.rotate(it['rotate'], expand=True))
        bx = it.get('box', [0, 0, 1, 1]); im = im.crop((int(im.width * bx[0]), int(im.height * bx[1]), int(im.width * bx[2]), int(im.height * bx[3])))
        base = Image.new('RGBA', im.size, (238, 236, 232, 255)); base.alpha_composite(im)
        t = ImageOps.fit(base, (cw, ch), Image.LANCZOS, centering=(.5, it.get('cy', .5)))
        m = Image.new('L', (cw, ch), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, cw - 1, ch - 1], radius=18, fill=255)
        x0 = M + i * (cw + gap); cv.paste(t, (x0, 1542), m)
        cap = it.get('caption', '')
        f = F('Bold', 28); d.text((x0 + (cw - d.textlength(cap, font=f)) / 2, 1712), cap, font=f, fill=GRAY)

    # CTA capsule
    by, bh = 1784, 104
    d.rounded_rectangle([M - 24, by, W - M + 24, by + bh], radius=bh // 2, fill=A)
    f = F('Black', 46); t = c['cta']; d.text(((W - d.textlength(t, font=f)) / 2 - 24, by + 20), t, font=f, fill=WHITE)
    cx = W - M + 24 - bh // 2; d.ellipse([cx - 38, by + 16, cx + 38, by + 92], fill=WHITE)
    d.line([(cx - 15, by + 54), (cx + 15, by + 54)], fill=A, width=6); d.line([(cx + 2, by + 40), (cx + 16, by + 54), (cx + 2, by + 68)], fill=A, width=6)

    cv.convert('RGB').save(out)
    cv.convert('RGB').resize((270, 480), Image.LANCZOS).save(out.rsplit('.', 1)[0] + '-thumb.png')
    print(out)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit("用法: python3 compose-product-poster.py layout.json OUT.png")
    main(sys.argv[1], sys.argv[2])
