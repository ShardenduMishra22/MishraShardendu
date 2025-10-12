#!/bin/bash

# Script to clean up duplicate code from PersonalWebsite
# These features now exist in separate apps

echo "🧹 Starting cleanup of duplicate code..."

# Remove admin folder from PersonalWebsite
ADMIN_PATH="apps/MishraShardendu22-Frontend-PersonalWebsite/src/app/admin"
if [ -d "$ADMIN_PATH" ]; then
  echo "Removing $ADMIN_PATH..."
  rm -rf "$ADMIN_PATH"
  echo "✅ Removed admin folder"
else
  echo "⚠️  Admin folder not found (already removed?)"
fi

# Remove blog folder from PersonalWebsite (if exists)
BLOG_PATH="apps/MishraShardendu22-Frontend-PersonalWebsite/src/app/blog"
if [ -d "$BLOG_PATH" ]; then
  echo "Removing $BLOG_PATH..."
  rm -rf "$BLOG_PATH"
  echo "✅ Removed blog folder"
else
  echo "⚠️  Blog folder not found (already removed?)"
fi

echo ""
echo "✨ Cleanup complete!"
