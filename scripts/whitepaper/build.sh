#!/bin/bash
# Convenience wrapper script that activates venv and runs build

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"

# Check if venv exists
if [ ! -d "$VENV_DIR" ]; then
    echo "❌ Virtual environment not found. Running setup..."
    "$SCRIPT_DIR/setup_venv.sh"
fi

# Activate venv and run build
source "$VENV_DIR/bin/activate"
python "$SCRIPT_DIR/build_whitepaper.py" "$@"
