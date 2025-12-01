# Whitepaper Build System

This directory contains the Python-based build system for generating the HUM∧N-Ø whitepaper in multiple formats from a single LaTeX source.

## Overview

The build system implements a single-source-of-truth workflow where `apps/docs/docs/whitepaper.tex` serves as the authoritative source for all whitepaper content. The system automatically generates:

- **PDF**: Professional LaTeX-compiled PDF for academic publications
- **Markdown**: Web-friendly Markdown for documentation sites
- **Jupyter Book**: Interactive HTML book with navigation

## Quick Start

### Option 1: Using Virtual Environment (Recommended)

```bash
# One-time setup
./scripts/whitepaper/setup_venv.sh

# Build all formats (automatically uses venv)
./scripts/whitepaper/build.sh

# Or activate venv manually
source scripts/whitepaper/venv/bin/activate
python scripts/whitepaper/build_whitepaper.py
deactivate
```

### Option 2: Direct Python (if dependencies already installed)

```bash
# Build all formats
python scripts/whitepaper/build_whitepaper.py

# Build specific format
python scripts/whitepaper/build_whitepaper.py --pdf-only
python scripts/whitepaper/build_whitepaper.py --markdown-only
python scripts/whitepaper/build_whitepaper.py --jupyter-only

# Check dependencies
python scripts/whitepaper/build_whitepaper.py --check-deps
```

## Requirements

### System Requirements
- Python 3.8 or higher
- pdflatex and bibtex (TeX Live or MiKTeX)

### Python Packages
See `requirements.txt`:
- pyyaml
- pylatexenc
- jupyter-book
- pytest (for testing)
- hypothesis (for property-based testing)

## Installation

### Recommended: Virtual Environment Setup

The easiest way to get started is using the provided setup script:

```bash
# Run the setup script
./scripts/whitepaper/setup_venv.sh
```

This will:
1. Create a virtual environment in `scripts/whitepaper/venv/`
2. Install all Python dependencies
3. Keep your system Python clean

### Manual Installation

If you prefer to install globally or in your own venv:

```bash
# Install Python dependencies
pip install -r scripts/whitepaper/requirements.txt

# On Ubuntu/Debian - install LaTeX
sudo apt-get install texlive-full

# On macOS - install LaTeX
brew install mactex
```

## Virtual Environment Management

### Why Use a Virtual Environment?

- **Isolation**: Keeps project dependencies separate from system Python
- **Reproducibility**: Ensures consistent builds across different machines
- **No Conflicts**: Avoids version conflicts with other Python projects
- **Easy Cleanup**: Just delete the `venv/` directory to remove everything

### Working with the Virtual Environment

```bash
# Activate the virtual environment
source scripts/whitepaper/venv/bin/activate

# Your prompt will change to show (venv)
# Now you can run Python commands with the project dependencies

# Build the whitepaper
python scripts/whitepaper/build_whitepaper.py

# Run tests
cd scripts/whitepaper && pytest

# When done, deactivate
deactivate
```

### Convenience Wrapper

Use `build.sh` to automatically handle venv activation:

```bash
# This script automatically activates venv and runs the build
./scripts/whitepaper/build.sh

# Pass arguments through
./scripts/whitepaper/build.sh --pdf-only
./scripts/whitepaper/build.sh --check-deps
```

## Architecture

```
whitepaper.tex (SOURCE)
    │
    ├─→ latex_to_pdf.py ──→ public/whitepaper.pdf
    ├─→ latex_to_markdown.py ──→ apps/docs/docs/whitepaper.md
    └─→ latex_to_jupyter.py ──→ apps/docs/jupyter_book/
```

## Components

- **build_whitepaper.py**: Main orchestrator script
- **latex_parser.py**: Shared LaTeX parsing utilities
- **latex_to_pdf.py**: PDF compilation with pdflatex/bibtex
- **latex_to_markdown.py**: LaTeX to Markdown converter
- **latex_to_jupyter.py**: Jupyter Book structure generator

## Output Locations

- PDF: `public/whitepaper.pdf`
- Markdown: `apps/docs/docs/whitepaper.md`
- Jupyter Book: `apps/docs/jupyter_book/_build/html/`

## Single Source of Truth

**IMPORTANT**: Only edit `apps/docs/docs/whitepaper.tex`. All other formats are automatically generated from this file.

❌ Don't edit:
- `apps/docs/docs/whitepaper.md`
- `apps/docs/jupyter_book/*.md`

✅ Do edit:
- `apps/docs/docs/whitepaper.tex`
- `apps/docs/docs/refs.bib`

## Development

### Running Tests

```bash
# Activate venv first
source scripts/whitepaper/venv/bin/activate

# Run all tests
cd scripts/whitepaper && pytest

# Run with coverage
pytest --cov=.

# Run property-based tests
pytest -k property

# Deactivate when done
deactivate
```

### Adding New Sections

1. Edit `apps/docs/docs/whitepaper.tex`
2. Run the build system
3. All formats update automatically

### Updating Citations

1. Edit `apps/docs/docs/refs.bib`
2. Run the build system
3. Bibliography updates in all formats

## Troubleshooting

### "externally-managed-environment" Error

If you see this error when trying to install packages:
```
error: externally-managed-environment
```

**Solution**: Use the virtual environment setup:
```bash
./scripts/whitepaper/setup_venv.sh
```

### LaTeX Compilation Errors

Check the `.log` files in the output directory for detailed error messages.

### Missing Dependencies

Run the dependency check:
```bash
python scripts/whitepaper/build_whitepaper.py --check-deps
```

### Jupyter Book Build Fails

Ensure you're using the virtual environment:
```bash
source scripts/whitepaper/venv/bin/activate
python scripts/whitepaper/build_whitepaper.py --jupyter-only
```

### Virtual Environment Issues

If the venv gets corrupted, simply delete and recreate:
```bash
rm -rf scripts/whitepaper/venv
./scripts/whitepaper/setup_venv.sh
```

## CI/CD Integration

For automated builds in CI/CD pipelines:

```bash
# In your CI script
cd scripts/whitepaper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python build_whitepaper.py
```

## License

See LICENSE file in project root.
