# MyST PDF Workflow Documentation

## Overview

This workflow enables using Markdown as the single source of truth for the HUMAN-ZERO whitepaper, generating high-quality PDFs using MyST (Markedly Structured Text) and Jupyter Book v2.

## Why MyST?

**Problem:** The current workflow converts LaTeX → Markdown, but Docusaurus struggles with LaTeX-specific syntax (TikZ diagrams, `\begin{}`, `\node`, etc.).

**Solution:** Use Markdown as the source and generate PDFs with MyST, which:
- Supports advanced math rendering
- Generates publication-quality PDFs
- Works natively with Docusaurus
- Eliminates conversion issues

## Architecture

```
┌─────────────────────────────┐
│  apps/docs/docs/            │
│  whitepaper.md              │ ← SINGLE SOURCE OF TRUTH
│  refs.bib                   │
└──────────┬──────────────────┘
           │
           ├─────────────────────────┐
           │                         │
           ▼                         ▼
┌──────────────────────┐   ┌──────────────────────┐
│  MyST PDF Pipeline   │   │  Docusaurus Build    │
│  ├── myst.yml        │   │  ├── docusaurus.config│
│  ├── PDF template    │   │  └── Web rendering   │
│  └── LaTeX backend   │   └──────────┬───────────┘
└──────────┬───────────┘              │
           │                          │
           ▼                          ▼
┌──────────────────────┐   ┌──────────────────────┐
│  public/             │   │  Web Output          │
│  whitepaper-myst.pdf │   │  (Docusaurus site)   │
└──────────────────────┘   └──────────────────────┘
```

## Installation

### 1. Install MyST CLI

```bash
npm install -g mystmd
```

Verify:
```bash
myst --version  # Should show v1.6.6 or higher
```

### 2. Install XeLaTeX (Required for PDF generation)

**Ubuntu/Debian:**
```bash
sudo apt-get install texlive-xetex texlive-fonts-recommended texlive-fonts-extra
```

**macOS:**
```bash
brew install --cask mactex
```

**Verify:**
```bash
xelatex --version
```

See `INSTALL_XELATEX.md` for detailed instructions.

### 3. Install Python Dependencies (Optional)

For comparison and validation scripts:
```bash
pip install pyyaml
```

## Configuration

### myst.yml

The `myst.yml` file at the project root configures MyST:

```yaml
version: 1
project:
  title: "HUMAN-ZERO Protocol Whitepaper"
  authors:
    - name: "Edward Calderón et al."
  date: 2025-11-30
  
exports:
  - format: pdf
    template: arxiv_two_column
    output: public/whitepaper-myst.pdf
    
bibliography:
  - apps/docs/docs/refs.bib
```

### Markdown Frontmatter

Add YAML frontmatter to your Markdown files:

```yaml
---
title: 'HUMAN-ZERO Protocol Whitepaper'
author: 'Edward Calderón et al.'
date: '2025-11-30'
version: '1.0.0'
keywords:
  - sustainability
  - blockchain
---
```

## Usage

### Build PDF

```bash
# Using Python script (recommended)
python3 scripts/myst/build_pdf.py

# Or using npm script
npm run build:pdf:myst

# Or directly with MyST CLI
myst build apps/docs/docs/whitepaper.md --pdf
```

### Extract and Sync Metadata

```bash
# Print frontmatter metadata
python3 scripts/myst/frontmatter_parser.py apps/docs/docs/whitepaper.md --print

# Sync frontmatter to myst.yml
python3 scripts/myst/frontmatter_parser.py apps/docs/docs/whitepaper.md --sync myst.yml
```

### Compare PDF Quality

```bash
# Compare MyST PDF with LaTeX PDF
python3 scripts/myst/compare_pdfs.py

# Save report to file
python3 scripts/myst/compare_pdfs.py --output comparison-report.txt
```

### Validate Docusaurus Compatibility

```bash
# Check Markdown compatibility
python3 scripts/myst/validate_docusaurus.py apps/docs/docs/whitepaper.md

# Test with full Docusaurus build
python3 scripts/myst/validate_docusaurus.py apps/docs/docs/whitepaper.md --test-build
```

## MyST Syntax Guide

### Math

**Inline math:**
```markdown
The equation $E = mc^2$ is famous.
```

**Display math:**
```markdown
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

**Math blocks:**
````markdown
```math
\mathsf{humanId} = H(\textsf{IdP.output} \parallel \textsf{salt})
```
````

### Citations

MyST supports BibTeX citations:

```markdown
This is a cited statement {cite}`key2024`.
```

For Docusaurus compatibility, use standard Markdown links:

```markdown
This is a cited statement [1](#ref-key2024).
```

### Admonitions

```markdown
:::{note}
This is a note admonition.
:::

:::{warning}
This is a warning.
:::
```

For Docusaurus, use:

```markdown
:::note
This is a note admonition.
:::
```

### Figures

```markdown
:::{figure} path/to/image.png
:name: fig-label
:width: 80%

Caption text here.
:::
```

### Cross-references

```markdown
See {ref}`fig-label` for details.
```

### Tables

Standard Markdown tables work in both MyST and Docusaurus:

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## Converting from LaTeX

### Issues to Address

1. **TikZ Diagrams** - Convert to:
   - PNG/SVG images
   - Mermaid diagrams
   - HTML/CSS diagrams

2. **LaTeX Commands** - Remove or convert:
   - `\begin{}` / `\end{}` → Use MyST directives
   - `\node[]` → Convert to images
   - `\caption{}` → Use MyST figure syntax
   - `\label{}` / `\ref{}` → Use MyST cross-references

3. **Math Environments** - Convert:
   - `\[...\]` → `$$...$$`
   - `\(...\)` → `$...$`
   - `\begin{equation}` → `$$` with labels

### Conversion Example

**LaTeX:**
```latex
\begin{figure}[h!]
  \centering
  \includegraphics{diagram.png}
  \caption{System architecture}
  \label{fig:arch}
\end{figure}

See Figure~\ref{fig:arch} for details.
```

**MyST:**
```markdown
:::{figure} diagram.png
:name: fig-arch
:width: 80%

System architecture
:::

See {ref}`fig-arch` for details.
```

**Docusaurus-compatible:**
```markdown
![System architecture](diagram.png)

See the figure above for details.
```

## Troubleshooting

### PDF Generation Fails

**Error:** `xelatex: not found`

**Solution:** Install XeLaTeX (see Installation section)

### Math Not Rendering

**MyST:** Ensure `dollarmath` and `amsmath` are enabled in `myst.yml`:

```yaml
parse:
  myst_enable_extensions:
    - amsmath
    - dollarmath
```

**Docusaurus:** Ensure KaTeX or MathJax is configured in `docusaurus.config.js`:

```javascript
module.exports = {
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};
```

### Docusaurus Build Errors

**Error:** `MDX compilation failed`

**Cause:** LaTeX-specific syntax in Markdown

**Solution:** Run the validator to identify issues:

```bash
python3 scripts/myst/validate_docusaurus.py apps/docs/docs/whitepaper.md
```

Then remove or convert LaTeX syntax.

### Citations Not Working

**MyST:** Ensure bibliography file is configured in `myst.yml`:

```yaml
bibliography:
  - apps/docs/docs/refs.bib
```

**Docusaurus:** Use standard Markdown links instead of `{cite}` syntax.

## Best Practices

### 1. Use MyST-Compatible Syntax

Write Markdown that works in both MyST and Docusaurus:
- Use `$...$` and `$$...$$` for math
- Use standard Markdown tables
- Avoid MyST-specific directives when possible
- Use images instead of TikZ diagrams

### 2. Test Both Outputs

Always test that your Markdown:
- Generates a good PDF with MyST
- Renders correctly in Docusaurus

```bash
# Test PDF
python3 scripts/myst/build_pdf.py

# Test Docusaurus
python3 scripts/myst/validate_docusaurus.py --test-build
```

### 3. Keep Metadata Synced

Sync frontmatter to `myst.yml` after updates:

```bash
python3 scripts/myst/frontmatter_parser.py apps/docs/docs/whitepaper.md --sync myst.yml
```

### 4. Version Control

Commit both the Markdown source and generated PDF:
- `apps/docs/docs/whitepaper.md` - Source
- `public/whitepaper-myst.pdf` - Generated PDF
- `myst.yml` - Configuration

### 5. Quality Checks

Before publishing, run quality comparison:

```bash
python3 scripts/myst/compare_pdfs.py
```

Review the report and ensure MyST PDF quality meets your standards.

## Workflow Summary

1. **Edit** `apps/docs/docs/whitepaper.md` (single source)
2. **Sync** metadata: `python3 scripts/myst/frontmatter_parser.py ... --sync myst.yml`
3. **Build PDF**: `python3 scripts/myst/build_pdf.py`
4. **Validate**: `python3 scripts/myst/validate_docusaurus.py ...`
5. **Compare**: `python3 scripts/myst/compare_pdfs.py`
6. **Commit** changes

## Resources

- [MyST Documentation](https://mystmd.org/)
- [MyST Syntax Guide](https://mystmd.org/guide/syntax)
- [Jupyter Book](https://jupyterbook.org/)
- [MyST PDF Export](https://mystmd.org/guide/creating-pdf-documents)
- [Docusaurus Math Support](https://docusaurus.io/docs/markdown-features/math-equations)

## Support

For issues or questions:
1. Check `scripts/myst/STATUS.md` for current status
2. Review `scripts/myst/README.md` for quick reference
3. Run validation scripts to diagnose issues
4. Check MyST documentation for syntax questions
