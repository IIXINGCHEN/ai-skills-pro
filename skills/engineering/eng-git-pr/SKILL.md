---
name: eng-git-pr
description: Prepare and submit a GitHub pull request for the current branch.
disable-model-invocation: true
---
# Git Pull Request

Prepare and create a GitHub Pull Request for the current branch.

## Push Readiness Policy

Default mode is **readiness-only**: prepare the branch, verify all checks, and present a push-readiness report. Actual `git push` runs only on explicit user instruction.

**Readiness report items (all must be green before offering to push):**
- [ ] Branch rebased or merged cleanly onto the latest base.
- [ ] Full validation suite green on the final state.
- [ ] Commit history conforms to conventional commits with no fixup/noise commits.
- [ ] PR description drafted with change summary, test evidence, and linked issues.
- [ ] No force-push required; if the branch diverged, reconcile via merge/rebase discussion, never force.

**Hard rules:** Never force push to `main`, `master`, or protected branches under any instruction. Pushing without an explicit user request is prohibited even when readiness is green.

## Prerequisites
- Branch pushed to remote.
- GitHub CLI (`gh`) available and authenticated, or generate markdown for manual submission.

## Process

### 1. Diff & Commit Analysis
1. Review all commits included on this branch compared to base branch:
   ```bash
   git log origin/<base-branch>...HEAD --oneline
   git diff origin/<base-branch>...HEAD --stat
   ```

### 2. Draft PR Description

Skip preambles and keep prose brief. Use the project's domain vocabulary.

```markdown
## Summary

<the smallest visual that makes the key point clear - pick one:>

<pseudocode for logic or an algorithm>

<call tree for runtime control flow>

<component or file tree for structure and module boundaries>

<Mermaid diagram or diff sketch for anything else visual>

## Evidence

- **Before:** <failing test run / screenshot / error output>
  **After:** <passing test run / screenshot / fixed output>

Evidence priority: screenshots and recorded test output first, manual notes last. Link CI run ids where available.

## Merge Danger

**Door:** <one-way (hard to revert: migrations, data changes, public API) or two-way (safe to revert)>

**Blast radius:** <one line: who and what is affected if this merge is wrong>

## Related Issues
- Closes #<issue-id>
```

### 3. Create PR
```bash
gh pr create --base <base-branch> --title "<title>" --body "<markdown-body>"
```
---

## Checkable Completion Criteria

- [ ] Readiness report shows every gate green: clean rebase state, validation green, conventional history, drafted description.
- [ ] PR body leads with a visual summary, shows before/after evidence (screenshots or test output preferred), and states the merge danger as one-way/two-way door plus blast radius.
- [ ] Push and PR creation happened only on explicit user instruction; zero force-pushes to protected branches.
