#!/usr/bin/env python3
"""
LaTeX to Markdown Converter

Converts LaTeX whitepaper to Markdown format for web documentation.
"""

import re
import sys
from pathlib import Path
from typing import Optional
from latex_parser import LaTeXParser, WhitepaperMetadata


class LaTeXToMarkdownConverter:
    """Converts LaTeX documents to Markdown"""
    
    def __init__(self, parser: LaTeXParser):
        """
        Initialize with LaTeX parser
        
        Args:
            parser: LaTeXParser instance
        """
        self.parser = parser
        self.metadata = parser.extract_metadata()
    
    def convert(self, output_file: str) -> bool:
        """
        Convert entire LaTeX document to Markdown
        
        Args:
            output_file: Path to output .md file
            
        Returns:
            True on success
        """
        try:
            print(f"📝 Converting LaTeX to Markdown...")
            
            # Build markdown content
            md_content = self._build_markdown()
            
            # Post-process for MDX compatibility
            md_content = self._make_mdx_safe(md_content)
            
            # Write to file
            output_path = Path(output_file)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(md_content)
            
            print(f"✅ Markdown generated: {output_path}")
            return True
            
        except Exception as e:
            print(f"❌ Markdown conversion failed: {e}")
            return False
    
    def _make_mdx_safe(self, text: str) -> str:
        """
        Make the markdown safe for MDX by escaping problematic characters
        
        Args:
            text: Markdown text
            
        Returns:
            MDX-safe markdown
        """
        # Protect code blocks from escaping
        code_blocks = []
        
        # Save all code blocks (```...```)
        def save_code_block(match):
            code_blocks.append(match.group(0))
            return f'___CODE_BLOCK_{len(code_blocks)-1}___'
        text = re.sub(r'```.*?```', save_code_block, text, flags=re.DOTALL)
        
        # Save inline code (`...`)
        def save_inline_code(match):
            code_blocks.append(match.group(0))
            return f'___CODE_BLOCK_{len(code_blocks)-1}___'
        text = re.sub(r'`[^`]+`', save_inline_code, text)
        
        # Count braces before
        brace_count_before = text.count('{')
        
        # Now escape ALL curly braces for MDX (including those in inline math)
        text = text.replace('{', '\\{')
        text = text.replace('}', '\\}')
        
        # Count escaped braces after
        escaped_count = text.count('\\{')
        print(f"Escaped {escaped_count} opening braces (was {brace_count_before})")
        
        # Restore all protected blocks
        for i, block in enumerate(code_blocks):
            text = text.replace(f'___CODE_BLOCK_{i}___', block)
        
        return text
    
    def _build_markdown(self) -> str:
        """Build complete Markdown document"""
        parts = []
        
        # Add frontmatter
        parts.append(self._generate_frontmatter())
        parts.append("")
        
        # Add title and metadata
        parts.append(f"# {self.metadata.title}")
        parts.append("")
        parts.append(f"**Author:** {self.metadata.author}")
        if self.metadata.version:
            parts.append(f"**Version:** {self.metadata.version}")
        if self.metadata.contact:
            parts.append(f"**Contact:** {self.metadata.contact}")
        parts.append("")
        parts.append("---")
        parts.append("")
        
        # Add abstract if present
        abstract = self.parser.get_abstract()
        if abstract:
            parts.append("## Abstract")
            parts.append("")
            parts.append(self.convert_text_formatting(abstract))
            parts.append("")
        
        # Add chapters
        chapters = self.parser.extract_chapters()
        for chapter in chapters:
            parts.append(self._convert_chapter(chapter))
            parts.append("")
        
        # Add references section
        citations = self.parser.find_citations()
        if citations:
            parts.append("## References")
            parts.append("")
            parts.append("See bibliography in the PDF version or [refs.bib](refs.bib) file.")
            parts.append("")
        
        return "\n".join(parts)
    
    def _generate_frontmatter(self) -> str:
        """Generate YAML frontmatter for Markdown"""
        frontmatter = [
            "---",
            f"title: '{self.metadata.title}'",
            f"author: '{self.metadata.author}'",
        ]
        
        if self.metadata.version:
            frontmatter.append(f"version: '{self.metadata.version}'")
        
        if self.metadata.date:
            frontmatter.append(f"date: '{self.metadata.date}'")
        
        frontmatter.append("---")
        
        return "\n".join(frontmatter)
    
    def _convert_chapter(self, chapter) -> str:
        """Convert a chapter to Markdown"""
        parts = []
        
        # Chapter title (level 2 heading)
        parts.append(f"## {chapter.title}")
        parts.append("")
        
        # Convert chapter content
        content = self.convert_text_formatting(chapter.content)
        content = self.convert_math(content)
        content = self.convert_lists(content)
        content = self.convert_sections(content)
        content = self.convert_citations(content)
        
        parts.append(content)
        
        return "\n".join(parts)
    
    def convert_text_formatting(self, text: str) -> str:
        """
        Convert LaTeX formatting commands to Markdown
        
        Args:
            text: LaTeX text
            
        Returns:
            Markdown text
        """
        # Bold: \textbf{text} -> **text**
        text = re.sub(r'\\textbf\{([^}]+)\}', r'**\1**', text)
        
        # Italic: \textit{text} -> *text*
        text = re.sub(r'\\textit\{([^}]+)\}', r'*\1*', text)
        
        # Emphasis: \emph{text} -> *text*
        text = re.sub(r'\\emph\{([^}]+)\}', r'*\1*', text)
        
        # Typewriter: \texttt{text} -> `text`
        text = re.sub(r'\\texttt\{([^}]+)\}', r'`\1`', text)
        
        # Remove size commands
        text = re.sub(r'\\(?:Large|large|small|footnotesize|tiny)', '', text)
        
        # Special characters
        text = re.sub(r'\\Lambda', 'Λ', text)
        text = re.sub(r'\\&', '&', text)
        text = re.sub(r'\\%', '%', text)
        text = re.sub(r'\\_', '_', text)
        text = re.sub(r'\\#', '#', text)
        text = re.sub(r'\\\$', '$', text)
        
        # Remove LaTeX commands that don't have Markdown equivalents
        text = re.sub(r'\\addcontentsline\{[^}]+\}\{[^}]+\}\{[^}]+\}', '', text)
        text = re.sub(r'\\clearpage', '', text)
        text = re.sub(r'\\newpage', '', text)
        text = re.sub(r'\\noindent', '', text)
        text = re.sub(r'\\medskip', '', text)
        text = re.sub(r'\\vspace\{[^}]+\}', '', text)
        text = re.sub(r'\\hspace\{[^}]+\}', '', text)
        
        # Line breaks
        text = re.sub(r'\\\\', '\n', text)
        
        # Remove comments
        text = re.sub(r'%.*$', '', text, flags=re.MULTILINE)
        
        return text
    
    def convert_math(self, text: str) -> str:
        """
        Preserve math notation for MathJax, escaping for MDX compatibility
        
        Args:
            text: Text with LaTeX math
            
        Returns:
            Text with math preserved for MathJax and MDX-safe
        """
        # For MDX/Docusaurus compatibility, use math code blocks
        # This prevents MDX from trying to parse the content
        
        # Convert display math \[ ... \] to ```math blocks
        def convert_display_math(match):
            math_content = match.group(1).strip()
            return f'\n```math\n{math_content}\n```\n'
        
        text = re.sub(r'\\\[(.*?)\\\]', convert_display_math, text, flags=re.DOTALL)
        
        return text
    
    def convert_lists(self, text: str) -> str:
        """
        Convert itemize/enumerate to Markdown lists
        
        Args:
            text: Text with LaTeX lists
            
        Returns:
            Text with Markdown lists
        """
        # Convert itemize (unordered lists) - do this BEFORE standalone items
        def convert_itemize(match):
            content = match.group(1)
            # Split by \item and filter empty strings
            items = [item.strip() for item in re.split(r'\\item\s+', content) if item.strip()]
            md_items = [f"- {item}" for item in items]
            return "\n" + "\n".join(md_items) + "\n"
        
        text = re.sub(
            r'\\begin\{itemize\}(?:\[.*?\])?(.*?)\\end\{itemize\}',
            convert_itemize,
            text,
            flags=re.DOTALL
        )
        
        # Convert enumerate (ordered lists)
        def convert_enumerate(match):
            content = match.group(1)
            # Split by \item and filter empty strings
            items = [item.strip() for item in re.split(r'\\item\s+', content) if item.strip()]
            md_items = [f"{i+1}. {item}" for i, item in enumerate(items)]
            return "\n" + "\n".join(md_items) + "\n"
        
        text = re.sub(
            r'\\begin\{enumerate\}(?:\[.*?\])?(.*?)\\end\{enumerate\}',
            convert_enumerate,
            text,
            flags=re.DOTALL
        )
        
        # Convert any remaining standalone \item commands
        text = re.sub(r'\\item\s+', '- ', text)
        
        return text
    
    def convert_sections(self, text: str) -> str:
        """
        Convert section commands to Markdown headers
        
        Args:
            text: Text with LaTeX sections
            
        Returns:
            Text with Markdown headers
        """
        # \section{Title} -> ### Title (level 3, since chapter is level 2)
        text = re.sub(r'\\section\{([^}]+)\}', r'\n### \1\n', text)
        
        # \subsection{Title} -> #### Title
        text = re.sub(r'\\subsection\{([^}]+)\}', r'\n#### \1\n', text)
        
        # \subsubsection{Title} -> ##### Title
        text = re.sub(r'\\subsubsection\{([^}]+)\}', r'\n##### \1\n', text)
        
        # \paragraph{Title} -> **Title**
        text = re.sub(r'\\paragraph\{([^}]+)\}', r'\n**\1**\n', text)
        
        # Remove labels
        text = re.sub(r'\\label\{[^}]+\}', '', text)
        
        return text
    
    def convert_citations(self, text: str) -> str:
        r"""
        Convert \cite commands to Markdown format
        
        Args:
            text: Text with LaTeX citations
            
        Returns:
            Text with Markdown citations
        """
        # \cite{key} -> [key]
        text = re.sub(r'\\cite\{([^}]+)\}', r'[\1]', text)
        
        # \citep{key} -> [key]
        text = re.sub(r'\\citep\{([^}]+)\}', r'[\1]', text)
        
        # \citet{key} -> [key]
        text = re.sub(r'\\citet\{([^}]+)\}', r'[\1]', text)
        
        return text
    
    def convert_figures(self, text: str) -> str:
        """
        Convert LaTeX figures to Markdown
        
        Args:
            text: Text with LaTeX figures
            
        Returns:
            Text with Markdown figures or placeholders
        """
        # For TikZ diagrams, add a placeholder
        def replace_tikz(match):
            caption_match = re.search(r'\\caption\{([^}]+)\}', match.group(0))
            caption = caption_match.group(1) if caption_match else "Diagram"
            return f"\n*[{caption} - See PDF version for diagram]*\n"
        
        text = re.sub(
            r'\\begin\{tikzpicture\}.*?\\end\{tikzpicture\}',
            replace_tikz,
            text,
            flags=re.DOTALL
        )
        
        # For regular figures with includegraphics
        def replace_figure(match):
            content = match.group(1)
            graphics_match = re.search(r'\\includegraphics(?:\[.*?\])?\{([^}]+)\}', content)
            caption_match = re.search(r'\\caption\{([^}]+)\}', content)
            
            if graphics_match:
                img_path = graphics_match.group(1)
                caption = caption_match.group(1) if caption_match else ""
                return f"\n![{caption}]({img_path})\n"
            return ""
        
        text = re.sub(
            r'\\begin\{figure\}.*?(.*?)\\end\{figure\}',
            replace_figure,
            text,
            flags=re.DOTALL
        )
        
        return text


def main():
    """CLI interface for Markdown conversion"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Convert LaTeX whitepaper to Markdown'
    )
    parser.add_argument(
        '--tex-file',
        default='apps/docs/docs/whitepaper.tex',
        help='Path to LaTeX source file'
    )
    parser.add_argument(
        '--output-file',
        default='apps/docs/docs/whitepaper.md',
        help='Output Markdown file'
    )
    
    args = parser.parse_args()
    
    try:
        # Parse LaTeX
        latex_parser = LaTeXParser(args.tex_file)
        
        # Convert to Markdown
        converter = LaTeXToMarkdownConverter(latex_parser)
        success = converter.convert(args.output_file)
        
        return 0 if success else 1
        
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
        return 1
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
