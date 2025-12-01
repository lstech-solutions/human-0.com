#!/usr/bin/env python3
"""Test LaTeX to Markdown conversion for math environments."""

import re

def convert_latex_math_to_markdown(content):
    """
    Convert LaTeX math to Markdown-compatible format.
    
    Rules:
    1. \[...\] -> $$...$$
    2. Inline $...$ stays as is
    3. \begin{cases}...\end{cases} -> keep inside $$
    4. Complex math stays in LaTeX format (MathJax will render it)
    """
    
    # Find all display math blocks \[...\]
    def replace_display_math(match):
        math_content = match.group(1)
        # Keep the math content as-is, just change delimiters
        return f"$$\n{math_content}\n$$"
    
    # Replace \[...\] with $$...$$
    content = re.sub(
        r'\\\[(.*?)\\\]',
        replace_display_math,
        content,
        flags=re.DOTALL
    )
    
    return content

# Test with sample LaTeX
test_latex = r"""
At the core of PoSH is a simple mapping:
\[
  \text{Human} \;\rightarrow\; \mathsf{humanId} \;\rightarrow\;
  \{\text{impact commitments on-chain}\}.
\]

On query $(\textsf{verify}, \mathsf{RWAP})$:

\[
  \textsf{Return } 
  \begin{cases}
  \textsf{valid}, & \mathsf{RWAP} \in \mathsf{Registry} \land \mathsf{RWAP} \notin \mathsf{Revoked} \\
  \textsf{invalid}, & \text{otherwise.}
  \end{cases}
\]

The score is:
\[
\mathsf{score}(h) = \sum_{i \in \mathcal{P}(h)} w_i \cdot \mathsf{impactValue}_i
\]
"""

print("Original LaTeX:")
print(test_latex)
print("\n" + "="*60 + "\n")

converted = convert_latex_math_to_markdown(test_latex)
print("Converted Markdown:")
print(converted)
