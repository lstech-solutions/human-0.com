#!/usr/bin/env python3
"""
Docusaurus Compatibility Validator

This script validates that MyST Markdown syntax is compatible with Docusaurus,
checking for potential rendering issues and providing recommendations.
"""

import re
import sys
import subprocess
from pathlib import Path
from typing import List, Tuple, Dict


class DocusaurusValidator:
    """Validator for MyST/Docusaurus compatibility."""
    
    def __init__(self, markdown_file: str = "apps/docs/docs/whitepaper.md",
                 docusaurus_dir: str = "apps/docs"):
        """
        Initialize validator.
        
        Args:
            markdown_file: Path to Markdown file to validate
            docusaurus_dir: Path to Docusaurus project directory
        """
        self.markdown_file = Path(markdown_file)
        self.docusaurus_dir = Path(docusaurus_dir)
        self.warnings = []
        self.errors = []
    
    def validate_file_exists(self) -> bool:
        """
        Check that the Markdown file exists.
        
        Returns:
            True if file exists
        """
        print(f"📄 Validating file: {self.markdown_file}")
        
        if not self.markdown_file.exists():
            print(f"  ✗ File not found: {self.markdown_file}")
            return False
        
        print(f"  ✓ File exists ({self.markdown_file.stat().st_size} bytes)")
        return True
    
    def check_myst_syntax_compatibility(self) -> List[str]:
        """
        Identify MyST syntax that may not render in Docusaurus.
        
        Returns:
            List of warnings about incompatible syntax
        """
        print("\n🔍 Checking MyST syntax compatibility...")
        
        if not self.markdown_file.exists():
            return ["File not found"]
        
        content = self.markdown_file.read_text(encoding='utf-8')
        warnings = []
        
        # Check for MyST directives
        directive_pattern = r':::\{(\w+)\}'
        directives = re.findall(directive_pattern, content)
        
        if directives:
            unique_directives = set(directives)
            print(f"  ⚠ Found {len(directives)} MyST directives: {', '.join(unique_directives)}")
            warnings.append(f"MyST directives found: {', '.join(unique_directives)}")
            print(f"    💡 These may need conversion to Docusaurus admonitions")
        else:
            print(f"  ✓ No MyST-specific directives found")
        
        # Check for MyST roles
        role_pattern = r'\{(\w+)\}`([^`]+)`'
        roles = re.findall(role_pattern, content)
        
        if roles:
            unique_roles = set(r[0] for r in roles)
            print(f"  ⚠ Found {len(roles)} MyST roles: {', '.join(unique_roles)}")
            warnings.append(f"MyST roles found: {', '.join(unique_roles)}")
            print(f"    💡 Roles like {{ref}}, {{cite}} may not work in Docusaurus")
        else:
            print(f"  ✓ No MyST-specific roles found")
        
        # Check for LaTeX-style commands
        latex_commands = [
            (r'\\begin\{', 'LaTeX environments (\\begin{})'),
            (r'\\end\{', 'LaTeX environments (\\end{})'),
            (r'\\node\[', 'TikZ nodes'),
            (r'\\draw\[', 'TikZ drawings'),
            (r'\\caption\{', 'LaTeX captions'),
            (r'\\label\{', 'LaTeX labels'),
            (r'\\ref\{', 'LaTeX references'),
        ]
        
        for pattern, description in latex_commands:
            matches = re.findall(pattern, content)
            if matches:
                print(f"  ✗ Found {len(matches)} instances of {description}")
                warnings.append(f"{description} found - will cause MDX errors")
        
        if not warnings:
            print(f"  ✓ No major compatibility issues detected")
        
        return warnings
    
    def test_math_rendering(self) -> bool:
        """
        Verify math expressions work in Docusaurus.
        
        Returns:
            True if math syntax is compatible
        """
        print("\n🔢 Checking math rendering compatibility...")
        
        if not self.markdown_file.exists():
            return False
        
        content = self.markdown_file.read_text(encoding='utf-8')
        
        # Check for inline math
        inline_math = re.findall(r'\$[^\$]+\$', content)
        print(f"  Found {len(inline_math)} inline math expressions ($...$)")
        
        # Check for display math
        display_math = re.findall(r'\$\$[^\$]+\$\$', content, re.DOTALL)
        print(f"  Found {len(display_math)} display math expressions ($$...$$)")
        
        # Check for equation environments
        equation_envs = re.findall(r'```math\n(.*?)\n```', content, re.DOTALL)
        print(f"  Found {len(equation_envs)} math code blocks (```math)")
        
        if inline_math or display_math or equation_envs:
            print(f"  ✓ Math syntax appears compatible with Docusaurus")
            print(f"    💡 Ensure KaTeX or MathJax is configured in Docusaurus")
            return True
        else:
            print(f"  ~ No math expressions found")
            return True
    
    def test_citations(self) -> bool:
        """
        Verify citations render in Docusaurus.
        
        Returns:
            True if citation syntax is compatible
        """
        print("\n📚 Checking citation compatibility...")
        
        if not self.markdown_file.exists():
            return False
        
        content = self.markdown_file.read_text(encoding='utf-8')
        
        # Check for MyST citations
        myst_citations = re.findall(r'\{cite\}`([^`]+)`', content)
        if myst_citations:
            print(f"  ⚠ Found {len(myst_citations)} MyST citations ({{cite}})")
            print(f"    💡 These will not work in Docusaurus - consider converting to links")
            return False
        
        # Check for markdown links (Docusaurus-compatible)
        md_links = re.findall(r'\[([^\]]+)\]\(([^\)]+)\)', content)
        if md_links:
            print(f"  ✓ Found {len(md_links)} standard Markdown links")
        
        # Check for references section
        if 'References' in content or 'Bibliography' in content:
            print(f"  ✓ References section found")
        
        return True
    
    def validate_docusaurus_build(self) -> bool:
        """
        Test that Docusaurus can build the Markdown source.
        
        Returns:
            True if build succeeds
        """
        print("\n🏗️  Testing Docusaurus build...")
        
        if not self.docusaurus_dir.exists():
            print(f"  ✗ Docusaurus directory not found: {self.docusaurus_dir}")
            return False
        
        print(f"  Running Docusaurus build (this may take a minute)...")
        
        try:
            result = subprocess.run(
                ['npm', 'run', 'build'],
                cwd=self.docusaurus_dir,
                capture_output=True,
                text=True,
                timeout=180,
                check=False
            )
            
            if result.returncode == 0:
                print(f"  ✅ Docusaurus build succeeded!")
                return True
            else:
                print(f"  ✗ Docusaurus build failed")
                
                # Look for specific errors
                if 'MDX compilation failed' in result.stderr:
                    print(f"    Error: MDX compilation failed")
                    # Extract file name if available
                    file_match = re.search(r'file "([^"]+)"', result.stderr)
                    if file_match:
                        print(f"    File: {file_match.group(1)}")
                
                if 'Could not parse expression' in result.stderr:
                    print(f"    Error: Expression parsing failed (likely LaTeX syntax)")
                
                # Show last few lines of error
                error_lines = result.stderr.split('\n')[-10:]
                print(f"\n    Last error lines:")
                for line in error_lines:
                    if line.strip():
                        print(f"      {line}")
                
                return False
        
        except subprocess.TimeoutExpired:
            print(f"  ✗ Build timed out after 3 minutes")
            return False
        except Exception as e:
            print(f"  ✗ Build error: {e}")
            return False
    
    def generate_recommendations(self) -> List[str]:
        """
        Generate recommendations for improving compatibility.
        
        Returns:
            List of recommendations
        """
        recommendations = []
        
        if self.warnings:
            recommendations.append("Convert MyST-specific syntax to Docusaurus-compatible alternatives")
        
        if any('LaTeX' in w for w in self.warnings):
            recommendations.append("Remove or escape LaTeX-specific commands (\\begin, \\node, etc.)")
            recommendations.append("Convert TikZ diagrams to images or Mermaid diagrams")
        
        if any('cite' in w for w in self.warnings):
            recommendations.append("Convert {cite} references to standard Markdown links")
        
        if any('directive' in w for w in self.warnings):
            recommendations.append("Convert MyST directives to Docusaurus admonitions")
        
        return recommendations
    
    def validate(self) -> Dict:
        """
        Run all validation checks.
        
        Returns:
            Dictionary with validation results
        """
        print("=" * 60)
        print("Docusaurus Compatibility Validation")
        print("=" * 60)
        
        results = {
            'file_exists': False,
            'syntax_compatible': False,
            'math_compatible': False,
            'citations_compatible': False,
            'build_succeeds': False,
            'warnings': [],
            'recommendations': []
        }
        
        # Check file exists
        results['file_exists'] = self.validate_file_exists()
        if not results['file_exists']:
            return results
        
        # Check syntax compatibility
        self.warnings = self.check_myst_syntax_compatibility()
        results['warnings'] = self.warnings
        results['syntax_compatible'] = len(self.warnings) == 0
        
        # Check math rendering
        results['math_compatible'] = self.test_math_rendering()
        
        # Check citations
        results['citations_compatible'] = self.test_citations()
        
        # Test Docusaurus build (optional, can be slow)
        # Uncomment to enable:
        # results['build_succeeds'] = self.validate_docusaurus_build()
        
        # Generate recommendations
        results['recommendations'] = self.generate_recommendations()
        
        return results
    
    def print_summary(self, results: Dict) -> None:
        """
        Print validation summary.
        
        Args:
            results: Validation results dictionary
        """
        print("\n" + "=" * 60)
        print("📊 Validation Summary")
        print("=" * 60)
        
        checks = [
            ('File exists', results['file_exists']),
            ('Syntax compatible', results['syntax_compatible']),
            ('Math compatible', results['math_compatible']),
            ('Citations compatible', results['citations_compatible']),
        ]
        
        if 'build_succeeds' in results and results['build_succeeds'] is not None:
            checks.append(('Build succeeds', results['build_succeeds']))
        
        for check_name, passed in checks:
            status = "✅" if passed else "✗"
            print(f"  {status} {check_name}")
        
        if results['warnings']:
            print(f"\n⚠️  Warnings ({len(results['warnings'])}):")
            for warning in results['warnings']:
                print(f"  - {warning}")
        
        if results['recommendations']:
            print(f"\n💡 Recommendations:")
            for i, rec in enumerate(results['recommendations'], 1):
                print(f"  {i}. {rec}")
        
        print("\n" + "=" * 60)
        
        # Overall assessment
        all_passed = all([
            results['file_exists'],
            results['syntax_compatible'],
            results['math_compatible'],
            results['citations_compatible']
        ])
        
        if all_passed:
            print("✅ Markdown is compatible with Docusaurus!")
        elif results['syntax_compatible']:
            print("~ Markdown is mostly compatible - minor issues to address")
        else:
            print("✗ Markdown has compatibility issues - conversion needed")
        
        print("=" * 60)


def main():
    """CLI interface for Docusaurus validator."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Validate MyST Markdown compatibility with Docusaurus'
    )
    parser.add_argument(
        'markdown_file',
        nargs='?',
        default='apps/docs/docs/whitepaper.md',
        help='Path to Markdown file to validate'
    )
    parser.add_argument(
        '--docusaurus-dir',
        default='apps/docs',
        help='Path to Docusaurus project directory'
    )
    parser.add_argument(
        '--test-build',
        action='store_true',
        help='Run full Docusaurus build test (slow)'
    )
    
    args = parser.parse_args()
    
    validator = DocusaurusValidator(
        markdown_file=args.markdown_file,
        docusaurus_dir=args.docusaurus_dir
    )
    
    results = validator.validate()
    
    # Optionally test build
    if args.test_build:
        results['build_succeeds'] = validator.validate_docusaurus_build()
    
    validator.print_summary(results)
    
    # Return exit code based on compatibility
    if results['syntax_compatible']:
        return 0
    else:
        return 1


if __name__ == '__main__':
    sys.exit(main())
