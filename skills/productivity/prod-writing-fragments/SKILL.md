---
name: prod-writing-fragments
description: "Writing explore phase (Chinese-first): relentless grilling interviews that mine raw writing fragments (sharp lines, claims, vignettes, half-thoughts); append-only, never structures or drafts. Use when the user wants to explore what to write, e.g. '帮我挖写作素材', 'brainstorm writing fragments'."
disable-model-invocation: true
---

# 写作碎片

纯 explore 阶段：把"能写什么"的空间撑大，不做任何收敛。挖出一堆写作碎片，存进一个文件。不定大纲，不写成文。

## 定位

- 只做 explore：挖碎片。exploit（收敛成文）是另一个 skill 的事。
- 成文由 `prod-writing-shape` 负责。两者的分工见"与 prod-writing-shape 的分工"。

## 开场

1. 确认写作主题，一句话即可。
2. 确认碎片文件路径。用户没给就问一次，之后记住。首次写入时只放一个 H1 工作标题（以后可改），不要元数据、目录、日期。

## 访谈：怎么挖

grilling 式追问，目标是把用户脑子里的东西倒出来：

- 问"你真正想说的是什么"，而不是"你想写什么结构"。
- 追具体：抽象论断要一个例子、一个反例、一段亲历。
- 听到反复打转的念头，逼它成形为一句话，甚至一个词（题眼词，见下）。
- 用户一旦滑向结构、标题、篇幅，拉回来："那是 exploit 的事，现在只管挖。"

从用户第一句话就开始捕捉碎片，包括最初的 prompt。

## 什么是碎片

碎片是"将来可能活下来的一段文字"。标准只有一条：作者自己能看懂。不需要让冷读者看懂，不需要自洽论证。是好写作的料，不是成品。

碎片故意长得不一样：

- 金句：想用但还不知道放哪的一句话。
- 论断加一行理由。
- vignette：发生过的事、一段代码、一个场景、一个类比。
- 半成品："X 有点像 Y，以后再想清楚"。
- 引文、对话、偶然听到的一句。
- 一组凭感觉凑在一起的观察。
- 抱怨、坦白、包袱。
- **题眼词**：能撑起整篇的 compact 隐喻或造词，一个词命名一个模式（像 tracer bullet、fog of war 那样）。这是最值钱的碎片：explore 阶段定下它，exploit 阶段的结构、过渡、标题都会跟着走，红利吃到最后。

## 只追加，严禁成文

- 碎片一出现就追加进文件，不攒批。
- 禁止事项：定大纲、分章节、排顺序、写过渡句、"我来总结一下"。
- 每次写入前重读文件：用户可能在回合之间改过、删过、调过顺序。只追加（或按用户要求原地改某一条），绝不覆盖重写。
- 用户随时可以说"删掉上一条""这条改锋利点""这两条合并"，当作一等指令执行。
- 追加时顺带提一句（"记下了"），不要用保存确认打断访谈。

## 文件格式

```markdown
# 工作标题

第一条碎片。可以多段，可以带列表、代码、引用：顺其自然。

---

第二条碎片。

---

> 用户想留着的一句引文。

附一句你的反应。

---

- 一组凭感觉凑在一起的观察
- 彼此靠近放着
```

碎片之间用 `---` 分隔。正文里不加标题、不打标签、不排序（追加顺序即顺序）。

## 与 prod-writing-shape 的分工

- fragments 只挖碎片，不成文；shape 只成文，不挖新碎片。
- shape 的输入就是这个碎片文件（对 shape 只读）。shape 过程中发现素材缺口，由用户当场补或砍掉，不回头重开 explore。

## 红线

- 不替用户决定主题：explore 是 widen，不是 decide。
- 不评判碎片好坏：先全部收下，筛是 exploit 阶段的事。

## Checkable Completion Criteria

- [ ] 碎片文件已建立：H1 工作标题加至少一条碎片。
- [ ] 全程没有出现大纲、章节、过渡句。
- [ ] 每次写入前都重读了文件，没有覆盖用户在回合间的修改。
- [ ] 用户说停就停：文件本身就是交付物。
