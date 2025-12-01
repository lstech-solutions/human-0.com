# Design Document: MyST PDF Workflow System

## Overview

The MyST PDF Workflow System implements a Markdown-first documentation pipeline where `apps/docs/docs/whitepaper.md` serves as the single source of truth for all white paper content. The system leverages Jupyter Book v2 with MyST (Markedly Structured Text) to generate high-quality PDF output comparable to traditional LaTeX compilation, while maintaining full compatibility with Docusaurus for web documentation.

The architecture follows a dual-output pattern where the Markdown source is processed by two independent rendering systems: MyST for PDF generation and Docusaurus for web documentation. The design ensures that MyST-specific syntax degrades gracefully in Docusaurus, allowing a single source file to serve both purposes without modification.

## Architecture

### System Components

```
┌─────────────────────────────┐
│  apps/docs/docs/            │
│  whitepaper.md              │ ← SINGLE SOURCE OF TRUTH
│  refs.bib (or refs.json)    │
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

### Data Flow

1. **Input Stage**: Read Markdown source and bibliography
2. **Dual Processing**: 
   - MyST: Parse MyST syntax, generate LaTeX, compile to PDF
   - Docusaurus: Parse Markdown, render to HTML
3. **Output Stage**: PDF artifact and web documentation

## Components and Interfaces

### 1. MyST Configuration (`myst.yml`)

**Purpose**: Configure MyST project settings, PDF export options, and metadata.

**Structure**:
```yaml
version: 1
project:
  title: "HUM∧N-Ø Protocol Whitepaper"
  authors:
    - name: "Edward Calderón"
  keywords:
    - sustainability
    - blockchain
    - verification
  github: https://github.com/human-zero/human-zero
  
site:
  template: book-theme
  
exports:
  - format: pdf
    template: arxiv_two_column
    output: public/whitepaper-myst.pdf
    
math:
  macros:
    # Custom LaTeX macros if needed
    
bibliography:
  - refs.bib
```

### 2. PDF Build Script (`scripts/myst/build_pdf.py`)

**Purpose**: Orchestrate MyST PDF generation with error handling and validation.

**Interface**:
```python
def main() -> int:
    """
    Execute MyST PDF build.
    Returns: 0 on success, non-zero on failure
    """
    pass

def check_dependencies() -> bool:
    """Verify MyST CLI and required tools are installed"""
    pass

def validate_markdown() -> bool:
    """Check Markdown source exists and is valid"""
    pass

def build_pdf() -> bool:
    """Execute myst build --pdf command"""
    pass

def verify_output() -> bool:
    """Confirm PDF was generated in correct location"""
    pass
```

**Build Process**:
1. Check for `myst` CLI tool
2. Validate `whitepaper.md` exists
3. Execute `myst build --pdf`
4. Move PDF to `public/whitepaper-myst.pdf`
5. Report success/failure

### 3. Quality Comparison Tool (`scripts/myst/compare_pdfs.py`)

**Purpose**: Compare MyST-generated PDF with existing LaTeX PDF to validate quality.

**Interface**:
```python
class PDFComparator:
    def __init__(self, latex_pdf: str, myst_pdf: str):
        """Initialize with paths to both PDFs"""
        pass
    
    def compare(self) -> dict:
        """
        Run all comparison checks.
        Returns: {'equations': score, 'typography': score, ...}
        """
        pass
    
    def compare_equations(self) -> float:
        """Evaluate math rendering quality (0-1 score)"""
        pass
    
    def compare_typography(self) -> float:
        """Evaluate font, spacing, layout quality"""
        pass
    
    def compare_citations(self) -> float:
        """Evaluate bibliography formatting"""
        pass
    
    def compare_structure(self) -> float:
        """Evaluate document organization"""
        pass
    
    def generate_report(self, scores: dict) -> str:
        """Create human-readable comparison report"""
        pass
```

**Comparison Metrics**:
- Equation rendering: Extract and compare math expressions
- Typography: Analyze font usage, line spacing, margins
- Citations: Count and format check bibliography entries
- Structure: Compare section hierarchy and page layout
- Overall score: Weighted average of all metrics

### 4. Docusaurus Compatibility Validator (`scripts/myst/validate_docusaurus.py`)

**Purpose**: Ensure Markdown source builds successfully in Docusaurus.

**Interface**:
```python
def validate_docusaurus_build() -> bool:
    """
    Test that Docusaurus can build the Markdown source.
    Returns: True if build succeeds
    """
    pass

def check_myst_syntax_compatibility() -> List[str]:
    """
    Identify MyST syntax that may not render in Docusaurus.
    Returns: List of warnings
    """
    pass

def test_math_rendering() -> bool:
    """Verify math expressions work in Docusaurus"""
    pass

def test_citations() -> bool:
    """Verify citations render in Docusaurus"""
    pass
```

### 5. Markdown Frontmatter Handler

**Purpose**: Extract and validate metadata from Markdown frontmatter.

**Interface**:
```python
class FrontmatterParser:
    def __init__(self, md_file: str):
        """Initialize with Markdown file path"""
        pass
    
    def extract_metadata(self) -> dict:
        """
        Parse YAML frontmatter.
        Returns: {'title': str, 'author': str, 'version': str, ...}
        """
        pass
    
    def validate_required_fields(self) -> bool:
        """Ensure required metadata fields are present"""
        pass
    
    def sync_to_myst_config(self, myst_yml: str) -> None:
        """Update myst.yml with frontmatter metadata"""
        pass
```

**Expected Frontmatter**:
```yaml
---
title: "HUM∧N-Ø Protocol Whitepaper"
author: "Edward Calderón et al."
version: "1.0.0"
date: "2024-01-15"
abstract: |
  Brief description of the whitepaper content.
keywords:
  - sustainability
  - blockchain
---
```

## Data Models

### Metadata Structure
```python
@dataclass
class WhitepaperMetadata:
    title: str
    author: str
    version: str
    date: str
    abstract: str
    keywords: List[str]
    contact: Optional[str] = None
```

### Build Configuration
```python
@dataclass
class MystBuildConfig:
    source_file: str
    output_file: str
    template: str
    bibliography: str
    custom_latex: Optional[str] = None
```

### Comparison Result
```python
@dataclass
class PDFComparisonResult:
    equation_score: float
    typography_score: float
    citation_score: float
    structure_score: float
    overall_score: float
    warnings: List[str]
    recommendations: List[str]
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Build regeneration consistency

*For any* Markdown source file, when the source is modified and the build is executed, the PDF output SHALL be regenerated with the updated content.

**Validates: Requirements 1.2**

### Property 2: Content preservation

*For any* Markdown content including equations, citations, and formatting, the generated PDF SHALL contain semantically equivalent content.

**Validates: Requirements 1.3**

### Property 3: Dual compatibility

*For any* Markdown source file, both MyST PDF build and Docusaurus build SHALL complete successfully without errors.

**Validates: Requirements 1.4**

### Property 4: Metadata propagation

*For any* metadata field in the Markdown frontmatter (title, author, version), that metadata SHALL appear in the generated PDF.

**Validates: Requirements 1.5**

### Property 5: Configuration customization

*For any* PDF styling configuration change in `myst.yml`, the generated PDF SHALL reflect that change.

**Validates: Requirements 2.5, 5.2, 5.5**

### Property 6: MyST syntax graceful degradation

*For any* MyST-specific syntax in the Markdown, Docusaurus SHALL either render it correctly or ignore it without build errors.

**Validates: Requirements 4.2**

### Property 7: Math rendering dual compatibility

*For any* mathematical expression in the Markdown, both MyST PDF and Docusaurus web output SHALL render it successfully.

**Validates: Requirements 4.3, 7.1, 7.2, 7.3**

### Property 8: Citation dual rendering

*For any* citation in the Markdown source, both PDF and web outputs SHALL include the citation.

**Validates: Requirements 4.4, 6.1, 6.4, 6.5**

### Property 9: Configuration metadata inclusion

*For any* metadata field in `myst.yml` configuration (title, author, version), that metadata SHALL appear in the generated PDF.

**Validates: Requirements 5.3**

### Property 10: LaTeX preamble application

*For any* custom LaTeX preamble specified in the configuration, the PDF output SHALL reflect the effects of that preamble.

**Validates: Requirements 5.4**

### Property 11: MyST directive rendering

*For any* MyST directive (admonitions, figures, cross-references, code blocks), both PDF and web outputs SHALL render it appropriately.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 12: Build error reporting

*For any* build failure, the system SHALL exit with a non-zero status code and display a descriptive error message.

**Validates: Requirements 9.2, 9.3**

## Error Handling

### MyST CLI Not Found

**Strategy**: Check for `myst` command before build.

**Handling**:
- Test for `myst` in PATH
- Display installation instructions: `npm install -g mystmd`
- Exit with status code 2

### Invalid Markdown Syntax

**Strategy**: Capture MyST parser errors.

**Handling**:
- Display line number and syntax error
- Suggest corrections for common issues
- Exit with status code 1

### Missing Bibliography File

**Strategy**: Validate bibliography file exists.

**Handling**:
- Check for `refs.bib` or `refs.json`
- Display clear message indicating missing file
- Exit with status code 3

### PDF Generation Failure

**Strategy**: Capture LaTeX compilation errors from MyST backend.

**Handling**:
- Display LaTeX error messages
- Preserve intermediate files for debugging
- Suggest common fixes
- Exit with status code 4

### Docusaurus Build Failure

**Strategy**: Run Docusaurus build and capture errors.

**Handling**:
- Display Docusaurus error messages
- Identify incompatible MyST syntax
- Suggest workarounds or alternatives
- Exit with status code 5

## Testing Strategy

### Unit Testing

**Framework**: pytest

**Coverage**:
- Frontmatter parsing
- Metadata extraction and validation
- Configuration file generation
- Error handling paths

**Example Tests**:
- `test_extract_frontmatter()`: Verify metadata extraction
- `test_validate_required_fields()`: Verify validation logic
- `test_handle_missing_myst_cli()`: Verify error handling
- `test_sync_metadata_to_config()`: Verify config updates

### Property-Based Testing

**Framework**: Hypothesis (Python property-based testing library)

**Test Configuration**: Minimum 100 iterations per property test

**Property Tests**:

1. **Property 1 Test: Build regeneration**
   - Modify Markdown source
   - Run build
   - Verify PDF is updated
   - **Feature: myst-pdf-workflow, Property 1: Build regeneration consistency**

2. **Property 2 Test: Content preservation**
   - Generate random Markdown content
   - Build PDF
   - Verify content appears in PDF
   - **Feature: myst-pdf-workflow, Property 2: Content preservation**

3. **Property 3 Test: Dual build success**
   - Generate valid Markdown
   - Run both MyST and Docusaurus builds
   - Verify both succeed
   - **Feature: myst-pdf-workflow, Property 3: Dual compatibility**

4. **Property 4 Test: Metadata propagation**
   - Generate random metadata
   - Build PDF
   - Verify metadata in PDF
   - **Feature: myst-pdf-workflow, Property 4: Metadata propagation**

5. **Property 5 Test: Configuration effects**
   - Modify configuration
   - Build PDF
   - Verify changes reflected
   - **Feature: myst-pdf-workflow, Property 5: Configuration customization**

6. **Property 6 Test: MyST syntax degradation**
   - Use MyST-specific syntax
   - Build with Docusaurus
   - Verify no errors
   - **Feature: myst-pdf-workflow, Property 6: MyST syntax graceful degradation**

7. **Property 7 Test: Math dual rendering**
   - Generate random math expressions
   - Build both outputs
   - Verify math in both
   - **Feature: myst-pdf-workflow, Property 7: Math rendering dual compatibility**

8. **Property 8 Test: Citation dual rendering**
   - Add citations to Markdown
   - Build both outputs
   - Verify citations in both
   - **Feature: myst-pdf-workflow, Property 8: Citation dual rendering**

### Integration Testing

**Scope**: End-to-end build process

**Tests**:
- Full build from actual `whitepaper.md`
- Verify PDF is created in correct location
- Verify PDF can be opened
- Verify Docusaurus build succeeds
- Compare PDF quality with LaTeX version

### Manual Testing

**Checklist**:
- Visual inspection of PDF output
- Equation rendering quality assessment
- Typography and layout review
- Citation formatting verification
- Comparison with LaTeX PDF

## Implementation Notes

### MyST Installation

MyST CLI can be installed via npm:
```bash
npm install -g mystmd
```

Or using pip:
```bash
pip install mystmd
```

### MyST Syntax Compatibility

Most MyST syntax is compatible with standard Markdown processors:
- Math: `$inline$` and `$$display$$` work in most renderers
- Directives: Use HTML comments for MyST-only features
- Cross-references: Degrade to plain text in Docusaurus

### PDF Template Selection

MyST provides several templates:
- `arxiv_two_column`: Academic paper format
- `plain_latex_book`: Book-style layout
- `plain_latex_article`: Article format
- Custom templates can be created

### Performance Considerations

- MyST PDF generation typically takes 5-15 seconds
- Caching can speed up repeated builds
- Large documents may require more memory

### Extensibility

The system can be extended to:
- Support multiple PDF templates
- Generate additional formats (EPUB, DOCX)
- Integrate with CI/CD pipelines
- Add automated quality checks

## Dependencies

### Node.js Packages
- `mystmd >= 1.1.0` (MyST CLI)

### Python Packages (for scripts)
- `python >= 3.8`
- `pyyaml >= 6.0`
- `pytest >= 7.0` (testing)
- `hypothesis >= 6.0` (property testing)
- `PyPDF2 >= 3.0` (PDF comparison)

### System Tools
- `node >= 18.0` (for MyST CLI)
- `pdflatex` (used by MyST backend)
- `git` (for version control)

## Future Enhancements

1. **Automated Quality Scoring**: Quantitative PDF quality metrics
2. **Template Library**: Collection of custom PDF templates
3. **Watch Mode**: Auto-rebuild on file changes
4. **CI/CD Integration**: Automated builds and comparisons
5. **Multi-format Export**: EPUB, DOCX, HTML from same source
6. **Version Comparison**: Track quality changes over time
7. **Accessibility Checks**: Ensure PDF meets accessibility standards
8. **Collaborative Review**: Tools for comparing and annotating PDFs
