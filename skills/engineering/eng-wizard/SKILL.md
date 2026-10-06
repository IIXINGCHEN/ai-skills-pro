---
name: eng-wizard
description: "Generate a guided bash walkthrough for procedures only a human can perform: provisioning third-party services, entering CI secrets, one-off migrations. The agent defines the stages; the human runs the script."
disable-model-invocation: true
---

# Wizard

`/eng-wizard` 为"只有人能动手"的流程生成交互式 bash 向导：配第三方服务、填 CI secrets、一次性迁移或割接。agent 只负责界定流程和编写 stage 定义，人运行脚本一步步走完。向导默认是一次性的，跑完即删；只有用户明确要留作可重复的装配路径，才提交进仓库。

## 密钥铁律

密钥只去它该去的地方（`.env` 或 CI secret），绝不出现在其他任何地方：

- 密钥用隐藏输入读取，不回显，不进 shell 历史。
- 密钥不许出现在日志、终端输出、聊天记录、commit message 里。
- 传给外部命令时走 stdin 或环境变量，不许拼进 argv（argv 对同机其他进程可见）。
- 总结阶段只列写了哪些名，永远不打印值；收尾 unset 变量。

## 流程

### 1. 界定流程

先读仓库再列 stage，不要冷启动提问：

- 装配类：`.env.example`、`.env.*`、`README`、`docker-compose*`、框架配置、`.github/workflows/*`（每个 `secrets.*` / `vars.*` 引用都是向导要产出的值）。
- 迁移类：现状、目标、中间的不可逆操作。

把有序的 stage 列表和每个 stage 产出的值交给用户确认：每个值说清 (a) 人从哪里拿到，(b) 写到哪里（`.env` / CI secret / 只执行不落盘），(c) 是密钥还是公开值。用户可增删改序。

完成标准：stage 有序且命名，每个捕获值的三要素齐全。

### 2. 核实每一步是真的

为每个 stage 写出人要走的精确路径：打开哪个 URL、点什么、值显示在哪、填进哪个变量。拿不准当前 UI 或命令就去查文档或问用户，不许编造可能不存在的步骤。

完成标准：每一步陌生人照着能走通。

### 3. 编写向导

复制 `scripts/wizard-template.sh` 到目标路径，在 STAGES 区按依赖顺序写 stage，用库函数：`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、`write_env`、`set_secret`/`set_var`、`pause`/`confirm`。`TOTAL_STAGES` 改成实际数量。

守住模板的水位：先 `open_url` 再要值；密钥一律 `ask_secret`；要持久化的值走 `write_env`；只有 CI 真正需要的值才 `set_secret`；不可逆操作前 `confirm`。每个 stage 只做一件事，`stage` 会清屏，别让关键信息滚出屏幕。库函数区不动。

### 4. 静态验证并交接

- `bash -n <script>`；有 shellcheck 就跑一遍。
- `chmod +x <script>`。
- 不要自己端到端运行：它会开浏览器、阻塞等人输入。改为静态走查：步骤 1 的每个值都被捕获且落到当时说的地方，每个 `set_secret` 的名字和 CI 里 `secrets.*` 引用完全一致。
- 告诉用户怎么运行。如果是可重复的装配路径，提交并在 README 链过去，让下一个人直接跑脚本而不是再问 AI。

## Checkable Completion Criteria

- [ ] Stage 列表经用户确认，每个捕获值的来源、去向、是否密钥三要素齐全。
- [ ] 每一步路径真实可走，无编造的 UI 或命令。
- [ ] 脚本从模板复制，库函数区未动，`TOTAL_STAGES` 与 stage 数一致。
- [ ] 密钥全程隐藏输入、stdin 传递、总结不打印值、收尾 unset。
- [ ] `bash -n` 通过，脚本可执行。
- [ ] 静态走查确认每个值落到预定位置，secret 名与 CI 引用一致。
