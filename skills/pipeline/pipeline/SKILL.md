---
name: pipeline
description: "把一次交付走完一整条流水线：需求 → 实现 → 发布。三个硬约束： ① 实现/审计/测试是内循环，不干净不许出环； ② 发布前有全局审计＋全局测试两道门禁，全过才能发布； ③ 出环的代码必须是生产级（标准见 references/production-bar.md）。"
---



# Pipeline

## Purpose

把一次交付走完一整条流水线：需求 → 实现 → 发布。三个硬约束：
① 实现/审计/测试是**内循环**，不干净不许出环；
② 发布前有**全局审计＋全局测试**两道门禁，全过才能发布；
③ 出环的代码必须是**生产级**（标准见 `references/production-bar.md`）。

## Workflow

每 stage 的详细门禁见 `references/stage-gates.md`（进入条件 → 执行 → 退出标准）；
每个 stage 用什么 skill 见 `references/skill-routing.md`（调用模型 L0/L1/L2：pipeline 是用户显式调用的编排器，stage skills 显式调用，tdd/code-review/diagnosing-bugs 等纪律 skills 执行中自动调用；不确定时先问 ask-matt）；
S6/S8 的具体扫描命令见 `references/audit-checks.md`；
生产级标准见 `references/production-bar.md`。

### 直线段（S0–S4，一次通过）

| Stage | 做什么 | 调用的 skill | 产物 | 出口门禁 |
|---|---|---|---|---|
| S0 问题提出 | 一句话问题陈述＋成功标准 | research, ask-matt | 问题陈述 | 说得清"解决什么、怎么算成" |
| S1 需求锐化 | 拷问到 shared understanding | grill-with-docs | GLOSSARY.md＋ADR＋PRD.md | frontier 为空 |
| S2 规格 | 沉淀为规格（基于 PRD） | to-spec | SPEC.md | 规格被接受，与 PRD 一致 |
| S3 分解 | 拆成可独立交付的 tickets | to-tickets, wayfinder | tickets（含阻塞边） | 每个 ticket 可独立验证 |
| S4 原型 | 可交互原型（设计类问题） | UI 设计子流水线（见 skill-routing.md） | 原型 | **用户确认方向；确认前不许动实现代码** |

### 内循环（S5–S7，不干净不出环）

| Stage | 做什么 | 调用的 skill | 产物 | 出口门禁 |
|---|---|---|---|---|
| S5 实现 | 按 SPEC 实现，TDD，先测试后代码 | implement / implement-spec, tdd | 代码＋测试 | 测试全绿 |
| S6 审计 | 标准＋规格双轴审计 | code-review ＋ audit-checks | 审计报告 | P0/P1 = 0 |
| S7 测试 | 回归测试 | 回归脚本；失败 diagnosing-bugs | 测试报告 | 全绿 |

循环规则：
- S6 发现 P0/P1 → 回 S5；S7 有失败 → 回 S5。
- **只有"S6 零 P0/P1 且 S7 全绿"同时成立，才允许进入 S8。**
- 防呆：同一问题第 3 次回环仍未解决，停下来问用户，不许无限循环；每次回环记录原因。

### 发布双门禁（S8–S10）

| Stage | 做什么 | 出口门禁 |
|---|---|---|
| S8 全局审计 | code-review 全量＋audit-checks＋production-bar：安全扫描（密钥/注入/越权）、配置审计（无硬编码、fail-closed）、真实性扫描（TODO/FIXME、生产路径 mock/桩/演示数据、硬编码密钥与 URL）、路径扫描（写死绝对路径、字符串拼接路径分隔符）、文档一致性（代码和文档一起修） | 零 P0/P1，否则打回 S5 |
| S9 全局测试 | 全量回归：单元＋集成＋e2e＋冒烟，干净环境重跑；失败 diagnosing-bugs | 全绿，否则打回 S5 |
| S10 发布 | 打包＋SHA-256＋版本一致性校验 | S8＋S9 全过 **且用户确认发布** |

### S11 复盘

retro（超长任务加 handoff）→ lessons 写入 AGENTS.md / MEMORY.md。

## Output Contract

一次完整流水线交付：问题陈述、SPEC、tickets、原型、代码、审计报告、测试报告、交付包（＋SHA-256）、复盘记录。缺一件都不算走完。

## Operating Rules

1. 门禁是硬性的：不许跳过 S4 的用户确认，不许带着 P0/P1 进 S8，不许 S8/S9 没全过就发布。
2. 生产标准见 `references/production-bar.md`：每条都是 S8 的检查项，不是建议。其中"真实性"三条是红线, , **虚构代码、硬编码、模拟代码**在 S6 和 S8 都是 P0，一票打回 S5。
3. 内循环防呆：同一问题第 3 次回环仍未解决，停下来问用户。
4. 文档与代码同修：任何实现变更必须同步更新受影响的文档（API.md / README / CHANGELOG），这是 S6/S8 的审计项。
5. 每个 stage 的产物落盘后再进下一 stage；stage 之间用 todo 跟踪，不靠口头。
6. 每次运行从 `assets/run-record-template.md` 复制一份 `PIPELINE_RUN.md` 到项目根：todo 管"正在做什么"，它管"做到了哪、为什么回环"。
7. 项目持久记忆：项目根维护一份 `PROJECT.md`（从 `assets/project-dossier-template.md` 复制），跨运行累积版本历史、未验证项、风险、环境教训、待办。S10 追加版本行，S11 做三层沉淀（PROJECT.md ← 本项目，AGENTS.md/MEMORY.md ← 跨项目通用）。
8. 实时状态：项目根维护一份 `STATUS.md`（从 `assets/status-template.md` 复制），每个 stage 退出、每次测试/审计跑完、每次回环都要更新。它回答四个问题, , 实时进度、全面测试是否通过、是否可发布、是否安全，是"项目现在怎么样"的唯一入口。
9. 调用约定：每个 stage 开始前，先读该 stage 对应 skill 的 SKILL.md 再执行, , pipeline 只管 stage 流转和门禁，不管 stage 内部细节。
10. 本 skill 为用户自研，可按实际跑下来的教训修改（改完记一条原因）。
