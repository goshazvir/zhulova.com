# Task "Done" Criteria — Strict Definition

**Version:** 1.0  
**Last updated:** 2026-08-12  
**Owner:** Board (Founder)

## ⚠️ CRITICAL RULE

A task MUST NOT transition to **Done** until ALL of the following are verified:

### 1. Pull Request Created & Merged ✅
- PR must be created on GitHub (not pending, not abandoned)
- PR title must reference the task (e.g., "GEO-27: ...", "feat(component): ... (GEO-27)")
- All CI/CD checks must pass:
  - Lint ✅
  - Unit tests ✅
  - E2E tests (Chromium) ✅
  - Performance gate ✅
  - Vercel build ✅
- PR must be **MERGED into `master`** (not just "Ready to merge")
- Merge must be visible in `git log master`

### 2. Production Deployment Verified ✅
- Vercel deployment must complete **successfully** (not pending, not failed)
- Production URL must be live and updated
- No 5xx errors on production
- Core functionality must work (spot-check the changes)

### 3. Code Review Chain Complete ✅
- Code Critic: **APPROVE** (not just "no blockers")
- QA Engineer: **PASS** (verified on production or staging)
- Designer: APPROVE (if design was part of the task)

### 4. Documentation Updated ✅
- Relevant `.md` files updated (architecture docs, CLAUDE.md, testing guide, etc.)
- `.env.example` updated if env vars were added
- Comments in code explain non-obvious decisions

---

## What "Done" Does NOT Mean

❌ **NOT DONE:**
- PR created but not merged
- PR merged but Vercel deployment still pending
- PR merged but deployment failed
- Task marked "in_progress" with code somewhere but no PR
- All tests pass locally but CI not run
- Designer research complete but implementation not started

---

## Workflow

1. **Implement** → feature branch → write tests → all green
2. **Create PR** → GitHub (automated or manual)
3. **Pass CI/CD** → all checks green
4. **Code review** → Critic APPROVE
5. **QA verify** → QA PASS on staging/production
6. **Merge** → PR merged to master
7. **Verify production** → changes live on zhulova.com
8. **Mark Done** → transition task to Done in Paperclip

---

## Agent Responsibility

**Frontend Dev, Backend Dev, BA, Designer:**
- Do NOT mark task as Done yourself
- Leave the task in "in_progress" after merge/deployment
- Notify in the task thread: "Merged: PR #X, deployed to production"

**QA Engineer:**
- Verify production after deployment
- Leave a PASS/FAIL comment in the task thread
- QA may mark Done if empowered, otherwise notifies team

**Founder/Team Lead:**
- Final verification that everything is live
- Responsibility for marking task Done

---

## Red Flags 🚩

If you see any of these, the task is NOT done:

- PR created but no merge
- Merge in git log but Vercel still building
- Vercel succeeded but domain shows old version (cache)
- Tests pass but Playwright report shows skipped tests
- Task says "Done" but changes not visible on production
- Task "Done" but there was no PR at all

---

## Examples

### ✅ CORRECT DONE
- PR #60 merged into master (commit: 7148356)
- Vercel deployment successful
- Changes visible on https://zhulova.com
- QA verified on production
- Task transitioned to Done

### ❌ INCORRECT DONE
- Task in Done, PR created but not merged
- Task in Done, PR merged but Vercel still building
- Task in Done, no PR was created at all
- Task in Done, PR merged but production shows old version

---

## Implementation Notes

This rule applies to **all tasks**:
- GEO-XX (Zhulova)
- Any other project task

Enforce in:
1. **AGENTS.md** (update all agent instructions)
2. **GitHub branch protection rule** (block merge without all checks)
3. **Paperclip task policy** (document in task templates)
