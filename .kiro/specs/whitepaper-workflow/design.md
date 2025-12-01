# Design Document: White Paper Workflow System

## Overview

The White Paper Workflow System implements a single-source-of-truth documentation pipeline where `apps/docs/docs/whitepaper.tex` serves as the authoritative source for all white paper content. The system automatically generates multiple output formats (PDF, Markdown, Jupyter Book) through a Python-based build system, ensuring consistency across all documentation while maintaining professional LaTeX quality for academic publications.

The architecture follows a pipeline pattern where the LaTeX source flows through specialized converters to produce format-specific outputs. Each converter is responsible for parsing LaTeX syntax, extracting content and metadata, and transforming it into the target format while preserving semantic meaning and visual fidelity.

## Architecture

### System Components

```
┌─────────────────────────────┐
│  apps/docs/docs/            │
│  whitepaper.tex             │ ← SINGLE SOURCE OF TRUTH
│  refs.bib                   │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  scripts/                    │
│  ├── build_whitepaper.py     │ ← Main orchestrator
│  ├── latex_to_pdf.py         │ ← PDF generator
│  ├── latex_to_markdown.py    │ ← Markdown converter
│  └── latex_to_jupyter.py     │ ← Jupyter Book builder
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Output Artifacts                        │
│  ├── public/whitepaper-latex.pdf         │
│  ├── apps/docs/docs/whitepaper.md        │
│  └── apps/docs/jupyter_book/             │
│      ├── _config.yml                     │
│      ├── _toc.yml                        │
│      ├── intro.md                        │
│      ├── [chapter files].md              │
│      └── _build/html/                    │
└──────────────────────────────────────────┘
```

### Data Flow

1. **Input Stage**: Read LaTeX source and bibliography
2. **Parsing Stage**: Extract structure, metadata, and content
3. **Transformation Stage**: Convert to target formats
4. **Output Stage**: Write files and compile final artifacts

## Components and Interfaces

### 1. Main Build Orchestrator (`build_whitepaper.py`)

**Purpose**: Coordinates the execution of all build scripts in the correct order.

**Interface**:
```python
def main() -> int:
    """
    Execute all build steps.
    Returns: 0 on success, non-zero on failure
    """
    pass

def check_dependencies() -> bool:
    """Verify required tools are installed"""
    pass

def build_pdf() -> bool:
    """Invoke PDF generation"""
    pass

def build_markdown() -> bool:
    """Invoke Markdown conversion"""
    pass

def build_jupyter_book() -> bool:
    """Invoke Jupyter Book generation"""
    pass
```

**Responsibilities**:
- Validate that LaTeX source exists
- Check for required dependencies (pdflatex, bibtex, jupyter-book)
- Execute build scripts in sequence
- Report overall build status
- Handle errors gracefully

### 2. LaTeX Parser Module (`latex_parser.py`)

**Purpose**: Shared parsing utilities for extracting content from LaTeX source.

**Interface**:
```python
class LaTeXParser:
    def __init__(self, tex_file_path: str):
        """Initialize parser with LaTeX file path"""
        pass
    
    def extract_metadata(self) -> dict:
        """
        Extract title, author, date, version from preamble.
        Returns: {'title': str, 'author': str, 'date': str, 'version': str}
        """
        pass
    
    def extract_chapters(self) -> List[dict]:
        """
        Extract all chapters with their content.
        Returns: [{'title': str, 'label': str, 'content': str}, ...]
        """
        pass
    
    def extract_sections(self, chapter_content: str) -> List[dict]:
        """
        Extract sections from chapter content.
        Returns: [{'title': str, 'level': int, 'content': str}, ...]
        """
        pass
    
    def extract_bibliography_entries(self, bib_file_path: str) -> List[dict]:
        """Parse BibTeX file and return citation entries"""
        pass
```

### 3. PDF Generator (`latex_to_pdf.py`)

**Purpose**: Compile LaTeX source to PDF with proper reference resolution.

**Interface**:
```python
def compile_latex_to_pdf(
    tex_file: str,
    output_dir: str,
    clean_aux: bool = True
) -> bool:
    """
    Compile LaTeX to PDF using pdflatex and bibtex.
    
    Args:
        tex_file: Path to .tex file
        output_dir: Directory for output PDF
        clean_aux: Whether to remove auxiliary files
    
    Returns: True on success
    """
    pass

def run_latex_pass(tex_file: str, output_dir: str) -> bool:
    """Execute single pdflatex compilation"""
    pass

def run_bibtex(tex_file: str, output_dir: str) -> bool:
    """Execute bibtex for bibliography"""
    pass

def clean_auxiliary_files(tex_file: str, output_dir: str) -> None:
    """Remove .aux, .log, .out, .toc files"""
    pass
```

**Build Process**:
1. Run pdflatex (first pass - generates .aux)
2. Run bibtex (processes citations)
3. Run pdflatex (second pass - incorporates bibliography)
4. Run pdflatex (third pass - resolves all references)
5. Move PDF to `public/whitepaper-latex.pdf`
6. Clean auxiliary files

### 4. Markdown Converter (`latex_to_markdown.py`)

**Purpose**: Convert LaTeX source to a single Markdown file for web documentation.

**Interface**:
```python
class LaTeXToMarkdownConverter:
    def __init__(self, parser: LaTeXParser):
        """Initialize with LaTeX parser"""
        pass
    
    def convert(self, output_file: str) -> bool:
        """
        Convert entire LaTeX document to Markdown.
        
        Args:
            output_file: Path to output .md file
        
        Returns: True on success
        """
        pass
    
    def convert_text_formatting(self, text: str) -> str:
        """Convert LaTeX formatting commands to Markdown"""
        pass
    
    def convert_math(self, text: str) -> str:
        """Preserve math notation for MathJax"""
        pass
    
    def convert_lists(self, text: str) -> str:
        """Convert itemize/enumerate to Markdown lists"""
        pass
    
    def convert_sections(self, text: str) -> str:
        """Convert section commands to Markdown headers"""
        pass
    
    def convert_citations(self, text: str) -> str:
        """Convert \cite commands to Markdown format"""
        pass
```

**Conversion Rules**:
- `\textbf{text}` → `**text**`
- `\textit{text}` → `*text*`
- `\chapter{Title}` → `# Title`
- `\section{Title}` → `## Title`
- `\subsection{Title}` → `### Title`
- `\begin{itemize}...\end{itemize}` → Markdown unordered list
- `\begin{enumerate}...\end{enumerate}` → Markdown ordered list
- Math environments preserved as-is for MathJax
- `\cite{key}` → `[citation]` with link to references

### 5. Jupyter Book Builder (`latex_to_jupyter.py`)

**Purpose**: Generate Jupyter Book structure with individual chapter files.

**Interface**:
```python
class JupyterBookBuilder:
    def __init__(self, parser: LaTeXParser, output_dir: str):
        """
        Initialize builder.
        
        Args:
            parser: LaTeX parser instance
            output_dir: Base directory for Jupyter Book (e.g., apps/docs/jupyter_book)
        """
        pass
    
    def build(self) -> bool:
        """
        Generate complete Jupyter Book structure.
        Returns: True on success
        """
        pass
    
    def generate_config(self, metadata: dict) -> None:
        """Create _config.yml with book metadata"""
        pass
    
    def generate_toc(self, chapters: List[dict]) -> None:
        """Create _toc.yml with table of contents"""
        pass
    
    def generate_chapter_files(self, chapters: List[dict]) -> None:
        """Create individual .md files for each chapter"""
        pass
    
    def build_html(self) -> bool:
        """Execute jupyter-book build command"""
        pass
```

**File Structure**:
```
apps/docs/jupyter_book/
├── _config.yml          # Book configuration
├── _toc.yml             # Table of contents
├── intro.md             # Introduction chapter
├── posh.md              # PoSH chapter
├── related_work.md      # Related Work chapter
├── threat_model.md      # Threat Model appendix
├── uc_model.md          # UC Specification appendix
├── references.md        # Bibliography
└── _build/
    └── html/            # Generated HTML output
```

### 6. Configuration Files

**`_config.yml`** (Jupyter Book configuration):
```yaml
title: "HUM∧N-Ø Protocol Whitepaper"
author: "Edward Calderón et al."
logo: ""
execute:
  execute_notebooks: off
parse:
  myst_enable_extensions:
    - amsmath
    - dollarmath
html:
  use_repository_button: true
  use_issues_button: true
sphinx:
  config:
    html_theme: sphinx_book_theme
```

**`_toc.yml`** (Table of contents):
```yaml
format: jb-book
root: intro
chapters:
  - file: posh
  - file: related_work
  - file: threat_model
  - file: uc_model
  - file: references
```

## Data Models

### Metadata Structure
```python
@dataclass
class WhitepaperMetadata:
    title: str
    author: str
    date: str
    version: str
    contact: str
```

### Chapter Structure
```python
@dataclass
class Chapter:
    title: str
    label: str
    content: str
    sections: List['Section']
    is_appendix: bool = False
```

### Section Structure
```python
@dataclass
class Section:
    title: str
    level: int  # 1 for section, 2 for subsection, etc.
    content: str
```

### Citation Structure
```python
@dataclass
class Citation:
    key: str
    entry_type: str  # article, book, etc.
    fields: dict  # author, title, year, etc.
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Single source consistency

*For any* LaTeX source file, when all output formats are generated, the content in PDF, Markdown, and Jupyter Book SHALL be semantically equivalent to the LaTeX source.

**Validates: Requirements 1.1, 1.4**

### Property 2: Version synchronization

*For any* version string extracted from the LaTeX `\date{}` command, that version SHALL appear identically in the PDF header, Jupyter Book intro page, and Markdown metadata.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 3: Build idempotency

*For any* unchanged LaTeX source, running the build process multiple times SHALL produce byte-identical output files (excluding timestamps).

**Validates: Requirements 2.1**

### Property 4: Section mapping preservation

*For any* LaTeX chapter or section, there SHALL exist a corresponding Markdown file in the Jupyter Book output with equivalent content.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

### Property 5: Citation completeness

*For any* `\cite{}` command in the LaTeX source, the corresponding citation SHALL appear in the bibliography of all output formats.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 6: Mathematical notation preservation

*For any* LaTeX math environment (`$...$`, `\[...\]`, `\begin{equation}`), the mathematical content SHALL be preserved in a renderable format in all output formats.

**Validates: Requirements 3.7, 9.6**

### Property 7: Formatting conversion correctness

*For any* LaTeX formatting command (`\textbf`, `\textit`, `\section`), the converted Markdown SHALL produce visually equivalent formatting when rendered.

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

### Property 8: Build error reporting

*For any* build failure (missing dependencies, LaTeX errors, file not found), the system SHALL exit with a non-zero status code and display a descriptive error message.

**Validates: Requirements 6.4, 8.4**

### Property 9: Reference resolution completeness

*For any* LaTeX cross-reference (`\ref{}`, `\label{}`), the PDF output SHALL contain the correct reference number or page number.

**Validates: Requirements 6.1, 6.2**

### Property 10: File structure consistency

*For any* successful build, the output files SHALL be placed in their specified locations: PDF in `public/`, Markdown in `apps/docs/docs/`, and Jupyter Book in `apps/docs/jupyter_book/`.

**Validates: Requirements 2.2, 2.3, 2.4, 2.5**

## Error Handling

### LaTeX Compilation Errors

**Strategy**: Capture stderr from pdflatex and parse for error messages.

**Handling**:
- Display line number and error description
- Suggest common fixes (missing packages, syntax errors)
- Preserve .log file for debugging
- Exit with status code 1

### Missing Dependencies

**Strategy**: Check for required tools before build.

**Handling**:
- Test for `pdflatex`, `bibtex`, `jupyter-book` in PATH
- Display installation instructions for missing tools
- Exit with status code 2

### File Not Found Errors

**Strategy**: Validate input files exist before processing.

**Handling**:
- Check for `whitepaper.tex` and `refs.bib`
- Display clear message indicating missing file
- Exit with status code 3

### Conversion Errors

**Strategy**: Catch exceptions during LaTeX parsing and conversion.

**Handling**:
- Log the problematic LaTeX construct
- Attempt graceful degradation (skip or use placeholder)
- Warn user but continue build if possible
- Exit with status code 4 if critical

### Jupyter Book Build Errors

**Strategy**: Capture output from `jupyter-book build` command.

**Handling**:
- Display Jupyter Book error messages
- Check for common issues (invalid YAML, missing files)
- Suggest fixes based on error type
- Exit with status code 5

## Testing Strategy

### Unit Testing

**Framework**: pytest

**Coverage**:
- LaTeX parser functions (metadata extraction, section parsing)
- Conversion functions (formatting, math, lists)
- File I/O operations
- Error handling paths

**Example Tests**:
- `test_extract_version_from_date()`: Verify version extraction from `\date{}`
- `test_convert_textbf_to_markdown()`: Verify bold conversion
- `test_parse_chapter_structure()`: Verify chapter extraction
- `test_handle_missing_tex_file()`: Verify error handling

### Property-Based Testing

**Framework**: Hypothesis (Python property-based testing library)

**Test Configuration**: Minimum 100 iterations per property test

**Property Tests**:

1. **Property 1 Test: Content preservation**
   - Generate random LaTeX text with formatting
   - Convert to Markdown
   - Verify semantic equivalence
   - **Feature: whitepaper-workflow, Property 1: Single source consistency**

2. **Property 2 Test: Version extraction**
   - Generate random version strings in `\date{}` format
   - Extract version
   - Verify it matches expected pattern
   - **Feature: whitepaper-workflow, Property 2: Version synchronization**

3. **Property 3 Test: Build determinism**
   - Run build twice on same input
   - Compare output file hashes (excluding timestamps)
   - Verify they are identical
   - **Feature: whitepaper-workflow, Property 3: Build idempotency**

4. **Property 4 Test: Section mapping**
   - Generate random chapter/section structure
   - Build Jupyter Book
   - Verify all sections have corresponding files
   - **Feature: whitepaper-workflow, Property 4: Section mapping preservation**

5. **Property 5 Test: Citation handling**
   - Generate random BibTeX entries
   - Add citations to LaTeX
   - Build all formats
   - Verify citations appear in all outputs
   - **Feature: whitepaper-workflow, Property 5: Citation completeness**

6. **Property 6 Test: Math preservation**
   - Generate random LaTeX math expressions
   - Convert to Markdown
   - Verify math delimiters are preserved
   - **Feature: whitepaper-workflow, Property 6: Mathematical notation preservation**

7. **Property 7 Test: Formatting conversion**
   - Generate random formatted text
   - Convert to Markdown
   - Verify formatting markers are correct
   - **Feature: whitepaper-workflow, Property 7: Formatting conversion correctness**

### Integration Testing

**Scope**: End-to-end build process

**Tests**:
- Full build from actual `whitepaper.tex`
- Verify all output files are created
- Verify PDF can be opened
- Verify Jupyter Book HTML is valid
- Verify Markdown renders correctly

### Manual Testing

**Checklist**:
- Visual inspection of PDF output
- Navigation testing in Jupyter Book
- Equation rendering in all formats
- Citation links work correctly
- Version numbers match across formats

## Implementation Notes

### LaTeX Parsing Approach

Use regular expressions for simple patterns and a state machine for complex structures like nested environments. Consider using existing libraries like `pylatexenc` for robust LaTeX-to-Unicode conversion.

### Markdown Generation

Use template strings for consistent formatting. Maintain a mapping of LaTeX commands to Markdown equivalents. Handle edge cases like nested formatting carefully.

### Jupyter Book Integration

Leverage Jupyter Book's MyST Markdown parser which supports extended syntax including math, admonitions, and cross-references. Configure Sphinx extensions for enhanced rendering.

### Performance Considerations

- Cache parsed LaTeX structure to avoid re-parsing
- Run LaTeX compilation passes only when necessary
- Use parallel processing for independent conversions
- Implement incremental builds (detect changes)

### Extensibility

Design the system to easily add new output formats:
- Abstract converter interface
- Plugin architecture for format handlers
- Configurable conversion rules
- Format-specific post-processing hooks

## Dependencies

### Python Packages
- `python >= 3.8`
- `jupyter-book >= 0.15.0`
- `pyyaml >= 6.0`
- `pytest >= 7.0` (testing)
- `hypothesis >= 6.0` (property testing)
- `pylatexenc >= 2.10` (LaTeX parsing)

### System Tools
- `pdflatex` (TeX Live or MiKTeX)
- `bibtex` (usually included with LaTeX distribution)
- `git` (for version control)

### Optional Tools
- `pandoc` (alternative conversion path)
- `latexmk` (automated LaTeX compilation)

## Future Enhancements

1. **Incremental Builds**: Only rebuild changed sections
2. **Watch Mode**: Auto-rebuild on file changes
3. **Format Validation**: Verify output quality automatically
4. **Multi-language Support**: Generate translations
5. **Version Archiving**: Keep historical versions
6. **Diff Visualization**: Show changes between versions
7. **CI/CD Integration**: Automated builds on commit
8. **Docker Container**: Reproducible build environment
