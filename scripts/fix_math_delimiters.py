#!/usr/bin/env python3
"""Fix LaTeX math delimiters for Docusaurus compatibility."""

import re
import sys

def fix_math_delimiters(content):
    """Convert LaTeX display math to $$...$$"""
    # Replace standalone \[ with $$
    content = re.sub(r'^\\\\?\[$', r'$$', content, flags=re.MULTILINE)
    # Replace standalone \] with $$
    content = re.sub(r'^\\\\?\]$', r'$$', content, flags=re.MULTILINE)
    # Also fix single $ that should be $$
    content = re.sub(r'^\$$', r'$$', content, flags=re.MULTILINE)
    return content

if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'apps/docs/docs/whitepaper-converted.md'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixed_content = fix_math_delimiters(content)
    
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"Fixed math delimiters in {input_file}")
