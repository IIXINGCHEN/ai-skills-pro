## 它做什么

为"只有人能动手"的流程生成交互式 bash 向导：配第三方服务、填 CI secrets、一次性迁移或割接。agent 只界定流程、编写 stage 定义；人运行脚本一步步走完。向导默认一次性，跑完即删。

## What it does

Generates an interactive bash wizard for manual-only procedures: provisioning third-party services, entering CI secrets, one-off migrations or cutovers. The agent scopes the procedure and authors the stage definitions; the human runs the script. Wizards are ephemeral by default: built for one run, deleted when done.

## 什么时候用

当流程里有 agent 做不了的步骤：要人登录第三方控制台点、要人扫码、人肉复制密钥、一次性不可逆的割接。纯 agent 能独立完成的步骤不要用它。

## When to reach for it

Type `/eng-wizard` when a procedure has steps only a human can perform: logging into a third-party dashboard, scanning a QR code, copying a secret by hand, a one-off irreversible cutover. Don't reach for it for steps the agent can do itself.

## 常见问题

**密钥安全吗？**
密钥铁律写在 skill 正文：隐藏输入、不回显；传给外部命令走 stdin 不进 argv；只写进预定目的地（`.env` 或 CI secret）；总结只列名不打印值；收尾 unset。密钥绝不进日志、终端输出、聊天记录。

**模板的库函数区能改吗？**
不能。所有向导共享同一套库函数（进度、开 URL、隐藏输入、幂等写 `.env`、CI secret 写入、确认门），行为一致才是向导的意义。你只写 STAGES 区。

**向导要提交进仓库吗？**
默认不。只有用户明确要留作可重复的装配路径才提交，并从 README 链过去，让下一个人直接跑脚本。

## Common questions

**Are secrets safe?**
The secret rule is in the skill body: hidden input with no echo; passed to external commands via stdin, never argv; written only to the declared destination (`.env` or CI secret); the summary lists names, never values; variables are unset at the end. Secrets never enter logs, terminal output, chat, or commits.

**Can I edit the template's library section?**
No. Every wizard shares the same library (progress display, URL opening, hidden input, idempotent `.env` writes, CI secret writes, confirmation gates). Consistent behavior is the point. You only author the STAGES section.

**Should the wizard be committed?**
No by default. Commit it only when the user wants a repeatable setup path, and link it from the README so the next person runs the script instead of asking an AI.

## 怎么算跑成了

- 每个 stage 只做一件事，清屏后关键信息不滚出屏幕。
- 每个捕获值都落到界定阶段说好的位置，secret 名和 CI 引用完全一致。
- `bash -n` 通过，脚本可执行，人能一步步走完。

## It's working if

- Each stage does one focused task; nothing the human needs scrolls away.
- Every captured value lands where the scoping step said it would; secret names match CI references exactly.
- `bash -n` passes, the script is executable, and a human can walk it end to end.

## 在哪一环

Engineering 桶，用户触发。常跟在装配需求之后：`eng-prime-context` 读仓库定 stage 边界；产出的 `.env` / CI secrets 是后续流程的前置条件。

## Where it fits

Engineering bucket, user-invoked only. Typically follows repo scoping: `eng-prime-context` reads the repo to bound the stages; the produced `.env` / CI secrets are preconditions for whatever comes next.
