## 它做什么

写"给 agent 消费的文档"的方法论：skill、AGENTS.md / CLAUDE.md、任何被 context pointer 指向的文档。给出一套杠杆：context pointer 措辞、context load 与 cognitive load 双预算、信息层级阶梯、完成标准（防提前收尾）、前置词、剪枝（猎杀 no-op）。

## What it does

Methodology for writing documents that agents consume: skills, AGENTS.md / CLAUDE.md, any document reached through a context pointer. Provides the levers: context pointer wording, the two budgets (context load vs cognitive load), the information hierarchy ladder, completion criteria (against premature completion), leading words, and pruning (hunting no-ops).

## 什么时候用它

新建或改写 skill、改 AGENTS.md / CLAUDE.md、写任何 agent 要按序执行的文档之前。先用它定指针措辞和信息层级，再写正文；写完用它的完成标准清单自查。

## When to reach for it

Before creating or rewriting a skill, editing AGENTS.md / CLAUDE.md, or writing any document an agent will execute. Use it to settle pointer wording and the information hierarchy first, then write the body; self-review against its completion checklist when done.

## 常见问题

**它和写作风格指南有什么区别？**
风格指南管文字好看；它管 agent 的行为可预测：指针何时触发、步骤何时算做完、哪行字在烧哪种预算。

**Common questions**

**How is it different from a style guide?**
A style guide makes prose pretty; this makes agent behavior predictable: when a pointer fires, when a step counts as done, which budget each line spends.

**为什么指针措辞比目标重要？**
措辞决定 agent 何时取到材料。重要材料配弱措辞等于方差 bug：先磨措辞，磨不动才把材料 inline 进来。

**Why does pointer wording matter more than its target?**
The wording decides when the agent reaches the material. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first, inline the material only if sharpening fails.

**no-op 怎么判？**
看它相对模型默认行为改变了什么。两个人有分歧，分歧的是"默认是什么"，跑一遍文档来裁，不用辩论。fail 的句子整句删。

**How do you judge a no-op?**
Check what it changes versus the model's default behavior. When two people disagree, they disagree about the default: settle it by running the document, not by debate. Delete the whole failing sentence.

## 写对了的信号

- 常驻指针触发词前置，一分支一触发。
- 步骤不被参考材料淹没；分支专属内容藏在指针后。
- 每个步骤的完成标准可检查、穷尽。
- 逐句过 no-op 测试，fail 的已删。

## It's working if

- Every always-loaded pointer front-loads its trigger word, one trigger per branch.
- Steps are not buried under reference material; branch-specific content sits behind pointers.
- Each step's completion criterion is checkable and exhaustive.
- Every sentence passed the no-op test; failures were deleted whole.

## 在目录里的位置

productivity 桶的元纪律 skill；model-invoked，可复用的写作纪律。写好它，再写目录里其他 skill。
