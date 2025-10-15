#!/bin/bash
# Icon Verification Script
# Verifies that all icon assets are properly configured across the monorepo

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verifying Icon Setup for Shardendu Mishra Portfolio Monorepo"
echo "================================================================"
echo ""

# Function to check file existence
check_file() {
    local file=$1
    local label=$2
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $label exists: $file"
        return 0
    else
        echo -e "${RED}✗${NC} $label missing: $file"
        return 1
    fi
}

# Function to check directory
check_dir() {
    local dir=$1
    local label=$2
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $label exists: $dir"
        return 0
    else
        echo -e "${RED}✗${NC} $label missing: $dir"
        return 1
    fi
}

# Counters
TOTAL=0
PASSED=0

# Check root public directory
echo "📁 Checking Root Public Directory"
echo "-----------------------------------"

ROOT_PUBLIC="public"
check_dir "$ROOT_PUBLIC" "Root public directory" && ((PASSED++))
((TOTAL++))

# Root public files
files=(
    "public/favicon.ico:Favicon"
    "public/logo.png:Logo"
    "public/apple-touch-icon.png:Apple Touch Icon"
    "public/manifest.json:PWA Manifest"
    "public/browserconfig.xml:Browser Config"
    "public/robots.txt:Robots.txt"
    "public/README.md:Assets README"
)

for file_entry in "${files[@]}"; do
    IFS=':' read -r file label <<< "$file_entry"
    check_file "$file" "$label" && ((PASSED++))
    ((TOTAL++))
done

# Root icons
echo ""
echo "🎨 Checking Root Icon Files"
echo "---------------------------"

icons=(
    "public/icons/icon-16.png:16x16 Icon"
    "public/icons/icon-32.png:32x32 Icon"
    "public/icons/icon-192.png:192x192 Icon"
    "public/icons/icon-512.png:512x512 Icon"
)

for icon_entry in "${icons[@]}"; do
    IFS=':' read -r icon label <<< "$icon_entry"
    check_file "$icon" "$label" && ((PASSED++))
    ((TOTAL++))
done

# Check each application
apps=("MishraShardendu22-Frontend-PersonalWebsite" "MishraShardendu22-Frontend-BlogWebsite" "MishraShardendu22-Frontend-AdminWebsite")

for app in "${apps[@]}"; do
    echo ""
    echo "📱 Checking $app"
    echo "$(printf '=%.0s' {1..60})"
    
    app_public="apps/$app/public"
    check_dir "$app_public" "App public directory" && ((PASSED++))
    ((TOTAL++))
    
    # Essential files
    check_file "$app_public/favicon.ico" "Favicon" && ((PASSED++))
    ((TOTAL++))
    
    check_file "$app_public/manifest.json" "Manifest" && ((PASSED++))
    ((TOTAL++))
    
    # Check for at least one icon
    if [ -d "$app_public/icons" ]; then
        icon_count=$(find "$app_public/icons" -name "*.png" 2>/dev/null | wc -l)
        if [ "$icon_count" -gt 0 ]; then
            echo -e "${GREEN}✓${NC} Found $icon_count icon files in $app_public/icons/"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠${NC}  No PNG icons found in $app_public/icons/"
        fi
    else
        echo -e "${YELLOW}⚠${NC}  Icons directory not found: $app_public/icons"
    fi
    ((TOTAL++))
done

# Check documentation
echo ""
echo "📚 Checking Documentation"
echo "-------------------------"

docs=(
    "ICONS.md:Icon Documentation"
    "ICON_SETUP_SUMMARY.md:Setup Summary"
)

for doc_entry in "${docs[@]}"; do
    IFS=':' read -r doc label <<< "$doc_entry"
    check_file "$doc" "$label" && ((PASSED++))
    ((TOTAL++))
done

# Summary
echo ""
echo "================================================================"
echo "📊 Verification Summary"
echo "================================================================"
echo ""
echo "Total Checks: $TOTAL"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$((TOTAL - PASSED))${NC}"
echo ""

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}✅ All icon assets are properly configured!${NC}"
    echo ""
    echo "🚀 Ready for deployment!"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some icon assets are missing or misconfigured.${NC}"
    echo ""
    echo "Please review the output above and ensure all required files exist."
    exit 1
fi
