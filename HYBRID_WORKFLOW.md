# Hybrid Documentation Workflow

**Status:** ✅ Active  
**Last Updated:** November 30, 2025

## Overview

This project uses a **hybrid approach** for whitepaper documentation:
- **LaTeX** for high-quality PDF generation
- **Markdown** for web documentation and easy editing

## File Structure

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
└── scripts/myst/               # Conversion & build tools
```

## Workflows

### 📄 For PDF Generation (Production Quality)

**Use LaTeX workflow:**

```bash
# Build from LaTeX source
cd apps/docs/docs
pdflatex whitepaper.tex
bibtex whitepaper
pdflatex whitepaper.tex
pdflatex whitepaper.tex

# Or use existing build script if available
# Output: public/whitepaper.pdf
```

**When to use:**
- Academic publications
- Formal releases
- Conference submissions
- High-quality print versions

### 🌐 For Web Documentation

**Use Markdown workflow:**

```bash
# Edit the Docusaurus version
vim apps/docs/docs/posh/whitepaper.md

# Build Docusaurus site
cd apps/docs
npm run build

# Preview locally
npm run start
```

**When to use:**
- Website updates
- Living documentation
- Quick edits and iterations
- Collaborative editing

### 🔄 For Draft PDFs (Quick Preview)

**Use MyST workflow:**

```bash
# Edit root Markdown
vim whitepaper.md

# Build draft PDF
python3 scripts/myst/build_pdf.py --source whitepaper.md

# Output: public/whitepaper-myst.pdf
```

**When to use:**
- Quick PDF previews
- Internal reviews
- Draft versions
- Testing changes

## Maintenance Strategy

### Primary Sources of Truth

1. **For PDF content:** `apps/docs/docs/whitepaper.tex`
2. **For web content:** `apps/docs/docs/posh/whitepaper.md`
3. **For drafts:** `whitepaper.md` (root level)

### Update Workflow

#### Scenario 1: Major Content Changes

```bash
# 1. Update LaTeX source (for PDF)
vim apps/docs/docs/whitepaper.tex

# 2. Build LaTeX PDF
cd apps/docs/docs
pdflatex whitepaper.tex
bibtex whitepaper
pdflatex whitepaper.tex
pdflatex whitepaper.tex
cp whitepaper.pdf ../../../public/

# 3. Manually sync key changes to web version
vim apps/docs/docs/posh/whitepaper.md

# 4. Optionally update MyST draft
vim whitepaper.md
python3 scripts/myst/build_pdf.py --source whitepaper.md
```

#### Scenario 2: Web-Only Updates

```bash
# Edit Docusaurus version directly
vim apps/docs/docs/posh/whitepaper.md

# Build and deploy
cd apps/docs
npm run build
```

#### Scenario 3: Quick Drafts

```bash
# Edit root Markdown
vim whitepaper.md

# Generate draft PDF
python3 scripts/myst/build_pdf.py --source whitepaper.md
```

## Available Commands

### LaTeX PDF Commands

```bash
# Full LaTeX build
cd apps/docs/docs
pdflatex whitepaper.tex && bibtex whitepaper && pdflatex whitepaper.tex && pdflatex whitepaper.tex

# Copy to public
cp apps/docs/docs/whitepaper.pdf public/
```

### MyST PDF Commands

```bash
# Build from root Markdown
python3 scripts/myst/build_pdf.py --source whitepaper.md

# Build from Docusaurus Markdown
python3 scripts/myst/build_pdf.py --source apps/docs/docs/posh/whitepaper.md

# Compare PDFs
python3 scripts/myst/compare_pdfs.py \
  --latex public/whitepaper.pdf \
  --myst public/whitepaper-myst.pdf
```

### Conversion Commands

```bash
# Convert LaTeX to Markdown (when needed)
python3 scripts/myst/convert_latex_to_myst.py \
  --input apps/docs/docs/whitepaper.tex \
  --output whitepaper-new.md
```

### Docusaurus Commands

```bash
cd apps/docs

# Development server
npm run start

# Production build
npm run build

# Serve production build
npm run serve
```

## Quality Comparison

Run comparison to track PDF quality over time:

```bash
python3 scripts/myst/compare_pdfs.py \
  --latex public/whitepaper.pdf \
  --myst public/whitepaper-myst.pdf \
  --output scripts/myst/comparison_report_$(date +%Y%m%d).txt
```

## NPM Scripts (Recommended)

Add these to your root `package.json`:

```json
{
  "scripts": {
    "pdf:latex": "cd apps/docs/docs && pdflatex whitepaper.tex && bibtex whitepaper && pdflatex whitepaper.tex && pdflatex whitepaper.tex && cp whitepaper.pdf ../../../public/",
    "pdf:myst": "python3 scripts/myst/build_pdf.py --source whitepaper.md",
    "pdf:compare": "python3 scripts/myst/compare_pdfs.py --latex public/whitepaper.pdf --myst public/whitepaper-myst.pdf",
    "docs:dev": "cd apps/docs && npm run start",
    "docs:build": "cd apps/docs && npm run build"
  }
}
```

Then use:

```bash
npm run pdf:latex      # Build production PDF
npm run pdf:myst       # Build draft PDF
npm run pdf:compare    # Compare quality
npm run docs:dev       # Start Docusaurus dev server
npm run docs:build     # Build Docusaurus site
```

## Decision Matrix

| Task | Use LaTeX | Use Markdown | Use MyST |
|------|-----------|--------------|----------|
| Academic publication | ✅ | ❌ | ❌ |
| Website update | ❌ | ✅ | ❌ |
| Quick draft | ❌ | ❌ | ✅ |
| Formal release | ✅ | ❌ | ❌ |
| Collaborative editing | ❌ | ✅ | ✅ |
| Complex diagrams | ✅ | ❌ | ❌ |
| Simple text changes | ❌ | ✅ | ✅ |
| Math-heavy content | ✅ | ⚠️ | ⚠️ |

## Migration Path (Future)

As MyST PDF quality improves:

1. **Phase 1 (Current):** Hybrid approach
   - LaTeX for PDF
   - Markdown for web

2. **Phase 2 (6 months):** Evaluate MyST quality
   - Run regular comparisons
   - Track quality score improvements
   - Test with stakeholders

3. **Phase 3 (12 months):** Consider consolidation
   - If MyST score > 0.85: Consider switching
   - If MyST score < 0.85: Continue hybrid

## Troubleshooting

### LaTeX PDF Issues

```bash
# Clean LaTeX build artifacts
cd apps/docs/docs
rm -f *.aux *.log *.out *.toc *.bbl *.blg

# Rebuild from scratch
pdflatex whitepaper.tex
bibtex whitepaper
pdflatex whitepaper.tex
pdflatex whitepaper.tex
```

### MyST PDF Issues

```bash
# Clean MyST build cache
rm -rf _build/

# Rebuild
python3 scripts/myst/build_pdf.py --source whitepaper.md
```

### Docusaurus Issues

```bash
cd apps/docs

# Clear cache
rm -rf .docusaurus build node_modules/.cache

# Reinstall and rebuild
npm install
npm run build
```

## Best Practices

### ✅ Do

- Keep LaTeX as the PDF master for now
- Use Markdown for web documentation
- Run comparisons regularly to track progress
- Document any manual syncing between versions
- Version control all source files

### ❌ Don't

- Don't try to maintain perfect sync between LaTeX and Markdown
- Don't use MyST PDF for production releases yet
- Don't delete LaTeX source files
- Don't expect automatic conversion to be perfect

## Support

- **LaTeX Issues:** Check `apps/docs/docs/whitepaper.log`
- **MyST Issues:** Check `_build/temp/*/whitepaper.log`
- **Docusaurus Issues:** Check browser console and terminal output
- **Comparison Tool:** `scripts/myst/compare_pdfs.py --help`

## References

- LaTeX source: `apps/docs/docs/whitepaper.tex`
- Web source: `apps/docs/docs/posh/whitepaper.md`
- Draft source: `whitepaper.md`
- Build scripts: `scripts/myst/`
- Comparison reports: `scripts/myst/comparison_report*.txt`

---

**Remember:** This hybrid approach is a pragmatic solution. Use the right tool for each job, and gradually improve the MyST workflow over time.
