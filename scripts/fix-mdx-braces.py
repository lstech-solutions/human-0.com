#!/usr/bin/env python3
"""
Fix curly braces in markdown files for MDX compatibility.
MDX tries to parse {} as JavaScript expressions, so we need to escape them.
"""

import re
import sys

def fix_mdx_braces(content):
    """
    Fix curly braces in markdown content for MDX compatibility.
    Strategy: Replace \{ and \} with \lbrace and \rbrace in math mode.
    """
    
    # Replace \{ with \lbrace and \} with \rbrace (LaTeX set notation)
    content = re.sub(r'\\{', r'\\lbrace', content)
    content = re.sub(r'\\}', r'\\rbrace', content)
    
    return content

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix-mdx-braces.py <file>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixed_content = fix_mdx_braces(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"Fixed {filepath}")

if __name__ == "__main__":
    main()
