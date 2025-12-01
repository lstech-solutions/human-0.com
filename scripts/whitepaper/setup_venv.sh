#!/bin/bash
# Setup script for whitepaper build system virtual environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"

echo "🐍 Setting up Python virtual environment for whitepaper build system..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "📌 Found Python $PYTHON_VERSION"

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Creating virtual environment..."
    if ! python3 -m venv "$VENV_DIR" 2>/dev/null; then
        echo ""
        echo "❌ Failed to create virtual environment."
        echo ""
        echo "On Ubuntu/Debian, you may need to install python3-venv:"
        echo "  sudo apt install python3-venv"
        echo ""
        echo "On other systems, ensure Python venv module is available."
        exit 1
    fi
    echo "✅ Virtual environment created at: $VENV_DIR"
else
    echo "✅ Virtual environment already exists at: $VENV_DIR"
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies from requirements.txt..."
pip install -r "$SCRIPT_DIR/requirements.txt"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To use the virtual environment:"
echo "  source $VENV_DIR/bin/activate"
echo ""
echo "To build the whitepaper:"
echo "  source $VENV_DIR/bin/activate"
echo "  python $SCRIPT_DIR/build_whitepaper.py"
echo ""
echo "To deactivate when done:"
echo "  deactivate"
