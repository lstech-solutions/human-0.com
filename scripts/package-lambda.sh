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
