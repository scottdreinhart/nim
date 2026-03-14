# Team Pre-Flight Checklist

**Due**: EOD March 14, 2026 (Today — Prep Day)  
**Duration**: 45 minutes per team  
**Outcome**: All teams confirm "✅ READY TO ROLL" by 5 PM

---

## 📋 Pre-Requisites (Before You Start)

**Confirm availability**:
- [ ] You're available March 15-17 (all 3 days)
- [ ] You have your laptop + power + network access
- [ ] You're in the correct timezone (sync with team lead)

**Software installed**:
- [ ] Node 24.14.0+ (`node --version`)
- [ ] pnpm 10.31.0+ (`pnpm --version`)
- [ ] Git configured (`git config user.name "Your Name"`)
- [ ] WSL/Bash shell available (for main work)
- [ ] VS Code or IDE of choice
- [ ] No npm conflicts (`npm list -g | grep -c npm`)

---

## ✅ Individual Developer Pre-Flight (30 min)

### Step 1: Environment Validation (5 min)

```bash
# Option A: WSL/Bash (primary shell)
cd /mnt/c/Users/scott/nim
node --version        # Should be v24.x or higher ✅
pnpm --version        # Should be 10.31.0+ ✅
git --version         # Should be 2.x+ ✅
which node            # Should be /usr/bin/node (WSL) ✅

# Option B: PowerShell (Windows-only, for reference only)
# DO NOT use for main project work
node --version        # Just checking, don't execute commands here
```

**✅ Pass Criteria**: All 4 commands return expected versions  
**❌ Fail Criteria**: Any command missing or wrong version → STOP, fix before rollout

**If failing**:
- Update Node: https://nodejs.org/en/download
- Update pnpm: `npm install -g pnpm@10.31.0` (one-time exception)
- Configure git: `git config --global user.name "Your Name"` + `git config --global user.email "you@company.com"`

---

### Step 2: Template Validation (10 min)

**Navigate to Nim template** (your master template):

```bash
cd /mnt/c/Users/scott/nim
```

**Verify Governance Instruction Files Present** (5 instruction files):

```bash
# Check all 5 files exist
ls -1 .github/instructions/09-*.md
ls -1 .github/instructions/10-*.md
ls -1 .github/instructions/11-*.md
ls -1 .github/instructions/12-*.md
ls -1 .github/instructions/13-*.md

# Expected output:
# .github/instructions/09-wcag-accessibility.instructions.md
# .github/instructions/10-security.instructions.md
# .github/instructions/11-performance.instructions.md
# .github/instructions/12-error-handling.instructions.md
# .github/instructions/13-mobile-gestures.instructions.md
```

**✅ Pass Criteria**: All 5 files listed  
**❌ Fail Criteria**: Any file missing → Report to team lead immediately

---

**Verify 3 Custom Hooks Present**:

```bash
# Check 3 hooks in src/app/
ls -1 src/app/use{Swipe,Long,Performance}*.ts

# Expected output:
# src/app/useLongPress.ts
# src/app/usePerformanceMetrics.ts
# src/app/useSwipeGesture.ts
```

**✅ Pass Criteria**: All 3 hooks listed  
**❌ Fail Criteria**: Any hook missing → Report to team lead immediately

---

**Verify ErrorBoundary Component Present**:

```bash
# Check component + styles
ls -1 src/ui/organisms/ErrorBoundary.*

# Expected output:
# src/ui/organisms/ErrorBoundary.module.css
# src/ui/organisms/ErrorBoundary.tsx
```

**✅ Pass Criteria**: Both files listed  
**❌ Fail Criteria**: Any file missing → Report to team lead immediately

---

**Verify Configuration Files Present**:

```bash
# Check commitlint config
ls -1 .commitlintrc.cjs

# Check eslint config (should already exist)
ls -1 eslint.config.js
```

**✅ Pass Criteria**: Both files exist  
**❌ Fail Criteria**: Missing → Report to team lead immediately

---

### Step 3: Validation Gate (5 min)

**Run full validation**:

```bash
cd /mnt/c/Users/scott/nim
pnpm validate
```

**Expected Output**:
```
✅ ESLint: 0 errors
✅ Prettier: Format check passes
✅ TypeScript: 0 type errors
✅ Build: Successful
```

**✅ Pass Criteria**: All 4 checks pass (zero errors)  
**❌ Fail Criteria**: Any error → Troubleshoot or escalate

**If validation fails**:
1. Try: `pnpm fix` (auto-fixes most issues)
2. Re-run: `pnpm validate`
3. If still failing, take screenshot + report to team lead

---

### Step 4: Commitizen Test (5 min)

**Test interactive commit workflow** (this is what everyone will use on Day 1):

```bash
# Navigate to a temporary directory
cd ~/tmp
mkdir test-commit
cd test-commit
git init

# Try pnpm commit (or commitizen)
# You should see interactive prompts:
# 1. Select type (feat, fix, docs, etc.)
# 2. Enter scope (optional)
# 3. Enter subject
# 4. Enter body (optional)
# 5. Enter footer (optional)
# You can cancel with Ctrl+C

pnpm commit
```

**Expected Behavior**:
- Interactive prompts appear
- You can select type (feat/fix/security/a11y/perf)
- You can enter subject line
- Commit can be cancelled with Ctrl+C

**✅ Pass Criteria**: Prompts appear, selection works, can cancel  
**❌ Fail Criteria**: Command not found or error → Report to team lead

---

## 🏁 Team Pre-Flight Meeting (15 min)

**All team members + team lead**  
**Duration**: 15 minutes  
**Agenda**:

### Agenda Item 1: Environment Check (3 min)

Team lead asks each member:
- [ ] Node/pnpm versions correct?
- [ ] All 5 instruction files present?
- [ ] All 3 hooks + 1 component present?
- [ ] `pnpm validate` passes?

**Go-No-Go**: If all ✅, proceed to next item. If any ❌, pause and fix.

---

### Agenda Item 2: Workflow Review (5 min)

Team lead reviews:
1. **Never use `npm`** — We use `pnpm` only
2. **Never use PowerShell** — We use Bash/WSL for main work
3. **Always check `.node-platform.md`** — Platform state before starting
4. **Always run `pnpm validate`** — Before committing each project
5. **Always use `pnpm commit`** — Interactive commit format (no `git commit`)

**Demo** (2 min):
- Team lead shows ROLLOUT-QUICK-REFERENCE.md (copy-paste commands)
- Shows how to run each step
- Shows how to run `pnpm validate` check

---

### Agenda Item 3: Readiness Confirmation (5 min)

Team lead asks:
- [ ] Does everyone understand the workflow?
- [ ] Does everyone have ROLLOUT-GUIDE.md bookmarked?
- [ ] Does everyone know how to escalate blockers?
- [ ] Can everyone make it 9:00 AM March 15 kickoff?

**Confirmation**: Each member confirms ✅ or asks clarification

---

### Agenda Item 4: Q&A Round (2 min)

Open floor:
- Any remaining questions about Day 1 execution?
- Any concerns about timeline or workload?
- Any environmental issues we can resolve now?

---

## 📝 Checklist Completion Form

**Print or fill out digitally** — Submit to team lead by EOD March 14

```
TEAM: [Team A / B / C / D]
DATE: March 14, 2026
TIME: [Completed at HH:MM]

INDIVIDUAL DEVELOPER CHECKLIST:
Name: ____________________

Step 1 (Environment): ☐ PASS   ☐ FAIL (explain: ________)
Step 2 (Template):    ☐ PASS   ☐ FAIL (explain: ________)
Step 3 (Validation):  ☐ PASS   ☐ FAIL (explain: ________)
Step 4 (Commitizen):  ☐ PASS   ☐ FAIL (explain: ________)

Overall Status:       ☐ READY ☐ NEEDS HELP (describe: ________)

Signature: ____________________

---

TEAM PRE-FLIGHT MEETING:
Date: March 14, 2026
Time: [HH:MM]
Lead: ____________________

Agenda Item 1 (Environment): ☐ ALL PASS  ☐ SOME FAIL (names: ________)
Agenda Item 2 (Workflow):    ☐ COMPLETE ☐ NEEDS CLARIFICATION
Agenda Item 3 (Readiness):   ☐ ALL READY ☐ CONCERNS (list: ________)
Agenda Item 4 (Q&A):         ☐ RESOLVED  ☐ OPEN ISSUES (list: ________)

Meeting Outcome: ☐ TEAM READY TO ROLL
                 ☐ SOME MEMBERS NEED HELP (escalate)

Lead Sign-Off: ____________________

---

ROLLOUT READINESS SUMMARY:
Total Team Members: ___
Ready to Roll:      ___ / ___
Need Help:          ___ / ___
Not Available:      ___ / ___

Final Status: ☐ GO FOR LAUNCH
              ☐ NO GO (explain: ________)
```

---

## 🆘 If You're Stuck

**Problem**: Node/pnpm version wrong  
**Solution**: Update from nodejs.org or reinstall pnpm  
**Time to Fix**: 5-10 min

**Problem**: File missing from template  
**Solution**: Contact team lead immediately (git sync issue)  
**Time to Fix**: 5 min

**Problem**: `pnpm validate` fails  
**Solution**: Run `pnpm fix` first (auto-fixes 90% of issues)  
**Time to Fix**: 2-3 min

**Problem**: Can't run `pnpm commit`  
**Solution**: Verify `node_modules/` installed with `pnpm install`  
**Time to Fix**: 2-3 min (reinstall node_modules)

**Problem**: Not in WSL/Bash, in PowerShell instead  
**Solution**: Open WSL terminal: `wsl` in current PowerShell  
**Time to Fix**: 1 min

---

## ✅ Success Criteria

**Individual Level** ✅:
- All 4 pre-flight steps PASS
- Commitizen test works
- Ready to execute rollout workflow

**Team Level** ✅:
- All members pass individual checklist
- Team pre-flight meeting is complete
- Team lead signs off: "GO FOR LAUNCH"

**Rollout Level** ✅:
- All 4 teams pass pre-flight
- All teams ready by 5 PM March 14
- Kickoff proceeds on schedule 9 AM March 15

---

## 🎯 Timeline (EOD March 14)

```
3:00 PM:  Individual pre-flight starts (everyone, 30 min)
3:30 PM:  Team pre-flight meeting begins (15 min)
3:45 PM:  Any troubleshooting (15 min)
4:00 PM:  Submit checklist completion forms
4:30 PM:  Team lead sign-offs collected
5:00 PM:  All 4 teams confirmed: "✅ READY TO ROLL"
5:30 PM:  Final briefing Q&A (optional, as needed)
6:00 PM:  EOD — teams released

---

MARCH 15: GO FOR LAUNCH 🚀
9:00 AM:  All-hands kickoff
9:15 AM:  Teams execute rollout
```

---

**No team proceeds to March 15 without sign-off from team lead.**

**All blockers must be resolved by 5 PM today.**

**Questions? Ask now. Tomorrow, we execute.** ✅
