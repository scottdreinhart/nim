#!/bin/bash
# Batch Commit Script - Governance File Synchronization
# Generated: 2026-03-14
# 
# This script generates git commit commands for all repos with changes.
# REVIEW each command before executing - this script does NOT auto-execute commits.
#
# Usage:
#   bash batch-commit-repos.sh  # Show all commands (read-only)
#   bash batch-commit-repos.sh | bash  # Execute all commits (CAUTION!)

PARENT="/mnt/c/Users/scott"
COMMIT_MSG="sync: governance files (AGENTS.md, instructions, workflows)"

# Repos with changes
REPOS=(
  "2048"
)

echo "=== BATCH COMMIT GENERATOR ==="
echo "Repositories: ${#REPOS[@]}"
echo ""
echo "Commit message: \"$COMMIT_MSG\""
echo ""
echo "--- Commands (not executed) ---"
echo ""

for repo in "${REPOS[@]}"; do
  repo_path="$PARENT/$repo"
  
  if [ ! -d "$repo_path/.git" ]; then
    echo "# SKIP: $repo (not a git repo)"
    continue
  fi
  
  cd "$repo_path"
  
  # Get count of changes
  change_count=$(git status --porcelain 2>/dev/null | wc -l)
  
  # Generate command block for this repo
  cat << CMDS

# --- $repo ($change_count files) ---
(
  cd "$repo_path" || exit 1
  echo "Committing: $repo"
  git add -A
  git commit -m "$COMMIT_MSG"
  echo "✓ $repo committed"
)

CMDS

done

echo ""
echo "--- End of commands ---"
echo ""
echo "To execute, run:"
echo "  bash $0 | bash"
