#!/usr/bin/env python3
"""
Simple LaTeX to Markdown converter for whitepaper.tex
Focuses on math environments and basic formatting.
"""

import re
import sys
import os

def convert_display_math(content):
    r"""Convert \[...\] to $$...$$ and \(...\) to $...$ for Docusaurus/MDX compatibility."""
    # MDX has issues with \[...\] and \(...\), so convert to $$...$$ and $...$
    content = re.sub(r'\\\[', r'$$', content)
    content = re.sub(r'\\\]', r'$$', content)
    content = re.sub(r'\\\(', r'$', content)
    content = re.sub(r'\\\)', r'$', content)
    return content

def convert_lists(content):
    """Convert LaTeX lists to Markdown."""
    # Remove list environment markers (keep items)
    content = re.sub(r'\\begin\{itemize\}(\[.*?\])?', '', content)
    content = re.sub(r'\\end\{itemize\}', '', content)
    content = re.sub(r'\\begin\{enumerate\}(\[.*?\])?', '', content)
    content = re.sub(r'\\end\{enumerate\}', '', content)
    
    # Convert \item to - (unordered list marker)
    content = re.sub(r'^\s*\\item\s+', r'- ', content, flags=re.MULTILINE)
    
    return content

def remove_figures_and_complex_envs(content):
    """Remove TikZ figures and other complex LaTeX environments."""
    # Remove entire figure environments (including TikZ)
    content = re.sub(
        r'\\begin\{figure\}.*?\\end\{figure\}',
        '\n\n*[Figure removed - see PDF version]*\n\n',
        content,
        flags=re.DOTALL
    )
    
    # Remove table environments
    content = re.sub(
        r'\\begin\{table\}.*?\\end\{table\}',
        '\n\n*[Table removed - see PDF version]*\n\n',
        content,
        flags=re.DOTALL
    )
    
    # Remove theorem environments
    content = re.sub(r'\\begin\{theorem\}.*?\\end\{theorem\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\\begin\{lemma\}.*?\\end\{lemma\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\\begin\{proof\}.*?\\end\{proof\}', '', content, flags=re.DOTALL)
    
    # Remove references to figures
    content = re.sub(r'Figure~\\ref\{[^}]+\}', '*[Figure reference]*', content)
    
    return content

def convert_basic_formatting(content):
    """Convert basic LaTeX formatting to Markdown."""
    # Special: HUM{\Large$\Lambda$}N-Ø -> HUM∧N-Ø
    content = re.sub(r'HUM\{\\Large\$\\Lambda\$\}N-Ø', r'HUM∧N-Ø', content)
    
    # Bold
    content = re.sub(r'\\textbf\{([^}]+)\}', r'**\1**', content)
    # Italic
    content = re.sub(r'\\textit\{([^}]+)\}', r'*\1*', content)
    content = re.sub(r'\\emph\{([^}]+)\}', r'*\1*', content)
    # Code/monospace
    content = re.sub(r'\\texttt\{([^}]+)\}', r'`\1`', content)
    
    # Remove LaTeX commands that don't translate well
    content = re.sub(r'\\maketitle', '', content)
    content = re.sub(r'\\tableofcontents', '', content)
    content = re.sub(r'\\clearpage', '\n\n---\n\n', content)
    content = re.sub(r'\\medskip', '', content)
    content = re.sub(r'\\noindent', '', content)
    content = re.sub(r'\\bigskip', '', content)
    
    # Remove LaTeX environments that don't translate
    content = re.sub(r'\\begin\{center\}', '', content)
    content = re.sub(r'\\end\{center\}', '', content)
    
    # Convert chapters and sections
    content = re.sub(r'\\chapter\*\{([^}]+)\}', r'# \1', content)
    content = re.sub(r'\\chapter\{([^}]+)\}', r'# \1', content)
    content = re.sub(r'\\section\{([^}]+)\}', r'## \1', content)
    content = re.sub(r'\\subsection\{([^}]+)\}', r'### \1', content)
    content = re.sub(r'\\subsubsection\{([^}]+)\}', r'#### \1', content)
    content = re.sub(r'\\paragraph\{([^}]+)\}', r'**\1**', content)
    
    # Remove labels and refs (keep for now, can be enhanced later)
    content = re.sub(r'\\label\{[^}]+\}', '', content)
    content = re.sub(r'\\addcontentsline\{[^}]+\}\{[^}]+\}\{[^}]+\}', '', content)
    
    # Remove LaTeX comments
    content = re.sub(r'%.*$', '', content, flags=re.MULTILINE)
    
    # Remove citations (for now, can be enhanced later)
    content = re.sub(r'\\cite\{[^}]+\}', '', content)
    content = re.sub(r'\\citep\{[^}]+\}', '', content)
    
    # Remove texorpdfstring
    content = re.sub(r'\\texorpdfstring\{([^}]+)\}\{[^}]+\}', r'\1', content)
    
    return content

def extract_document_body(tex_content):
    r"""Extract content between \begin{document} and \end{document}."""
    match = re.search(
        r'\\begin\{document\}(.*?)\\end\{document\}',
        tex_content,
        flags=re.DOTALL
    )
    if match:
        return match.group(1)
    return tex_content

def add_frontmatter(title="HUM∧N-Ø Protocol Whitepaper", author="Edward Calderón et al."):
    """Add MyST-compatible frontmatter."""
    return f"""---
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

def main():
    # File paths
    input_file = 'apps/docs/docs/whitepaper.tex'
    output_file = 'apps/docs/docs/whitepaper-from-tex.md'
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found!")
        return 1
    
    print(f"📖 Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("✂️  Extracting document body...")
    content = extract_document_body(content)
    
    print("🔢 Converting math environments...")
    content = convert_display_math(content)
    
    print("📝 Converting lists...")
    content = convert_lists(content)
    
    print("🖼️  Removing figures and complex environments...")
    content = remove_figures_and_complex_envs(content)
    
    print("✨ Converting basic formatting...")
    content = convert_basic_formatting(content)
    
    print("📝 Adding frontmatter...")
    final_content = add_frontmatter() + content
    
    print(f"💾 Writing to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"✅ Conversion complete!")
    print(f"\n📊 Stats:")
    print(f"   - Math blocks: {content.count('$$') // 2}")
    print(f"   - Bold text: {content.count('**') // 2}")
    print(f"   - Italic text: {content.count('*') - content.count('**')}")
    print(f"\n🧪 Test with: head -100 {output_file}")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
