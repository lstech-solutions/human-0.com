#!/bin/bash

echo "📦 Copying locales from i18n package..."

# Create locales directory in docs
mkdir -p apps/docs/locales

# Copy all JSON files from i18n package to docs
cp packages/i18n/locales/*.json apps/docs/locales/

echo "✅ Copied locale files:"
ls -la apps/docs/locales/

echo "🌐 Available locales:"
for file in apps/docs/locales/*.json; do
  basename "$file" .json
done

echo "🎯 Build-time locale copying complete!"
