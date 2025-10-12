#!/bin/bash
# Monorepo Optimization Migration Script
# This script helps automate the migration to shared packages

set -e

echo "🚀 Starting Monorepo Optimization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Copy UI Components to shared-ui
echo -e "${YELLOW}Step 1: Copying UI components to shared-ui...${NC}"

UI_COMPONENTS=(
  "button.tsx"
  "card.tsx"
  "input.tsx"
  "label.tsx"
  "badge.tsx"
  "alert-dialog.tsx"
  "dialog.tsx"
  "tabs.tsx"
  "tooltip.tsx"
  "avatar.tsx"
  "separator.tsx"
  "checkbox.tsx"
  "dropdown-menu.tsx"
  "popover.tsx"
  "alert.tsx"
)

mkdir -p packages/shared-ui/src/components
mkdir -p packages/shared-ui/src/lib

# Copy from PersonalWebsite (most complete implementation)
for component in "${UI_COMPONENTS[@]}"; do
  SRC="apps/MishraShardendu22-Frontend-PersonalWebsite/src/components/ui/$component"
  DEST="packages/shared-ui/src/components/$component"
  
  if [ -f "$SRC" ]; then
    echo "  ✓ Copying $component"
    cp "$SRC" "$DEST"
    
    # Update imports in the copied file
    sed -i "s|from '@/lib/utils'|from '../lib/utils'|g" "$DEST"
    sed -i "s|from '@/components/ui/|from './|g" "$DEST"
  else
    echo -e "${RED}  ✗ $component not found${NC}"
  fi
done

# Copy utils.ts
if [ -f "apps/MishraShardendu22-Frontend-PersonalWebsite/src/lib/utils.ts" ]; then
  echo "  ✓ Copying utils.ts to shared-ui"
  cp apps/MishraShardendu22-Frontend-PersonalWebsite/src/lib/utils.ts packages/shared-ui/src/lib/utils.ts
fi

# Step 2: Copy utilities to shared-utils
echo -e "${YELLOW}Step 2: Copying utilities to shared-utils...${NC}"

mkdir -p packages/shared-utils/src

if [ -f "apps/MishraShardendu22-Frontend-PersonalWebsite/src/util/api.ts" ]; then
  echo "  ✓ Copying api.ts"
  cp apps/MishraShardendu22-Frontend-PersonalWebsite/src/util/api.ts packages/shared-utils/src/api.ts
fi

if [ -f "apps/MishraShardendu22-Frontend-PersonalWebsite/src/util/apiResponse.util.ts" ]; then
  echo "  ✓ Copying apiResponse.util.ts"
  cp apps/MishraShardendu22-Frontend-PersonalWebsite/src/util/apiResponse.util.ts packages/shared-utils/src/apiResponse.util.ts
  
  # Update imports
  sed -i "s|from './api'|from './api'|g" packages/shared-utils/src/apiResponse.util.ts
  sed -i "s|from '../data/types.data'|from '@repo/shared-types/data'|g" packages/shared-utils/src/apiResponse.util.ts
fi

# Step 3: Copy types to shared-types
echo -e "${YELLOW}Step 3: Copying types to shared-types...${NC}"

mkdir -p packages/shared-types/src

if [ -f "apps/MishraShardendu22-Frontend-PersonalWebsite/src/data/types.data.ts" ]; then
  echo "  ✓ Copying types.data.ts"
  cp apps/MishraShardendu22-Frontend-PersonalWebsite/src/data/types.data.ts packages/shared-types/src/types.data.ts
fi

if [ -f "apps/MishraShardendu22-Frontend-PersonalWebsite/auth-schema.ts" ]; then
  echo "  ✓ Copying auth-schema.ts"
  cp apps/MishraShardendu22-Frontend-PersonalWebsite/auth-schema.ts packages/shared-types/src/auth-schema.ts
fi

# Step 4: Copy auth logic to auth-shared
echo -e "${YELLOW}Step 4: Copying auth logic to auth-shared...${NC}"

mkdir -p packages/auth-shared/src

AUTH_FILES=(
  "auth.ts"
  "authClient.ts"
)

for file in "${AUTH_FILES[@]}"; do
  SRC="apps/MishraShardendu22-Frontend-PersonalWebsite/src/lib/$file"
  DEST="packages/auth-shared/src/$file"
  
  if [ -f "$SRC" ]; then
    echo "  ✓ Copying $file"
    cp "$SRC" "$DEST"
  fi
done

# Copy authHelper from Blog app (Astro-specific but useful)
if [ -f "apps/MishraShardendu22-Frontend-BlogWebsite/src/lib/authHelper.ts" ]; then
  echo "  ✓ Copying authHelper.ts from Blog app"
  cp apps/MishraShardendu22-Frontend-BlogWebsite/src/lib/authHelper.ts packages/auth-shared/src/authHelper.ts
fi

# Step 5: Install dependencies
echo -e "${YELLOW}Step 5: Installing dependencies...${NC}"
pnpm install

# Step 6: Build shared packages
echo -e "${YELLOW}Step 6: Building shared packages...${NC}"
pnpm --filter "@repo/shared-types" build 2>/dev/null || echo "  ⚠ shared-types build skipped (no build script)"
pnpm --filter "@repo/shared-utils" build 2>/dev/null || echo "  ⚠ shared-utils build skipped (no build script)"
pnpm --filter "@repo/shared-ui" build 2>/dev/null || echo "  ⚠ shared-ui build skipped (no build script)"
pnpm --filter "@repo/auth-shared" build 2>/dev/null || echo "  ⚠ auth-shared build skipped (no build script)"

# Step 7: Create index files for easy imports
echo -e "${YELLOW}Step 7: Creating index files...${NC}"

# shared-ui index
cat > packages/shared-ui/src/components/index.ts << 'EOF'
// Auto-generated index file for shared UI components
export * from './button'
export * from './card'
export * from './input'
export * from './label'
export * from './badge'
export * from './alert-dialog'
export * from './dialog'
export * from './tabs'
export * from './tooltip'
export * from './avatar'
export * from './separator'
export * from './checkbox'
export * from './dropdown-menu'
export * from './popover'
EOF

echo -e "${GREEN}✅ Shared packages setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update imports in your apps to use @repo/shared-* packages"
echo "2. Test each app individually: pnpm --filter <app-name> dev"
echo "3. Remove duplicate local files after verifying everything works"
echo "4. Update documentation"
echo ""
echo "Example import updates:"
echo "  Before: import { Button } from '@/components/ui/button'"
echo "  After:  import { Button } from '@repo/shared-ui/components/button'"
echo ""
echo "See MONOREPO_OPTIMIZATION.md for detailed migration guide"
