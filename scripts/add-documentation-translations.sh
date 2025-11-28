#!/bin/bash

echo "🌐 Adding Documentation Translations to All Locales"
echo "=================================================="

# List of all locale files
locales=("ar-SA" "de-DE" "es-CO" "es-ES" "es-MX" "fr-FR" "pt-BR" "zh-CN")

# Base documentation translations structure
documentation_json='{
  "homepage": {
    "title": "Hello from HUMΛN-Ø Documentation",
    "description": "Verified Human Impact Platform - Complete documentation for HUMΛN-Ø",
    "hero": {
      "title": "HUMΛN-Ø",
      "subtitle": "Verified Human Impact Platform"
    },
    "getStarted": "Get Started - 5min ⏱️",
    "viewArchitecture": "View Architecture",
    "stats": {
      "blockchains": "Blockchains",
      "verifiable": "Verifiable",
      "scalable": "Scalable"
    },
    "features": {
      "global": {
        "title": "Global Impact",
        "description": "Track and verify human impact across multiple blockchain networks worldwide."
      },
      "secure": {
        "title": "Secure Verification",
        "description": "Blockchain-powered verification ensures tamper-proof impact records."
      },
      "instant": {
        "title": "Instant Access",
        "description": "Real-time impact tracking and verification with instant proof generation."
      }
    },
    "quickLinks": {
      "title": "Quick Links",
      "gettingStarted": {
        "title": "Getting Started",
        "description": "Quick start guide to begin using HUMΛN-Ø platform"
      },
      "api": {
        "title": "API Reference",
        "description": "Complete API documentation and integration guides"
      },
      "examples": {
        "title": "Code Examples",
        "description": "Practical examples and use cases for implementation"
      },
      "contribute": {
        "title": "Contribute",
        "description": "Join the community and contribute to the project"
      }
    }
  }
}'

for locale in "${locales[@]}"; do
  echo "📝 Processing $locale..."
  
  # Check if the locale file exists
  if [ -f "apps/docs/locales/$locale.json" ]; then
    # Read the current JSON content
    current_content=$(cat "apps/docs/locales/$locale.json")
    
    # Remove the closing brace to add the documentation section
    modified_content=$(echo "$current_content" | sed '$s/}/,/')
    
    # Add the documentation section and closing brace
    final_content="$modified_content
  \"documentation\": $documentation_json
}"
    
    # Write back to the file
    echo "$final_content" > "apps/docs/locales/$locale.json"
    
    echo "✅ Added documentation translations to $locale.json"
  else
    echo "❌ File $locale.json not found"
  fi
done

echo ""
echo "🎯 Documentation translations added to all locales!"
echo ""
echo "📁 Updated files:"
for locale in "${locales[@]}"; do
  echo "  • apps/docs/locales/$locale.json"
done
echo ""
echo "🌍 All locales now have comprehensive documentation translations!"
