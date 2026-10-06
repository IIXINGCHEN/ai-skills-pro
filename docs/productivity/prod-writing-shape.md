## 它做什么 / What it does

写作 exploit 阶段的中文 skill：把已冻结的素材堆一段一段长成文章。每个概念先"接地"（读者自带或前文已建）后使用；开头给 2 到 3 个候选由用户选定；每段达成一致立刻落盘；素材堆缺料就点名，不编造。

Chinese-first skill for the writing exploit phase: grows a frozen pile of raw material into an article paragraph by paragraph. Every concept is grounded (brought by the reader or built earlier) before use; the opening is chosen by the user from 2-3 candidates; each agreed block is written to disk immediately; gaps in the pile are named, never silently invented.

## 何时用它 / When to reach for it

碎片已经够了、用户说"开始成文"时。输入是 prod-writing-fragments 的产出，也可以是任何素材堆（提纲、转文字稿、草稿）。用户触发，模型不会自行调用。

When the fragments are ready and the user says "开始成文" ("shape my draft"). Input is the prod-writing-fragments output, or any raw pile (outline, transcript, rough draft). User-invoked only.

## 常见问题 / Common questions

**它和 prod-writing-fragments 是什么关系？**
shape 只成文不挖新碎片，fragments 只挖碎片不成文。素材文件对 shape 是只读的；shape 发现缺口由用户当场补或砍掉，不回头重开 explore。

**What is its relationship with prod-writing-fragments?**
shape drafts but never mines new fragments; fragments mines but never drafts. The material file is read-only to shape; gaps found mid-shaping are filled by the user on the spot or cut, never by reopening explore.

**素材不够怎么办？**
明确点名缺口："这里需要一个例子，堆里没有。你现在给我一个，或者这节砍掉。"不许静默编造，这是红线。

**What if the pile lacks something the article needs?**
Name the gap explicitly ("we need an example here and the pile doesn't have one; give me one now or we cut this section"). Silently inventing material is a red line.

**它会改我的碎片文件吗？**
不会。素材文件只读，所有成文写进另一篇独立的文章文件。

**Will it edit my fragment file?**
No. The material file is read-only; all drafting goes into a separate article file.

**"接地"是什么意思？**
读者能用的概念才能用：要么读者进门自带（前置知识），要么前文已经建起来。没接地的概念硬用，读者就跟丢了。

**What does "grounding" mean?**
Only concepts the reader has can be used: either brought in by the reader (prerequisites) or built earlier in the article. Leaning on an ungrounded concept loses the reader.

## 怎么算成了 / It's working if

- 每段只用已接地概念；新概念先接地后使用。
- 开头是用户从候选里选定的，不是模型默认的。
- 缺料处都被点名过（用户补了或砍掉了）。
- 素材文件全程未被修改。
- Every block leans only on grounded concepts; new concepts are grounded before use.
- The opening was chosen by the user from candidates, not defaulted by the model.
- Every material gap was named (filled by the user or cut).
- The material file was never modified.

## 在哪一环 / Where it fits

productivity 桶的写作 skill，用户触发。explore/exploit 二分的后半段；前接 prod-writing-fragments。成文后如需发布排版，那是用户自己的事，不在本 skill 范围内。
