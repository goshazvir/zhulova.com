# Project Labels Guide — Paperclip

**Purpose:** Tag all issues with project labels to organize and filter tasks by project.

**Status:** Manual setup (consider automation later)

---

## 📋 Project Labels to Create

Create these labels in Paperclip:

| Label Name | Color | Projects |
|-----------|-------|----------|
| `project:zhulova` | 🔵 Blue | Zhulova.com website |
| `project:muninn` | 🟡 Yellow | Muninn trading dashboard |
| `project:apteka` | 🟢 Green | Apteka (tabletki) |
| `project:findable` | 🟣 Purple | Findable project |
| `project:progrev` | 🔴 Red | Progrev project |
| `project:jobhunter` | 🟠 Orange | JobHunter project |
| `project:ravnedge` | ⚫ Gray | RavnEdge project |

---

## How to Create Labels

### Via Paperclip Web UI

1. Go to **Paperclip Dashboard** → http://127.0.0.1:3100/
2. Settings/Admin section (look for project settings or label management)
3. Create new label:
   - Name: `project:zhulova`
   - Color: Blue
   - Description: "Task belongs to Zhulova.com project"
4. Repeat for all 7 projects

### (Alternative) If labels exist already
1. Check board/project view
2. Look for "Labels" or "Tags" filter
3. See what's available

---

## How to Apply Labels to Tasks

### When Creating New Task

When you create a task with:
```bash
paperclipai issue create -C <company-id> \
  --title "..." \
  --description "..."
```

Then manually:
1. Open task in Paperclip UI
2. Click "Labels" section
3. Add `project:zhulova` (or appropriate project label)

### When Updating Existing Task

1. Open task in Paperclip UI (e.g., http://127.0.0.1:3100/GEO/issues/GEO-45)
2. Look for "Labels" or "Tags" field
3. Click to add label
4. Select `project:zhulova`

---

## Example: GEO-45

**Task:** Frontend: Fix header social icons + gift button  
**Label:** `project:zhulova` ✅

---

## Automation Options (TODO)

### Option 1: Paperclip Rules/Automation
- Check if Paperclip has built-in rules engine
- Create rule: "If issue is in project X, auto-add label project:X"

### Option 2: Pre-Task Creation Script
- Create bash script that:
  1. Reads project ID
  2. Determines project name
  3. Creates task with predetermined label
  
```bash
#!/bin/bash
# create-with-label.sh

PROJECT_ID=$1
TITLE=$2
DESCRIPTION=$3

# Map project ID to label
case $PROJECT_ID in
  "93754ca9-a89d-49eb-b1d1-b36d31dc7be8") LABEL="project:zhulova" ;;
  "05ca6aab-7362-4788-b266-1f1ea210af90") LABEL="project:muninn" ;;
  # ... etc
esac

# Create task
paperclipai issue create ... --title "$TITLE" --description "$DESCRIPTION"
# Then: Add label via API or UI
```

### Option 3: Post-Task Creation Hook
- After creating task, automatically apply label
- Requires Paperclip webhook support or custom integration

---

## Current Workflow

**Until automation is set up:**

1. Create task with `paperclipai issue create`
2. ✋ Manually open in Paperclip UI
3. ✋ Add appropriate `project:*` label
4. Task is now tagged

---

## Filtering by Project Label

Once labels exist:

### In Paperclip UI
- Click "Labels" filter
- Select `project:zhulova`
- See only Zhulova tasks

### Via CLI (if supported)
```bash
paperclipai issue list --filter "label:project:zhulova"
```

---

## Next Steps

1. **Create labels** in Paperclip (7 project labels)
2. **Test manually:** Add label to GEO-45, verify it sticks
3. **Investigate automation:** Check Paperclip docs for rules/webhooks
4. **Document final process:** Update this guide with automation approach

---

## References

- Paperclip Issue Tracking: http://127.0.0.1:3100/
- Project List: `paperclipai project list -C b19249ef-4054-480a-a07c-e83c4ed2e74d`
- Paperclip Docs: (check local Paperclip instance help)
