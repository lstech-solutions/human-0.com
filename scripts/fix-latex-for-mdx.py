#!/usr/bin/env python3
"""
Fix LaTeX math delimiters for MDX compatibility.
MDX has issues with \[...\] delimiters, so we convert them to $$...$$.
"""

import re
import sys

def fix_latex_delimiters(content):
    """
    Convert \[...\] to $$...$$ for better MDX compatibility.
    Also revert any \lbrace/\rbrace back to \{/\} since $$ handles them better.
    """
    
    # Revert \lbrace and \rbrace back to \{ and \}
    content = content.replace(r'\lbrace', r'\{')
    content = content.replace(r'\rbrace', r'\}')
    
    # Convert \[ to $$ and \] to $$
    # Use a more careful approach to handle multiline equations
    content = re.sub(r'\\\[', r'$$', content)
    content = re.sub(r'\\\]', r'$$', content)
    
    return content

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix-latex-for-mdx.py <file>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixed_content = fix_latex_delimiters(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"Fixed {filepath}")

if __name__ == "__main__":
    main()
