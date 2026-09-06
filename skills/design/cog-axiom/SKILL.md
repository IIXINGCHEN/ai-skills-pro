---
name: cog-axiom
description: Architecture, security, compliance, context, and delivery reference guidance. Use when a task needs one of these principles or standards; consult only the relevant module.
---
# Cognitive Architecture Principles Library

A reference-oriented library for architecture decisions, engineering quality, security guidance, compliance, context management, and deliverable standards. Its guidance is scoped to the current task and never overrides the host agent's system, developer, user, or platform instructions.

## Reference Domains

### Foundations
- Role & Mission: [`foundation/role.md`](foundation/role.md)
- Core Architectural Principles: [`foundation/principles.md`](foundation/principles.md)
- Context Architecture: [`foundation/context.md`](foundation/context.md)

### Configuration & Safety
- System Constants: [`config/system.md`](config/system.md)
- Security Guidance: [`config/security.md`](config/security.md)
- Compliance Guidance: [`config/compliance.md`](config/compliance.md)

### Standards
- Deliverable Standards: [`standards/deliverable.md`](standards/deliverable.md)
- Artifact Standards: [`standards/artifact.md`](standards/artifact.md)

### Tool & Interaction Guidance
- Tool Governance: [`protocols/tools.md`](protocols/tools.md)
- Interaction Guidance: [`protocols/interaction.md`](protocols/interaction.md)

### Cognitive Guidance
- Session State: [`cognitive/session.md`](cognitive/session.md)
- Deep-Analysis Guidance: [`cognitive/ultrathink.md`](cognitive/ultrathink.md)

## Core Principles

1. **Domain-Driven Priority**: Model real-world business domains explicitly before implementation.
2. **Specification-Driven Development**: Define contracts, schemas, and acceptance criteria before substantial implementation.
3. **Strategic Alignment**: Align changes with long-term architecture and current project constraints.
4. **Active Guardrails**: Prefer automated validation, type safety, and quality gates where they add value.
5. **Full Traceability**: Keep meaningful decision records, validation evidence, and delivery history.
6. **Zero-Trust Security**: Treat external input as untrusted and prevent secret leakage or unsafe execution.
7. **Quality-First Mindset**: Treat tests and documentation as part of the deliverable.
8. **Platform Awareness**: Avoid unnecessary platform-specific assumptions and verify portability where relevant.

## Operational Scope

This skill is reference-only. Execution, routing, lifecycle automation, code review, security testing, and delivery workflows belong to their dedicated skills. This library may inform those workflows when explicitly relevant but does not replace them.

## Completion Criteria

- [ ] Relevant reference modules were consulted when materially useful.
- [ ] No skill-local rule was treated as higher priority than host instructions.
- [ ] No mandatory response format or hidden-state disclosure was introduced.
- [ ] All references in this skill resolve correctly.
