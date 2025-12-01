# Implementation Plan: White Paper Workflow System

- [x] 1. Set up project structure and dependencies
  - Create `scripts/` directory at project root if it doesn't exist
  - Create Python package structure with `__init__.py` files
  - Set up `requirements.txt` or add dependencies to `package.json` scripts section
  - Document Python version requirement (3.8+)
  - _Requirements: 8.1, 8.2, 8.5_

- [ ] 2. Implement LaTeX parser module
- [x] 2.1 Create `scripts/latex_parser.py` with LaTeXParser class
  - Implement `__init__` method to load LaTeX file
  - Implement `extract_metadata()` to parse title, author, date, version from preamble
  - Implement `extract_chapters()` to identify and extract chapter content
  - Implement `extract_sections()` to parse section hierarchy
  - Implement `extract_bibliography_entries()` to parse BibTeX file
  - _Requirements: 1.5, 3.1, 4.1_

- [ ]* 2.2 Write property test for metadata extraction
  - **Property 2: Version synchronization**
  - **Validates: Requirements 4.1**

- [ ]* 2.3 Write property test for chapter extraction
  - **Property 4: Section mapping preservation**
  - **Validates: Requirements 3.1**

- [ ]* 2.4 Write unit tests for LaTeX parser
  - Test metadata extraction with sample LaTeX
  - Test chapter and section parsing
  - Test handling of malformed LaTeX
  - _Requirements: 1.5, 3.1_

- [ ] 3. Implement PDF generator
- [x] 3.1 Create `scripts/latex_to_pdf.py` with compilation functions
  - Implement `compile_latex_to_pdf()` main function
  - Implement `run_latex_pass()` to execute pdflatex
  - Implement `run_bibtex()` to process bibliography
  - Implement `clean_auxiliary_files()` to remove temp files
  - Handle compilation errors with clear messages
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 3.2 Write property test for PDF generation
  - **Property 9: Reference resolution completeness**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 3.3 Write property test for bibliography compilation
  - **Property 5: Citation completeness**
  - **Validates: Requirements 5.3, 6.3**

- [ ]* 3.4 Write property test for error handling
  - **Property 8: Build error reporting**
  - **Validates: Requirements 6.4, 8.4**

- [ ]* 3.5 Write unit tests for PDF generator
  - Test successful compilation
  - Test error handling for missing files
  - Test auxiliary file cleanup
  - _Requirements: 6.1, 6.4, 6.5_

- [ ] 4. Implement Markdown converter
- [x] 4.1 Create `scripts/latex_to_markdown.py` with LaTeXToMarkdownConverter class
  - Implement `convert()` main conversion method
  - Implement `convert_text_formatting()` for bold, italic, etc.
  - Implement `convert_math()` to preserve math notation
  - Implement `convert_lists()` for itemize/enumerate
  - Implement `convert_sections()` for headers
  - Implement `convert_citations()` for bibliography references
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ]* 4.2 Write property test for formatting conversion
  - **Property 7: Formatting conversion correctness**
  - **Validates: Requirements 9.1, 9.2, 9.3**

- [ ]* 4.3 Write property test for math preservation
  - **Property 6: Mathematical notation preservation**
  - **Validates: Requirements 3.7, 9.6**

- [ ]* 4.4 Write property test for content preservation
  - **Property 1: Single source consistency**
  - **Validates: Requirements 1.4**

- [ ]* 4.5 Write unit tests for Markdown converter
  - Test bold/italic conversion
  - Test section header conversion
  - Test list conversion
  - Test math preservation
  - Test citation conversion
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 5. Implement Jupyter Book builder
- [x] 5.1 Create `scripts/latex_to_jupyter.py` with JupyterBookBuilder class
  - Implement `__init__` to set up output directory
  - Implement `build()` main orchestration method
  - Implement `generate_config()` to create `_config.yml`
  - Implement `generate_toc()` to create `_toc.yml`
  - Implement `generate_chapter_files()` to create individual .md files
  - Implement `build_html()` to execute jupyter-book build command
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 7.1, 7.2_

- [ ]* 5.2 Write property test for section mapping
  - **Property 4: Section mapping preservation**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

- [ ]* 5.3 Write property test for file structure
  - **Property 10: File structure consistency**
  - **Validates: Requirements 2.4, 2.5**

- [ ]* 5.4 Write unit tests for Jupyter Book builder
  - Test config file generation
  - Test TOC file generation
  - Test chapter file creation
  - Test HTML build execution
  - _Requirements: 3.6, 7.1, 7.2_

- [ ] 6. Implement main build orchestrator
- [x] 6.1 Create `scripts/build_whitepaper.py` with main build logic
  - Implement `check_dependencies()` to verify required tools
  - Implement `build_pdf()` to invoke PDF generation
  - Implement `build_markdown()` to invoke Markdown conversion
  - Implement `build_jupyter_book()` to invoke Jupyter Book generation
  - Implement `main()` to orchestrate all builds
  - Add progress logging and error reporting
  - _Requirements: 2.1, 2.6, 8.3, 8.4_

- [ ]* 6.2 Write property test for build orchestration
  - **Property 3: Build idempotency**
  - **Validates: Requirements 2.1**

- [ ]* 6.3 Write integration test for full build
  - Test complete build process from whitepaper.tex
  - Verify all output files are created
  - Verify file locations are correct
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7. Create Jupyter Book configuration files
- [x] 7.1 Generate `apps/docs/jupyter_book/_config.yml`
  - Set book title, author, and metadata
  - Configure MyST parser extensions for math
  - Configure HTML theme and options
  - Enable repository and issues buttons
  - _Requirements: 7.1, 7.5_

- [x] 7.2 Generate initial `apps/docs/jupyter_book/_toc.yml`
  - Define root page (intro)
  - List all chapter files
  - Maintain hierarchical structure
  - _Requirements: 7.2, 3.6_

- [x] 8. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property tests
  - Fix any failing tests
  - Verify build completes successfully
  - Ask the user if questions arise

- [ ] 9. Create workflow documentation
- [x] 9.1 Create `WHITEPAPER_WORKFLOW.md` documentation file
  - Document the single-source-of-truth concept
  - Include architecture diagram
  - List all build commands
  - Explain file structure
  - Provide troubleshooting guide
  - Include examples of common tasks
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 10. Add convenience scripts and tooling
- [ ] 10.1 Create individual format build scripts
  - Create `scripts/build_pdf_only.py`
  - Create `scripts/build_markdown_only.py`
  - Create `scripts/build_jupyter_only.py`
  - _Requirements: 2.6_

- [x] 10.2 Add npm/package.json scripts for easy invocation
  - Add `"build:whitepaper"` script
  - Add `"build:whitepaper:pdf"` script
  - Add `"build:whitepaper:markdown"` script
  - Add `"build:whitepaper:jupyter"` script
  - _Requirements: 2.1, 2.6_

- [ ] 11. Final integration and validation
- [x] 11.1 Run complete build on actual whitepaper.tex
  - Execute `python scripts/build_whitepaper.py`
  - Verify PDF is generated in `public/whitepaper-latex.pdf`
  - Verify Markdown is generated in `apps/docs/docs/whitepaper.md`
  - Verify Jupyter Book is built in `apps/docs/jupyter_book/_build/html/`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 11.2 Validate output quality
  - Open and inspect PDF for correct formatting
  - Check Markdown renders correctly
  - Navigate Jupyter Book HTML and test links
  - Verify equations render in all formats
  - Verify citations appear in all formats
  - Verify version numbers match across formats
  - _Requirements: 1.4, 3.7, 4.2, 4.3, 4.4, 5.1, 5.3, 5.4_

- [ ] 12. Final Checkpoint - Ensure all tests pass
  - Run full test suite
  - Verify all property tests pass
  - Verify all unit tests pass
  - Verify integration tests pass
  - Ensure all tests pass, ask the user if questions arise
