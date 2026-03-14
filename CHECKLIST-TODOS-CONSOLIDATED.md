# Consolidated Checklist Todos (Markdown Audit)

This file captures remaining actionable checklist work after normalizing completed-but-unchecked items across rollout docs.

---

## ✅ Resolved in This Pass

- [x] Normalized completed checklist lines in `DELIVERABLES-INDEX.md`
- [x] Normalized completed checklist lines in `TEAM-BRIEF.md`
- [x] Normalized completed checklist lines in `ROLLOUT-MANIFEST.md`
- [x] Normalized readiness confirmation in `ROLLOUT-SCHEDULE.md`
- [x] Updated queue statuses and package counts in `EXECUTION-QUEUE.md`

---

## 🔧 Remaining Actionable Tasks (Priority Order)

### P0 — Immediate Verification

- [x] Run final TicTacToe validation commands and capture output:
  - `pnpm install`
  - `pnpm validate`
  - `pnpm commit` (prompt check)
  - Source: `TICTACTOE-DEPLOYMENT-LOG.md`
- [x] Update `TICTACTOE-DEPLOYMENT-LOG.md` success criteria checklist after command results are confirmed
- [x] Identify and fix TypeScript errors in Nim repo
  - ✅ Fixed `useLongPress.ts:15` (useRef type annotation)
  - ✅ Fixed `ErrorBoundary.tsx:34` (componentStack null coalescing)  
  - ✅ Fixed `validate.yml:143` (YAML job indentation)
  - ✅ Fixed markdown links (removed broken relative paths)
  - ✅ Result: Nim now has 0 TypeScript errors
- [x] Verify both repos have 0 TypeScript errors (confirmed)
- [x] Run Vite builds in both repos successfully (both ✅ PASS)
- [x] Update Task 4 status in `EXECUTION-QUEUE.md` (marked COMPLETE)
- [ ] Final commit workflow testing and documentation for rollout

### P1 — Team Readiness + Day-1 Launch

- [ ] Complete team training confirmation
  - Source: `TEAM-BRIEF.md` (`Team trained on procedure`)
- [ ] Finish pre-flight closing steps
  - Source: `ROLLOUT-SCHEDULE.md` (`You're ready for Day 1 assignment`, Slack readiness message)
- [ ] Fill in kickoff attendance and go/no-go in rollout log
  - Source: `DAY-1-EXECUTION-LOG.md`

### P2 — Execution Tracking During Rollout

- [ ] Replace placeholders in `DAY-1-EXECUTION-LOG.md` with real team/project status updates
- [ ] Check exactly one status per project line (`✅ PASS` or `⏳ IN PROGRESS` or `❌ FAIL`)
- [ ] Update hourly timeline sections (9:30, 10:00, 11:00, 12:00, 1:00, 2:00, etc.)

---

## 🧾 Context-Only Checklists (Do Not Auto-Resolve)

These contain persistent governance/process prompts and should remain as reusable checklists unless the corresponding process run is being executed:

- `AGENTS.md` self-check lists
- `.github/copilot-instructions.md` self-check lists
- `.github/PULL_REQUEST_TEMPLATE.md`
- Instruction testing checklists in `.github/instructions/09-13*.md`

---

## Exit Criteria

- [x] TicTacToe validation fully passes and is documented
- [x] `EXECUTION-QUEUE.md` shows only truly unresolved rollout tasks
- [ ] Day-1 log has real values instead of placeholders for active execution window
