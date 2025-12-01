# Whitepaper: LaTeX-First Workflow

## Overview

The HUM∧N-Ø whitepaper uses **LaTeX as the single source of truth**. All other formats (Markdown, PDF, Jupyter Book) are generated from `apps/docs/docs/whitepaper.tex`.

## Why LaTeX First?

1. **Academic Standard**: LaTeX is the gold standard for academic papers and whitepapers
2. **Math Support**: Complex mathematical notation is native to LaTeX
3. **Professional PDF**: LaTeX produces publication-quality PDFs
4. **Single Source**: One file to maintain, multiple outputs generated

## File Structure

```
apps/docs/docs/
├── whitepaper.tex          ← SINGLE SOURCE OF TRUTH (edit this)
├── refs.bib                ← Bibliography
├── whitepaper-from-tex.md  ← Generated Markdown (don't edit)
└── whitepaper.pdf          ← Generated PDF (don't edit)

apps/docs/jupyter_book/
├── _config.yml             ← Jupyter Book config
├── _toc.yml                ← Table of contents
├── intro.md                ← Generated chapters
├── posh.md
└── ...
```

## Workflow

### 1. Edit the LaTeX Source

Edit `apps/docs/docs/whitepaper.tex` with your changes.

**Math Guidelines:**
- Use `\[...\]` for display math (converts to `$$...$$`)
- Use `$...$` for inline math (stays as-is)
- Complex environments like `\begin{cases}` are supported
- Keep math readable - MathJax will render it in Markdown

**Formatting Guidelines:**
- Use `\textbf{}` for bold (converts to `**...**`)
- Use `\textit{}` or `\emph{}` for italic (converts to `*...*`)
- Use `\texttt{}` for code (converts to `` `...` ``)

### 2. Generate Outputs

Run the conversion script:

```bash
python3 scripts/whitepaper/latex_to_markdown_simple.py
```

This generates:
- `apps/docs/docs/whitepaper-from-tex.md` - Markdown for Docusaurus
- Math blocks properly formatted as `$$...$$`
- Basic formatting converted to Markdown

### 3. Build PDF (Optional)

```bash
cd apps/docs/docs
pdflatex whitepaper.tex
bibtex whitepaper
pdflatex whitepaper.tex
pdflatex whitepaper.tex
```

### 4. Build Jupyter Book (Optional)

```bash
cd apps/docs/jupyter_book
jupyter-book build .
```

## Math Conversion Examples

### LaTeX Input

```latex
\[
  \mathsf{humanId} = H(\textsf{IdP.output} \parallel \textsf{salt})
\]
```

### Markdown Output

```markdown
$$

  \mathsf{humanId} = H(\textsf{IdP.output} \parallel \textsf{salt})

$$
```

### Complex Math (cases environment)

```latex
\[
  \textsf{Return } 
  \begin{cases}
  \textsf{valid}, & \mathsf{RWAP} \in \mathsf{Registry} \\
  \textsf{invalid}, & \text{otherwise.}
  \end{cases}
\]
```

This converts cleanly and MathJax renders it properly in Markdown.

## Testing the Conversion

After converting, test the Markdown:

```bash
# Check math blocks
grep -c "^\$\$" apps/docs/docs/whitepaper-from-tex.md

# View first 100 lines
head -100 apps/docs/docs/whitepaper-from-tex.md

# Test with Docusaurus
cd apps/docs
npm run start
```

## Jupyter Book v2 Configuration

The `apps/docs/jupyter_book/_config.yml` is configured for Jupyter Book v2:

```yaml
title: "HUM∧N-Ø Protocol Whitepaper"
author: "Edward Calderón et al."

parse:
  myst_enable_extensions:
    - amsmath        # Math support
    - dollarmath     # $ and $$ delimiters
    - colon_fence    # ::: fences
    - deflist        # Definition lists
    - tasklist       # Task lists

html:
  use_repository_button: true
  use_issues_button: true
  use_download_button: true

sphinx:
  config:
    mathjax_path: https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
```

## Benefits

✅ **Single Source**: Edit only `whitepaper.tex`
✅ **Math Support**: Complex equations work everywhere
✅ **Professional PDF**: LaTeX quality for academic distribution
✅ **Web-Friendly**: Markdown for Docusaurus
✅ **Interactive**: Jupyter Book for web reading
✅ **Version Control**: Text-based, git-friendly

## Troubleshooting

### Math Not Rendering in Docusaurus

- Ensure math blocks use `$$...$$` not `\[...\]`
- Check that MathJax is enabled in Docusaurus config
- Verify no syntax errors in LaTeX math

### Conversion Issues

- Run the conversion script again
- Check for unclosed braces in LaTeX
- Verify the .tex file compiles with pdflatex

### Jupyter Book Build Errors

- Check `_config.yml` syntax
- Ensure all referenced files exist in `_toc.yml`
- Verify MyST extensions are enabled

## Next Steps

1. ✅ LaTeX source is the single source of truth
2. ✅ Conversion script handles math properly
3. ✅ Jupyter Book v2 configured
4. 🔄 Test Docusaurus build
5. 🔄 Verify PDF generation
6. 🔄 Build Jupyter Book HTML

## Related Files

- `scripts/whitepaper/latex_to_markdown_simple.py` - Conversion script
- `.kiro/specs/whitepaper-workflow/` - Full workflow specification
- `apps/docs/jupyter_book/_config.yml` - Jupyter Book configuration
