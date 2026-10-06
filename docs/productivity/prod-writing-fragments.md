## 它做什么 / What it does

写作 explore 阶段的中文访谈 skill：用 grilling 式追问把用户脑子里的东西挖成写作碎片（金句、论断、vignette、半成品想法、题眼词），追加进一个碎片文件。只挖不整理：不定大纲、不分章节、不写成文。

Chinese-first interview skill for the writing explore phase: relentless grilling questions mine raw writing fragments (sharp lines, claims, vignettes, half-thoughts, leading words) into an append-only fragment file. It mines but never organizes: no outlines, no sections, no drafting.

## 何时用它 / When to reach for it

用户说"想写点东西但还没想清楚""帮我挖写作素材"时；有主题、没结构时。用户触发，模型不会自行调用。

When the user says they want to write something but have not thought it through yet ("帮我挖写作素材", "brainstorm writing fragments"); when there is a topic but no structure. User-invoked only; the model never reaches for it on its own.

## 常见问题 / Common questions

**它和 prod-writing-shape 是什么关系？**
fragments 只挖碎片不成文，shape 只成文不挖新碎片。shape 的输入就是 fragments 的产出（只读）。先 explore，再 exploit。

**What is its relationship with prod-writing-shape?**
fragments mines fragments but never drafts; shape drafts but never mines new fragments. shape takes the fragment file as read-only input. Explore first, exploit second.

**碎片要写多完整？**
作者自己能看懂就行，不需要让冷读者看懂。标准是"这是好写作的料"，不是"这是自洽的论证"。

**How polished should a fragment be?**
Readable by the author is enough; it does not need to make sense to a cold reader. The bar is "this is good raw material", not "this is a self-contained argument".

**它会替我定结构吗？**
不会。那是 exploit 的事，也是本 skill 的红线：访谈中一旦滑向大纲就拉回来。

**Will it decide the structure for me?**
No. That belongs to the exploit phase and is this skill's red line: any drift toward outlining gets pulled back to mining.

## 怎么算成了 / It's working if

- 碎片文件里只有碎片和 `---` 分隔线，没有大纲、章节、过渡句。
- 每次写入前都重读了文件，没有覆盖用户的回合间修改。
- 用户能随时删、改、合并碎片。
- The fragment file contains only fragments separated by `---`: no outlines, sections, or transitions.
- The file is re-read from disk before every write; no user edit between turns is overwritten.
- The user can cut, sharpen, or merge fragments at any time.

## 在哪一环 / Where it fits

productivity 桶的写作 skill，用户触发。explore/exploit 二分的前半段；后接 prod-writing-shape。与 prod-eq-reply 同属"只出主意不动手"的咨询型 skill：它挖料，用户拥有最终文字。
