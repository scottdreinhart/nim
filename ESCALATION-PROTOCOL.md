# Escalation Protocol: Blockers & Support Triage

**Purpose**: Fast resolution of blockers during rollout (March 15-17)  
**Response SLA**: 5-15 min per level  
**Escalation Path**: Developer → Team Lead → Senior Dev → Project Lead  

---

## 🚨 Problem Classification

### Level 1: Self-Service (Developer First, 5 min)

**Common, fixable immediately by developer**:

| Problem | Try This | Time |
|---------|----------|------|
| `pnpm validate` fails | Run `pnpm fix` first | 2 min |
| TypeScript errors | Delete `dist/` then `pnpm install` | 3 min |
| Node modules missing | Run `pnpm install --force` | 3 min |
| Commitizen not working | Run `pnpm install` in that project | 2 min |
| git config missing | `git config user.name "Your Name"` | 1 min |
| Platform (Windows/WSL) mismatch | Check `.node-platform.md`, reinstall if needed | 5 min |
| File not found after copy-paste | Verify filename from ROLLOUT-MANIFEST.md | 2 min |
| Command not found (npm vs pnpm) | Use `pnpm` instead of `npm` | 1 min |

**Developer Action**:
1. Encounter error
2. Find your error in table above
3. Execute the "Try This" action
4. Re-run `pnpm validate`
5. If fixed, continue ✅
6. If not fixed after 5 min, escalate to Level 2

---

### Level 2: Team Lead Triage (Team Lead, 10-15 min)

**Issues that need human judgment or debugging**:

| Problem | Team Lead Does | Time |
|---------|----------------|------|
| `pnpm install` takes >3 min | Kill process, delete node_modules/, retry | 5 min |
| Merge conflict in eslint.config.js | Manually review, apply changes | 10 min |
| ESLint rule error (new rule) | Check ROLLOUT-MANIFEST.md for rule explanation | 5 min |
| Git history corrupted | Attempt reset, or fresh clone | 10 min |
| Multiple errors (cascading) | Check sequence: install → lint → build | 10 min |
| Developer unsure of next step | Point to ROLLOUT-GUIDE.md section | 3 min |

**Team Lead Action**:
1. Developer escalates with error screenshot/message
2. Lead reviews error + developer's attempted fixes
3. Lead attempts Level 2 fix from table above
4. If fixed, document solution in ESCALATION-LOG.md
5. If not fixed after 15 min, escalate to Level 3

**Team Lead Escalation Trigger**:
- Error persists after 15 min
- Multiple team members reporting same issue (systematic problem)
- Error is outside the table above (unknown issue)

---

### Level 3: Senior Dev Support (Senior Dev, 20-30 min)

**Issues requiring deep debugging or system-level fixes**:

| Problem Category | Senior Dev Does | Example |
|------------------|-----------------|---------|
| Node/pnpm issue | Reinstall environment, verify PATH | npm conflicts, version mismatch |
| Git/GitHub issue | Reset branch, revert bad commit, retry | Corrupted history, auth failure |
| System-level issue | Check system logs, file permissions, disk space | Out of disk space, permission denied |
| Cascading failures | Debug root cause, trace dependency chain | Circular import, broken export |
| Configuration conflict | Review all 4 config files, identify conflict | eslint.config.js vs .prettierrc |
| Something from AGENTS.md | Research architecture rules, propose fix | Layer boundary violation, pattern mismatch |

**Senior Dev Action**:
1. Receive escalation from team lead with full context
2. Review error + developer's log + team lead's attempted fixes
3. May request live screen-share session for debugging
4. Attempt deep fix (env reset, git recovery, etc.)
5. Document discovery in ESCALATION-LOG.md
6. If not fixed after 30 min OR if critical blocker, escalate to Level 4

**Senior Dev Escalation Trigger**:
- Issue impacts >1 team member (systemic issue)
- Issue is preventing rollout (critical blocker)
- Root cause is unclear after 30 min of debugging
- Solution requires codebase changes (governance issue)

---

### Level 4: Critical Blocker (Project Lead, All-Hands)

**Issues blocking entire rollout or multiple teams**:

| Critical Blocker | Project Lead Does | Example |
|------------------|-------------------|---------|
| Nim template broken | Revert last commit, investigate cause | Bad merge, breaking change |
| Tool unavailable (pnpm, npm) | Switch to fallback tool or delay rollout | Tool crash, license issue |
| Network/GitHub down | Switch to offline mode or delay rollout | Service outage |
| Multiple systems failing | Declare "rollout pause", all-hands debug | Systematic infection (bad config) |
| Unknown root cause | Get domain expert, escalate externally | Unprecedented error |

**Project Lead Action**:
1. Declare "ROLLOUT PAUSE" in Slack #rollout channel
2. All teams stop work (don't continue if unsure)
3. Call all-hands meeting (15 min)
4. Discuss root cause + remediation plan
5. Either: Fix + resume, or delay rollout
6. Communicate decision to all stakeholders

**All-Hands Red Signal**: 
- Blood red emoji 🔴 in Slack #rollout
- All team leads notified
- Automatic pause to rollout execution

---

## 📋 Escalation Workflow

### Developer → Team Lead (Level 1 → Level 2)

**Step 1**: Try self-service fixes (Level 1 table) for 5 min

**Step 2**: If not fixed, prepare escalation:
```
TO: @team-lead
SUBJECT: [BLOCKER] ProjectName — Error Description

ERROR:
[Paste full error message or screenshot]

WHAT I TRIED:
- [First fix attempt]
- [Second fix attempt]
- [Third fix attempt]

TIME SPENT: X min

CURRENT STATE:
- pnpm validate: ☐ pass ☐ fail
- Files copied: ☐ yes ☐ no
- Commits made: ☐ yes ☐ no
```

**Step 3**: Team lead responds within 5 min with next action

---

### Team Lead → Senior Dev (Level 2 → Level 3)

**Step 1**: Try Team Lead fixes (Level 2 table) for 15 min

**Step 2**: If not fixed, prepare escalation:
```
TO: @senior-dev
SUBJECT: [ESCALATION] Team X — ProjectName — Error Category

ISSUE SUMMARY:
[1-2 sentence description]

DEVELOPER ERROR:
[Full error message]

WHAT I (TEAM LEAD) TRIED:
- [First fix attempt]
- [Second fix attempt]
- [Third fix attempt]

TIME SPENT: 15 min

ROOT CAUSE HYPOTHESIS:
[What you think the issue is]

TEAM IMPACT:
- Developers affected: 1 / 2 / 3+
- Cascading failures: yes / no
- Other teams blocked: yes / no
```

**Step 3**: Senior dev responds within 10 min with debugging plan or fix

---

### Senior Dev → Project Lead (Level 3 → Level 4)

**Step 1**: Attempt Level 3 debugging for 20-30 min

**Step 2**: If critical blocker identified, escalate:
```
TO: @project-lead
CC: @all-team-leads
SUBJECT: [CRITICAL BLOCKER] Impact + ETA

BLOCKER SUMMARY:
[Description of blocker + impact]

AFFECTED:
- Teams: X/4 teams
- Projects: Y/25 projects
- Developers: Z/16 developers

ROOT CAUSE:
[What's broken and why]

PROPOSED FIX:
[How to resolve]

TIME TO FIX:
X min (estimate)

ROLLOUT STATUS:
- Recommendation: ☐ PAUSE ☐ CONTINUE (with workaround)
- ETA to resume: HH:MM or [not available]
```

**Step 3**: Project lead calls all-hands meeting, makes decision

---

## 🛠️ Common Issues & Quick Fixes

### Issue: `pnpm install` Fails with "EACCES: Permission Denied"

**Root Cause**: File permission issue, usually from platform mismatch (Windows vs WSL)

**Quick Fix**:
```bash
# Check platform state
cat .node-platform.md

# If says "windows", you're in WSL — need to reinstall for Linux
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Update platform file
echo "platform: linux" > .node-platform.md
```

**Time**: 3-5 min  
**Escalate if**: Still failing after this fix

---

### Issue: `pnpm validate` Fails with "ESLint: dangerouslySetInnerHTML not allowed"

**Root Cause**: Security rule violation (expected, means rule is working)

**Quick Fix**:
1. Find the line: `dangerouslySetInnerHTML in your code`
2. Refactor to avoid it (use `textContent` or JSX)
3. Re-run `pnpm validate`

**Example**:
```tsx
// ❌ BAD
<div dangerouslySetInnerHTML={{ __html: data }} />

// ✅ GOOD
<div>{data}</div>  // If data is already safe text
```

**Time**: 2-5 min  
**Escalate if**: Can't find/fix the violation

---

### Issue: `pnpm commit` Says "Command Not Found"

**Root Cause**: Node modules not installed or commitizen not recognized

**Quick Fix** (in order):
```bash
# 1. Check if installed
ls node_modules/.bin/commitizen

# 2. If missing, install
pnpm install

# 3. Try again
pnpm commit

# 4. If still failing, use direct path
pnpm exec cz commit
```

**Time**: 2-3 min  
**Escalate if**: Still not working after pnpm install

---

### Issue: `pnpm validate` Fails with "TypeScript Error: Cannot Find Module"

**Root Cause**: Usually missing `dist/` folder or broken path alias

**Quick Fix**:
```bash
# 1. Delete dist
rm -rf dist

# 2. Reinstall
pnpm install

# 3. Validate again
pnpm validate

# If still failing:
# Check tsconfig.json for correct path aliases
cat tsconfig.json | grep -A5 '"paths"'
```

**Time**: 2-5 min  
**Escalate if**: Path aliases are correct but still failing

---

### Issue: Git Merge Conflict in `eslint.config.js`

**Root Cause**: Manual merge conflict from applying config changes

**Quick Fix**:
```bash
# 1. Check conflict markers
cat eslint.config.js | grep -A3 "<<<<<<<<"

# 2. Manually edit — keep BOTH sections (project + new rules)
# Use VS Code: resolve conflict UI, select "Keep Both"

# 3. Verify syntax
pnpm lint

# 4. Commit
pnpm commit

# If you can't resolve:
# Use nim template as source of truth
git checkout --theirs eslint.config.js
```

**Time**: 5-10 min  
**Escalate if**: Can't resolve conflict or produces syntax error

---

### Issue: `node_modules` Wrong Platform (Windows Binary in WSL)

**Root Cause**: Installed in Windows, now running in WSL (or vice versa)

**Quick Fix**:
```bash
# 1. Check active platform
uname -s  # Should be "Linux" in WSL, "Windows" in PowerShell

# 2. Check what's installed
ls node_modules/.bin/pnpm | head -1  # If binary, 2 lines: one link, one file

# 3. Fix platform
rm -rf node_modules pnpm-lock.yaml
pnpm install --force

# 4. Update tracking
echo "platform: linux" > .node-platform.md  # or "windows" if in PowerShell
```

**Time**: 3-5 min  
**Escalate if**: pnpm install still fails after this

---

### Issue: Multiple Projects Start Failing at Once

**Root Cause**: Usually Nim template itself is broken, OR platform issue affects all projects

**Quick Fix**:
1. **Check Nim template**: `cd ~/nim && pnpm validate`
   - If Nim failing: CRITICAL BLOCKER → Level 4
   - If Nim passing: Issue is in individual project

2. **Check platform**: All teams run `cat .node-platform.md`
   - If mismatched: ALL teams need to reinstall (coordinated)

3. **Check recent changes**: Did someone push a breaking change?
   - If yes: Revert it, resume rollout

**Time**: 5-10 min diagnosis  
**Escalate if**: Nim template is broken or widespread platform issue

---

## 📊 Escalation Logging

**All escalations logged in ESCALATION-LOG.md** for post-rollout analysis:

```markdown
## March 15, 2026 — 10:30 AM

**Escalation #1**: ProjectName — ESLint Rule Violation
- Developer: Dev Names
- Team: Team A
- Issue: dangerouslySetInnerHTML in component
- Time to Fix: 3 min
- Resolution: Refactored to textContent
- Logged By: Team A Lead

**Escalation #2**: ProjectName — Node Modules Platform
- Developer: Dev Name
- Team: Team C
- Issue: Windows binaries in WSL environment
- Time to Fix: 5 min
- Resolution: `rm -rf node_modules && pnpm install`
- Logged By: Team C Lead

---
[More escalations...]
```

---

## 📞 Contact Matrix (During Rollout)

| Level | Role | Slack | Response Time | Availability |
|-------|------|-------|----------------|--------------|
| 1 | Developer | n/a | 5 min (self) | All 3 days |
| 2 | Team Lead | @team-a/b/c/d | 5-10 min | All 3 days, 9 AM-5 PM |
| 3 | Senior Dev | @senior-dev | 10-15 min | Days 1-3, 10 AM-5 PM only |
| 4 | Project Lead | @project-lead | 15 min (all-hands) | On-call, 24/7 |

---

## 🚨 Red Flags (Escalate Immediately)

**Auto-escalate to Level 3+ if you see**:

1. **"Cannot read property of undefined"** (cascading errors)
2. **"EACCES: Permission denied"** on multiple projects
3. **"Fatal: could not read commit"** (git corruption)
4. **Multiple teams reporting same error** (systemic issue)
5. **Error not in ROLLOUT-MANIFEST.md "Common Issues"** (unknown problem)
6. **Something broke between Nim template validation and rollout** (template issue)
7. **Team member's entire dev environment broken** (system-level issue)
8. **Cannot reach GitHub / network issues** (infrastructure outage)

**Action**: Post in Slack #rollout with 🚨 emoji + full details, tag team lead immediately

---

## ✅ Escalation Success Metrics

**By EOD March 17**:

- [ ] 0 escalations remaining unresolved
- [ ] 0 critical blockers
- [ ] All escalations documented in ESCALATION-LOG.md
- [ ] Average escalation time: <10 min per issue
- [ ] 100% of issues resolved at Level 2 or below

**If**:
- [ ] 1+ escalation to Level 4 (critical blocker occurred)
- [ ] Average escalation time >15 min
- [ ] Any issues unresolved carryed into post-rollout

**→ Post-rollout retrospective needed**

---

**Keep this protocol handy during Days 1-3. Escalation speed = rollout success.** ✅
