## 是什么

领域模型的"生产者" skill：开一场术语会话，把模糊的说法磨成精确的词汇，当场写回词汇表，难逆转的决策按三条件门写成 ADR。中文优先。

目录里四个地方消费词汇表和 ADR（pipe-grill-plan、pipe-to-spec、pipe-code-improve-architecture），但之前没有 skill 生产它们，这个 skill 补的就是生产侧。只读不写的词汇表必然腐烂。

## 什么时候用

- 术语有争议："到底叫取消还是作废"、"'账户'是指客户还是用户"。
- 用户说法和代码行为对不上。
- pipe-grill-plan 之后、pipe-to-spec 之前，作为可选阶段先把语言磨利。
- 用户直接说"把术语定下来"。

## 常见问题

**它和"读词汇表"有什么区别？**
读词汇表是消费习惯，任何 skill 一行就能做。这个 skill 是改模型的纪律：质询、拍板、写回、留痕。

**词汇表里能写实现细节吗？**
不能。词汇表只收术语定义。实现细节进 spec 或代码注释。

**什么决策值得写 ADR？**
三条全满足才写：难逆转、无上下文会惊讶、真实权衡过。缺一条就不写，避免 ADR 通胀。

**没有词汇表怎么办？**
懒创建：第一个术语敲定时建词汇表，第一个 ADR 需要时建 docs/adr/。有东西写才建文件。

## 怎么算做好了

- 会话里所有术语冲突当场解决或明确标未定。
- 敲定的术语已写回词汇表，没有攒批。
- 该写的 ADR 写了，不该写的一个没多。
- 未定术语有负责人和下次确认点。

## 在目录中的位置

productivity 桶，用户触发（disable-model-invocation）。pipe-ship 可选阶段：pipe-grill-plan → prod-domain-model → pipe-to-spec。

---

## What it does

The "producer" skill for domain models: run a terminology session that sharpens fuzzy language into precise vocabulary, writes settled terms back to the glossary on the spot, and records hard-to-reverse decisions as ADRs through a three-gate check. Chinese-first.

Four places in the catalog consume the glossary and ADRs, but no skill produced them; this one fills the producer side. A glossary nobody writes to will rot.

## When to reach for it

- Terms are disputed: what exactly "cancel" means, whether "account" is the customer or the user.
- What the user says contradicts what the code does.
- Between pipe-grill-plan and pipe-to-spec, as an optional stage to sharpen the language first.
- The user asks to settle the terminology.

## Common questions

**How is this different from reading the glossary?**
Reading is consumption; any skill can do it in one line. This skill is the discipline of changing the model: challenge, decide, write back, record.

**Can the glossary hold implementation details?**
No. Terms and definitions only. Implementation details belong in specs or code comments.

**Which decisions deserve an ADR?**
Only when all three gates pass: hard to reverse, surprising without context, the result of a real trade-off. Miss one, skip it; no ADR inflation.

**What if there is no glossary yet?**
Create lazily: the glossary appears when the first term is settled, docs/adr/ when the first ADR is needed. No file before there is something to write.

## It's working if

- Every term conflict raised in the session is resolved on the spot or explicitly marked open.
- Settled terms are already in the glossary; nothing batched.
- ADRs exist exactly where the three gates pass.
- Open terms have an owner and a next checkpoint.

## Where it fits

Productivity bucket, user-invoked only (disable-model-invocation). Optional pipe-ship stage: pipe-grill-plan → prod-domain-model → pipe-to-spec.
