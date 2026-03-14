#!/bin/bash
# Generate batch commit script for all repos with changes
# This script does NOT execute commits - it generates them for review

PARENT="/mnt/c/Users/scott"
OUTPUT="/mnt/c/Users/scott/nim/batch-commit-repos.sh"

echo "Scanning all 33 sibling repos for changes..."
echo ""

# Arrays to track repos
declare -a REPOS_WITH_CHANGES

cd "$PARENT"

# Check each directory
for d in */; do
  repo="${d%/}"
  
  [ ! -d "$repo/.git" ] && continue
  [ "$repo" = "nim" ] && continue
  
  cd "$PARENT/$repo"
  
  # Check for changes
  changes=$(git status --porcelain 2>/dev/null)
  
  if [ -n "$changes" ]; then
    REPOS_WITH_CHANGES+=("$repo")
  fi
done

echo "Found ${#REPOS_WITH_CHANGES[@]} repos with changes:"
printf '  %s\n' "${REPOS_WITH_CHANGES[@]}"
echo ""

# Generate the batch commit script
cat > "$OUTPUT" << 'EOF'
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
EOF

# Add repo names
for repo in "${REPOS_WITH_CHANGES[@]}"; do
  echo "  \"$repo\"" >> "$OUTPUT"
done

cat >> "$OUTPUT" << 'EOF'
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
EOF

chmod +x "$OUTPUT"

echo ""
echo "Generated batch commit script: $OUTPUT"
echo ""
echo "To see all commits (without executing): bash $OUTPUT"
echo "To execute all commits: bash $OUTPUT | bash"
