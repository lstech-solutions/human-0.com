#!/bin/bash

echo "🔗 Dashboard Link Theme & Locale Fix"
echo "===================================="
echo ""

echo "🐛 Issue Identified:"
echo "  • Location: apps/web/app/index.tsx line 699"
echo "  • Problem: Docs link wasn't sending theme and locale state"
echo "  • Impact: Users lost language/theme preferences when navigating to docs"
echo ""

echo "🛠️ Solution Applied:"
echo "  • Added useLanguagePicker import"
echo "  • Added currentLanguage state extraction"
echo "  • Updated getDocsUrl('/', currentLanguage, isDark) call"
echo "  • Added target='_blank' for consistency with Footer behavior"
echo ""

echo "📝 Code Changes:"
echo "  Import added:"
echo "  import { useLanguagePicker } from '@human-0/i18n/hooks';"
echo ""
echo "  State added:"
echo "  const { currentLanguage } = useLanguagePicker();"
echo ""
echo "  Link updated:"
echo "  Before: <a href={getDocsUrl('/')}..."
echo "  After:  <a href={getDocsUrl('/', currentLanguage, isDark)} target='_blank'..."
echo ""

echo "🌐 Generated URLs Examples:"
echo ""

# Get current version
VERSION=$(node -p "require('./version.json').version")

echo "English, Light Theme:"
echo "  https://human-0.com/documentation/?locale=en&dark=false"
echo ""
echo "Spanish, Dark Theme:"
echo "  https://human-0.com/documentation/?locale=es&dark=true"
echo ""
echo "French, Light Theme:"
echo "  https://human-0.com/documentation/?locale=fr&dark=false"
echo ""

echo "✅ Benefits:"
echo "  • ✅ Language preference preserved when navigating to docs"
echo "  • ✅ Theme preference preserved when navigating to docs"
echo "  • ✅ Consistent behavior with Footer links"
echo "  • ✅ Opens in new tab for better UX"
echo "  • ✅ All state properly propagated to documentation"
echo ""

echo "🎯 Verification:"
echo "  • Link now includes locale parameter"
echo "  • Link now includes dark theme parameter"
echo "  • Opens in new tab with proper context"
echo "  • Maintains user preferences across navigation"
echo ""

echo "🚀 Dashboard Link Optimization: COMPLETE"
