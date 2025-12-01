#!/usr/bin/env python3
"""Convert whitepaper.tex to Markdown with proper math formatting."""

import re
import sys

def convert_latex_math_to_markdown(content):
    """Convert LaTeX display math \[...\] to $$...$$ for Markdown/MathJax."""
    
    # Replace \[...\] with $$...$$
    content = re.sub(
        r'\\\[(.*?)\\\]',
        lambda m: f"$$\n{m.group(1)}\n$$",
        content,
        flags=re.DOTALL
    )
    
    return content

def simplify_latex_for_markdown(content):
    """Simplify LaTeX constructs that don't convert well to Markdown."""
    
    # Convert \textbf{} to **...**
    content = re.sub(r'\\textbf\{([^}]+)\}', r'**\1**', content)
    
    # Convert \textit{} to *...*
    content = re.sub(r'\\textit\{([^}]+)\}', r'*\1*', content)
    
    # Convert \emph{} to *...*
    content = re.sub(r'\\emph\{([^}]+)\}', r'*\1*', content)
    
    # Convert \texttt{} to `...`
    content = re.sub(r'\\texttt\{([^}]+)\}', r'`\1`', content)
    
    return content

def extract_body_content(tex_content):
    """Extract content between \begin{document} and \end{document}."""
    match = re.search(
        r'\\begin\{document\}(.*?)\\end\{document\}',
        tex_content,
        flags=re.DOTALL
    )
    if match:
        return match.group(1)
    return tex_content

def main():
    input_file = 'apps/docs/docs/whitepaper.tex'
    output_file = 'apps/docs/docs/whitepaper-test-converted.md'
    
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Extracting document body...")
    content = extract_body_content(content)
    
    print("Converting math environments...")
    content = convert_latex_math_to_markdown(content)
    
    print("Simplifying LaTeX formatting...")
    content = simplify_latex_for_markdown(content)
    
    print(f"Writing to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ Conversion complete!")
    print(f"\nTest the output with: cat {output_file} | head -100")

if __name__ == '__main__':
    main()
