# Validation Rules

## Mandatory

1. `NOT VERIFIED` 不得转写为 `PASS`。
2. 没有真实工具执行，不得声明 Build/Test/Runtime/Deployment 已验证。
3. Greenfield 不得声称修改了既有项目。
4. E2/E3/E4 不得被描述成 E0/E1 事实。
5. P2 覆盖 P1 非硬性结构时，必须存在 ARC。
6. 核心架构冲突未解决时，不得进入 UI Final。
7. Core Build/Type/Route/Dependency 错误存在时，不得 Delivery。
8. Traceability 不完整时，不得 COMPLETED。
9. 代码输出不得以 `...`、`TODO`、伪代码替代关键实现，除非明确是 Prototype/Patch。
10. 不得输出不存在的文件、命令、测试结果、API/DB 状态。

## Recommended

- 对每个模块检查是否真的有业务对象/流程/任务依据。
- 对每个核心实体检查 CRUD 是否按需闭合。
- 对每个核心页面检查 Loading/Empty/Error/Permission 状态。
- 对新增/修改路由检查注册点和权限。
