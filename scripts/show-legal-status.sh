#!/bin/bash

echo "🔍 Git-based Legal Document Update System"
echo "=========================================="
echo ""

echo "📄 Current Legal Document Status:"
echo ""

# Show Git info for legal documents
node scripts/git-file-info.js

echo ""
echo "🔗 Generated Links:"
echo ""

# Generate version links
node scripts/update-legal-docs.js 2>/dev/null | grep -A 10 "Generated version links"

echo ""
echo "✅ System Features:"
echo "  • Uses actual Git commit dates (not release dates)"
echo "  • Links to GitHub commit history for transparency"
echo "  • Version-aware documentation URLs"
echo "  • Context-aware redirection (web vs native)"
echo "  • Automatic updates via version management"
echo ""
echo "🎯 Link Behavior:"
echo "  • Web Footer → GitHub commit history"
echo "  • Docs → Versioned documentation URLs"
echo "  • Native → Internal app pages"
echo ""
echo "📅 Usage:"
echo "  Run during release: ./scripts/update-legal.sh"
echo "  Manual update: node scripts/update-legal-docs.js"
echo "  Check Git info: node scripts/git-file-info.js"
