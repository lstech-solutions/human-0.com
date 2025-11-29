#!/usr/bin/env bash
# Package Lambda function for deployment.

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/.lambda-package"
LAMBDA_DIR="$ROOT_DIR/lambda"
BUILD_DIR="${LAMBDA_BUILD_DIR:-$ROOT_DIR/apps/web/dist/server}"
ZIP_PATH="$ROOT_DIR/lambda-deployment.zip"

echo "📦 Packaging Lambda"

if [ ! -f "$LAMBDA_DIR/index.js" ]; then
  echo "❌ Missing Lambda handler: $LAMBDA_DIR/index.js"
  exit 1
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Missing build output: $BUILD_DIR"
  echo "   Set LAMBDA_BUILD_DIR to your build path or run your server build (e.g., pnpm web:build) before packaging."
  exit 1
fi

rm -rf "$PACKAGE_DIR" "$ZIP_PATH"
mkdir -p "$PACKAGE_DIR/config"

echo "→ Copy handler and package.json"
cp "$LAMBDA_DIR/index.js" "$PACKAGE_DIR/"
cp "$LAMBDA_DIR/package.json" "$PACKAGE_DIR/"

echo "→ Copy server build"
cp -r "$BUILD_DIR" "$PACKAGE_DIR/server"

echo "→ Copy API markdown files"
if [ -d "$ROOT_DIR/apps/docs" ]; then
  mkdir -p "$PACKAGE_DIR/docs"
  # Only copy the files actually needed by APIs (updated paths)
  cp "$ROOT_DIR/apps/docs/docs/privacy.md" "$PACKAGE_DIR/docs/" 2>/dev/null || echo "⚠️  privacy.md not found"
  cp "$ROOT_DIR/apps/docs/docs/terms.md" "$PACKAGE_DIR/docs/" 2>/dev/null || echo "⚠️  terms.md not found"
  
  # Copy i18n folders if they exist (for localized content)
  if [ -d "$ROOT_DIR/apps/docs/i18n" ]; then
    cp -r "$ROOT_DIR/apps/docs/i18n" "$PACKAGE_DIR/docs/"
    echo "✅ API docs and i18n copied"
  else
    echo "✅ API docs copied (no i18n)"
  fi
else
  echo "⚠️  No docs folder found"
fi

echo "→ Verify API routes in server build"
if [ -d "$BUILD_DIR/_expo/functions/api" ]; then
  echo "✅ API routes found in server/_expo/functions/api"
else
  echo "⚠️  No API routes found in build output"
fi

if [ -f "$ROOT_DIR/config/versions.json" ]; then
  echo "→ Copy config/versions.json"
  cp "$ROOT_DIR/config/versions.json" "$PACKAGE_DIR/config/"
fi

echo "→ Install production deps"
(cd "$PACKAGE_DIR" && npm install --production --verbose)

echo "→ Create zip"
(cd "$PACKAGE_DIR" && zip -r "$ZIP_PATH" . -x "*.git*" "*.DS_Store*" "*.map" > /dev/null)

echo "→ Cleanup"
rm -rf "$PACKAGE_DIR"

echo "✅ Package ready at $ZIP_PATH"
