# MyST PDF Workflow - Hybrid Approach

This directory contains scripts for the **hybrid documentation workflow** - using both LaTeX and Markdown for whitepaper generation.

## 🎯 Hybrid Workflow Overview

- **LaTeX** → Production PDFs (high quality, 31 pages)
- **Markdown** → Web documentation (Docusaurus)
- **MyST** → Draft PDFs (quick previews, 15 pages)

## 🚀 Quick Start

```bash
# Production PDF (LaTeX)
npm run pdf:latex

# Draft PDF (MyST)
npm run pdf:myst

# Compare quality
npm run pdf:compare

# Web documentation
npm run dev:docs
```

## 📁 Scripts

### Core Build Tools

#### `build_pdf.py`
Build PDF from Markdown using MyST.

```bash
python3 scripts/myst/build_pdf.py --source whitepaper.md
# Output: public/whitepaper-myst.pdf
```

#### `compare_pdfs.py`
Compare quality between LaTeX and MyST PDFs.

```bash
python3 scripts/myst/compare_pdfs.py \
  --latex public/whitepaper.pdf \
  --myst public/whitepaper-myst.pdf
```

**Metrics:** Page count, file size, equations, typography, citations, structure

### Conversion Tools

#### `convert_latex_to_myst.py`
Convert LaTeX source to MyST Markdown.

```bash
python3 scripts/myst/convert_latex_to_myst.py \
  --input apps/docs/docs/whitepaper.tex \
  --output whitepaper-new.md
```

**Note:** Manual cleanup usually required for complex documents.

#### `frontmatter_parser.py`
Parse and validate YAML frontmatter in Markdown files.

#### `validate_docusaurus.py`
Validate Markdown compatibility with Docusaurus.

```bash
python3 scripts/myst/validate_docusaurus.py
```

## 📊 Current Status

| Format | File | Pages | Size | Quality |
|--------|------|-------|------|---------|
| LaTeX | `public/whitepaper.pdf` | 31 | 407 KB | ⭐⭐⭐⭐⭐ Production |
| MyST | `public/whitepaper-myst.pdf` | 15 | 113 KB | ⭐⭐⭐ Draft (48%) |

**MyST Quality Score:** 0.43/1.00
- Pages: 0.50 (15 vs 31)
- Equations: 0.30 (missing math)
- Citations: 0.30 (missing references)
- Structure: 0.40 (72% content)

## 📝 File Structure

```
human-0.com/
├── apps/docs/docs/
│   ├── whitepaper.tex          # LaTeX source (PDF master)
│   └── posh/
│       └── whitepaper.md       # Docusaurus web version
├── whitepaper.md               # MyST Markdown (working draft)
├── public/
│   ├── whitepaper.pdf          # LaTeX PDF (production)
│   └── whitepaper-myst.pdf     # MyST PDF (draft)
└── scripts/myst/               # Build & conversion tools
```

## 🎯 Which File to Edit?

| Goal | Edit This File | Command |
|------|----------------|---------|
| Production PDF | `apps/docs/docs/whitepaper.tex` | `npm run pdf:latex` |
| Website | `apps/docs/docs/posh/whitepaper.md` | `npm run dev:docs` |
| Quick draft | `whitepaper.md` | `npm run pdf:myst` |

## 🔧 Installation

### MyST CLI

```bash
npm install -g mystmd
# Verify: myst --version
```

### Python Dependencies

```bash
pip install pyyaml PyPDF2
```

### LaTeX (for PDF generation)

```bash
# Ubuntu/Debian
sudo apt-get install texlive-xetex texlive-latex-extra

# macOS
brew install --cask mactex
```

### PDF Utilities (optional)

```bash
sudo apt-get install poppler-utils
```

## 📚 MyST Syntax

### Math

Inline: `$E = mc^2$`

Display:
```
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Citations

```markdown
This is cited {cite}`key2024`.
```

### Admonitions

```markdown
:::{note}
This is a note.
:::
```

### Figures

```markdown
:::{figure} path/to/image.png
:name: fig-label
:width: 80%

Caption text.
:::
```

## 🎯 Use Cases

### Use LaTeX When:
- ✅ Generating production PDFs
- ✅ Academic publications
- ✅ Formal releases
- ✅ Complex diagrams needed

### Use MyST When:
- ✅ Quick PDF previews
- ✅ Draft versions
- ✅ Testing changes

### Use Markdown When:
- ✅ Web documentation
- ✅ Collaborative editing
- ✅ Quick updates

## 🐛 Troubleshooting

### MyST Build Fails
```bash
rm -rf _build/
npm run pdf:myst
```

### LaTeX Build Fails
```bash
cd apps/docs/docs
rm -f *.aux *.log *.out *.toc *.bbl *.blg
npm run pdf:latex
```

### Comparison Tool Issues
```bash
sudo apt-get install poppler-utils
pdfinfo public/whitepaper.pdf
```

## 📖 Documentation

- **Quick Start:** `../../QUICK_START.md`
- **Full Workflow:** `../../HYBRID_WORKFLOW.md`
- **Comparison Findings:** `COMPARISON_FINDINGS.md`
- **Conversion Status:** `CONVERSION_COMPLETE.md`

## 📈 NPM Scripts

```json
{
  "pdf:latex": "Build production PDF from LaTeX",
  "pdf:myst": "Build draft PDF from Markdown",
  "pdf:compare": "Compare PDF quality",
  "convert:latex-to-md": "Convert LaTeX to Markdown"
}
```

## 🔗 Resources

- [MyST Documentation](https://mystmd.org/)
- [MyST Syntax Guide](https://mystmd.org/guide/syntax)
- [Jupyter Book](https://jupyterbook.org/)
- [Docusaurus](https://docusaurus.io/)

---

**Remember:** This is a hybrid approach. Use LaTeX for production, Markdown for web, MyST for drafts!
