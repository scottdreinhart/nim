#!/bin/bash
set -euo pipefail

PARENT="/mnt/c/Users/scott"

cd "$PARENT"

echo "=== GIT STATUS SWEEP ACROSS ALL SIBLING REPOS ==="
echo "Date: $(date)"
echo ""

# Initialize trackers
declare -a WITH_CHANGES
declare -a CLEAN

# Scan each repo
for dir in */; do
  repo="${dir%/}"
  
  # Skip if not a git repo or if it's nim
  if [ ! -d "$repo/.git" ] || [ "$repo" = "nim" ]; then
    continue
  fi
  
  cd "$PARENT/$repo" 2>/dev/null || continue
  
  # Get git status (porcelain format = machine-readable)
  status=$(git status --porcelain 2>/dev/null || echo "")
  
  if [ -z "$status" ]; then
    CLEAN+=("$repo")
  else
    WITH_CHANGES+=("$repo")
  fi
  
  cd "$PARENT"
done

# Print summary
echo "Summary:"
echo "  ✓ Clean repos: ${#CLEAN[@]}"
echo "  ⚠ Repos with changes: ${#WITH_CHANGES[@]}"
echo ""

if [ ${#WITH_CHANGES[@]} -gt 0 ]; then
  echo "Repos with changes:"
  printf '  - %s\n' "${WITH_CHANGES[@]}"
  echo ""
  echo "Total: ${#WITH_CHANGES[@]} repos need commits"
else
  echo "All repos are clean!"
fi
