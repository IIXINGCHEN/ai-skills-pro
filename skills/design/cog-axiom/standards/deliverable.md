---
description: "生产级交付标准（12项A-L标准，含v20.2新增L回归防止）"
version: "1.6.0"
tags: ["standards", "quality", "production"]
module-type: "standards"
---

# Production-Grade Deliverable Standards

## Overview

These are production-oriented quality targets. Apply them proportionally to the task, technology, risk, and repository constraints; do not fabricate compliance or block reasonable work solely to satisfy a metric.

## Deliverable Standards

`<deliverable_standards>`

**Use these standards as task-appropriate quality gates:**

### A. Domain Alignment

Code structure must map to the domain model in `.agents/context/domain/`.

**Requirements:**
- Domain entities reflected in code structure
- Business logic strictly in the domain layer
- Domain language used in naming
- Clear separation of concerns

### B. Zero-Trust Security

Endpoints are deny-by-default; use secret managers; eng-validate/sanitize all input.

**Requirements:**
- All endpoints deny by default
- Use secret managers (never hardcode secrets)
- Validate and sanitize ALL input
- Use structured security logs
- Manage keys via `.env` and `.gitignore`
- Principle of least privilege

### C. Reliability & Resilience

Critical operations are idempotent; includes graceful error handling.

**Requirements:**
- Idempotent critical operations
- Graceful error handling
- Timeouts on all external calls
- Retry mechanisms with exponential backoff
- Circuit breakers for cascading failures
- Fail-safe defaults

### D. Observability

Produces structured logs with a `trace_id`; exposes Prometheus-compliant metrics.

**Requirements:**
- Structured JSON logs
- Unique `trace_id` for request tracking
- Prometheus-compatible metrics
- Distributed tracing integration
- Performance monitoring
- Health check endpoints

### E. Testability

Adheres to DIP; code should have appropriate unit and integration coverage for its risk and scope; >95% may be a project-specific target rather than a universal requirement.

**Requirements:**
- Dependency Inversion Principle (DIP)
- Meet the repository's stated coverage target when one exists
- Follow **test-first** development
- Unit tests for all functions/methods
- Integration tests for workflows
- E2E tests for critical paths
- Mocking/stubbing external dependencies

### F. Performance & Efficiency

Use efficient algorithms/data structures; avoid N+1 queries.

**Requirements:**
- Efficient algorithms (appropriate time/space complexity)
- Optimal data structures
- No N+1 query problems
- Benchmark resource-intensive operations
- Connection pooling
- Caching where appropriate
- Lazy loading when beneficial

### G. Maintainability

Follows SOLID; **all code and comments must be in English**.

**Requirements:**
- SOLID principles strictly followed
- **All code in English** (variables, functions, classes)
- **All comments in English**
- Adhere to `.agents/context/standards/`
- Consistent naming conventions
- Comment the "why," not the "what"
- Separate config from code
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

### H. Precision & Completeness

Avoid shipping incomplete production code. Mocks, fixtures, placeholders, and prototypes are acceptable when they are explicitly scoped to tests, development tooling, or documentation.

**Requirements:**
- No unresolved production placeholders or incomplete implementation markers
- Clearly distinguish test doubles, fixtures, prototypes, and production implementations
- Do not present temporary solutions as complete production work
- Complete, production-ready implementation
- All logic fully implemented
- All edge cases handled
- No redundant documentation
- No unrelated test code

### I. Obey Existing Patterns

Analyze and strictly adhere to the project's existing architectural patterns.

**Requirements:**
- Study existing codebase first
- Follow established patterns
- Maintain consistency with current code
- Use same libraries/frameworks
- Match coding style
- Preserve architectural decisions

### J. Keep It Simple and Scoped

Limit code modifications strictly to the current task's scope.

**Requirements:**
- Change only what's necessary
- No out-of-scope refactoring
- Minimal impact on existing code
- Clear boundaries
- Focused commits
- Single responsibility per change

### K. Cross-Platform Compatibility

All text files **must** use **UTF-8 without BOM** and **LF line endings**.

**Requirements:**

#### 1. File Encoding
- All text files **must** use **UTF-8 without BOM**
- No legacy encodings (ASCII, Latin-1, etc.)
- Verify encoding in editor/IDE

#### 2. Line Endings
- All text files **must** use **LF (`\n`)**
- Never use CRLF (`\r\n`) or CR (`\r`)
- Configure `.gitattributes` properly
- Set editor to use LF

#### 3. File Paths
- **Never** hard-code path separators (`/` or `\`)
- Use language's built-in path library:
  - Python: `os.path.join()` or `pathlib.Path`
  - Node.js: `path.join()`
  - Go: `filepath.Join()`
  - Java: `Paths.get()` or `File.separator`

#### 4. Case Sensitivity
- All file/directory references **must** match the filesystem case exactly
- Assume case-sensitive filesystem
- Test on Linux to verify

#### 5. Shell Scripting
- `.sh` scripts **must** use POSIX-compliant syntax
- Use `#!/bin/sh` not `#!/bin/bash` (unless bash-specific features required)
- Check for command existence before use:
  ```bash
  if command -v foo >/dev/null 2>&1; then
      foo --version
  fi
  ```
- Avoid bash-isms in POSIX scripts

`</deliverable_standards>`

## Quality Checklist

Before delivering any code, verify:

- [ ] **A** - Domain alignment verified
- [ ] **B** - Security review passed
- [ ] **C** - Resilience patterns implemented
- [ ] **D** - Observability instrumented
- [ ] **E** - Test coverage >95%
- [ ] **F** - Performance eng-validated
- [ ] **G** - Maintainability standards met
- [ ] **H** - No placeholders or TODOs
- [ ] **I** - Existing patterns followed
- [ ] **J** - Scope strictly maintained
- [ ] **K** - Cross-platform compatibility ensured

## Enforcement

These standards are:
- **Mandatory**: No exceptions
- **Verifiable**: Each can be checked
- **Automated**: Many can be tool-verified
- **Comprehensive**: Cover all quality aspects

## Related Modules

- [Core Principles](../foundation/principles.md) - Quality-First Mindset
- [Artifact Protocol](./artifact.md) - Delivery format requirements
- `eng-code-review` - Quality verification process
