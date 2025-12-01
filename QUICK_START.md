# Quick Start Guide - Hybrid Workflow

## 🚀 Common Commands

### Generate Production PDF (LaTeX)
```bash
npm run pdf:latex
```
Output: `public/whitepaper.pdf` (high quality, 31 pages)

### Generate Draft PDF (MyST)
```bash
npm run pdf:myst
```
Output: `public/whitepaper-myst.pdf` (quick preview, 15 pages)

### Compare PDF Quality
```bash
npm run pdf:compare
```
Shows quality comparison between LaTeX and MyST PDFs

### Start Documentation Website
```bash
npm run dev:docs
```
Opens Docusaurus at http://localhost:3000

### Build Documentation Website
```bash
cd apps/docs
npm run build
```

## 📝 Editing Workflows

### For PDF Updates (Production)
1. Edit: `apps/docs/docs/whitepaper.tex`
2. Build: `npm run pdf:latex`
3. Result: `public/whitepaper.pdf`

### For Website Updates
1. Edit: `apps/docs/docs/posh/whitepaper.md`
2. Preview: `npm run dev:docs`
3. Build: `cd apps/docs && npm run build`

### For Quick Drafts
1. Edit: `whitepaper.md` (root level)
2. Build: `npm run pdf:myst`
3. Result: `public/whitepaper-myst.pdf`

## 🎯 Which File to Edit?

| Goal | Edit This File | Command |
|------|----------------|---------|
| Production PDF | `apps/docs/docs/whitepaper.tex` | `npm run pdf:latex` |
| Website | `apps/docs/docs/posh/whitepaper.md` | `npm run dev:docs` |
| Quick draft | `whitepaper.md` | `npm run pdf:myst` |

## 📊 Current Status

- ✅ **LaTeX PDF:** 31 pages, 407 KB (production quality)
- ⚠️ **MyST PDF:** 15 pages, 113 KB (draft quality)
- ✅ **Web Docs:** Fully functional in Docusaurus

## 🔄 Conversion (When Needed)

```bash
npm run convert:latex-to-md
```
Converts LaTeX to Markdown (use sparingly, requires manual cleanup)

## 📚 Full Documentation

See `HYBRID_WORKFLOW.md` for complete details.

## ⚡ Pro Tips

1. **Always use LaTeX for production PDFs** - it's the gold standard
2. **Use Markdown for web** - easier to maintain
3. **Use MyST for quick previews** - fast iteration
4. **Run comparisons regularly** - track quality improvements

## 🆘 Need Help?

- LaTeX errors: Check `apps/docs/docs/whitepaper.log`
- MyST errors: Check `_build/temp/*/whitepaper.log`
- Docusaurus: Check browser console
- Questions: See `HYBRID_WORKFLOW.md`
