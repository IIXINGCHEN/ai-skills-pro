---
"ai-skills-pro": patch
---

Deep remediation sweep closing every deferred item from the audit and review loops, plus two new defect classes found by byte-level scanning:

- **Control-character corruption (new class)**: seven docs lines shipped with stray C0 controls (U+0008 backspace, U+000B vertical tab, U+001B escape) embedded mid-word, silently eating the adjacent character's display ("precedes \x0Balidate" read as "precedes alidate"); the encoding gate only checked empty files and BOM. All seven lines repaired with their intended skill names; a control-character marker added to `fabricationViolations` (all C0 except tab/newline/cr plus U+007F) with ablation controls proving vertical-tab and backspace fire while tab/newline stay legal.
- **Graft to-variant (new class)**: the graft-fragment marker's verb list missed "to", so two docs pages shipped an invocation sentence ending mid-air into a leftover "to implement tasks" clause. Both pages rewritten; the marker extended; ablation control added. The new marker immediately caught its own pattern quoted in two report files, which were rewritten to describe rather than quote.
- **REDIRECT_RE tightened to require the slash**: prose mentions ("run `eng-multidimensional-audit`" inside a review step) no longer land in manifests as redirects; `eng-enterprise-lifecycle`'s redirects shrank to the real `eng-git-pr` hand-off. Manifests regenerated, graph valid.
- **Clean single-line gate exits**: all four CLI gate entry points (validate, release-check, trigger-eval, output-eval) now trap load errors and exit with one named `[ERROR]`/`[EVAL ERROR]` line and zero stack frames; ablated with corrupt files on every entry point.
- **read-json contract tests**: 5 tests pin the loader's behavior (happy path, corrupt names the file, missing says missing, empty file, in-memory string label).
- Two new failure-ledger entries (control-character-corruption, graft-to-variant), each with its marker and ablation control. Test suite: 54 -> 59.
