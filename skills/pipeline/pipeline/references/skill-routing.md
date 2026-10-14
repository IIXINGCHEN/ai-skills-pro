# Skill 路由表

## 调用模型（三层）

按调用角色划分：

- **L0 用户显式调用, , 编排器**：`pipeline` 本身。整条 S0–S11 由它编排，只在用户说"走流水线"时启动。
- **L1 stage 编排 skills**（pipeline 在 stage 入口指导模型显式调用）：
 ask-matt、grill-me、grill-with-docs、to-spec、to-tickets、
 implement、implement-spec、wayfinder、retro、handoff、improve-codebase-architecture。
- **L2 纪律 skills**（无该字段，执行中模型自动调用，不用等用户点头）：
 tdd（红-绿-重构）、code-review、diagnosing-bugs、prototype、research、domain-modeling。

**不确定用哪个 skill 时，先问 ask-matt**, , 它是全线的分流器。

## Stage 路由

| Stage | 主 skill | 辅 skill / 说明 |
|---|---|---|
| S0 问题提出 | ask-matt 分流 → research | 手动等价初始化（每个 repo 一次）：issue tracker 选本地文件、triage 标签、GLOSSARY/ADR 路径（原 `/setup-matt-pocock-skills` 为第三方 skill，未收录）；超大问题先 wayfinder 画决策地图 |
| S1 需求锐化 | grill-me / grill-with-docs | domain-modeling（GLOSSARY / ADR 的方法） |
| S2 规格 | to-spec | research（事实核查，只认一手来源） |
| S3 分解 | to-tickets | 超大工作先 wayfinder |
| S4 原型 | UI 设计子流水线（见下） | 纯后端 / 纯逻辑类可声明跳过并记录原因 |
| S5 实现 | implement-spec / implement ＋ tdd | 先测试后代码 |
| S6 审计 | code-review（标准＋规格双轴）＋ audit-checks | UI 项目加 web-design-guidelines、review-animations |
| S7 测试 | 回归（单元＋集成＋e2e） | 失败 → diagnosing-bugs 诊断 → 回 S5 |
| S8 全局审计 | code-review 全量 ＋ audit-checks ＋ production-bar | UI 项目加 web-design-guidelines；可选 improve-codebase-architecture（架构可视化审计报告） |
| S9 全局测试 | 干净环境全量回归 | 失败 → diagnosing-bugs → 打回 S5 |
| S10 发布 | 打包＋SHA-256＋版本一致性校验 | pr 不适用（不提交仓库） |
| S11 复盘 | retro | 超长任务加 handoff 交接 |

## S4 UI 设计子流水线

按顺序走，每一步的输出是下一步的输入：

1. **prototype**, , 搭可交互原型骨架，先验证状态机和逻辑对不对。
2. **frontend-design**, , 定美学方向（去模板化，不做平庸后台风）。
3. **ui-ux-pro-max**, , 落 token：配色 / 字体 / 间距 / 圆角规范。
4. **impeccable**, , 精修：排版、间距、动效细节。
5. **emil-design-eng** / **apple-design**, , 动效语言（按压缩放 .97、ease-out、<300ms、reduced-motion）。
6. **review-animations** ＋ **web-design-guidelines**, , 审查挑刺（动效审计＋无障碍/合规）。
7. **用户亲口确认方向**, , 确认前不许动实现代码。

术语对齐用 animation-vocabulary；按需用 improve-animations / find-animation-opportunities 做动效审计。

## 说明

- 本表只管"用什么 skill"，不管"做到什么算过", , 门禁标准在 `stage-gates.md`。
- skill 缺失或不会用 → 先 `muse.skill_search` 查，查不到再考虑自研（skill_creator）。
- git-guardrails-claude-code：仅当项目使用 git 时可选启用；默认本地流程不 commit、不 push，不适用，不做门禁。
