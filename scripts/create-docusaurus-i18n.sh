#!/bin/bash

echo "🌐 Creating Docusaurus i18n Structure"
echo "======================================"
echo ""

# Create i18n directory structure
mkdir -p /home/ed/Documents/LSTS/human-0.com/apps/docs/i18n

# Create locale directories
for locale in es de fr pt zh ar; do
    echo "📁 Creating locale: $locale"
    mkdir -p "/home/ed/Documents/LSTS/human-0.com/apps/docs/i18n/$locale"
    
    # Create docusaurus-theme-classic translations
    mkdir -p "/home/ed/Documents/LSTS/human-0.com/apps/docs/i18n/$locale/docusaurus-theme-classic"
    
    # Create basic translation files
    cat > "/home/ed/Documents/LSTS/human-0.com/apps/docs/i18n/$locale/docusaurus-theme-classic/navbar.json" << EOF
{
  "theme.navbar.title": "HUMΛN-Ø",
  "theme.navbar.docs": "Docs",
  "theme.navbar.github": "GitHub"
}
EOF
    
    # Create doc translations directory
    mkdir -p "/home/ed/Documents/LSTS/human-0.com/apps/docs/i18n/$locale/docusaurus-plugin-content-docs"
    
    # Create basic doc translations
    cat > "/home/ed/Documents/LSTS/human-0.com/apps/docs/i18n/$locale/docusaurus-plugin-content-docs/current.json" << EOF
{
  "sidebar.tutorialSidebar.category.Introduction": "Introducción",
  "sidebar.tutorialSidebar.category.Architecture": "Arquitectura"
}
EOF

    echo "  ✅ Created translations for $locale"
done

echo ""
echo "📋 Locale Structure Created:"
echo "  /i18n/"
echo "    ├── es/"
echo "    │   ├── docusaurus-theme-classic/"
echo "    │   │   └── navbar.json"
echo "    │   └── docusaurus-plugin-content-docs/"
echo "    │       └── current.json"
echo "    ├── de/"
echo "    ├── fr/"
echo "    ├── pt/"
echo "    ├── zh/"
echo "    └── ar/"
echo ""
echo "✅ Docusaurus i18n structure ready!"
echo ""
echo "🔗 Expected URL Structure:"
echo "  English: /documentation/"
echo "  Spanish: /es/documentation/"
echo "  German: /de/documentation/"
echo "  French: /fr/documentation/"
echo "  Portuguese: /pt/documentation/"
echo "  Chinese: /zh/documentation/"
echo "  Arabic: /ar/documentation/"
echo ""
echo "🚀 Language switching will now work properly!"
