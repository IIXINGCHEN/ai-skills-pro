# AI Skills Pro Context

## Purpose

AI Skills Pro is a multi-harness skill library. Skills are small, composable units rather than a single mandatory global workflow.

## Vocabulary

- **User-invoked**: human-triggered only. It orchestrates a workflow or performs an explicitly requested consequential action.
- **Model-invoked**: available to the model or the user when the task matches its description. It provides reusable discipline or a bounded capability.
- **Skill Tool dependency**: an explicit call from one skill to one model-invoked skill. User-invoked skills remain human-controlled.
- **Context pointer**: a short reference that tells the agent when to load out-of-context material.
- **Progressive disclosure**: keeping always-loaded descriptions and entry files small, with branch-specific detail behind pointers.
- **Production gate**: repository validation that must pass before a release artifact is considered publishable.

## Local sources of truth

Skill behavior lives in `skills/<bucket>/<skill>/SKILL.md`.
Codex UI metadata lives beside each skill in `agents/openai.yaml`.
The public catalog is documented in the top-level and bucket README files.
Release metadata is sourced from `VERSION` and synchronized into package and plugin manifests.
