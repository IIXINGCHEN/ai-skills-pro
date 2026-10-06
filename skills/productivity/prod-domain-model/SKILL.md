---
name: prod-domain-model
description: "Domain-model producer (Chinese-first): sharpen fuzzy terms in a live session, challenge glossary conflicts on the spot, write settled terms back to the glossary immediately, and record hard-to-reverse decisions as ADRs only when all three gates pass. Use for term disputes like '把术语定下来', or as the optional stage between pipe-grill-plan and pipe-to-spec."
disable-model-invocation: true
---

# 领域模型生产者 (Domain Model Producer)

主动建造并磨利项目的领域模型。这是**生产者**纪律：质询术语、澄清冲突、把敲定的词当场写回词汇表、把难逆转的决策写成 ADR。

只读词汇表（一行习惯，任何 skill 都能做）不是这个 skill。这个 skill 用于**改模型**的时候：术语有争议、说法和代码对不上、决策需要留痕。

## 何时用

- 用户说"把术语定下来"、"这个词到底叫什么"、"术语有冲突"。
- pipe-grill-plan 之后、pipe-to-spec 之前的**可选阶段**：先把语言磨利，再写 spec。
- 讨论中发现用户说法与代码行为矛盾。

## 文件布局

单上下文仓库：

```
/
├── GLOSSARY.md
├── docs/
│   └── adr/
│       ├── 0001-*.md
└── src/
```

多上下文仓库：根目录放 `GLOSSARY-MAP.md`，指到各上下文自己的词汇表与 `docs/adr/`。

懒创建：没有词汇表时，第一个术语敲定才建；没有 `docs/adr/` 时，第一个 ADR 需要时才建。有东西写才建文件。

## 会话流程

### 1. 质询冲突

用户用的词与词汇表现有定义冲突时，**当场叫停**，不攒到最后："词汇表里'取消'指 X，你刚才的说法像是 Y，到底是哪个？"冲突不清，后面全是返工。

### 2. 磨利模糊词

用户用模糊或一词多义的词时，给出精确的 canonical 候选："你说的'账户'，是指客户还是用户？这是两个东西。"让用户二选一或拍板新词。

### 3. 场景压测

讨论概念关系时，**主动编** edge-case 场景逼边界精确："如果一笔订单同时满足 A 和 B 两个条件，它算哪一种？"场景越具体，概念边界越锋利。

### 4. 代码交叉验证

用户说"系统是这么工作的"时，去看代码是否真这么做。对不上就摆出来："代码里是整单取消，但你刚才说支持部分取消，哪个是对的？"以代码或用户拍板为准，记下结论。

### 5. 即时写回

术语一敲定，**当场**更新词汇表，不攒批。词汇表只收术语定义：不写实现细节、不当 spec、不当草稿纸。实现变了、定义没变，词汇表不动。

### 6. ADR 三条件门

只在三条**全满足**时才提议写 ADR：

1. **难逆转**：以后改主意的代价是实质性的。
2. **无上下文会惊讶**：未来的读者看到会问"为什么这么做"。
3. **真实权衡过**：有过真正的备选，是因为具体理由选了这个。

缺一条就不写。ADR 一页纸：编号、标题、日期、背景、决策、考虑过的备选、后果。

## 访谈纪律

- 一次只问一个术语问题；问完就写回，再问下一个。
- 不替用户拍板：候选词可以提，决定权在用户。
- 会话结束给一份清单：新增/修改了哪些术语、写了哪几份 ADR、还有哪些没定。

## 完成标准

- 会话中出现的所有术语冲突都已当场解决或明确标记未定。
- 敲定的术语已写回词汇表（无攒批）。
- 满足三条件的决策已有 ADR；不满足的不写。
- 未定的术语有明确的负责人和下次确认点。

## 在目录中的位置

productivity 桶，用户触发。pipe-ship 中的可选阶段：pipe-grill-plan → prod-domain-model → pipe-to-spec。spec 阶段若发现术语分歧，回到本 skill 解决。
