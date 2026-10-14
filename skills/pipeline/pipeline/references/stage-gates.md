# Stage 门禁清单

每个 stage：进入条件 → 执行 → 退出标准。退出标准不满足，不许进下一 stage。

## S0 问题提出

- 进入：用户提出一个需求 / 问题。
- 执行：按 `skill-routing.md`：ask_matt 分流 → research 查背景；每个 repo 首次跑流水线时先走 setup-matt-pocock-skills 做一次性初始化（issue tracker 选本地文件）。
- 退出：写出一句话问题陈述 ＋ 可验证的成功标准。写不出 → 回去问用户。

## S1 需求锐化

- 进入：S0 退出。
- 执行：grill-with-docs 多轮追问（skill 路由见 `skill-routing.md`）。
- 退出：GLOSSARY.md ＋ ADR 落盘 ＋ **PRD.md**（从 `assets/prd-template.md` 复制：功能清单＋验收标准＋不做）；frontier 为空；用户确认 shared understanding。
 - PRD 回答"做什么、为什么、什么算好"；S2 的 SPEC 回答"怎么做"。

## S2 规格

- 进入：S1 退出（读 PRD.md）。
- 执行：to-spec；事实核查用 research（一手来源）。
- 退出：SPEC.md 被接受；SPEC 与 PRD 一致（功能无遗漏、验收标准可映射）；范围边界明确（做什么 / 不做什么）。

## S3 分解

- 进入：S2 退出。
- 执行：to-tickets / wayfinder。
- 退出：tickets 列表，每个有验收标准；阻塞边标清；没有"大到无法验证"的 ticket。

## S4 原型

- 进入：S3 退出。（纯后端 / 纯逻辑类问题可声明跳过原型工作，但跳过本身需用户确认，并记录原因；对应 pipeline/SKILL.md 规则 1"不许跳过 S4 的用户确认"。）
- 执行：按 `skill-routing.md` 的 S4 UI 设计子流水线（prototype → frontend-design → vis-product-design → web-design-guidelines → apple-design → review-animations / web-design-guidelines）。
- 退出：**用户亲口确认方向**。确认前不许动实现代码。

## S5 实现

- 进入：S4 退出。
- 执行：implement / implement-spec ＋ tdd（先测试后代码）。
 - 多个无依赖的 tickets 可并行实现，但每个 ticket 独立走 S5→S6→S7。
- 退出：本 ticket 测试全绿；无虚构 / 硬编码 / 模拟代码；相关文档同步更新。
- 更新 `STATUS.md`：tickets 进度、当前 stage。

## S6 审计

- 进入：S5 退出。
- 执行：code-review（标准＋规格双轴）＋ `audit-checks.md` 快速扫描；UI 项目加 web-design-guidelines / review-animations。
- 退出：P0/P1 = 0。有 → 回 S5，并记录回环原因。
- 更新 `STATUS.md`：回环次数、阻塞事项。

## S7 测试

- 进入：S6 退出。
- 执行：回归脚本（单元＋集成＋e2e）；失败先走 diagnosing_bugs 诊断再回 S5。
- 退出：全绿。有失败 → 回 S5，并记录回环原因。
- 更新 `STATUS.md`："全面测试"四套件结果＋时间＋结论。

## 需求变更（任何 stage 都可能发生）

- 用户中途改需求 → **不许在当前 stage 硬改**。回到 S1（术语 / 决策 / PRD 变了）或 S2（范围变了），更新 GLOSSARY / ADR / PRD / SPEC，已完成的 stage 中受影响的部分重跑。
- 在 PIPELINE_RUN.md 记录：变更内容、回到的 stage、重跑范围。

## 内循环出口

S6 零 P0/P1 **且** S7 全绿 → 进 S8。同一问题第 3 次回环仍未解决 → 停下来问用户，不许无限循环。

## S8 全局审计

- 进入：内循环出口。
- 执行：code_review 全量 ＋ `audit-checks.md` 全量 ＋ `production-bar.md` 逐条过；可选 improve-codebase-architecture 做架构可视化审计。
- 退出：零 P0/P1。有 → 打回 S5，并记录原因。
- 更新 `STATUS.md`："安全"四项结果＋时间＋结论；"发布就绪"S8 勾选。

## S9 全局测试

- 进入：S8 退出。
- 执行：全量回归（单元＋集成＋e2e＋冒烟），干净环境重跑；失败走 diagnosing_bugs。
 - 干净环境 ＝ 全新检出或全新临时数据目录（参考 quiz 项目"全新临时 DATA_DIR"做法），不复用旧构建产物与旧数据库，依赖重新安装。
- 退出：全绿。有失败 → 打回 S5。
- 更新 `STATUS.md`："全面测试"四套件结果＋时间；"发布就绪"S9 勾选。

## S10 发布

- 进入：S8 ＋ S9 全过。
- 执行：打包（只收本项目文件，不含旧文件与非项目文件）＋ SHA-256 ＋ 版本一致性校验（`pr` skill 不适用：本流水线不提交仓库）。
- 退出：**用户确认发布** ＋ 交付包可独立验证。
- 落盘：`PIPELINE_RUN.md` 记录交付包＋SHA-256＋确认时间；项目根 `PROJECT.md`（从 `assets/project-dossier-template.md` 复制，不存在则新建）的"版本历史"追加一行。
- 更新 `STATUS.md`："发布就绪"用户确认勾选＋结论；一句话状态改为"可发布"。

## S11 复盘

- 进入：S10 退出。
- 执行：retro；超长任务加 handoff。
- 退出：三层沉淀，缺一不可, 1. **本项目**：`PROJECT.md` 更新（未验证项勾选/新增、风险更新、环境教训追加、待办更新）；
 2. **跨项目**：通用 lessons 写入 `AGENTS.md` / `MEMORY.md`；
 3. **pipeline 自身**：skill 要改的也改掉（记一条原因）。
- `PIPELINE_RUN.md` 归档保留（重命名为 `PIPELINE_RUN-<版本>.md` 或移入 `docs/runs/`）。
