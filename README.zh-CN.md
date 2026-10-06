# AI Skills Pro（AI 技能库）

> 面向真实软件工程的生产级模块化 AI Agent 技能库：横跨工程、生产力、设计与流水线四大领域的 63 个技能。提供一键式 Autopilot 流水线、证据门禁质量体系，并全面兼容 Claude Code、OpenAI Codex、DeepSeek Harness (DSH)、Cursor 及开放的 Agent Skills 标准。

[English](README.md) | 简体中文

![技能数](https://img.shields.io/badge/skills-63-blue) ![校验](https://img.shields.io/badge/validation-63%2F63%20pass-brightgreen) ![协议](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-%E2%89%A520.x-339933)

---

## ⚡ 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/IIXINGCHEN/ai-skills-pro.git
cd ai-skills-pro

# 2. 校验完整性
npm run validate

# 3. 安装（将全部 63 个技能软链至 Agent 技能目录）
./scripts/link-skills.sh        # Linux / macOS
.\scripts\link-skills.ps1      # Windows PowerShell

# 4. 在任意 Agent 会话中使用
/eng-enterprise-lifecycle 开发一个用户积分兑换模块
```

**一条指令，跑通全流程。** 旗舰 Autopilot 编排器自动推进 13 个阶段（需求澄清、规格冻结、白名单约束计划、编码、自动验证、多维审查、修复循环、完成判定），仅在 3 个人工门禁处暂停等待确认（Brief 确认、Plan 确认、推送授权）。

---

## 🚀 11 个一键 Autopilot 工作流

| 指令 | 流水线 | 人工门禁 |
| :--- | :--- | :--- |
| `/pipe-ship` | 从想法到生产：拷问、定规格、拆任务、实现（单 ticket 闭环）、审查、架构深化、交付、部署 | 规格确认、任务确认、推送授权、发布窗口 |
| `/pipe-harden` | 存量项目到绿灯：审计、修复、测试、再修复循环、分支-PR-CI-审查-合并 | 修复范围、推送授权、合并授权 |
| `/eng-enterprise-lifecycle` | 新功能研发全链路（13 阶段，支持快速通道） | Brief / Plan+白名单 / 推送授权 |
| `/eng-review-and-fix` | 审查到绿灯修复循环（上限 3 轮修复） | 无（自动循环） |
| `/eng-review-and-ship` | 审查、修复、验证、3-5 轮收敛后提交到授权推送的交付闭环 | 推送授权 |
| `/eng-defect-lifecycle` | Bug 修复：根因分析到提交 | RCA 根因确认 |
| `/eng-onboarding-audit-lifecycle` | 只读代码库健康体检 | 无 |
| `/eng-hotfix-emergency-lifecycle` | P0/P1 生产事故快车道 + 强制复盘 | 热修审批 |
| `/eng-refactor-lifecycle` | 行为保持的渐进式重构 | Plan 确认 |
| `/eng-release-ops-lifecycle` | 发布窗口自动化 + 回滚预案 | 发布窗口确认 |
| `/prod-content-delivery-lifecycle` | Brief 冻结的内容交付 | Brief 确认 |

---

## 🔄 顺序执行流水线

所有技能既可独立使用，也可作为端到端流水线的互联阶段：

### 1. 新功能研发全链路
```
[1. 需求澄清]       prod-briefing-loop ──► [门禁: Brief 确认]
                            │
[2. 上下文]         eng-prime-context ➔ eng-analyze-codebase
                            │
[3. PRD(可选)]      prod-create-prd（仅新功能需要）
                            │
[4. 规格冻结]       eng-spec（requirements.md, design.md, checklist.md）
                            │
[5. 计划+白名单]    eng-plan ➔ eng-change-scope-funnel ──► [门禁: 计划确认]
                            │
[6. 实现]           eng-execute（白名单边界内编辑）
                            │
[7. 先验证]         eng-validate（绝不审查未经测试的代码）
                            │
[8. 多维审查]       eng-multidimensional-audit ➔ eng-hardening-review
                            │
[9. 修复循环]       eng-review-fix（3-5 轮收敛）➔ 重新验证
                            │
[10. 修复复核]      二次独立审查（仅复核修复 diff）
                            │
[11. 完成判定]      eng-completion-gate（DONE / 带风险完成 / BLOCKED）
                            │
[12. 交付]          eng-git-commit ➔ eng-git-pr ──► [门禁: 推送授权]
                            │
[13. 复盘归档]      prod-execution-report
```

### 2. 缺陷排查与精准修复
```
eng-bugfix-rca（先红测试）➔ [门禁: RCA 确认] ➔ eng-bugfix-implement ➔ eng-validate ➔ eng-git-commit
```

### 3. 代码库接手与架构巡检
```
eng-prime-context ➔ eng-analyze-codebase ➔ eng-multidimensional-audit ➔ eng-validate ➔ 输出健康报告
```

### 4. Ship：想法到生产全链路
```
/pipe-ship <feature-slug>
[1. 拷问]   pipe-grill-plan ──► [门禁: 共识确认]
[2. 规格]   pipe-to-spec ──► [门禁: 规格冻结]
[3. 任务]   pipe-to-tickets ──► [门禁: 拆分确认]
[4. 实现]   pipe-implement 单 ticket 闭环（实现、测试、审计、审查、修复、再测试、再修复；3 轮熔断）
[5. 审查]   eng-code-review ➔ eng-review-fix ──► [门禁: APPROVED]
[6. 深化]   code-improve-architecture ──► [门禁: 深入 / 搁置 / 结束]
[7. 交付]   eng-review-and-ship ──► [门禁: 推送授权]
[8. 部署]   eng-release-ops-lifecycle ──► [门禁: 发布窗口] ➔ 健康检查 ➔ 回滚预案
```

### 5. Harden：存量项目加固
```
/pipe-harden <project-dir>
[1. 审计]  eng-adversarial-audit / eng-code-review ──► [门禁: 修复范围确认]
[2. 修复]  eng-review-fix（每个修复带回归测试）
[3. 测试]  eng-validate（全量套件）──► 绿灯? ──► [5. 交付] / 红灯? ──► [4. 再修复]
[4. 再修复] 诊断 ➔ 最小修复 ➔ 重测（每处失败最多 3 轮，超了升级）
[5. 交付]  分支 ➔ PR ➔ CI（必须全绿）➔ 审查 ➔ squash 合并 ──► [门禁: 推送授权、合并授权]
```

---

## 🌐 技能蒸馏目录

本包自带面向技能蒸馏目录（如 everythingskill.net）的机器可读元数据：每个 skill 的 `agents/openai.yaml` 接口描述、中英双语摘要、63 个 skill 的规范注册表。随时生成可提交的目录条目：

```
npm run export:distillation
```

输出 `dist/everythingskill-entry.json`，可直接用于目录提交（web 表单、issue，或向目录的 `skills.json` 提 PR）。

---

## 🛡️ 内置安全模型

- **证据化完成判定**：`eng-completion-gate` 给出 DONE / DONE-WITH-ACCEPTED-RISKS / BLOCKED 三态结论；每项声明必须对应可验证产物。
- **破坏性操作双确认**：`eng-destructive-safety-gate` 对任何不可逆操作要求两次显式确认并生成恢复工件。
- **只读推送策略**：`eng-git-pr` 默认仅产出就绪报告，未经用户显式指令绝不推送；保护分支永不强推。
- **白名单约束编辑**：`eng-change-scope-funnel` 在首次编辑前锁定变更面。
- **测试先行修复**：`eng-bugfix-rca` 要求修复前必须存在失败测试作为证据链起点。

---

## 架构与调用模型

技能按四大桶组织于 `skills/` 目录：
- **`skills/engineering/`**（29 个）：生命周期编排器、SDD 核心（规格/计划/执行）、审查与审计、安全门禁、Git 交付、DevOps。
- **`skills/productivity/`**（11 个）：需求简报循环、PRD、内容交付、提示词增强、会话管理、复盘报告。
- **`skills/design/`**（8 个）：UI 逆向、3D 角色编译、动漫风格化、产品级 Web 体验设计、自适应产品设计套件、苹果级作品集生成、现代原生 UI 架构，以及 AxiomOS 认知原则库。
- **`skills/pipeline/`**（10 个）：`pipe-ship` 端到端流水线（拷问、规格、任务、实现、审查、深化、交付、部署）及其阶段技能，以及 `pipe-harden` 修复流水线（审计、修复、测试、再修复、经 PR 交付）。

每个技能均包含：
1. `SKILL.md`：无歧义指令 + 可勾选验收标准 + 反幻觉护栏。
2. `agents/openai.yaml`：标准 Codex / OpenAI 接口元数据。
3. 配套人类文档 `docs/<bucket>/<skill-name>.md`。

---

## 🧭 完整技能目录

### 1. 工程技能（`skills/engineering/`）

| 技能 | 调用方式 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| `eng-enterprise-lifecycle` | 仅用户 | [`SKILL.md`](skills/engineering/eng-enterprise-lifecycle/SKILL.md) | **Autopilot**：13 阶段企业流水线，3 门禁 + 快速通道 |
| `eng-review-and-fix` | 仅用户 | [`SKILL.md`](skills/engineering/eng-review-and-fix/SKILL.md) | **Autopilot**：一键审查到绿灯修复循环 |
| `eng-review-and-ship` | 仅用户 | [`SKILL.md`](skills/engineering/eng-review-and-ship/SKILL.md) | **Autopilot**：审查修复验证后授权推送到对应仓库的交付闭环 |
| `eng-defect-lifecycle` | 仅用户 | [`SKILL.md`](skills/engineering/eng-defect-lifecycle/SKILL.md) | **Autopilot**：RCA 到提交的缺陷闭环 |
| `eng-onboarding-audit-lifecycle` | 仅用户 | [`SKILL.md`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md) | **Autopilot**：一次性只读代码库健康体检 |
| `eng-hotfix-emergency-lifecycle` | 仅用户 | [`SKILL.md`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md) | **Autopilot**：P0/P1 事故快车道 + 强制复盘 |
| `eng-release-ops-lifecycle` | 仅用户 | [`SKILL.md`](skills/engineering/eng-release-ops-lifecycle/SKILL.md) | **Autopilot**：发布窗口自动化与回滚预案 |
| `eng-refactor-lifecycle` | 仅用户 | [`SKILL.md`](skills/engineering/eng-refactor-lifecycle/SKILL.md) | **Autopilot**：行为保持的渐进式重构 |
| `eng-router` | 仅用户 | [`SKILL.md`](skills/engineering/eng-router/SKILL.md) | 中央生命周期路由器与编排器注册表 |
| `eng-spec` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-spec/SKILL.md) | **SDD**：编码前冻结需求与设计契约 |
| `eng-plan` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-plan/SKILL.md) | 基于真实代码证据的一次性施工计划 |
| `eng-execute` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-execute/SKILL.md) | 白名单约束下的逐步实现 |
| `eng-validate` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-validate/SKILL.md) | 全套健康检查：Lint、类型、测试、构建 |
| `eng-code-review` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-code-review/SKILL.md) | 六维审查 + 修复后二次独立复审 |
| `eng-multidimensional-audit` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-multidimensional-audit/SKILL.md) | 空间/立体/逆向三维深度审计 |
| `eng-hardening-review` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-hardening-review/SKILL.md) | 数据完整性 + 六大故障面错误处理审计 |
| `eng-adversarial-audit` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-adversarial-audit/SKILL.md) | 第一性原理安全与架构对抗审计 |
| `eng-review-fix` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-review-fix/SKILL.md) | 系统化修复审查发现项 |
| `eng-completion-gate` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-completion-gate/SKILL.md) | 证据链支撑的三态完成判定门禁 |
| `eng-destructive-safety-gate` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-destructive-safety-gate/SKILL.md) | 不可逆操作双确认门禁 |
| `eng-change-scope-funnel` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-change-scope-funnel/SKILL.md) | 编辑前变更面白名单契约 |
| `eng-bugfix-rca` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-bugfix-rca/SKILL.md) | 测试先行证据链的根因分析 |
| `eng-bugfix-implement` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-bugfix-implement/SKILL.md) | 以红转绿复现测试验证的手术式修复 |
| `eng-git-commit` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-git-commit/SKILL.md) | 就绪检查前置的约定式原子提交 |
| `eng-git-pr` | 仅用户 | [`SKILL.md`](skills/engineering/eng-git-pr/SKILL.md) | 只读推送策略的 PR 创建 |
| `eng-prime-context` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-prime-context/SKILL.md) | 陌生仓库快速上手与心智建模 |
| `eng-analyze-codebase` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-analyze-codebase/SKILL.md) | 拓扑、循环依赖与设计模式分析 |
| `eng-docker-update` | 仅用户 | [`SKILL.md`](skills/engineering/eng-docker-update/SKILL.md) | 零停机容器镜像更新 |
| `eng-linux-security` | 仅用户 | [`SKILL.md`](skills/engineering/eng-linux-security/SKILL.md) | 端口扫描检测与防火墙自动化 |
| `eng-wizard` | 仅用户 | [`SKILL.md`](skills/engineering/eng-wizard/SKILL.md) | 为"只有人能动手"的流程生成交互式 bash 向导（配第三方服务、填 CI secrets、一次性迁移） |

### 2. 生产力技能（`skills/productivity/`）

| 技能 | 调用方式 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| `prod-briefing-loop` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-briefing-loop/SKILL.md) | 四阶段对齐门禁：澄清、Brief 回放、执行、差距自审 |
| `prod-content-delivery-lifecycle` | 仅用户 | [`SKILL.md`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) | **Autopilot**：Brief 冻结的内容交付流水线 |
| `prod-prompt-enhancer` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-prompt-enhancer/SKILL.md) | 一次性提示词增强，仅输出优化后的文本 |
| `prod-create-prd` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-create-prd/SKILL.md) | 会话需求转正式 PRD 文档 |
| `prod-project-init` | 仅用户 | [`SKILL.md`](skills/productivity/prod-project-init/SKILL.md) | 技术栈勘察与环境初始化指南 |
| `prod-mine-keywords` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-mine-keywords/SKILL.md) | AI 领域爆发关键词挖掘 |
| `prod-execution-report` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-execution-report/SKILL.md) | 计划符合度与测试证据复盘报告 |
| `prod-compress-context` | 仅用户 | [`SKILL.md`](skills/productivity/prod-compress-context/SKILL.md) | 会话状态压缩检查点 |
| `prod-export-session` | 仅用户 | [`SKILL.md`](skills/productivity/prod-export-session/SKILL.md) | 会话日志与产物导出 Markdown |
| `prod-system-review` | 仅用户 | [`SKILL.md`](skills/productivity/prod-system-review/SKILL.md) | 元级工作流复盘 |
| `prod-eq-reply` | 仅用户 | [`SKILL.md`](skills/productivity/prod-eq-reply/SKILL.md) | 高情商回复助手（中文优先）：潜台词解码 + 2-3 个可直接发送的版本，每版一句话理由 |
| `prod-writing-for-agents` | 模型 / 用户 | [`SKILL.md`](skills/productivity/prod-writing-for-agents/SKILL.md) | 写给 agent 看的文档的方法论：指针措辞、双预算、信息层级、剪枝 |
| `prod-domain-model` | 仅用户 | [`SKILL.md`](skills/productivity/prod-domain-model/SKILL.md) | 领域模型生产者（中文优先）：现场磨利术语、写回词汇表、ADR 三条件门 |
| `prod-writing-fragments` | 仅用户 | [`SKILL.md`](skills/productivity/prod-writing-fragments/SKILL.md) | 写作探索期（中文优先）：拷问式访谈挖写作碎片，只追加不成文 |
| `prod-writing-shape` | 仅用户 | [`SKILL.md`](skills/productivity/prod-writing-shape/SKILL.md) | 写作收敛期（中文优先）：把冻结的碎片堆一段一段长成文章 |

### 3. 设计与认知技能（`skills/design/`）

| 技能 | 调用方式 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| `vis-reverse-ui` | 模型/用户 | [`SKILL.md`](skills/design/vis-reverse-ui/SKILL.md) | 从 UI 提取计算样式、布局树与 CSS Token |
| `vis-vtp-3d` | 模型/用户 | [`SKILL.md`](skills/design/vis-vtp-3d/SKILL.md) | 3D 动画角色提示词编译协议 |
| `vis-anime-stylize` | 模型/用户 | [`SKILL.md`](skills/design/vis-anime-stylize/SKILL.md) | 日系动漫赛璐璐风格化协议 |
| `vis-product-web` | 模型/用户 | [`SKILL.md`](skills/design/vis-product-web/SKILL.md) | 需求到生产级 Web 体验生成：信息架构、设计系统、数据驱动 UI、动效 |
| `vis-product-design` | 模型/用户 | [`SKILL.md`](skills/design/vis-product-design/SKILL.md) | **套件**：创意、截图与活网页面路由为可评审原型（9 种模式） |
| `vis-apple-portfolio` | 模型/用户 | [`SKILL.md`](skills/design/vis-apple-portfolio/SKILL.md) | Apple 级作品集落地页生成：灵动岛 + 宫格布局 |
| `vis-modern-native-ui` | 模型/用户 | [`SKILL.md`](skills/design/vis-modern-native-ui/SKILL.md) | 两阶段 2026 原生栈 UI 架构师：线框图 + 结构确认门禁，再到生产级单文件代码 |
| `cog-axiom` | 模型/用户 | [`SKILL.md`](skills/design/cog-axiom/SKILL.md) | AxiomOS 认知原则库：8 条不变原则与交付标准 |

### 4. 流水线技能（`skills/pipeline/`）

| 技能 | 调用方式 | 路径 | 描述 |
| :--- | :--- | :--- | :--- |
| `pipe-ship` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-ship/SKILL.md) | **Autopilot**：完整功能环：拷问、规格、任务、实现、审查、深化、交付、部署 |
| `pipe-harden` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-harden/SKILL.md) | **Autopilot**：修复环：审计、修复、测试、再修复到绿灯，经分支-PR-CI-审查-合并交付 |
| `pipe-grill-plan` | 模型/用户 | [`SKILL.md`](skills/pipeline/pipe-grill-plan/SKILL.md) | 对计划与决策的无情拷问访谈 |
| `pipe-to-spec` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-to-spec/SKILL.md) | 把当前对话转为冻结规格 |
| `pipe-to-tickets` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-to-tickets/SKILL.md) | 把规格或计划拆成 tracer-bullet 任务 |
| `pipe-implement` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-implement/SKILL.md) | 按规格或任务实现 |
| `pipe-review-diff` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-review-diff/SKILL.md) | 按标准轴与规格轴的人工式 diff 审查 |
| `pipe-code-tdd` | 模型/用户 | [`SKILL.md`](skills/pipeline/pipe-code-tdd/SKILL.md) | 测试驱动开发：红-绿-重构 |
| `pipe-code-improve-architecture` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-code-improve-architecture/SKILL.md) | 可视化 HTML 架构深化机会报告 + 拷问 |
| `pipe-distill` | 仅用户 | [`SKILL.md`](skills/pipeline/pipe-distill/SKILL.md) | 把一个人的思维方式蒸馏成可运行 skill |

---

## ⚡ 安装与集成

### 1. Claude Code：插件市场安装
```bash
# 在 Claude Code 会话内：
/plugin marketplace add IIXINGCHEN/ai-skills-pro
/plugin install ai-skills-pro@ai-skills-pro-marketplace

# 或通过 CLI：
claude plugin marketplace add IIXINGCHEN/ai-skills-pro
claude plugin install ai-skills-pro@ai-skills-pro-marketplace
```

### 2. Codex、Cursor、DSH 及其他 Agent：`skills` CLI
```bash
# 交互式安装（自选 Agent 与技能）：
npx skills add IIXINGCHEN/ai-skills-pro

# 免交互全局安装全部 63 个技能：
npx skills add IIXINGCHEN/ai-skills-pro --skill '*' -g -y

# 安装单个指定技能：
npx skills add IIXINGCHEN/ai-skills-pro --skill eng-enterprise-lifecycle -g -y

# 仅预览可用技能（不安装）：
npx skills add IIXINGCHEN/ai-skills-pro --list
```

### 3. 本地开发（符号链接直连）
```bash
# Linux / macOS：
./scripts/link-skills.sh

# Windows PowerShell：
.\scripts\link-skills.ps1
```

**受限 Linux 环境**：在自己家目录内创建符号链接无需 root 权限。在禁用符号链接的文件系统上（企业 NFS 挂载、加固容器），脚本会自动降级为复制模式；上游更新后请重新运行脚本。

### 校验技能完整性
```bash
npm run validate        # 结构、frontmatter、配套文档与 em-dash 四重门禁
```

CI 通过 GitHub Actions 在每个 Pull Request 上运行同一门禁：`.github/workflows/validate-skills.yml`。

---

## 🤝 参与贡献

1. 在 `skills/<bucket>/<skill-name>/` 下新增或修改技能，包含 `SKILL.md` 与 `agents/openai.yaml`。
2. 在 `docs/<bucket>/<skill-name>.md` 添加配套文档。
3. 在 `package.json` 与 `.claude-plugin/plugin.json` 中注册技能路径。
4. 运行 `npm run validate`，所有门禁必须通过。
5. 遵守仓库行文规范：禁用 em-dash、正向表述、可勾选的完成标准。

---

## 📄 开源协议

MIT。详见 [LICENSE](LICENSE)。