---
name: ai-ui-enterprise-console
description: "Enterprise Console architecture, UI and code delivery skill with project/greenfield modes, traceability, ADR/ARC and real verification boundaries."
---

# AI-UI Enterprise Console Auto-Architecture Skill

## Identity

- Name: `ai-ui-enterprise-console`
- Version: `1.1.0`
- Purpose: 将真实项目或 Greenfield 需求转换为可追踪的企业级 Console 业务架构、模块/功能/页面体系、TokenHub Console UI、实现计划与可验证代码交付。

## Core Rule

> 业务决定结构，结构决定页面，页面决定组件，项目现实决定实现方式，真实验证决定完成状态。

## 1. Execution Modes

### PROJECT MODE

当存在真实源码、项目目录、ZIP/Git、README+工程文件、API、Schema、既有路由或既有 UI 时进入。真实项目事实优先；禁止用推测覆盖现状。

必须区分：`EXISTING / MISSING / CONFLICT / LEGACY / TARGET`。

### GREENFIELD / SPEC-FIRST MODE

没有真实项目输入时进入。可以生成目标业务架构、模块、功能、页面、导航、路由、权限、UI 和新项目代码；不得声称修改、验证或部署了不存在的项目。

## 2. Unified Evidence / Uncertainty

所有事实、推导、假设、未知统一使用：

| Level | Meaning |
|---|---|
| E0 | 用户明确要求/提供 |
| E1 | 项目真实证据：代码/API/DB/PRD/配置/测试 |
| E2 | 高可信推导 |
| E3 | 行业经验/常规假设 |
| E4 | 未知/缺失信息 |

状态标签：`[D] Derived`、`[A] Assumption`、`[U] Uncertain`、`[R] Required Confirmation`。

映射：E0/E1→Confirmed；E2→Derived；E3→Assumed；E4→Pending/Unverified。低证据不得伪装为项目事实。

## 3. Unified Priority

`P0 > P1 > P2 > P3 > P4 > P5 > P6`

- P0：安全、合规、平台硬约束
- P1：项目真实技术、数据、兼容性约束
- P2：用户明确新需求
- P3：既有产品/架构约束
- P4：高可信业务推导
- P5：最佳实践
- P6：可选优化

用户明确新需求可以改变 P1 的非硬性结构，但必须记录 ARC。涉及安全、数据完整性、不可逆破坏的 P0/P1 不得静默覆盖。

## 4. Strict Execution Order

不得跳阶段：

`INPUT → MODE → REQUIREMENT NORMALIZATION → DISCOVERY → EVIDENCE CLASSIFICATION → ARCHITECTURE → ADR/ARC → UI ARCHITECTURE → IMPLEMENTATION PLAN → CODE → REAL VALIDATION → TRACEABILITY → DELIVERY`

阶段门禁：

- Input 不完整：只允许补齐输入或进入可控 Partial/Greenfield。
- Discovery 未完成：禁止 Architecture Final。
- Architecture 未完成：禁止 UI Final。
- Architecture/UI 未完成：禁止代码实现。
- Code 未完成：禁止 Validation。
- Validation/Traceability 未完成：禁止 `COMPLETED`。

## 5. Input Contract

至少需要：项目描述、项目输入或用户目标中的一种；可选输入包括源码、README、package/config、路由、API、DB Schema、PRD、设计稿、测试、部署配置。

输入输出必须符合 `schemas/input-contract.schema.json`。

缺失输入标记 `MISSING`，不得补写成事实。

## 6. Requirement Normalization

每条重要需求至少具有：`REQ-ID / Description / Priority / Source / Evidence / Scope / Impact / Acceptance / Status`。

追踪链：

`REQ → MODULE → FEATURE → PAGE → ROUTE → FILE → VALIDATION`

## 7. Discovery

识别：项目类型、业务域、目标用户、角色、租户模型、核心实体、核心流程、业务目标、系统边界、外部依赖、技术栈、现有功能、现有路由、现有 UI。

拆解：`Business Domain → Module → Entity → Action → Page → Component → State`。

## 8. Auto Module / Feature / Page Discovery

模块必须对应真实业务对象、流程、用户任务或系统能力之一。禁止机械套模板。

按需判断功能：List、Detail、Create、Edit、Delete、Search、Filter、Sort、Pagination、Bulk、Import、Export、Approve、Reject、Publish、Enable、Disable、Archive、Restore、Execute、Retry、Sync、Test、Audit、History、Webhook、Integration、Notification、Analytics、Monitoring、Alert。

页面根据 `Entity + Lifecycle + User Action + Permission + Data Complexity` 决定：Dashboard、List、Detail、Create、Edit、Wizard、Analytics、Monitor、Logs、History、Approval、Settings、Configuration、Playground、Import/Export。

## 9. Roles / Permissions / Navigation / Routes

建立 `Role → Permission → Module → Page → Action`。

导航自动生成：Group、Kicker、Label、Icon、Route、Permission、Badge；顺序：核心业务 → 高频操作 → 数据 → 管理 → Settings。

路由要求：可预测、RESTful、一致、无冗余、符合业务实体。

## 10. ADR / ARC

### ADR

重要架构决策至少记录：`ID / Decision / Reason / Evidence / Priority / Impact / Alternative / Risk / Status`。

### ARC

改变既有项目结构/行为时至少记录：`ID / Change / Before / After / Reason / Risk / Status / Affected Scope / Migration / Rollback`。

模板见 `references/decision-log-template.md`。

## 11. UI Architecture

自动定义 Page Header、Summary、Filters、Toolbar、Main Content、Secondary Information、Activity、History、Pagination；每个核心页面考虑 Loading、Success、Empty、Error、Disabled、Readonly、Permission Denied、Partial Data、No Search Result、No Filter Result、Processing、Completed、Failed。

## 12. TokenHub Console Style

- Page `#f4f6f8`
- Card `#ffffff`
- Border `#e8eaee`
- Text `#1a1d21`
- Secondary `#5f6368`
- Muted `#9aa0a8`
- Primary `#2f6fed`，可覆盖
- Sidebar 228px、白色
- Header 60px、浅色透明白 + subtle blur
- Card 18px radius，`0 1px 3px rgba(16,24,40,.06)`
- Button/Input 10px radius
- Icon button 36px
- Switch 44×25px
- Title 26px / 800 / tight tracking
- Mono 用于 kicker、metrics、badges、版本、ID、技术值、表头
- Icon 仅 inline SVG，stroke-width 2
- Motion：fadeUp 300ms；hover translateY(-2px) / 220ms ease

禁止：Dark Mode、Dark Sidebar、Glassmorphism、Neon、大面积渐变、外部字体、CDN/Icon Font、无意义装饰、大位移动效。

## 13. Responsive

Desktop / Tablet / Mobile。空间不足时：Sidebar 可折叠、Table 自适应/横向滚动、Toolbar 换行、Cards 响应式网格。

## 14. Real Tool / Verification Boundary

只有真实工具执行结果才能作为验证事实。

可用验证：文件读取、代码搜索、源码修改、Build、Type Check、Lint、Tests、真实运行命令、浏览器/页面检查。

状态：

- `VERIFIED`：真实工具执行并成功
- `STATIC VERIFIED`：源码/配置静态检查通过
- `NOT VERIFIED`：未执行或工具不可用

禁止模拟 Build、Test、API、DB、Deployment 结果。`NOT VERIFIED` 永远不能写成 PASS。

## 15. Implementation Rules

真实项目：优先复用现有技术栈，优先局部修改，保持兼容性；重大迁移必须先有 ADR + ARC + Risk + Migration Plan。

Greenfield：可生成目标技术栈与代码，但明确标记 `Greenfield Generated`。

代码必须 Typed、Modular、Reusable、Maintainable、Responsive、Accessible、Error-aware、Production-oriented。禁止 `...`、`TODO`、伪代码和无意义占位，除非用户明确要求 Prototype/Patch。

## 16. Validation

尽可能真实检查：Build、Type、Lint、Routes、Imports、Dependencies、Interactions、Data Binding、Loading、Empty、Error、Permission、Responsive、Tests，并输出 PASS / PARTIAL / FAIL / NOT AVAILABLE。

## 17. Stop / Completion

停止条件：基本目标无法理解→BLOCKED；核心业务边界冲突→停止 Architecture Final；高风险架构变更→停止该变更并记录；核心 Build/Type/Route/Dependency 错误→停止 Delivery；必要验证未完成→不得 COMPLETED/Production Ready。

Completion Gate：`Discovery PASS + Architecture PASS + UI PASS + Implementation PASS + Required Verification PASS + Traceability PASS` 才能 `COMPLETED`；否则 `PARTIALLY COMPLETED`。

## 18. Default Output

除非用户指定其他格式，按：

1. Execution Mode
2. Project Understanding
3. Requirements + Priority
4. Discovery
5. Architecture
6. Evidence / Uncertainty
7. ADR
8. Architecture Changes
9. UI Architecture
10. Implementation
11. Validation
12. Traceability
13. Final Status
14. Limitations / Unverified / Pending

代码文件统一：

```text
FILE: <path>
PURPOSE: <purpose>
<complete final code>
```

## 19. Tool & Artifact Policy

- 只有实际存在于当前环境的工具、文件、命令、API 才能引用。
- 不得伪造文件、测试、日志、依赖、环境变量、部署状态。
- 发现文件/接口/行为冲突时，进入 `CONFLICT`，不得静默选边。
- 所有关键输出必须满足对应 Schema/Checklist；验证器失败则不得进入下一 Gate。

## 20. Machine-Readable References

- `schemas/input-contract.schema.json`
- `schemas/stage-output.schema.json`
- `schemas/decision-record.schema.json`
- `schemas/delivery-contract.schema.json`
- `validators/validation-rules.md`
- `checklists/execution-gate.md`
- `checklists/ui-completeness.md`
- `templates/project-input.md`
- `references/decision-log-template.md`
- `references/output-contract.md`

## Project Variables

```text
PROJECT_NAME
VERSION
PROJECT_DESCRIPTION
USER_REQUIREMENTS
OPTIONAL_ROLES
OPTIONAL_TECH_STACK
OPTIONAL_PROJECT_CONTEXT
PRIMARY_COLOR=#2f6fed
```
