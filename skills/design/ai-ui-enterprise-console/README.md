# AI-UI Enterprise Console Skill v1.1.0

将项目需求或 Greenfield 需求自动转换为企业级 Console 架构、模块/功能/页面、TokenHub Console UI、代码实现与可验证交付。

## v1.1 升级

- 双执行模式：PROJECT / GREENFIELD
- 统一 E0-E4 + D/A/U/R 证据规则
- 统一 P0-P6 优先级
- 严格阶段顺序与 Gate
- 输入/阶段输出/交付 Schema
- ADR / Architecture Change Log
- 真实工具验证边界
- Execution / UI / Delivery Checklists
- 需求 → 架构 → 页面 → 路由 → 文件 → 验证追踪

## 使用方式

1. 加载 Skill。
2. 提供项目代码/ZIP/README/API/PRD，或直接提供 Greenfield 需求。
3. Skill 自动判断 PROJECT MODE 或 GREENFIELD / SPEC-FIRST。
4. 按严格阶段顺序执行。
5. 只有真实工具结果可以进入 VERIFIED。
6. 未通过 Completion Gate 不得声明 COMPLETED。

## 目录

```text
SKILL.md
manifest.yaml
schemas/
validators/
templates/
references/
checklists/
examples/
```
