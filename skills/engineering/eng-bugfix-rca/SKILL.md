---
name: eng-bugfix-rca
description: Investigate software bugs or GitHub issues and produce a structured Root Cause Analysis (RCA) document. Use when diagnosing defects, analyzing bug reports, and designing targeted bug fixes.
---

# Bugfix: Root Cause Analysis (RCA)

Investigate reported bugs, identify the root mechanism of failure, and formulate an evidence-backed remediation strategy.

## Process

### 1. Issue Triage & Reproduction
1. Ingest the issue description, error logs, and stack traces (from issue trackers or direct user input).
2. Trace the execution path that leads to the failure.
3. Establish a deterministic reproduction case (minimal test case or reproduction script).
   - **非确定性 bug 走「复现率提升」分支**：若 bug 时有时无、无法稳定复现，不要硬凑一个看似确定的复现用例（伪造的确定性等于伪造证据）。转入复现率提升模式--目标不是干净复现，而是把复现率抬到可调试的水平：循环触发、并行施压、收窄时序窗口、注入延时。完成标准是「可调试的复现率」，不是「每次必现」。
   - **回路构造梯子**（从轻到重，选第一条走得通的）：
     1. 失败测试：单元/集成/e2e，写在能触及 bug 代码路径的 seam 上。
     2. HTTP 脚本：对开发服务器的请求脚本，断言响应。
     3. CLI + fixture 输入：diff stdout 与已知正确的快照。
     4. Headless 浏览器脚本：驱动 UI，断言 DOM/控制台/网络。
     5. 抓包回放：把真实请求/payload/事件日志落盘，隔离重放。
     6. 最小 harness：单服务 + mock 依赖，单函数调用触发 bug 路径。
     7. Property/fuzz 循环：bug 表现为「偶发错误输出」时，跑大量随机输入找失败模式。
     8. 版本 bisection：bug 出现在两个已知状态（commit/数据集/版本）之间时，自动化「切到状态 X → 检查 → 重复」。
     9. 新旧 differential：同一输入跑新旧版本（或两套配置），diff 输出。
     10. HITL 兜底：人必须手动点时，用结构化脚本驱动人，捕获的输出回流给 agent。
   - **建不出回路就停**：穷尽上述手段仍建不出回路时，显式停下：列出已尝试的全部手段，向用户索取三样--可复现环境的访问权限、脱敏后的产物（日志转储/抓包/带时间戳的录屏）、生产临时插桩许可。没有回路，不许进入假设阶段；无证据的臆测在此止步。
4. **Test-First Evidence Chain**: Convert the repro into an executable failing test BEFORE any fix exists. Capture the red run output as evidence; the fix phase (later, via `eng-bugfix-implement`) is only legitimate when it turns this exact test green without weakening assertions. Archive the red run output inside the RCA document as proof the defect existed. The green run output is recorded by `eng-bugfix-implement` after the fix, completing the before/after pair.

### 2. Codebase Investigation
1. Search for affected functions, components, or API boundaries using code search tools.
2. Review recent git commit history on affected paths (`git log -n 10 -- <path>`) to see if recent changes introduced regressions.
3. Formulate and test hypotheses regarding the bug's root mechanism.
4. **Ablation of Competing Hypotheses**: When more than one root cause is plausible, eliminate them one at a time, one variable per run (disable, stub, or revert exactly one thing and re-run the repro). Record in the RCA which evidence killed each rejected hypothesis; a surviving hypothesis is the one no ablation could spare.

### 3. Formulate Remediation Plan
1. Detail the precise technical root cause (why it failed).
2. Design a minimal, clean fix with zero unintended side effects.
3. Plan regression tests to permanently prevent recurrence.
---
## Output RCA Template

Save to `specs/<bug-id>/rca.md` (the defect lifecycle and eng-bugfix-implement read it from there):

```markdown
# Root Cause Analysis: <Bug Title / Issue #ID>

## 1. Problem Description
- **Symptoms**: <What failed, error messages, broken behavior>
- **Reproduction**: <Exact steps or test case to reproduce>

## 2. Root Cause Analysis
- **Failing Component**: `path/to/file.ext:line`
- **Mechanism**: <Detailed explanation of the logical or environmental failure>
- **Contributing Factors**: <Concurrency, unhandled nulls, type mismatches, etc.>
- **Hypothesis Ablation Ledger**: <Each rejected hypothesis, the single-variable run that tested it, and the evidence that killed it; the surviving root cause is the one no ablation could spare>

## Evidence Archive
- **Red run output (pre-fix)**: <pasted verbatim; command and exit status>
- **Green run output (post-fix)**: <pasted verbatim; same test, unweakened assertions>

## 3. Proposed Fix Strategy
- **Target Files**:
  - `path/to/file.ext`: <Specific modification needed>
- **Regression Test Plan**:
  - `tests/path/to/test_issue.ext`: <New test to verify the fix>
  - **Seam 检查**：回归测试必须写在能复现真实 bug 模式的调用点 seam 上（测试驱动的是 bug 在真实调用链中的触发方式，而非一个碰巧经过的浅层单元）。若不存在这样的正确 seam--这本身就是架构发现：记入 RCA 上报（架构阻止了 bug 被测试锁定），不许静默吞掉，更不许用一个浅层测试制造「已覆盖」的假信心。

## 4. Verification Command
- `<executable test command>`
```
---

## Checkable Completion Criteria

- [ ] A deterministic reproduction case exists and was captured failing BEFORE any fix (flaky bug: a pinned, debuggable reproduction rate instead, per the rate-raising branch above).
- [ ] 回路已打磨到「紧」：更快--秒级，缓存 setup、跳过无关初始化、缩小测试范围；更锐--断言用户的 exact 症状（不是「没崩」）；更稳--固定时间/随机种子、隔离文件系统、冻结网络，同一命令每次 verdict 一致。
- [ ] Root cause identified with exact `file:line` location and failure mechanism explanation.
- [ ] RCA document saved with fix strategy, target files, and regression test plan.
- [ ] Verification command is executable and currently red on the unfixed code
- [ ] Red run output archived in the RCA document as proof the defect existed (the green run is recorded later by `eng-bugfix-implement`).
- [ ] Competing root-cause hypotheses eliminated by ablation, one variable per run, with the killing evidence recorded.
