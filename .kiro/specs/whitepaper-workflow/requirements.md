# Requirements Document

## Introduction

This document specifies the requirements for implementing a single-source-of-truth white paper workflow system for the HUM∧N-Ø project. The system will use LaTeX as the authoritative source and automatically generate multiple output formats (PDF, Markdown, Jupyter Book) to ensure consistency across all documentation formats while maintaining professional LaTeX quality for academic publications.

## Glossary

- **LaTeX Source**: The authoritative `whitepaper.tex` file located in `apps/docs/docs/` that serves as the single source of truth for all white paper content
- **Build System**: The collection of Python scripts that transform the LaTeX source into various output formats
- **MRV**: Measurement, Reporting, and Verification - a sustainability verification process referenced in the white paper
- **PoSH**: Proof of Sustainable Humanity - the core protocol described in the white paper
- **Jupyter Book**: An open-source tool for building interactive, publication-quality books from computational content
- **Output Formats**: The generated artifacts including PDF, Markdown, and Jupyter Book HTML
- **Bibliography**: The `refs.bib` file containing BibTeX citations used in the white paper
- **Section Mapping**: The process of extracting LaTeX sections and converting them to individual Markdown files for Jupyter Book
- **Version Synchronization**: Ensuring the version number from the LaTeX source appears consistently across all output formats

## Requirements

### Requirement 1

**User Story:** As a documentation maintainer, I want to edit only the LaTeX source file, so that I can maintain consistency across all output formats without manual synchronization.

#### Acceptance Criteria

1. WHEN a user edits `apps/docs/docs/whitepaper.tex` THEN the system SHALL treat this file as the single source of truth for all white paper content
2. WHEN output formats are generated THEN the system SHALL NOT require manual editing of generated Markdown or Jupyter Book files
3. WHEN the LaTeX source is updated THEN the system SHALL regenerate all output formats from the LaTeX source
4. THE system SHALL preserve all LaTeX content including mathematical equations, citations, and formatting during conversion
5. THE system SHALL extract metadata (title, author, version, abstract) from the LaTeX source and propagate it to all output formats

### Requirement 2

**User Story:** As a documentation maintainer, I want to build all output formats with a single command, so that I can efficiently generate consistent documentation across all formats.

#### Acceptance Criteria

1. WHEN a user executes the main build script THEN the system SHALL generate PDF, Markdown, and Jupyter Book outputs in a single operation
2. WHEN the build process completes THEN the system SHALL place the PDF output in `public/whitepaper-latex.pdf`
3. WHEN the build process completes THEN the system SHALL place the Markdown output in `apps/docs/docs/whitepaper.md`
4. WHEN the build process completes THEN the system SHALL place Jupyter Book files in `apps/docs/jupyter_book/` directory
5. WHEN the build process completes THEN the system SHALL generate the Jupyter Book HTML output in `apps/docs/jupyter_book/_build/html/`
6. THE system SHALL provide individual build scripts for generating each format independently

### Requirement 3

**User Story:** As a documentation maintainer, I want LaTeX sections to be automatically mapped to Jupyter Book chapters, so that the book structure reflects the white paper organization.

#### Acceptance Criteria

1. WHEN the system parses the LaTeX source THEN the system SHALL identify all `\section{}` and `\chapter{}` commands
2. WHEN a LaTeX `\chapter{Proof of Sustainable Humanity (PoSH)}` is encountered THEN the system SHALL create a corresponding Markdown file with appropriate content
3. WHEN a LaTeX `\section{Introduction}` is encountered THEN the system SHALL extract the section content to `intro.md`
4. WHEN a LaTeX `\section{Design Principles}` is encountered THEN the system SHALL extract the section content to an appropriately named Markdown file
5. WHEN the system encounters `\bibliography{}` commands THEN the system SHALL generate a `references.md` file
6. THE system SHALL preserve the hierarchical structure of chapters and sections in the Jupyter Book table of contents
7. THE system SHALL convert LaTeX mathematical notation to formats compatible with both Markdown and Jupyter Book rendering

### Requirement 4

**User Story:** As a documentation maintainer, I want version numbers to be synchronized across all formats, so that users always see consistent version information.

#### Acceptance Criteria

1. WHEN the LaTeX source contains a version number in the `\date{}` command THEN the system SHALL extract this version number
2. WHEN the PDF is generated THEN the system SHALL include the extracted version number in the document header
3. WHEN Jupyter Book files are generated THEN the system SHALL include the version number in the intro page
4. WHEN the Markdown file is generated THEN the system SHALL include the version number in the document metadata
5. THE system SHALL support version formats matching the pattern "Version X.Y.Z" where X, Y, and Z are integers

### Requirement 5

**User Story:** As a documentation maintainer, I want citations and bibliography to be handled automatically, so that references remain consistent across all output formats.

#### Acceptance Criteria

1. WHEN the LaTeX source contains `\cite{}` or `\citep{}` commands THEN the system SHALL preserve these citations in the conversion process
2. WHEN the system processes the bibliography THEN the system SHALL read citations from `apps/docs/docs/refs.bib`
3. WHEN generating PDF output THEN the system SHALL compile the bibliography using BibTeX or BibLaTeX
4. WHEN generating Markdown and Jupyter Book outputs THEN the system SHALL convert BibTeX citations to an appropriate format
5. WHEN a new citation is added to `refs.bib` THEN the system SHALL include it in all output formats after rebuild

### Requirement 6

**User Story:** As a documentation maintainer, I want the build system to handle LaTeX compilation dependencies, so that PDFs are generated correctly with all references resolved.

#### Acceptance Criteria

1. WHEN generating a PDF THEN the system SHALL run LaTeX compilation multiple times to resolve all cross-references
2. WHEN the LaTeX source contains `\ref{}` or `\label{}` commands THEN the system SHALL ensure all references are correctly resolved in the PDF
3. WHEN the LaTeX source contains citations THEN the system SHALL run BibTeX to generate the bibliography
4. WHEN LaTeX compilation errors occur THEN the system SHALL report clear error messages indicating the source of the problem
5. THE system SHALL clean up auxiliary LaTeX files (`.aux`, `.log`, `.out`, `.toc`) after successful compilation

### Requirement 7

**User Story:** As a documentation maintainer, I want the Jupyter Book to have proper configuration and styling, so that the web version is professional and navigable.

#### Acceptance Criteria

1. WHEN Jupyter Book is built THEN the system SHALL use a `_config.yml` file to configure book metadata and settings
2. WHEN Jupyter Book is built THEN the system SHALL use a `_toc.yml` file to define the table of contents structure
3. WHEN the Jupyter Book HTML is generated THEN the system SHALL apply consistent styling across all pages
4. WHEN a user views the Jupyter Book THEN the system SHALL provide navigation between chapters and sections
5. THE system SHALL configure Jupyter Book to render mathematical equations using MathJax or similar

### Requirement 8

**User Story:** As a documentation maintainer, I want the build scripts to be written in Python, so that they are cross-platform and maintainable.

#### Acceptance Criteria

1. THE system SHALL implement all build scripts using Python 3.8 or higher
2. THE system SHALL place all build scripts in a `scripts/` directory at the project root
3. WHEN a build script is executed THEN the system SHALL provide clear console output indicating progress
4. WHEN a build script encounters an error THEN the system SHALL exit with a non-zero status code and display an error message
5. THE system SHALL document all required Python dependencies in a requirements file or package configuration

### Requirement 9

**User Story:** As a documentation maintainer, I want to convert LaTeX formatting to Markdown equivalents, so that web-based formats display content correctly.

#### Acceptance Criteria

1. WHEN the system encounters LaTeX `\textbf{}` commands THEN the system SHALL convert them to Markdown bold syntax `**text**`
2. WHEN the system encounters LaTeX `\textit{}` commands THEN the system SHALL convert them to Markdown italic syntax `*text*`
3. WHEN the system encounters LaTeX `\section{}` commands THEN the system SHALL convert them to Markdown headers with appropriate levels
4. WHEN the system encounters LaTeX `\begin{itemize}` environments THEN the system SHALL convert them to Markdown unordered lists
5. WHEN the system encounters LaTeX `\begin{enumerate}` environments THEN the system SHALL convert them to Markdown ordered lists
6. WHEN the system encounters LaTeX math environments (`\[...\]`, `$...$`) THEN the system SHALL preserve them in a format compatible with MathJax rendering
7. WHEN the system encounters LaTeX figures with TikZ diagrams THEN the system SHALL handle them appropriately (either convert or provide placeholders)

### Requirement 10

**User Story:** As a developer, I want comprehensive documentation of the workflow, so that I understand how to use and maintain the system.

#### Acceptance Criteria

1. THE system SHALL provide a README or documentation file explaining the single-source-of-truth workflow
2. THE documentation SHALL include a visual diagram showing the build process flow
3. THE documentation SHALL list all build commands and their purposes
4. THE documentation SHALL explain the file structure and where outputs are generated
5. THE documentation SHALL provide troubleshooting guidance for common issues
6. THE documentation SHALL include examples of common tasks (adding sections, updating versions, adding citations)
