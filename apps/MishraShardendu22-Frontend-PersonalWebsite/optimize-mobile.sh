#!/bin/bash

# Mobile Performance Optimization Application Script
# This script helps apply the performance optimizations to your components

echo "🚀 Mobile Performance Optimization Helper"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the app root directory"
    exit 1
fi

echo "📋 Available Optimizations:"
echo "1. Replace CanvasCard with MobileOptimizedCanvasCard"
echo "2. Replace framer-motion with OptimizedMotion components"
echo "3. Add MobilePerformanceMonitor to layout"
echo "4. Check current bundle size"
echo "5. Run Lighthouse audit"
echo "6. All of the above"
echo ""

read -p "Select optimization (1-6): " choice

case $choice in
    1)
        echo "🔍 Finding CanvasCard imports..."
        grep -r "from.*canva" src/components --include="*.tsx" --include="*.ts" || echo "No imports found"
        echo ""
        echo "ℹ️  Replace with:"
        echo "import { MobileOptimizedCanvasCard } from '@/components/projects/mobile-optimized-canva'"
        ;;
    2)
        echo "🔍 Finding framer-motion imports..."
        grep -r "from 'framer-motion'" src --include="*.tsx" --include="*.ts" | head -10
        echo ""
        echo "ℹ️  Replace with:"
        echo "import { OptimizedMotionDiv, OptimizedAnimatePresence } from '@/components/ui/optimized-motion'"
        ;;
    3)
        echo "✅ Adding MobilePerformanceMonitor to layout..."
        if grep -q "MobilePerformanceMonitor" src/app/layout.tsx; then
            echo "Already added!"
        else
            echo "Add this import:"
            echo "import { MobilePerformanceMonitor } from '@/components/extra/MobilePerformanceMonitor'"
            echo ""
            echo "Add this component before </body>:"
            echo "<MobilePerformanceMonitor />"
        fi
        ;;
    4)
        echo "📊 Building and analyzing bundle..."
        if command -v pnpm &> /dev/null; then
            pnpm build
            echo ""
            echo "Check .next/analyze/ for bundle analysis"
        else
            echo "pnpm not found, using npm..."
            npm run build
        fi
        ;;
    5)
        echo "🔍 Running Lighthouse audit..."
        if command -v lighthouse &> /dev/null; then
            lighthouse http://localhost:3000 --only-categories=performance --view
        else
            echo "Lighthouse CLI not installed"
            echo "Install with: npm install -g lighthouse"
            echo ""
            echo "Or use Chrome DevTools:"
            echo "1. Open http://localhost:3000"
            echo "2. Open DevTools (F12)"
            echo "3. Go to Lighthouse tab"
            echo "4. Select Mobile + Performance"
            echo "5. Click 'Analyze page load'"
        fi
        ;;
    6)
        echo "🎯 Applying all optimizations..."
        echo ""
        echo "1️⃣ Checking component usage..."
        echo "Components using framer-motion:"
        grep -r "from 'framer-motion'" src --include="*.tsx" | wc -l
        echo ""
        echo "Components using CanvasCard:"
        grep -r "CanvasCard" src --include="*.tsx" | wc -l
        echo ""
        echo "2️⃣ Building production bundle..."
        pnpm build 2>&1 | tail -20
        echo ""
        echo "3️⃣ Bundle sizes:"
        if [ -d ".next" ]; then
            du -sh .next/static/chunks/* | sort -h | tail -10
        fi
        echo ""
        echo "✅ Review complete! Check docs/MOBILE_PERFORMANCE_FIX.md for details"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📚 Documentation: docs/MOBILE_PERFORMANCE_FIX.md"
echo "✨ Done!"
