---
name: to-spec
description: "This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know."
---



This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know. The single exception: confirming the test seams with the user in step 2 below, that seam confirmation is the one allowed user check; do not expand it into a general interview.

**与 `pipe-to-spec` 的分工**：本 skill 独立使用，由用户直接调用，从当前对话合成规格。`pipe-to-spec` 是 `pipe-ship` 流水线 stage 2 的编排版本（带 RUN.md 记录、stage 门禁、tracker 选择）。走完整 pipe-ship 时用 `pipe-to-spec`；单独做一次规格时用本 skill。

The issue tracker and triage label vocabulary should have been provided to you. If not, ask the user to complete the equivalent manual initialization first (issue tracker or local `.scratch/` layout, triage labels), the `/setup-matt-pocock-skills` setup skill is third-party and not bundled here.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations. This seam confirmation is the one allowed user check in this skill, do not turn it into a broader interview.

3. Write the spec using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
