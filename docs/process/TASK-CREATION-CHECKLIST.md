# Task Creation Checklist — Paperclip

**CRITICAL:** Every task MUST be assigned to a project!

---

## Quick Reference: Project IDs

```
Zhulova:    93754ca9-a89d-49eb-b1d1-b36d31dc7be8
Muninn:     05ca6aab-7362-4788-b266-1f1ea210af90
Apteka:     ef2e7130-d0c8-4b58-8e6d-2ec7ab6487c3
Findable:   9d12ec62-5724-448a-ad6d-cba3ca1e9438
Progrev:    452904ce-7c8e-4f90-82e1-d518b5399312
JobHunter:  effa207f-0e39-435b-9a88-b4b522600444
RavnEdge:   78e820c3-f51e-4ecf-ab2a-ef854573e0bd
```

---

## ✅ Correct Way to Create Task

### Command Template

```bash
paperclipai issue create -C b19249ef-4054-480a-a07c-e83c4ed2e74d \
  --project-id 93754ca9-a89d-49eb-b1d1-b36d31dc7be8 \
  --title "Task Title" \
  --description "Task description" \
  --priority high
```

### Real Example (Zhulova Project)

```bash
paperclipai issue create -C b19249ef-4054-480a-a07c-e83c4ed2e74d \
  --project-id 93754ca9-a89d-49eb-b1d1-b36d31dc7be8 \
  --title "Frontend: Fix header layout" \
  --description "Social icons need better spacing" \
  --priority high
```

### Real Example (Muninn Project)

```bash
paperclipai issue create -C b19249ef-4054-480a-a07c-e83c4ed2e74d \
  --project-id 05ca6aab-7362-4788-b266-1f1ea210af90 \
  --title "Trading Pairs Analysis page" \
  --description "Show bond performance metrics" \
  --priority high
```

---

## ❌ Wrong Way (Current Problem)

```bash
# ❌ NO PROJECT ASSIGNED!
paperclipai issue create -C b19249ef-4054-480a-a07c-e83c4ed2e74d \
  --title "Task Title" \
  --description "..."
```

Result: Task exists but is **ORPHANED** (no project)

---

## Checklist Before Creating Task

- [ ] I know **which project** this task belongs to
- [ ] I have the **project ID** from the list above
- [ ] My command includes `--project-id <id>`
- [ ] Title is clear and actionable
- [ ] Description has context and requirements
- [ ] Priority is set (high/medium/low)
- [ ] I'll verify project was assigned after creation

---

## Verify Task Was Created Correctly

After creating task, verify project assignment:

```bash
# Get task details
paperclipai issue get GEO-45

# Check "projectId" field is NOT empty
# Should show: "projectId": "93754ca9-a89d-49eb-b1d1-b36d31dc7be8"
```

---

## What If Task Already Created Without Project?

Update it:

```bash
paperclipai issue update GEO-42 \
  --project-id 93754ca9-a89d-49eb-b1d1-b36d31dc7be8
```

Then verify:
```bash
paperclipai issue get GEO-42 | jq '.projectId'
```

---

## Agent Instructions (AGENTS.md Update)

All agents creating tasks MUST include `--project-id`:

```markdown
### Task Creation

When creating tasks:
1. Identify the project (Zhulova, Muninn, etc.)
2. Get project ID from reference list
3. Include --project-id in creation command
4. Verify task shows correct project after creation

Example:
\`\`\`bash
paperclipai issue create -C b19249ef-4054-480a-a07c-e83c4ed2e74d \
  --project-id 93754ca9-a89d-49eb-b1d1-b36d31dc7be8 \
  --title "..." \
  --description "..."
\`\`\`

CRITICAL: Tasks without project assignment will be rejected.
```

---

## Current Status: Tasks to Fix

### Already Correct (Has Project)
- GEO-42: Diagnostic booking → Zhulova ✅
- GEO-45: Header layout → Zhulova ✅
- GEO-44: Analytics keys → Zhulova ✅
- GEO-41: Trading Pairs Analysis → Muninn ✅

### Need to Verify/Fix
- GEO-43: (check what this is)
- GEO-40: (cancelled, but check)
- Older tasks: May need retroactive project assignment

---

## References

- Paperclip instance: http://127.0.0.1:3100/
- Project list: `paperclipai project list -C b19249ef-4054-480a-a07c-e83c4ed2e74d`
- Task with project: GEO-42 (example of correct assignment)

---

## Next Steps

1. ✅ Share this checklist with team
2. ✅ Update all AGENTS.md with project ID requirement
3. ✅ Fix any existing orphaned tasks
4. ✅ Use this as standard going forward
