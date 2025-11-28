#!/bin/bash

# Version-aware legal document update script
# This script should be run as part of your release process

echo "🔄 Running version-aware legal document update..."

# Update legal documents with current version
node scripts/update-legal-docs.js

# Commit the changes if they exist
if git diff --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "📝 Committing legal document updates..."
    git add apps/docs/terms.md apps/docs/privacy.md version.json apps/web/version.json
    git commit -m "docs: update legal documents with version v$(node -p "require('./version.json').version")"
    
    echo "✅ Legal documents updated and committed"
fi

echo "🎉 Legal document update process complete!"
