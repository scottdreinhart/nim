#!/bin/bash

# Quick Copy Script — Deploy Governance to One Project
# Usage: ./copy-to-project.sh /path/to/target_project
# Example: ./copy-to-project.sh /mnt/c/Users/scott/tictactoe

set -e

if [ $# -eq 0 ]; then
  echo "❌ Usage: $0 /path/to/target_project"
  echo "Example: $0 /mnt/c/Users/scott/tictactoe"
  exit 1
fi

TARGET=$1
NIM_REPO="/mnt/c/Users/scott/nim"

if [ ! -d "$TARGET" ]; then
  echo "❌ Target project not found: $TARGET"
  exit 1
fi

echo "📋 Deploying governance package to: $TARGET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Copy 5 governance instructions
echo "📄 Copying governance instructions (.github/instructions/)..."
mkdir -p "$TARGET/.github/instructions"
cp "$NIM_REPO"/.github/instructions/{09,10,11,12,13}*.md "$TARGET/.github/instructions/" 2>/dev/null || {
  echo "⚠️  Instruction files not found in $NIM_REPO"
  exit 1
}
echo "✅ 5 instruction files copied"

# Step 2: Copy 3 custom hooks
echo "🪝 Copying custom hooks (src/app/)..."
mkdir -p "$TARGET/src/app"
cp "$NIM_REPO"/src/app/useSwipeGesture.ts "$TARGET/src/app/"
cp "$NIM_REPO"/src/app/useLongPress.ts "$TARGET/src/app/"
cp "$NIM_REPO"/src/app/usePerformanceMetrics.ts "$TARGET/src/app/"
echo "✅ 3 hooks copied"

# Step 3: Copy error boundary component
echo "🛡️  Copying ErrorBoundary component (src/ui/organisms/)..."
mkdir -p "$TARGET/src/ui/organisms"
cp "$NIM_REPO"/src/ui/organisms/ErrorBoundary.tsx "$TARGET/src/ui/organisms/"
cp "$NIM_REPO"/src/ui/organisms/ErrorBoundary.module.css "$TARGET/src/ui/organisms/"
echo "✅ ErrorBoundary component + CSS copied"

# Step 4: Copy configuration files
echo "⚙️  Copying configuration files..."
cp "$NIM_REPO"/.commitlintrc.cjs "$TARGET/"
mkdir -p "$TARGET/.husky"
cp "$NIM_REPO"/.husky/commit-msg "$TARGET/.husky/" || echo "⚠️  .husky/commit-msg may need manual setup"
# Note: eslint.config.js should be manually merged (add security rules)
echo "✅ Config files copied (.commitlintrc.cjs, .husky/commit-msg)"
echo "⚠️  📌 MANUAL STEP: Merge eslint.config.js security rules from Nim"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Files copied. Now run in target project:"
echo ""
echo "  cd $TARGET"
echo "  pnpm add -D eslint-plugin-security@^3.1.1 commitizen@^4.3.1 cz-conventional-changelog@^3.3.0 @commitlint/config-conventional@^19.5.0"
echo "  pnpm validate"
echo "  pnpm commit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Copy complete"
