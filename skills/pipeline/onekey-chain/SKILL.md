---
name: onekey-chain
description: "把\"有一个想法\"到\"代码写完、审完、架构看完\"的完整链路一次走完，免去六次分别调用、每次重新讲上下文。适用于中等以上规模的新功能/新模块：一次调用，全程只在被链 skill 要求人工判断处暂停。"
---



# onekey-chain

## 目标

把"有一个想法"到"代码写完、审完、架构看完"的完整链路一次走完，免去六次分别调用、每次重新讲上下文。适用于中等以上规模的新功能/新模块：一次调用，全程只在被链 skill **要求人工判断**处暂停。

## 调用即授权

**用户显式调用 onekey-chain 即视为明确授权**按本文件顺序依次调用六个 stage skill，不再逐个请示。
但每个 skill 内部要求的人工确认点（下文各阶段"暂停点"）必须遵守，不得跳过。

## 全局覆盖规则（高于被链 skill 的默认行为）

1. **永不 commit / push**：implement 阶段默认会 commit，本链中必须覆盖, 全程只改工作区，
 完成后由用户决定如何处置。这是硬规则，无例外。
2. **code-review 的 fixed point 适配**：code-review 要求 `git diff <fixed-point>...HEAD`，
 但本链不产生新 commit。做法：stage 4 开始前若工作区干净，记下 `HEAD` 为 fixed point；
 审查时用 `git diff <fixed-point>`（worktree 对比）代替 three-dot，并在报告里注明。
 若 stage 4 开始前工作区本来就脏，先让用户确认以当前状态为基准（审查范围会包含之前未提交的改动）。
3. **上下文管理**：链很长。每阶段结束时用 3–5 行小结沉淀结论（决策、spec 位置、ticket 列表），
 下一阶段只带小结 + 必要文件上路，保持上下文轻量。implement 与 code-review 的重活优先派子 agent。

## 前置检查（stage 0，不计入六步）

1. 确认当前目录是 git 仓库；记录 `git status --short`，有未提交改动先告知用户（影响 code-review 基准）。
2. 确认 `docs/agents/issue-tracker.md` 是否存在。不存在 → 两种走法，由用户选：
 - 手动完成等价初始化（建 issue tracker 或本地 `.scratch/` 目录、triage 标签、GLOSSARY/ADR 骨架）后再继续（推荐；原 `/setup-matt-pocock-skills` 为第三方 skill，未收录）；
 - 降级为本地模式：spec/ticket 落 `.scratch/` 文件（to-tickets 支持本地文件口径）。
3. 确认用户给出了明确的想法/目标。只有一个词或含糊不清时，先问清再进 stage 1。

## 六步流程

### Stage 1, /grill-me（架构拷问）

用 Skill 工具调用 `grill-me`（实际执行体是 `grilling`），按其流程对用户的想法做 relentless interview。
**暂停点**：用户回答问题（多轮）。**结束门**：等待用户亲口说"方向定了/可以了"确认收敛。

### Stage 2, /to-spec（定规格）

用 Skill 工具调用 `to-spec`。**不做访谈**，只把 stage 1 的结论综合成 spec
（Problem / Solution / 用户故事 / Implementation Decisions），先探索仓库现状，
用项目的领域词汇（GLOSSARY）和 ADR 约束措辞。
**暂停点**：该 skill 要求与用户确认测试 seam 的选择, 必须问。**结束门**：spec 发布到 tracker
（或本地 `.scratch/`），用户认可。

### Stage 3, /to-tickets（拆任务）

用 Skill 工具调用 `to-tickets`。按 tracer-bullet 切纵切片，每个 ticket 声明
blocking edges；大改动走 expand–contract。先探索代码库找 prefactor 机会。
**暂停点**：该 skill 要求 quiz 用户, 必须问。**结束门**：ticket 列表 + 阻塞关系用户确认。

### Stage 4, /implement（写代码）

用 Skill 工具调用 `implement`。按 ticket 顺序实现：能 TDD 的 TDD，
在约定 seam 处测试，勤跑类型检查，结束跑全量测试。**覆盖规则 1 生效：不 commit**。
建议按 ticket 派子 agent 并行（无阻塞关系的），主 agent 负责串联与验收。
**暂停点**：无（除非测试全红、实现与 spec 冲突, 此时停下问用户，不自行改 spec）。
**结束门**：全量测试通过。

### Stage 5, /code-review（双轴审查）

用 Skill 工具调用 `code-review`。fixed point 按"全局覆盖规则 2"取。
Standards 轴与 Spec 轴并行跑（子 agent 隔离），汇总报告。
**暂停点**：报告 findings 后，由用户决定修 / 不修 / 降级, 修则回到 stage 4 补一刀再验，
不自行决定忽略 P0/P1。
**结束门**：用户接受审查结论（修完或明确接受）。

### Stage 6, /improve-codebase-architecture（架构深化）

用 Skill 工具调用 `improve-codebase-architecture`。先定扫描范围
（用户指定方向，或从 git log 找热点），读 GLOSSARY 与相关 ADR，生成 HTML 报告给用户看，
用户挑一个后针对它 grill。**只出报告和 grill**；用户明确说"动手改"才进入改动。
**暂停点**：用户挑选 deepening 机会。**结束门**：grill 完成，报告路径告知用户。

## 跳过与提前结束

- 用户可在任何暂停点说"跳过这步/后面"或"到此为止"，照做即可。
- 任何阶段发现想法本身不成立（如 stage 1 拷问出方向错误），立即停下汇报，六步按需取舍。

## 输出

结束时给一份六步小结：每步一句话结论 + 产物位置（spec 链接/路径、ticket 列表、
code-review findings 处置、arch 报告路径），点到为止。
