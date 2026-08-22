# AI Skills Pro（AI 技能库）

> 面向真实软件工程的生产级模块化 AI Agent 技能库：横跨工程、生产力与设计三大领域的 42 个技能。提供一键式 Autopilot 流水线、证据门禁质量体系，并全面兼容 Claude Code、OpenAI Codex、DeepSeek Harness (DSH)、Cursor 及开放的 Agent Skills 标准。

[English](README.md) | 简体中文

![技能数](https://img.shields.io/badge/skills-42-blue) ![校验](https://img.shields.io/badge/validation-42%2F42%20pass-brightgreen) ![协议](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-%E2%89%A520.x-339933)

---

## ⚡ 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/IIXINGCHEN/ai-skills-pro.git
cd ai-skills-pro

# 2. 校验完整性
npm run validate

# 3. 安装（将全部 42 个技能软链至 Agent 技能目录）
./scripts/link-skills.sh        # Linux / macOS
.\scripts\link-skills.ps1      # Windows PowerShell

# 4. 在任意 Agent 会话中使用
/eng-enterprise-lifecycle 开发一个用户积分兑换模块
```

**一条指令，跑通全流程。** 旗舰 Autopilot 编排器自动推进 13 个阶段（需求澄清、规格冻结、白名单约束计划、编码、自动验证、多维审查、修复循环、完成判定），仅在 3 个人工门禁处暂停等待确认（Brief 确认、Plan 确认、推送授权）。

---

## 🚀 8 个一键 Autopilot 工作流

| 指令 | 流水线 | 人工门禁 |
| :--- | :--- | :--- |
| `/eng-enterprise-lifecycle` | 新功能研发全链路（13 阶段，支持快速通道） | Brief / Plan+白名单 / 推送授权 |
| `/eng-review-and-fix` | 审查到绿灯修复循环 | 无（最多 3 轮迭代） |
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
[9. 修复循环]       eng-review-fix（最多 3 轮）➔ 重新验证
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

---

## 🛡️ 内置安全模型

- **证据化完成判定**：`eng-completion-gate` 给出 DONE / DONE-WITH-ACCEPTED-RISKS / BLOCKED 三态结论；每项声明必须对应可验证产物。
- **破坏性操作双确认**：`eng-destructive-safety-gate` 对任何不可逆操作要求两次显式确认并生成恢复工件。
- **只读推送策略**：`eng-git-pr` 默认仅产出就绪报告，未经用户显式指令绝不推送；保护分支永不强推。
- **白名单约束编辑**：`eng-change-scope-funnel` 在首次编辑前锁定变更面。
- **测试先行修复**：`eng-bugfix-rca` 要求修复前必须存在失败测试作为证据链起点。

---

## 架构与调用模型

技能按三大桶组织于 `skills/` 目录：
- **`skills/engineering/`**（28 个）：生命周期编排器、SDD 核心（规格/计划/执行）、审查与审计、安全门禁、Git 交付、DevOps。
- **`skills/productivity/`**（10 个）：需求简报循环、PRD、内容交付、提示词增强、会话管理、复盘报告。
- **`skills/design/`**（4 个）：UI 逆向、3D 角色编译、动漫风格化，以及 AxiomOS 认知原则库。

每个技能均包含：
1. `SKILL.md`：无歧义指令 + 可勾选验收标准 + 反幻觉护栏。
2. `agents/openai.yaml`：标准 Codex / OpenAI 接口元数据。
3. 配套人类文档 `docs/<bucket>/<skill-name>.md`。

---

## 🧭 完整技能目录

### 1. 工程技能（`skills/engineering/`）

| 技能 | 调用方式 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| `eng-enterprise-lifecycle` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-enterprise-lifecycle/SKILL.md) | **Autopilot**：13 阶段企业流水线，3 门禁 + 快速通道 |
| `eng-review-and-fix` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-review-and-fix/SKILL.md) | **Autopilot**：一键审查到绿灯修复循环 |
| `eng-defect-lifecycle` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-defect-lifecycle/SKILL.md) | **Autopilot**：RCA 到提交的缺陷闭环 |
| `eng-onboarding-audit-lifecycle` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md) | **Autopilot**：一次性只读代码库健康体检 |
| `eng-hotfix-emergency-lifecycle` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md) | **Autopilot**：P0/P1 事故快车道 + 强制复盘 |
| `eng-release-ops-lifecycle` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-release-ops-lifecycle/SKILL.md) | **Autopilot**：发布窗口自动化与回滚预案 |
| `eng-refactor-lifecycle` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-refactor-lifecycle/SKILL.md) | **Autopilot**：行为保持的渐进式重构 |
| `eng-router` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-router/SKILL.md) | 中央生命周期路由器与编排器注册表 |
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
| `eng-git-pr` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-git-pr/SKILL.md) | 只读推送策略的 PR 创建 |
| `eng-prime-context` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-prime-context/SKILL.md) | 陌生仓库快速上手与心智建模 |
| `eng-analyze-codebase` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-analyze-codebase/SKILL.md) | 拓扑、循环依赖与设计模式分析 |
| `eng-docker-update` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-docker-update/SKILL.md) | 零停机容器镜像更新 |
| `eng-linux-security` | 模型/用户 | [`SKILL.md`](skills/engineering/eng-linux-security/SKILL.md) | 端口扫描检测与防火墙自动化 |

### 2. 生产力技能（`skills/productivity/`）

| 技能 | 调用方式 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| `prod-briefing-loop` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-briefing-loop/SKILL.md) | 四阶段对齐门禁：澄清、Brief 回放、执行、差距自审 |
| `prod-content-delivery-lifecycle` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) | **Autopilot**：Brief 冻结的内容交付流水线 |
| `prod-prompt-enhancer` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-prompt-enhancer/SKILL.md) | 一次性提示词增强，仅输出优化后的文本 |
| `prod-create-prd` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-create-prd/SKILL.md) | 会话需求转正式 PRD 文档 |
| `prod-project-init` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-project-init/SKILL.md) | 技术栈勘察与环境初始化指南 |
| `prod-mine-keywords` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-mine-keywords/SKILL.md) | AI 领域爆发关键词挖掘 |
| `prod-execution-report` | 模型/用户 | [`SKILL.md`](skills/productivity/prod-execution-report/SKILL.md) | 计划符合度与测试证据复盘报告 |
| `prod-compress-context` | 仅用户 | [`SKILL.md`](skills/productivity/prod-compress-context/SKILL.md) | 会话状态压缩检查点 |
| `prod-export-session` | 仅用户 | [`SKILL.md`](skills/productivity/prod-export-session/SKILL.md) | 会话日志与产物导出 Markdown |
| `prod-system-review` | 仅用户 | [`SKILL.md`](skills/productivity/prod-system-review/SKILL.md) | 元级工作流复盘 |

### 3. 设计与认知技能（`skills/design/`）

| 技能 | 调用方式 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| `vis-reverse-ui` | 模型/用户 | [`SKILL.md`](skills/design/vis-reverse-ui/SKILL.md) | 从 UI 提取计算样式、布局树与 CSS Token |
| `vis-vtp-3d` | 模型/用户 | [`SKILL.md`](skills/design/vis-vtp-3d/SKILL.md) | 3D 动画角色提示词编译协议 |
| `vis-anime-stylize` | 模型/用户 | [`SKILL.md`](skills/design/vis-anime-stylize/SKILL.md) | 日系动漫赛璐璐风格化协议 |
| `cog-axiom` | 模型/用户 | [`SKILL.md`](skills/design/cog-axiom/SKILL.md) | AxiomOS 认知原则库：8 条不变原则与交付标准 |

---

## ⚡ 安装与集成

### 1. Claude Code：插件安装
```bash
# 在 Claude Code 会话内：
/plugin install <path-or-repo>

# 或通过 CLI：
claude plugins install <path-or-repo>
```

### 2. Codex、Cursor、DSH 及其他 Agent：`skills.sh`
```bash
# 安装整套技能库：
npx skills@latest add <path-or-repo>

# 或安装单个技能：
npx skills@latest add <path-or-repo> --skill=eng-router
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