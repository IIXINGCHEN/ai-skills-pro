#!/usr/bin/env python3
"""Cut a real product photo out of its background and straighten it.

Usage: python3 cutout-rectify.py IN.jpg OUT.png [--ratio 2.139] [--radius 0.13] [--height 1600]

--ratio  is the product's height / width from its official spec sheet (Xiaomi 15: 152.3 / 71.2).
--radius is the corner radius as a share of the width (0 for square objects).
Needs: pip install rembg onnxruntime opencv-python-headless numpy pillow
The pixels stay the user's own photo: only background removal and a perspective warp are applied.
"""
import argparse, io, sys
import cv2, numpy as np
from PIL import Image, ImageDraw

def cutout(path):
    from rembg import remove, new_session
    with open(path, 'rb') as f:
        data = remove(f.read(), session=new_session('isnet-general-use'))
    return np.array(Image.open(io.BytesIO(data)).convert('RGBA'))

def edge_lines(mask):
    cs, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cs:
        raise ValueError("抠图结果为空：输入图片未检测到有效主体（可能是全透明图）")
    c = max(cs, key=cv2.contourArea).reshape(-1, 2).astype(np.float32)
    x0, y0 = c.min(0); x1, y1 = c.max(0); w, h = x1 - x0, y1 - y0
    my = (c[:, 1] > y0 + .2 * h) & (c[:, 1] < y1 - .2 * h)   # skip rounded corners
    mx = (c[:, 0] > x0 + .25 * w) & (c[:, 0] < x1 - .25 * w)
    sides = {'T': c[mx & (c[:, 1] < y0 + .5 * h)], 'R': c[my & (c[:, 0] > x0 + .5 * w)],
             'B': c[mx & (c[:, 1] > y0 + .5 * h)], 'L': c[my & (c[:, 0] < x0 + .5 * w)]}
    def outer(P, axis, low):  # outermost points only, so a camera bump never bends the edge
        thr = np.percentile(P[:, axis], 40 if low else 60)
        return P[P[:, axis] <= thr] if low else P[P[:, axis] >= thr]
    def fit(P):
        vx, vy, px, py = cv2.fitLine(P, cv2.DIST_HUBER, 0, .01, .01).ravel()
        return np.array([px, py]), np.array([vx, vy])
    return [fit(outer(sides['T'], 1, True)), fit(outer(sides['R'], 0, False)),
            fit(outer(sides['B'], 1, False)), fit(outer(sides['L'], 0, True))], (x0, y0, x1, y1)

def meet(a, b):
    (p1, d1), (p2, d2) = a, b
    M = np.array([d1, -d2]).T
    if abs(np.linalg.det(M)) < 1e-6:
        return None  # near-parallel edges (round/near-round product): degenerate corner
    t = np.linalg.solve(M, p2 - p1)
    return p1 + t[0] * d1

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--ratio', type=float, required=True)
    ap.add_argument('--radius', type=float, default=.13)
    ap.add_argument('--height', type=int, default=1600)
    ap.add_argument('--already-cut', action='store_true', help='input is already a transparent PNG')
    a = ap.parse_args()
    im = np.array(Image.open(a.src).convert('RGBA')) if a.already_cut else cutout(a.src)
    mask = cv2.morphologyEx(((im[:, :, 3] > 128) * 255).astype(np.uint8), cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    try:
        lines, bbox = edge_lines(mask)
    except ValueError as e:
        sys.exit(f"处理失败: {e}")
    T, R, B, L = lines
    corners = [meet(L, T), meet(T, R), meet(R, B), meet(B, L)]
    if any(p is None for p in corners):
        print("警告：产品边缘近似平行（圆形/近圆主体），回退到最小外接矩形", file=sys.stderr)
        x0, y0, x1, y1 = bbox
        src = np.array([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], np.float32)
    else:
        src = np.array(corners, np.float32)
    H = a.height; W = int(H / a.ratio)
    M = cv2.getPerspectiveTransform(src, np.array([[0, 0], [W, 0], [W, H], [0, H]], np.float32))
    rgb = cv2.warpPerspective(im[:, :, :3], M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    out = Image.fromarray(rgb).convert('RGBA')
    m = Image.new('L', (W * 4, H * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle([6, 6, W * 4 - 6, H * 4 - 6], radius=int(W * 4 * a.radius), fill=255)
    out.putalpha(m.resize((W, H), Image.LANCZOS))
    out.save(a.out); print(a.out, out.size)

if __name__ == '__main__':
    main()
