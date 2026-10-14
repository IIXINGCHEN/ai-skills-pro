# Tokens, Amber Glass

Source: measured from the reference implementation's CSS (`[data-theme]`
selectors). Values marked （估计） are inferred from screenshots.

## Color, dark (default)

| Token | Value | 用途 |
|---|---|---|
| `--bg` | `#130c05` | 页面底色：暖黑，不是纯黑 |
| `--fg` | `#ffffff` | 主文字 |
| `--fg-muted` | `#f5f0e899` | 次级文字（60% 暖白） |
| `--fg-subtle` | `#ffffffb3` | 辅助文字（70% 白） |
| `--accent` | `#d4841a` | 唯一强调色：琥珀 |
| `--glow` | `#bd6d1d` | 发光渐变、光晕 |
| `--accent-mid` | `#ac651e` | 强调色中间调 |
| `--accent-pale` | `#f6d5b4` | 浅琥珀：小字强调、描边 |
| `--btn-fill` | `#f3bc85` → `#a65f18` | 主按钮渐变（浅→深） |
| `--card-start` | `#5a3715` | 卡片渐变上：暖棕 |
| `--card-end` | `#3e260e` | 卡片渐变下：深棕 |
| `--glass` | `#130c05b3` | 玻璃面板底（70% 底色） |
| `--text-on-accent` | `#0d0806` | 琥珀底上的深色文字 |

## Color, light

| Token | Value | 用途 |
|---|---|---|
| `--bg` | `#fdfdf7` | 暖纸白 |
| `--fg` | `#000000` | 主文字 |
| `--fg-muted` | `#25252599` | 次级文字 |
| `--fg-subtle` | `#252525b3` | 辅助文字 |
| `--accent` | `#b85c33` | 唯一强调色（浅色版更偏陶土；白字对比度 4.55:1，满足可读性要求） |
| `--card-start` | `#ece8e6` | 卡片渐变上 |
| `--card-end` | `#fbf9f5` | 卡片渐变下 |
| `--glass` | `#ffffffd9` | 玻璃面板底（85% 白） |
| `--text-on-accent` | `#ffffff` | 强调色底上的白色文字 |

浅色主题注意：卡片渐变与纸面对比弱，卡片必须加 `1px` 描边。

## Radius

| Value | 用途 | 出现频率 |
|---|---|---|
| `24px` | 标准卡片 | 最高 |
| `35px` | 大面板、胶囊导航 | 高 |
| `16px` / `12px` | 内层卡片、输入框 | 中 |
| `8px` | 小标签、徽章 | 中 |
| `9999px` / `999px` | 按钮、胶囊 | 高 |
| `50%` | 头像、光点、圆形图标 |, |

## Blur（玻璃与光）

| Value | 用途 |
|---|---|
| `blur(20px)` | 导航胶囊、玻璃面板（最常用） |
| `blur(8px)` | 小型玻璃元素 |
| `blur(30px)` | 中等光晕 |
| `blur(61px)` / `blur(153px)` | 大环境光、背景光斑 |

## Type scale

| 层级 | 大小 | 字重 | 行高 | 说明 |
|---|---|---|---|---|
| Hero H1 | 48–56px（估计） | 700 | ~1.2（估计） | 只染一个关键词 |
| 区块标题 | `40px` → 移动 `36px` | 600 | `1.4` | 居中，`margin-bottom: 16–24px` |
| 卡片标题 | 20–24px（估计） | 600 | 1.4（估计） |, |
| 正文 | 15–16px（估计） | 400 | 1.6–1.8（估计） | 用 `--fg-muted` |
| 眉题 eyebrow | 12–13px（估计） | 500 | 1.5（估计） | 小字引导，如"三步完成" |
| 辅助/标签 | 12px | 400–500 | 1.5 | 统计标签、页脚 |

字体栈：`Geist, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`；
代码：`Geist Mono, "SF Mono", monospace`。无外链时用系统栈代替。

## Spacing

- 页面容器：`max-width: 1300px`，居中。
- 区块垂直节奏：`60–80px`（`padding: 60px 24px 80px` 类）。
- 卡片内边距：`32–40px`（`padding: 36px 40px 40px` 类）。
- 区块标题下间距：`16–24px`。
- 断点：`1024px` / `768px`（主）/ `480px`。

## Opacity rules

- 次级文字用透明度而非灰色号：深色 `#f5f0e899` / `#ffffffb3`。
- 卡片内水印图标 ≤ 12% 不透明度。
- 纹理底图低透明叠加，只做质感不抢内容。
