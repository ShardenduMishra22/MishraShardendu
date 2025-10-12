#!/bin/bash
# Vercel Build Script with Cache Optimization

set -e

echo "🚀 Starting optimized build..."

# Navigate to monorepo root
cd ../..

# Show Turbo version
echo "📦 Turbo version:"
pnpm turbo --version

# Check for remote cache
if [ -n "$TURBO_TOKEN" ]; then
  echo "✅ Remote cache enabled (TURBO_TOKEN found)"
else
  echo "⚠️  Remote cache disabled (TURBO_TOKEN not found)"
fi

# Run build with detailed output
echo "🔨 Building with Turbo..."
pnpm turbo build --filter=ms22-main --summarize

echo "✅ Build complete!"
