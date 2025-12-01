#!/usr/bin/env python3
"""
LaTeX to Jupyter Book Builder

Generates Jupyter Book structure with individual chapter files from LaTeX source.
"""

import sys
import subprocess
import yaml
from pathlib import Path
from typing import List, Dict
from latex_parser import LaTeXParser, Chapter
from latex_to_markdown import LaTeXToMarkdownConverter


class JupyterBookBuilder:
    """Builds Jupyter Book from LaTeX source"""
    
    def __init__(self, parser: LaTeXParser, output_dir: str):
        """
        Initialize builder
        
        Args:
            parser: LaTeX parser instance
            output_dir: Base directory for Jupyter Book (e.g., apps/docs/jupyter_book)
        """
        self.parser = parser
        self.output_dir = Path(output_dir)
        self.metadata = parser.extract_metadata()
        self.converter = LaTeXToMarkdownConverter(parser)
    
    def build(self) -> bool:
        """
        Generate complete Jupyter Book structure
        
        Returns:
            True on success
        """
        try:
            print(f"📚 Building Jupyter Book structure...")
            
            # Create output directory
            self.output_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate configuration files
            self.generate_config(self.metadata.__dict__)
            
            # Extract chapters
            chapters = self.parser.extract_chapters()
            
            # Generate chapter files
            self.generate_chapter_files(chapters)
            
            # Generate table of contents
            self.generate_toc(chapters)
            
            # Build HTML
            return self.build_html()
            
        except Exception as e:
            print(f"❌ Jupyter Book build failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def generate_config(self, metadata: Dict) -> None:
        """
        Create _config.yml with book metadata
        
        Args:
            metadata: Dictionary with title, author, etc.
        """
        # Clean up title - handle special characters
        title = metadata.get('title', 'Whitepaper')
        # If title contains special LaTeX, use a clean version
        if 'HUM' in title and 'Protocol' in title:
            title = 'HUM∧N-Ø Protocol Whitepaper'
        
        config = {
            'title': title,
            'author': metadata.get('author', ''),
            'logo': '',
            'execute': {
                'execute_notebooks': 'off'
            },
            'parse': {
                'myst_enable_extensions': [
                    'amsmath',
                    'dollarmath',
                    'colon_fence'
                ]
            },
            'html': {
                'use_repository_button': False,
                'use_issues_button': False,
            },
            'sphinx': {
                'config': {
                    'html_theme': 'sphinx_book_theme',
                    'html_title': title
                }
            }
        }
        
        config_file = self.output_dir / '_config.yml'
        with open(config_file, 'w', encoding='utf-8') as f:
            yaml.dump(config, f, default_flow_style=False, sort_keys=False)
        
        print(f"✅ Generated: {config_file}")
    
    def generate_toc(self, chapters: List[Chapter]) -> None:
        """
        Create _toc.yml with table of contents
        
        Args:
            chapters: List of Chapter objects
        """
        # Build TOC structure
        toc = {
            'format': 'jb-book',
            'root': 'intro',
            'chapters': []
        }
        
        # Track seen filenames to avoid duplicates
        seen_files = set()
        
        for chapter in chapters:
            # Create filename from chapter title
            filename = self._title_to_filename(chapter.title)
            
            # Skip intro (it's the root) and duplicates
            if filename == 'intro' or filename in seen_files:
                continue
            
            seen_files.add(filename)
            toc['chapters'].append({'file': filename})
        
        # Add references at the end if not already present
        if 'references' not in seen_files:
            toc['chapters'].append({'file': 'references'})
        
        toc_file = self.output_dir / '_toc.yml'
        with open(toc_file, 'w', encoding='utf-8') as f:
            yaml.dump(toc, f, default_flow_style=False, sort_keys=False)
        
        print(f"✅ Generated: {toc_file}")
    
    def generate_chapter_files(self, chapters: List[Chapter]) -> None:
        """
        Create individual .md files for each chapter
        
        Args:
            chapters: List of Chapter objects
        """
        # Generate intro page with metadata
        self._generate_intro_page()
        
        # Generate each chapter
        for chapter in chapters:
            filename = self._title_to_filename(chapter.title)
            
            # Skip intro (already generated)
            if filename == 'intro':
                continue
            
            self._generate_chapter_file(chapter, filename)
        
        # Generate references page
        self._generate_references_page()
    
    def _generate_intro_page(self) -> None:
        """Generate the intro.md file with metadata and abstract"""
        parts = []
        
        # Title
        parts.append(f"# {self.metadata.title}")
        parts.append("")
        
        # Metadata
        parts.append(f"**Author:** {self.metadata.author}")
        if self.metadata.version:
            parts.append(f"**Version:** {self.metadata.version}")
        if self.metadata.contact:
            parts.append(f"**Contact:** {self.metadata.contact}")
        parts.append("")
        parts.append("---")
        parts.append("")
        
        # Abstract
        abstract = self.parser.get_abstract()
        if abstract:
            parts.append("## Abstract")
            parts.append("")
            parts.append(self.converter.convert_text_formatting(abstract))
            parts.append("")
        else:
            # If no abstract, add introduction text
            parts.append("## Introduction")
            parts.append("")
            parts.append("This document presents the technical whitepaper for the HUM∧N-Ø Protocol.")
            parts.append("")
        
        intro_file = self.output_dir / 'intro.md'
        with open(intro_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(parts))
        
        print(f"✅ Generated: {intro_file}")
    
    def _generate_chapter_file(self, chapter: Chapter, filename: str) -> None:
        """
        Generate a single chapter file
        
        Args:
            chapter: Chapter object
            filename: Output filename (without extension)
        """
        parts = []
        
        # Chapter title
        parts.append(f"# {chapter.title}")
        parts.append("")
        
        # Convert content
        content = chapter.content
        content = self.converter.convert_text_formatting(content)
        content = self.converter.convert_math(content)
        content = self.converter.convert_lists(content)
        content = self.converter.convert_sections(content)
        content = self.converter.convert_citations(content)
        content = self.converter.convert_figures(content)
        
        # Remove section commands (already converted)
        content = content.replace('\\section', '')
        content = content.replace('\\subsection', '')
        
        parts.append(content)
        
        chapter_file = self.output_dir / f'{filename}.md'
        with open(chapter_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(parts))
        
        print(f"✅ Generated: {chapter_file}")
    
    def _generate_references_page(self) -> None:
        """Generate references.md with bibliography"""
        parts = []
        
        parts.append("# References")
        parts.append("")
        parts.append("## Bibliography")
        parts.append("")
        
        # Get citations used in document
        citations = self.parser.find_citations()
        
        if citations:
            parts.append(f"This document references {len(citations)} sources.")
            parts.append("")
            parts.append("For the complete bibliography, please refer to:")
            parts.append("- The PDF version of this whitepaper")
            parts.append("- The [refs.bib](../docs/refs.bib) file in the repository")
            parts.append("")
        else:
            parts.append("No references found in this document.")
            parts.append("")
        
        refs_file = self.output_dir / 'references.md'
        with open(refs_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(parts))
        
        print(f"✅ Generated: {refs_file}")
    
    def _title_to_filename(self, title: str) -> str:
        """
        Convert chapter title to filename
        
        Args:
            title: Chapter title
            
        Returns:
            Filename (without extension)
        """
        # Special cases
        title_lower = title.lower()
        
        if 'introduction' in title_lower:
            return 'intro'
        elif 'posh' in title_lower or 'proof of sustainable humanity' in title_lower:
            return 'posh'
        elif 'related work' in title_lower:
            return 'related_work'
        elif 'threat model' in title_lower:
            return 'threat_model'
        elif 'universal composability' in title_lower or 'uc' in title_lower:
            return 'uc_model'
        
        # General case: convert to snake_case
        filename = title.lower()
        filename = filename.replace(' ', '_')
        filename = filename.replace('-', '_')
        # Remove special characters
        filename = ''.join(c for c in filename if c.isalnum() or c == '_')
        
        return filename
    
    def build_html(self) -> bool:
        """
        Execute jupyter-book build command
        
        Returns:
            True on success
        """
        try:
            print("🔨 Building Jupyter Book HTML...")
            
            # Jupyter Book 0.x uses simple build command
            result = subprocess.run(
                ['jupyter-book', 'build', str(self.output_dir)],
                capture_output=True,
                text=True,
                check=False
            )
            
            if result.returncode != 0:
                print(f"❌ Jupyter Book build failed:")
                print(result.stderr)
                if result.stdout:
                    print(result.stdout)
                return False
            
            html_dir = self.output_dir / '_build' / 'html'
            print(f"✅ Jupyter Book HTML generated: {html_dir}")
            return True
            
        except FileNotFoundError:
            print("❌ jupyter-book command not found")
            print("Install with: pip install jupyter-book")
            return False
        except Exception as e:
            print(f"❌ Jupyter Book build failed: {e}")
            return False


def main():
    """CLI interface for Jupyter Book building"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Build Jupyter Book from LaTeX whitepaper'
    )
    parser.add_argument(
        '--tex-file',
        default='apps/docs/docs/whitepaper.tex',
        help='Path to LaTeX source file'
    )
    parser.add_argument(
        '--output-dir',
        default='apps/docs/jupyter_book',
        help='Output directory for Jupyter Book'
    )
    
    args = parser.parse_args()
    
    try:
        # Parse LaTeX
        latex_parser = LaTeXParser(args.tex_file)
        
        # Build Jupyter Book
        builder = JupyterBookBuilder(latex_parser, args.output_dir)
        success = builder.build()
        
        return 0 if success else 1
        
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
        return 1
    except Exception as e:
        print(f"❌ Build failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
