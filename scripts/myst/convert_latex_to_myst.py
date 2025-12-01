#!/usr/bin/env python3
"""
LaTeX to MyST Markdown Converter

Converts the whitepaper.tex file to MyST-compatible Markdown,
handling TikZ diagrams, math, citations, and theorem environments.
"""

import re
import sys
from pathlib import Path


class LaTeXToMystConverter:
    """Converter for LaTeX to MyST Markdown."""
    
    def __init__(self, tex_file: str, output_file: str):
        """
        Initialize converter.
        
        Args:
            tex_file: Path to LaTeX source file
            output_file: Path to output Markdown file
        """
        self.tex_file = Path(tex_file)
        self.output_file = Path(output_file)
        self.content = ""
        self.in_tikz = False
        self.tikz_counter = 0
    
    def read_latex(self) -> str:
        """Read LaTeX source file."""
        if not self.tex_file.exists():
            raise FileNotFoundError(f"LaTeX file not found: {self.tex_file}")
        
        return self.tex_file.read_text(encoding='utf-8')
    
    def convert_preamble_to_frontmatter(self, content: str) -> tuple:
        """
        Extract LaTeX preamble and convert to YAML frontmatter.
        
        Returns:
            Tuple of (frontmatter, body_content)
        """
        # Extract title
        title_match = re.search(r'\\title\{([^}]+)\}', content, re.DOTALL)
        title = "HUM∧N-Ø Protocol Whitepaper" if not title_match else title_match.group(1)
        title = re.sub(r'\\Large\$\\Lambda\$', '∧', title)
        title = re.sub(r'\\\\.*', '', title)  # Remove line breaks
        title = re.sub(r'\[.*?\]', '', title)  # Remove optional args
        title = title.strip()
        
        # Extract author
        author_match = re.search(r'\\author\{([^}]+)\}', content)
        author = "Edward Calderón et al." if not author_match else author_match.group(1)
        
        # Find document start
        doc_start = content.find(r'\begin{document}')
        if doc_start == -1:
            body = content
        else:
            body = content[doc_start + len(r'\begin{document}'):]
        
        # Remove \end{document}
        body = body.replace(r'\end{document}', '')
        
        frontmatter = f"""---
title: '{title}'
subtitle: 'A Cryptographic Primitive for Sustainability Verification'
authors:
  - name: '{author}'
    email: 'contact@human0.me'
date: '2025-11-30'
version: '1.0.0'
keywords:
  - sustainability
  - blockchain
  - proof-of-personhood
  - zero-knowledge
  - climate
  - web3
bibliography: apps/docs/docs/refs.bib
---

"""
        return frontmatter, body
    
    def convert_sections(self, text: str) -> str:
        """Convert LaTeX section commands to Markdown headers."""
        # Chapter (unnumbered)
        text = re.sub(r'\\chapter\*\{([^}]+)\}', r'# \1', text)
        # Chapter (numbered)
        text = re.sub(r'\\chapter\{([^}]+)\}', r'# \1', text)
        # Section
        text = re.sub(r'\\section\{([^}]+)\}', r'## \1', text)
        # Subsection
        text = re.sub(r'\\subsection\{([^}]+)\}', r'### \1', text)
        # Subsubsection
        text = re.sub(r'\\subsubsection\{([^}]+)\}', r'#### \1', text)
        
        return text
    
    def convert_text_formatting(self, text: str) -> str:
        """Convert LaTeX text formatting to Markdown."""
        # Bold
        text = re.sub(r'\\textbf\{([^}]+)\}', r'**\1**', text)
        # Italic/Emphasis
        text = re.sub(r'\\textit\{([^}]+)\}', r'*\1*', text)
        text = re.sub(r'\\emph\{([^}]+)\}', r'*\1*', text)
        # Typewriter/Code
        text = re.sub(r'\\texttt\{([^}]+)\}', r'`\1`', text)
        
        # Special characters
        text = text.replace(r'\{', '{')
        text = text.replace(r'\}', '}')
        text = text.replace(r'---', '—')
        text = text.replace(r'--', '–')
        
        # Lambda symbol
        text = re.sub(r'\\Large\$\\Lambda\$', '∧', text)
        text = re.sub(r'\{\$\\Lambda\$\}', '∧', text)
        
        return text
    
    def convert_lists(self, text: str) -> str:
        """Convert LaTeX lists to Markdown."""
        # Itemize (unordered list)
        text = re.sub(r'\\begin\{itemize\}.*?\n', '', text)
        text = re.sub(r'\\end\{itemize\}', '', text)
        text = re.sub(r'\\item\s+', '- ', text)
        
        # Enumerate (ordered list)
        text = re.sub(r'\\begin\{enumerate\}.*?\n', '', text)
        text = re.sub(r'\\end\{enumerate\}', '', text)
        
        return text
    
    def convert_citations(self, text: str) -> str:
        """Convert LaTeX citations to MyST format."""
        # Single citation
        text = re.sub(r'\\cite\{([^}]+)\}', r'{cite}`\1`', text)
        # Multiple citations
        text = re.sub(r'\\cite\{([^}]+),([^}]+)\}', lambda m: '{cite}`' + m.group(1) + ',' + m.group(2) + '`', text)
        
        return text
    
    def convert_tikz_to_mermaid(self, tikz_content: str, caption: str) -> str:
        """
        Convert TikZ diagram to Mermaid flowchart.
        
        This is a simplified conversion - complex TikZ may need manual adjustment.
        """
        self.tikz_counter += 1
        
        # For now, create placeholder Mermaid diagrams
        # These should be manually refined based on the actual TikZ content
        
        if 'Human User' in tikz_content and 'Oracle Network' in tikz_content:
            # This is the architecture diagram
            mermaid = """```{mermaid}
flowchart TD
    A[Human User] --> B[HUM∧N-Ø Application]
    B --> C[MRV Adapters<br/>smart meter, I-REC, EV, ...]
    B --> D[Oracle Network]
    C --> D
    D --> E[PoSH Proof Registry<br/>on-chain]
    E --> F[PoSH Soulbound NFTs]
    E --> G[dApps, ESG Systems,<br/>Employers, Protocols]
    
    style A fill:#e1f5ff
    style E fill:#ffe1e1
    style F fill:#fff4e1
```"""
        elif 'MRV System' in tikz_content:
            # This is the cryptographic flow diagram
            mermaid = """```{mermaid}
flowchart TD
    A[Human u<br/>pk_u, sk_u] --> B[MRV System<br/>event E]
    B --> C[Oracle Network<br/>claim, σ]
    C --> D[ZK Prover<br/>Π_impact]
    D --> E[Blockchain /<br/>PoSH Registry]
    F[Verifier / dApp] --> E
    E --> F
    
    style A fill:#e1f5ff
    style E fill:#ffe1e1
```"""
        elif 'Environment' in tikz_content or 'Protocol' in tikz_content:
            # This is the UC model diagram
            mermaid = """```{mermaid}
flowchart LR
    A[Environment<br/>Z] --> B[Real Protocol<br/>Π_PoSH]
    B --> C[Adversary /<br/>Simulator A]
    C --> D[Ideal Functionality<br/>F_PoSH]
    D --> A
    
    style A fill:#e1f5ff
    style D fill:#ffe1e1
```"""
        else:
            # Generic placeholder
            mermaid = f"""```{{mermaid}}
flowchart TD
    A[Diagram {self.tikz_counter}] --> B[See LaTeX source<br/>for details]
    
    style A fill:#fff4e1
```"""
        
        result = f"\n{mermaid}\n\n**Figure {self.tikz_counter}:** {caption}\n"
        return result
    
    def process_tikz_figures(self, text: str) -> str:
        """Find and convert TikZ figures to Mermaid."""
        # Pattern to match figure environment with TikZ
        pattern = r'\\begin\{figure\}.*?\\begin\{tikzpicture\}.*?\\end\{tikzpicture\}.*?\\caption\{([^}]+)\}.*?\\end\{figure\}'
        
        def replace_tikz(match):
            caption = match.group(1)
            tikz_content = match.group(0)
            return self.convert_tikz_to_mermaid(tikz_content, caption)
        
        text = re.sub(pattern, replace_tikz, text, flags=re.DOTALL)
        
        return text
    
    def convert_tables(self, text: str) -> str:
        """Convert LaTeX tables to Markdown tables."""
        # Simple table conversion - may need manual adjustment for complex tables
        # Remove table environment
        text = re.sub(r'\\begin\{table\}.*?\n', '', text)
        text = re.sub(r'\\end\{table\}', '', text)
        
        # Remove tabular environment but keep content
        text = re.sub(r'\\begin\{tabular\}\{[^}]+\}', '', text)
        text = re.sub(r'\\end\{tabular\}', '', text)
        
        # Convert hline to markdown table separator
        text = re.sub(r'\\hline', '', text)
        
        # Convert & to | for table cells
        text = re.sub(r'\s*&\s*', ' | ', text)
        
        # Convert \\ to newline
        text = re.sub(r'\\\\\s*\n', '\n', text)
        
        return text
    
    def convert_theorem_environments(self, text: str) -> str:
        """Convert LaTeX theorem environments to MyST admonitions."""
        # Theorem
        text = re.sub(r'\\begin\{theorem\}', ':::{admonition} Theorem\n:class: important\n', text)
        text = re.sub(r'\\end\{theorem\}', ':::', text)
        
        # Proof
        text = re.sub(r'\\begin\{proof\}(\[.*?\])?', ':::{admonition} Proof\n:class: note\n', text)
        text = re.sub(r'\\end\{proof\}', ':::', text)
        
        # Lemma
        text = re.sub(r'\\begin\{lemma\}', ':::{admonition} Lemma\n:class: important\n', text)
        text = re.sub(r'\\end\{lemma\}', ':::', text)
        
        # Definition
        text = re.sub(r'\\begin\{definition\}', ':::{admonition} Definition\n:class: tip\n', text)
        text = re.sub(r'\\end\{definition\}', ':::', text)
        
        # Remark
        text = re.sub(r'\\begin\{remark\}', ':::{admonition} Remark\n:class: note\n', text)
        text = re.sub(r'\\end\{remark\}', ':::', text)
        
        return text
    
    def convert_math_environments(self, text: str) -> str:
        """Convert LaTeX math environments to MyST format."""
        # Cases environment - keep as LaTeX within math
        # It's already in math mode, so just leave it
        
        # Align environment
        text = re.sub(r'\\begin\{align\*?\}', r'$$' + '\n' + r'\\begin{aligned}', text)
        text = re.sub(r'\\end\{align\*?\}', r'\\end{aligned}' + '\n' + r'$$', text)
        
        # Equation environment
        text = re.sub(r'\\begin\{equation\*?\}', '$$', text)
        text = re.sub(r'\\end\{equation\*?\}', '$$', text)
        
        return text
    
    def clean_latex_commands(self, text: str) -> str:
        """Remove or convert remaining LaTeX commands."""
        # Remove table of contents
        text = re.sub(r'\\tableofcontents', '', text)
        text = re.sub(r'\\clearpage', '\n\n---\n\n', text)
        text = re.sub(r'\\newpage', '\n\n---\n\n', text)
        
        # Remove maketitle
        text = re.sub(r'\\maketitle', '', text)
        
        # Remove addcontentsline
        text = re.sub(r'\\addcontentsline\{[^}]+\}\{[^}]+\}\{[^}]+\}', '', text)
        
        # Remove labels and refs (convert to simple text)
        text = re.sub(r'\\label\{[^}]+\}', '', text)
        text = re.sub(r'\\ref\{([^}]+)\}', r'[\1]', text)
        
        # Remove center environment
        text = re.sub(r'\\begin\{center\}', '', text)
        text = re.sub(r'\\end\{center\}', '', text)
        
        # Remove centering command
        text = re.sub(r'\\centering', '', text)
        
        # Remove caption command (already handled in figures)
        text = re.sub(r'\\caption\{([^}]+)\}', r'**\1**', text)
        
        # Bibliography
        text = re.sub(r'\\bibliographystyle\{[^}]+\}', '', text)
        text = re.sub(r'\\bibliography\{[^}]+\}', '\n## References\n\nSee bibliography file: `refs.bib`\n', text)
        
        return text
    
    def convert(self) -> str:
        """
        Perform full conversion from LaTeX to MyST Markdown.
        
        Returns:
            Converted Markdown content
        """
        print(f"📖 Reading LaTeX file: {self.tex_file}")
        content = self.read_latex()
        
        print("🔄 Converting preamble to frontmatter...")
        frontmatter, body = self.convert_preamble_to_frontmatter(content)
        
        print("🔄 Converting sections...")
        body = self.convert_sections(body)
        
        print("🔄 Converting text formatting...")
        body = self.convert_text_formatting(body)
        
        print("🔄 Converting lists...")
        body = self.convert_lists(body)
        
        print("🔄 Converting citations...")
        body = self.convert_citations(body)
        
        print("🔄 Converting TikZ diagrams to Mermaid...")
        body = self.process_tikz_figures(body)
        
        print("🔄 Converting tables...")
        body = self.convert_tables(body)
        
        print("🔄 Converting theorem environments...")
        body = self.convert_theorem_environments(body)
        
        print("🔄 Converting math environments...")
        body = self.convert_math_environments(body)
        
        print("🔄 Cleaning LaTeX commands...")
        body = self.clean_latex_commands(body)
        
        # Combine frontmatter and body
        result = frontmatter + body
        
        return result
    
    def save(self, content: str) -> None:
        """Save converted Markdown to file."""
        print(f"💾 Saving to: {self.output_file}")
        self.output_file.write_text(content, encoding='utf-8')
        print(f"✅ Conversion complete!")
        print(f"📄 Output: {self.output_file} ({len(content)} characters)")


def main():
    """CLI interface for converter."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Convert LaTeX whitepaper to MyST Markdown'
    )
    parser.add_argument(
        '--input',
        default='apps/docs/docs/whitepaper.tex',
        help='Path to LaTeX source file'
    )
    parser.add_argument(
        '--output',
        default='apps/docs/docs/whitepaper-converted.md',
        help='Path to output Markdown file'
    )
    
    args = parser.parse_args()
    
    try:
        converter = LaTeXToMystConverter(args.input, args.output)
        content = converter.convert()
        converter.save(content)
        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
