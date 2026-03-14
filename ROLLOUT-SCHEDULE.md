# Rollout Schedule & Team Assignment Matrix

**Timeline**: March 15-17, 2026 (3 consecutive days)  
**Projects**: 25 total  
**Teams**: 4 developer teams (one per OS/platform)  
**Prep Day**: March 14 (today)  
**Success Criteria**: All 25 projects passing `pnpm validate` by EOD March 17

---

## 📅 Timeline Overview

```
PREP DAY: March 14 (Friday)
├─ Morning: Team lead reviews TEAM-BRIEF.md (all leads)
├─ Late AM: All 4 teams execute team pre-flight checklist
├─ Afternoon: Day 1 project assignments distributed
├─ EOD: All teams confirm "ready to roll"

DAY 1: March 15 (Saturday)
├─ 9:00 AM:  Kickoff meeting (all teams, 15 min)
├─ 9:15 AM:  Team A starts projects 1-5 (TicTacToe, Snake, Connect4, Checkers, Chess)
├─ 9:15 AM:  Team B starts projects 6-10
├─ 9:15 AM:  Team C starts projects 11-15
├─ 9:15 AM:  Team D starts projects 16-20
├─ 12:00 PM: Lunch break (all teams)
├─ 1:00 PM:  Continue rollout
├─ 5:00 PM:  Status check-in (project leads only, 15 min)
├─ EOD:      15 projects complete (Teams A-C), validation passing

DAY 2: March 16 (Monday)
├─ 9:00 AM:  Standby meeting (blocking issues only, 10 min)
├─ 9:10 AM:  Teams A-C complete projects 21-25
├─ 9:10 AM:  Team D completes projects 16-20 + support
├─ 12:00 PM: Lunch break
├─ 1:00 PM:  Validation sweep (all 25 projects)
├─ 3:00 PM:  Status check-in (all teams, 30 min)
├─ EOD:      All 25 projects validated ✅

DAY 3: March 17 (Tuesday — Buffer/Training Day)
├─ 9:00 AM:  Team training session (1 hour)
│            ├─ Topic 1: Conventional commits workflow (pnpm commit)
│            ├─ Topic 2: New hooks (useSwipeGesture, useLongPress)
│            └─ Topic 3: Error boundary testing patterns
├─ 10:15 AM: Fix any remaining issues (if blocking)
├─ 12:00 PM: Final validation check
├─ 1:00 PM:  Post-rollout retrospective (30 min)
└─ EOD:      COMPLETE — All systems operational
```

---

## 👥 Team Assignment Matrix

### Team A (5 Games — Core Mechanics)
**Lead**: [Name]  
**Members**: 2 developers + 1 QA

| # | Project | Language | Est. Time | Owner | Status |
|---|---------|----------|-----------|-------|--------|
| 1 | TicTacToe | TypeScript/React | 25 min | Dev1 | ⏳ pending |
| 2 | Snake | TypeScript/React | 25 min | Dev1 | ⏳ pending |
| 3 | Connect4 | TypeScript/React | 25 min | Dev2 | ⏳ pending |
| 4 | Checkers | TypeScript/React | 25 min | Dev2 | ⏳ pending |
| 5 | Chess | TypeScript/React | 30 min | Dev2 | ⏳ pending |

**Daily Target**: 5 projects (120 min total, with breaks)  
**Start Time**: 9:15 AM, March 15  
**Deadline**: EOD March 15  
**Validation**: All 5 pass `pnpm validate`

---

### Team B (5 Games — Intermediate)
**Lead**: [Name]  
**Members**: 2 developers + 1 QA

| # | Project | Language | Est. Time | Owner | Status |
|---|---------|----------|-----------|-------|--------|
| 6 | Othello | TypeScript/React | 25 min | Dev3 | ⏳ pending |
| 7 | Hangman | TypeScript/React | 20 min | Dev3 | ⏳ pending |
| 8 | Minesweeper | TypeScript/React | 25 min | Dev4 | ⏳ pending |
| 9 | 2048 | TypeScript/React | 25 min | Dev4 | ⏳ pending |
| 10 | Sudoku | TypeScript/React | 30 min | Dev4 | ⏳ pending |

**Daily Target**: 5 projects (125 min total)  
**Start Time**: 9:15 AM, March 15  
**Deadline**: EOD March 15  
**Validation**: All 5 pass `pnpm validate`

---

### Team C (5 Games — Advanced)
**Lead**: [Name]  
**Members**: 2 developers + 1 QA

| # | Project | Language | Est. Time | Owner | Status |
|---|---------|----------|-----------|-------|--------|
| 11 | Wordle | TypeScript/React | 25 min | Dev5 | ⏳ pending |
| 12 | Poker | TypeScript/React | 30 min | Dev5 | ⏳ pending |
| 13 | Blackjack | TypeScript/React | 25 min | Dev6 | ⏳ pending |
| 14 | Solitaire | TypeScript/React | 30 min | Dev6 | ⏳ pending |
| 15 | Bingo | TypeScript/React | 20 min | Dev6 | ⏳ pending |

**Daily Target**: 5 projects (130 min total)  
**Start Time**: 9:15 AM, March 15  
**Deadline**: EOD March 15  
**Validation**: All 5 pass `pnpm validate`

---

### Team D (5 Games — Support/Buffer)
**Lead**: [Name]  
**Members**: 2 developers + 1 QA + 1 Senior

| # | Project | Language | Est. Time | Owner | Status |
|---|---------|----------|-----------|-------|--------|
| 16 | Mastermind | TypeScript/React | 25 min | Dev7 | ⏳ pending |
| 17 | Battleship | TypeScript/React | 25 min | Dev7 | ⏳ pending |
| 18 | Golf Solitaire | TypeScript/React | 20 min | Dev8 | ⏳ pending |
| 19 | Hearts | TypeScript/React | 25 min | Dev8 | ⏳ pending |
| 20 | Spades | TypeScript/React | 25 min | Dev8 | ⏳ pending |

**Day 1 Target**: 5 projects (120 min total)  
**Day 2 Role**: Support + complete projects 21-25 (if A-C need help)  
**Start Time**: 9:15 AM, March 15  
**Primary Deadline**: EOD March 15  
**Support Deadline**: EOD March 16  
**Validation**: All complete pass `pnpm validate`

---

### Projects 21-25 (To Be Assigned)
**Assignment Strategy**: First available team on Day 2

| # | Project | Language | Critical? |
|---|---------|----------|-----------|
| 21 | [TBD] | TypeScript/React | No |
| 22 | [TBD] | TypeScript/React | No |
| 23 | [TBD] | TypeScript/React | No |
| 24 | [TBD] | TypeScript/React | No |
| 25 | [TBD] | TypeScript/React | No |

**Assignment**: Announce on Day 2 morning based on Team A-C progress

---

## 📋 Pre-Rollout Verification Checklist

**Complete by EOD March 14** (Prep Day):

### Team Lead Verification (All Leads)
- [ ] Read TEAM-BRIEF.md (5 min) — understand workflow changes
- [ ] Read ROLLOUT-QUICK-REFERENCE.md (10 min) — know the commands
- [ ] Read ROLLOUT-MANIFEST.md (15 min) — know the files + variations
- [ ] Execute team pre-flight checklist (see below)
- [ ] Familiarize with common issues in ROLLOUT-MANIFEST.md
- [ ] Confirm team members' calendar blocks (Day 1-3)
- [ ] Review escalation protocol (ESCALATION.md)

### Developer Pre-Flight Checklist (All Developers — Each Team)

**Environment Check** (10 min):
```bash
# WSL/Bash (all developers)
cd ~/nim
pnpm validate          # Must pass ✅

# Confirm availability
node --version         # 24.14.0+
pnpm --version         # 10.31.0+
npm list -g            # Check for npm conflicts
```

**Template Inspection** (15 min):
- [ ] Clone/navigate to `~/nim` (Nim template)
- [ ] Verify: `ls .github/instructions/0[9-3].*.md` (5 files present)
- [ ] Verify: `ls src/app/use{Swipe,Long,Performance}*.ts` (3 hooks present)
- [ ] Verify: `ls src/ui/organisms/ErrorBoundary.*` (1 component + CSS)
- [ ] Verify: `cat .commitlintrc.cjs | head` (config exists)
- [ ] Run: `pnpm lint` (should pass, no errors)
- [ ] Run: `pnpm validate` (should pass completely)

**Git Workflow Check** (5 min):
- [ ] Configure git: `git config user.name "Your Name"` (if not done)
- [ ] Confirm git works: `git log --oneline -1`
- [ ] Test commitizen: `cd ~/tmp && git init && pnpm commit` (if unsure)

**Knowledge Check** (10 min):
- [ ] Read `.github/instructions/09-wcag-accessibility.instructions.md` (first 30 lines)
- [ ] Read `.github/instructions/10-security.instructions.md` (first 30 lines)
- [ ] Understand: `pnpm fix` = auto-fix lint + format
- [ ] Understand: `pnpm validate` = full gate before push

**Readiness Confirmation** (2 min):
- [x] All 4 checks above are ✅ PASSED
- [ ] You're ready for Day 1 assignment
- [ ] Slack message to team lead: "✅ Pre-flight complete, ready to roll"

---

## 🚀 Day 1 Execution Protocol (March 15)

### 9:00 AM — Kickoff Meeting (15 min, All Teams)
**Location**: [Zoom/Teams link]  
**Agenda**:
1. Welcome + timeline overview (2 min)
2. Common mistakes to avoid (3 min)
   - Never run `npm install` (only pnpm)
   - Never run in PowerShell for main code (Bash only)
   - Always verify node_modules platform flag before starting
3. Q&A (5 min)
4. Final confidence check (3 min)
5. Doors open at 9:15 AM

### 9:15 AM — Teams A-D Start Projects

**Each developer**:
1. Open ROLLOUT-QUICK-REFERENCE.md
2. Copy-paste 7 file operations (setup takes ~5 min)
3. Update package.json + eslint.config.js (takes ~3 min)
4. Run `pnpm install` ( takes ~2-3 min)
5. Run `pnpm validate` (takes ~1-2 min)
6. If failing, check ROLLOUT-MANIFEST.md "Common Issues"
7. Commit changes with `pnpm commit` (conventional format)
8. Repeat for next project (or assist team member if blocked)

**Time Budget Per Project**: 20-30 min  
**Total per team**: 5 projects × 25 min avg = 125 min ✅

### 12:00 PM — Lunch Break (All Teams)
- Expected progress: ~50% of daily target (2-3 projects per team complete)
- No work on rollout during lunch

### 1:00 PM — Resume Projects + Continue Strategy
**Expected at this point**:
- Teams completing projects 3-4 of 5
- Some teams may request support if blocking issue found

**Support Strategy**:
- Team lead acts as escalation point
- Check ESCALATION.md for blocker protocol
- Ping [Senior Dev] if issue unresolved in 15 min

### 5:00 PM — Status Check-In (Project Leads Only, 15 min)
**Location**: [Zoom/Teams link]  
**Report**:
- [ ] Team A: Projects 1-5 complete? Y/N, issues?
- [ ] Team B: Projects 6-10 complete? Y/N, issues?
- [ ] Team C: Projects 11-15 complete? Y/N, issues?
- [ ] Team D: Projects 16-20 complete? Y/N, issues?
- [ ] Any blockers for Day 2? List them

**Expected Outcome**: 15/25 projects complete + validated by EOD

---

## ✅ Success Criteria

### Per Project (Minimum)
```
✅ All 5 files copied (instructions + hooks + component)
✅ package.json updated (commitizen config added)
✅ eslint.config.js merged (no conflicts)
✅ .commitlintrc.cjs created
✅ pnpm install completes
✅ pnpm validate passes (no errors)
✅ Git history updated (conventional commit format)
✅ No TypeScript errors
✅ No ESLint errors
✅ Builds successfully (dist/ generated)
```

### Per Team / Per Day
```
✅ Day 1: 15 projects complete (Teams A-C) + validated
✅ Day 2: 10 projects complete (Projects 21-25 + Team D) + validated
✅ Day 3: All 25 projects passing final sweep
```

### Rollout Complete
```
✅ 100% of projects passing pnpm validate
✅ All projects using conventional commits
✅ ESLint security rules active in all projects
✅ Error boundaries protecting all apps
✅ Team trained on new workflows
✅ No critical blockers remaining
```

---

## 📞 Escalation Protocol

**See ESCALATION.md for full protocol**, but TL;DR:

**Level 1: Developer (0-15 min)**
- Check ROLLOUT-MANIFEST.md "Common Issues"
- Try suggested fix
- Document error message

**Level 2: Team Lead (15-30 min)**
- Escalate to team lead with error details
- Leader attempts fix or finds similar issue pattern
- If still blocked, ping [Senior Dev]

**Level 3: Senior Dev (30+ min)**
- Senior reviews error + context
- May require live debug session
- Documents resolution for future reference

**Critical Blocker** (Impacts team):
- Slack #rollout channel immediately
- All-hands conference if needed
- Escalate to project lead

---

## 🎯 Metrics & Tracking

### Real-Time Dashboard (Update as you complete projects)
```
Team A: ✅ ✅ _ _ _  (2/5 complete, on schedule)
Team B: ✅ _ _ _ _   (1/5 complete, slightly behind)
Team C: ✅ ✅ ✅ _ _ (3/5 complete, ahead of schedule)
Team D: ✅ _ _ _ _   (1/5 complete, on schedule)

Total: 7/20 by 1:00 PM (target: 6-8) ✅
```

### End-of-Day Reporting
```
March 15: 15/25 complete ✅
March 16: 25/25 complete ✅
March 17: Training + retrospective ✅
```

---

## 📌 Key Contacts

| Role | Name | Slack | Availability |
|------|------|-------|--------------|
| Rollout Lead | [Name] | @rollout-lead | All 3 days |
| Team A Lead | [Name] | @team-a | All 3 days |
| Team B Lead | [Name] | @team-b | All 3 days |
| Team C Lead | [Name] | @team-c | All 3 days |
| Team D Lead | [Name] | @team-d | All 3 days |
| Senior Dev (Support) | [Name] | @senior-dev | Days 1-3 (10 AM - 5 PM only) |

---

## 🔔 Important Reminders

1. **Never use `npm`** — Always `pnpm`
2. **Never run in PowerShell** — Use Bash/WSL for main code
3. **Check `.node-platform.md`** before starting (platform state)
4. **Run `pnpm validate` before committing** — Non-negotiable
5. **Follow ROLLOUT-GUIDE.md step-by-step** — Don't skip steps
6. **Commit frequently** — Each project gets a commit with `pnpm commit`
7. **Document blockers** — Write them in ESCALATION.md or communicate

---

**This schedule is LOCKED**. Any changes require approval from [Project Lead].

**Team assignments are FINAL**. Substitutions by request only (notify lead by 6 PM March 14).
