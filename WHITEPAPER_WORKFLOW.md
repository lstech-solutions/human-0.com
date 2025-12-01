# White Paper Workflow - Single Source of Truth

## Overview

The HUM∧N-Ø white paper uses **LaTeX as the single source of truth**. All other formats (Markdown, Jupyter Book, PDF) are automatically generated from `apps/docs/docs/whitepaper.tex`.

```
┌─────────────────────────────┐
│ apps/docs/docs/whitepaper.tex│ ← EDIT THIS ONLY
│  (SINGLE SOURCE)             │
└──────────┬───────────────────┘
           │
┌──────────┴──────────────────┐
│  python scripts/whitepaper/ │
│  build_whitepaper.py        │
└──────────┬──────────────────┘
           │
┌──────────┼──────────────────┐
│          │                  │
▼          ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ public/      │ │ apps/docs/   │ │ apps/docs/   │
│ whitepaper   │ │ docs/        │ │ jupyter_book/│
│ -latex.pdf   │ │ whitepaper.md│ │ _build/html/ │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Why This Approach?

### Before (2 Sources of Truth ❌)
- **Problem:** `whitepaper.tex` for PDF + separate `jupyter_book/*.md` files
- **Issues:**
  - Content gets out of sync
  - Have to edit content twice
  - Version numbers might differ
  - Hard to maintain consistency

### After (1 Source of Truth ✅)
- **Solution:** `apps/docs/docs/whitepaper.tex` is the ONLY file you edit
- **Benefits:**
  - Edit once, publish everywhere
  - Guaranteed consistency across all formats
  - Version number always matches
  - LaTeX quality for PDF, accessible web formats too

## Workflow

### Daily Usage

1. **Edit the LaTeX source:**
```bash
# Open and edit the ONLY file that matters
vim apps/docs/docs/whitepaper.tex
```

2. **Build all outputs:**
```bash
# One command generates everything
npm run whitepaper:build

# Or using Python directly
python3 scripts/whitepaper/build_whitepaper.py
```

3. **Done!** All formats are updated:
   - ✅ PDF: `public/whitepaper-latex.pdf`
   - ✅ Markdown: `apps/docs/docs/whitepaper.md`
   - ✅ Jupyter Book: `apps/docs/jupyter_book/_build/html/`

### Individual Build Commands

If you only want to build specific formats:

```bash
# Just PDF
npm run whitepaper:pdf

# Just Markdown
npm run whitepaper:markdown

# Just Jupyter Book
npm run whitepaper:jupyter

# Check dependencies
npm run whitepaper:check
```

## File Structure

```
human-0.com/
├── apps/docs/docs/
│   ├── whitepaper.tex          ← EDIT THIS (single source)
│   ├── whitepaper.md           ← AUTO-GENERATED
│   └── refs.bib                ← Bibliography (edit as needed)
│
├── apps/docs/jupyter_book/
│   ├── intro.md                ← AUTO-GENERATED
│   ├── posh.md                 ← AUTO-GENERATED
│   ├── related_work.md         ← AUTO-GENERATED
│   ├── threat_model.md         ← AUTO-GENERATED
│   ├── uc_model.md             ← AUTO-GENERATED
│   ├── references.md           ← AUTO-GENERATED
│   ├── _config.yml             ← AUTO-GENERATED
│   ├── _toc.yml                ← AUTO-GENERATED
│   └── _build/html/            ← Built HTML output
│
├── public/
│   └── whitepaper-latex.pdf    ← AUTO-GENERATED PDF
│
└── scripts/whitepaper/
    ├── build_whitepaper.py     ← Main build script
    ├── latex_parser.py         ← LaTeX parsing utilities
    ├── latex_to_pdf.py         ← PDF generator
    ├── latex_to_markdown.py    ← Markdown converter
    ├── latex_to_jupyter.py     ← Jupyter Book builder
    └── requirements.txt        ← Python dependencies
```

## How It Works

### 1. LaTeX Parsing

The `latex_parser.py` script:
- Reads `apps/docs/docs/whitepaper.tex`
- Extracts metadata (title, author, version, abstract)
- Splits content by `\chapter{}` and `\section{}` commands
- Parses bibliography from `refs.bib`

### 2. Format Generation

**PDF (`latex_to_pdf.py`):**
- Runs pdflatex (3 passes for references)
- Runs bibtex for bibliography
- Outputs to `public/whitepaper-latex.pdf`

**Markdown (`latex_to_markdown.py`):**
- Converts LaTeX formatting to Markdown
- Preserves math notation for MathJax
- Outputs to `apps/docs/docs/whitepaper.md`

**Jupyter Book (`latex_to_jupyter.py`):**
- Creates individual chapter files
- Generates `_config.yml` and `_toc.yml`
- Builds HTML with `jupyter-book build`
- Outputs to `apps/docs/jupyter_book/_build/html/`

### 3. Version Synchronization

The version is extracted from `apps/docs/docs/whitepaper.tex`:

```latex
\date{\today\ \\ {\small Version 1.0.0}}
```

This version appears in:
- ✅ PDF header
- ✅ Jupyter Book intro page
- ✅ Markdown frontmatter

## Installation

### System Requirements

- Python >= 3.8
- LaTeX distribution (TeX Live or MiKTeX)
- Node.js (for npm scripts)

### Install Dependencies

```bash
# Install Python dependencies
pip install -r scripts/whitepaper/requirements.txt

# Or using a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r scripts/whitepaper/requirements.txt

# Check if everything is installed
npm run whitepaper:check
```

### Install LaTeX

**Ubuntu/Debian:**
```bash
sudo apt-get install texlive-full
```

**macOS:**
```bash
brew install mactex
```

**Windows:**
Download and install MiKTeX from https://miktex.org/

## Common Tasks

### Adding a New Section

1. Edit `apps/docs/docs/whitepaper.tex`:
```latex
\section{My New Section}
Content goes here...
```

2. Rebuild:
```bash
npm run whitepaper:build
```

The new section will automatically appear in all formats.

### Updating the Version

1. Edit `apps/docs/docs/whitepaper.tex`:
```latex
\date{\today\ \\ {\small Version 1.0.1}}
```

2. Rebuild - version updates everywhere:
```bash
npm run whitepaper:build
```

### Adding Citations

1. Add to `apps/docs/docs/refs.bib`:
```bibtex
@article{my_paper,
  author = {Smith, J.},
  title = {Great Paper},
  year = {2025}
}
```

2. Cite in `apps/docs/docs/whitepaper.tex`:
```latex
This is important~\citep{my_paper}.
```

3. Rebuild - citations appear in all formats:
```bash
npm run whitepaper:build
```

## Troubleshooting

### LaTeX Not Found

```bash
# Check if installed
which pdflatex

# Install if missing (Ubuntu)
sudo apt-get install texlive-full

# Install if missing (macOS)
brew install mactex
```

### Jupyter Book Not Found

```bash
# Install
pip install jupyter-book

# Verify
jupyter-book --version
```

### Build Fails

```bash
# Check dependencies
npm run whitepaper:check

# Clean and rebuild
rm -rf apps/docs/jupyter_book/_build
npm run whitepaper:build
```

### Content Not Updating

```bash
# Force rebuild Jupyter Book
jupyter-book clean apps/docs/jupyter_book
npm run whitepaper:jupyter

# Or rebuild everything
npm run whitepaper:build
```

## Best Practices

1. **Always edit `apps/docs/docs/whitepaper.tex` directly**
   - ❌ Don't edit `apps/docs/jupyter_book/*.md` files
   - ❌ Don't edit `apps/docs/docs/whitepaper.md`
   - ✅ Edit `apps/docs/docs/whitepaper.tex` only

2. **Run the build after changes**
   ```bash
   npm run whitepaper:build
   ```

3. **Commit both source and outputs**
   ```bash
   git add apps/docs/docs/whitepaper.tex
   git add apps/docs/jupyter_book/*.md
   git add public/whitepaper-latex.pdf
   git commit -m "Update whitepaper to v1.0.1"
   ```

4. **Test locally before pushing**
   ```bash
   # Build everything
   npm run whitepaper:build
   
   # Check Jupyter Book locally
   open apps/docs/jupyter_book/_build/html/index.html
   
   # Check PDF
   open public/whitepaper-latex.pdf
   ```

## Deployment

The built outputs can be deployed:

1. **Jupyter Book** → GitHub Pages or Vercel
2. **PDF** → Public download link
3. **Markdown** → Documentation site (Docusaurus, etc.)

All from the same LaTeX source!

## Summary

✅ **Single Source:** Edit `apps/docs/docs/whitepaper.tex` only  
✅ **One Command:** `npm run whitepaper:build`  
✅ **Multiple Outputs:** PDF, Jupyter Book, Markdown  
✅ **Always Synced:** Version, content, citations match everywhere  
✅ **LaTeX Quality:** Professional PDF while maintaining web accessibility

---

**Questions?** Check `scripts/whitepaper/README.md` or open an issue.
