# AI Skills Pro 3.2.2

面向工程、生产力与设计工作的可组合 Agent Skills。2.0 遵循 `mattpocock/skills` 的核心 invocation 与组合模型：Skill 只按 User-invoked / Model-invoked 两类区分，Skill Tool 依赖只能指向 Model-invoked Skill，详细规则按需通过 context pointer 加载。

[English](README.md) | 简体中文

![Version](https://img.shields.io/badge/version-3.2.2-blue) ![Skills](https://img.shields.io/badge/skills-42-blue) ![Validation](https://img.shields.io/badge/validation-42%2F42%20pass-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green)

[上游参考](https://github.com/mattpocock/skills)

---

## ⚡ 安装与验证

### 1. 本地安装（直接软链接，当前可用）
```bash
# Linux / macOS：
./scripts/link-skills.sh

# Windows PowerShell：
.\scripts\link-skills.ps1
```
将全部技能链接到 `~/.claude/skills` 与 `~/.agents/skills`（Windows 下符号链接失败自动降级为 Junction）。新增、删除或改名技能后需重跑。

### 2. 远程安装（直接从公开仓库安装）
本仓库已发布为公开仓库 `IIXINGCHEN/ai-skills-pro`，以下命令可直接从 GitHub 安装：

```bash
# Claude Code 插件市场：
claude plugin marketplace add IIXINGCHEN/ai-skills-pro
claude plugin install ai-skills-pro@ai-skills-pro-marketplace

# Codex、Cursor、DSH 与开放 Agent Skills CLI：
npx skills add IIXINGCHEN/ai-skills-pro --skill '*' -g -y
```

### 3. 完整性与门禁校验
```bash
npm run validate
npm test
npm run eval
npm run release-check
```

---

## Invocation 模型

- **User-invoked**：只能由用户显式启动的工作流或高影响操作。它可以向用户推荐其他 User-invoked Skill，但不会通过 Skill Tool 调用它们。
- **Model-invoked**：模型和用户都可以调用的可复用能力。当任务匹配 description 时，模型可以自动发现它。User-invoked 工作流可以通过 Skill Tool 调用 Model-invoked 依赖。

## 渐进式加载

`SKILL.md` 只保留所有分支都需要的核心行为。分支专用 schema、模板、检查表和协议放在 Skill 旁边，仅在相关分支需要时加载。

---

## User-invoked Skills（用户显式启动工作流 - 18 个）

- [`eng-defect-lifecycle`](skills/engineering/eng-defect-lifecycle/SKILL.md) `[工程]`: 运行从 RCA 根因分析到验证交付的端到端缺陷修复生命周期。
- [`eng-docker-update`](skills/engineering/eng-docker-update/SKILL.md) `[工程]`: 在健康检查与回滚安全保障下更新 Docker Compose 容器镜像。
- [`eng-enterprise-lifecycle`](skills/engineering/eng-enterprise-lifecycle/SKILL.md) `[工程]`: 运行带有显式人工确认门禁的企业级研发全生命周期流程。
- [`eng-git-pr`](skills/engineering/eng-git-pr/SKILL.md) `[工程]`: 为当前分支准备并提交规范的 GitHub Pull Request。
- [`eng-hotfix-emergency-lifecycle`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md) `[工程]`: 针对线上 P0/P1 紧急故障运行带强制复盘的热修复生命周期。
- [`eng-linux-security`](skills/engineering/eng-linux-security/SKILL.md) `[工程]`: 执行 Linux 主机加固、端口扫描检测及防火墙安全防护自动化。
- [`eng-onboarding-audit-lifecycle`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md) `[工程]`: 对陌生代码库执行只读式的快速上手与架构健康巡检。
- [`eng-refactor-lifecycle`](skills/engineering/eng-refactor-lifecycle/SKILL.md) `[工程]`: 针对遗留系统执行保持既有行为的渐进式安全重构生命周期。
- [`eng-release-ops-lifecycle`](skills/engineering/eng-release-ops-lifecycle/SKILL.md) `[工程]`: 自动化执行生产发布窗口运维，包含服务健康检查与回滚预案。
- [`eng-review-and-fix`](skills/engineering/eng-review-and-fix/SKILL.md) `[工程]`: 审查-修复-验证的收敛循环，在交付前停止；若要在同一流程末端提交并授权推送，请改用 eng-review-and-ship。
- [`eng-review-and-ship`](skills/engineering/eng-review-and-ship/SKILL.md) `[工程]`: 运行端到端审查、修复、验证及经授权后的最终交付发布流程。
- [`eng-router`](skills/engineering/eng-router/SKILL.md) `[工程]`: 检索工程能力地图并为当前任务匹配最佳工作流或可复用技能。
- [`eng-skill-create`](skills/engineering/eng-skill-create/SKILL.md) `[工程]`: 按作者化清单端到端创建新技能：准入门禁、脚手架、接触面接线、门禁验证、变更集。
- [`eng-skill-optimize`](skills/engineering/eng-skill-optimize/SKILL.md) `[工程]`: 从触发、预算、契约、治理四个维度诊断指定技能，并按风险排序的计划在门禁下落地优化；项目代码审查归 eng-review-fix。
- [`prod-compress-context`](skills/productivity/prod-compress-context/SKILL.md) `[生产力]`: 为当前会话上下文和任务执行状态生成紧凑的检查点快照。
- [`prod-content-delivery-lifecycle`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) `[生产力]`: 运行从需求简报对齐到最终交付的端到端内容研发流程。
- [`prod-project-init`](skills/productivity/prod-project-init/SKILL.md) `[生产力]`: 针对特定代码库初始化开发环境配置与团队上手指南。
- [`prod-system-review`](skills/productivity/prod-system-review/SKILL.md) `[生产力]`: 交付完成后对开发工作流执行元层级复盘并沉淀流程改进建议。

---

## Model-invoked Skills（模型自动发现可复用能力 - 24 个）

- [`cog-axiom`](skills/design/cog-axiom/SKILL.md) `[设计]`: 架构、安全、合规、上下文与交付参考指南库。当任务涉及核心设计原则或生产标准时按需查阅对应模块。
- [`vis-product-design`](skills/design/vis-product-design/SKILL.md) `[设计]`: 多模式自适应产品设计套件。适用于产品构想、界面截图分析、交互原型、在线 URL 逆向或前端审查。
- [`vis-product-web`](skills/design/vis-product-web/SKILL.md) `[设计]`: 从业务需求端到端设计并构建现代响应式 Web 产品界面与交互体验。
- [`vis-reverse-ui`](skills/design/vis-reverse-ui/SKILL.md) `[设计]`: 将 Web 界面、截图或设计稿逆向/复刻为精确的设计 Token 与原子化 CSS 规范：间距、颜色、排版均取自真实计算样式。
- [`eng-adversarial-audit`](skills/engineering/eng-adversarial-audit/SKILL.md) `[工程]`: 执行对抗性安全审查与深度架构巡检，识别并发风险与边界漏洞。
- [`eng-analyze-codebase`](skills/engineering/eng-analyze-codebase/SKILL.md) `[工程]`: 分析代码拓扑结构、依赖关系、循环引用与设计模式，评估架构健康度。
- [`eng-bugfix-implement`](skills/engineering/eng-bugfix-implement/SKILL.md) `[工程]`: 按已有 RCA 报告（由 eng-bugfix-rca 产出的 rca.md）实施精准补丁与回归测试；仅当该报告已存在时使用，绝不可作为排查缺陷的起点。
- [`eng-bugfix-rca`](skills/engineering/eng-bugfix-rca/SKILL.md) `[工程]`: 深入排查软件缺陷并编写结构化 RCA 根因分析报告，坚持测试先行（红灯测试）。
- [`eng-change-scope-funnel`](skills/engineering/eng-change-scope-funnel/SKILL.md) `[工程]`: 编码前通过调用链追踪与影响半径分析收敛真实变更面，生成修改白名单。
- [`eng-code-review`](skills/engineering/eng-code-review/SKILL.md) `[工程]`: 对照工程规范与原始规格对代码变更执行多维度审查，杜绝未经测试代码。
- [`eng-completion-gate`](skills/engineering/eng-completion-gate/SKILL.md) `[工程]`: 输出证据链完备的完成判定，明确区分 DONE、带风险完成或 BLOCKED 状态。
- [`eng-destructive-safety-gate`](skills/engineering/eng-destructive-safety-gate/SKILL.md) `[工程]`: 对破坏性操作实施双重人工确认门禁：文件删除、git reset/clean、强推、数据库清理、批量覆盖，以及任何会抹除数据或不可撤销的操作。
- [`eng-execute`](skills/engineering/eng-execute/SKILL.md) `[工程]`: 执行已批准的计划：按依赖顺序落地每个编码任务并逐步验证；计划尚未产出时请改用 eng-plan。
- [`eng-git-commit`](skills/engineering/eng-git-commit/SKILL.md) `[工程]`: 遵循 Conventional Commits 规范安全创建原子化 Git 提交。
- [`eng-hardening-review`](skills/engineering/eng-hardening-review/SKILL.md) `[工程]`: 审计全链路数据完整性，覆盖 API、文件、数据库与配置等六大错误处理面。
- [`eng-multidimensional-audit`](skills/engineering/eng-multidimensional-audit/SKILL.md) `[工程]`: 从三个架构维度协同审计：拓扑（空间）、端到端数据流（实体）与场景推演（逆向）；安全威胁请改用 eng-adversarial-audit。
- [`eng-plan`](skills/engineering/eng-plan/SKILL.md) `[工程]`: 为功能或已冻结规格产出实现计划：有序编码阶段、涉及文件与风险；执行已有计划请改用 eng-execute。
- [`eng-prime-context`](skills/engineering/eng-prime-context/SKILL.md) `[工程]`: 快速建立对陌生项目的系统化认知，梳理技术栈、工程惯例与关键入口。
- [`eng-review-fix`](skills/engineering/eng-review-fix/SKILL.md) `[工程]`: 通过七维检查（代码扫描、架构、安全、性能、可靠性、修复方案、验证）把审查/审计发现转化为已验证的修复，每项修复附带回归测试与全绿证明。
- [`eng-spec`](skills/engineering/eng-spec/SKILL.md) `[工程]`: 落地编码前将模糊需求冻结为确定性的工程规格文档与验收检查表。
- [`eng-validate`](skills/engineering/eng-validate/SKILL.md) `[工程]`: 运行项目验证套件：代码风格检查、类型检查、单元与集成测试以及构建验证。
- [`prod-briefing-loop`](skills/productivity/prod-briefing-loop/SKILL.md) `[生产力]`: 在产出长篇交付物前先对齐需求：提出针对性澄清问题、确认理解、复述并冻结 Brief 契约，再对结果做差异审查。
- [`prod-create-prd`](skills/productivity/prod-create-prd/SKILL.md) `[生产力]`: 将用户故事与功能构想转化为规范的产品需求文档 (PRD)：角色、KPI、MVP 范围与非目标；工程实现计划请改用 eng-plan。
- [`prod-execution-report`](skills/productivity/prod-execution-report/SKILL.md) `[生产力]`: 在功能交付后生成执行复盘报告，客观比对计划偏差与测试证据。

---

## 生产发布门禁

只有同时满足以下条件才允许发布：

- Skill 清单与 invocation 元数据完全同步。
- Skill Tool 依赖只指向 Model-invoked Skill。
- Markdown 链接全部有效，文本统一使用 LF。
- 生产包不包含空文件、运行态状态、Git 元数据或构建产物。
- 安全检查拒绝身份劫持、指令优先级接管和隐藏状态泄露模式。
- `VERSION`、package、plugin、lockfile 与 release manifest 的版本完全一致。
- 每个技能均携带治理元数据（owner、status、maturity、review_due）；无过期待审条目。
- 高危风险与具备网络能力的技能必须处于 `governed` 成熟度，且拥有有效的 `security/network_policy.json` 审批。
- 触发词评测套件达到基线（train 90%，holdout 与 blind 100%）且输出契约达标（`npm run eval`）。
- 技能产物只能写入四大知识归宿：`specs/`、`.scratch/`、`docs/adr/`、`docs/`。
- 每次受治理的执行均需按照 ADR 0004 追加执行记录（执行者、技能、版本、权限、步骤、结果、风险、报告）。

---

## 📄 开源协议

基于 MIT License 开源，详见 [LICENSE](LICENSE)。
