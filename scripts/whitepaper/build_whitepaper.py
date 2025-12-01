#!/usr/bin/env python3
"""
White Paper Build Orchestrator

Main script to build all output formats from LaTeX source.
Coordinates PDF generation, Markdown conversion, and Jupyter Book building.
"""

import sys
import subprocess
from pathlib import Path
from typing import Tuple

# Add current directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from latex_parser import LaTeXParser
from latex_to_pdf import compile_latex_to_pdf, check_latex_installed
from latex_to_markdown import LaTeXToMarkdownConverter
from latex_to_jupyter import JupyterBookBuilder


class WhitepaperBuilder:
    """Orchestrates the complete whitepaper build process"""
    
    def __init__(
        self,
        tex_file: str = 'apps/docs/docs/whitepaper.tex',
        pdf_output_dir: str = 'public',
        md_output_file: str = 'apps/docs/docs/whitepaper.md',
        jupyter_output_dir: str = 'apps/docs/jupyter_book'
    ):
        """
        Initialize builder with paths
        
        Args:
            tex_file: Path to LaTeX source
            pdf_output_dir: Directory for PDF output
            md_output_file: Path for Markdown output
            jupyter_output_dir: Directory for Jupyter Book
        """
        self.tex_file = tex_file
        self.pdf_output_dir = pdf_output_dir
        self.md_output_file = md_output_file
        self.jupyter_output_dir = jupyter_output_dir
    
    def check_dependencies(self) -> Tuple[bool, list]:
        """
        Verify required tools are installed
        
        Returns:
            Tuple of (all_ok, missing_tools)
        """
        missing = []
        
        # Check LaTeX
        if not check_latex_installed():
            missing.append('pdflatex/bibtex')
        
        # Check Jupyter Book
        try:
            subprocess.run(
                ['jupyter-book', '--version'],
                capture_output=True,
                check=True
            )
        except (subprocess.CalledProcessError, FileNotFoundError):
            missing.append('jupyter-book')
        
        # Check Python version
        if sys.version_info < (3, 8):
            missing.append('python>=3.8')
        
        return (len(missing) == 0, missing)
    
    def build_pdf(self) -> bool:
        """
        Invoke PDF generation
        
        Returns:
            True on success
        """
        print("\n" + "="*60)
        print("📄 BUILDING PDF")
        print("="*60)
        
        success = compile_latex_to_pdf(
            self.tex_file,
            self.pdf_output_dir,
            clean_aux=True
        )
        
        if success:
            print("✅ PDF build completed")
        else:
            print("❌ PDF build failed")
        
        return success
    
    def build_markdown(self) -> bool:
        """
        Invoke Markdown conversion
        
        Returns:
            True on success
        """
        print("\n" + "="*60)
        print("📝 BUILDING MARKDOWN")
        print("="*60)
        
        try:
            parser = LaTeXParser(self.tex_file)
            converter = LaTeXToMarkdownConverter(parser)
            success = converter.convert(self.md_output_file)
            
            if success:
                print("✅ Markdown build completed")
            else:
                print("❌ Markdown build failed")
            
            return success
            
        except Exception as e:
            print(f"❌ Markdown build failed: {e}")
            return False
    
    def build_jupyter_book(self) -> bool:
        """
        Invoke Jupyter Book generation
        
        Returns:
            True on success
        """
        print("\n" + "="*60)
        print("📚 BUILDING JUPYTER BOOK")
        print("="*60)
        
        try:
            parser = LaTeXParser(self.tex_file)
            builder = JupyterBookBuilder(parser, self.jupyter_output_dir)
            success = builder.build()
            
            if success:
                print("✅ Jupyter Book build completed")
            else:
                print("❌ Jupyter Book build failed")
            
            return success
            
        except Exception as e:
            print(f"❌ Jupyter Book build failed: {e}")
            return False
    
    def build_all(self) -> bool:
        """
        Build all output formats
        
        Returns:
            True if all builds succeeded
        """
        print("\n" + "="*60)
        print("🚀 WHITEPAPER BUILD SYSTEM")
        print("="*60)
        print(f"Source: {self.tex_file}")
        print(f"Outputs:")
        print(f"  - PDF: {self.pdf_output_dir}/whitepaper.pdf")
        print(f"  - Markdown: {self.md_output_file}")
        print(f"  - Jupyter Book: {self.jupyter_output_dir}/_build/html/")
        
        # Check dependencies
        print("\n🔍 Checking dependencies...")
        all_ok, missing = self.check_dependencies()
        
        if not all_ok:
            print(f"❌ Missing dependencies: {', '.join(missing)}")
            print("\nInstallation instructions:")
            if 'pdflatex/bibtex' in missing:
                print("  LaTeX: sudo apt-get install texlive-full (Ubuntu)")
                print("         brew install mactex (macOS)")
            if 'jupyter-book' in missing:
                print("  Jupyter Book: pip install jupyter-book")
            return False
        
        print("✅ All dependencies found")
        
        # Build each format
        results = {
            'pdf': self.build_pdf(),
            'markdown': self.build_markdown(),
            'jupyter_book': self.build_jupyter_book()
        }
        
        # Summary
        print("\n" + "="*60)
        print("📊 BUILD SUMMARY")
        print("="*60)
        
        for format_name, success in results.items():
            status = "✅ SUCCESS" if success else "❌ FAILED"
            print(f"{format_name.upper()}: {status}")
        
        all_success = all(results.values())
        
        if all_success:
            print("\n🎉 All builds completed successfully!")
        else:
            print("\n⚠️  Some builds failed. Check the output above for details.")
        
        return all_success


def main():
    """CLI interface for whitepaper building"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Build whitepaper in multiple formats from LaTeX source',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Build all formats
  python build_whitepaper.py
  
  # Build only PDF
  python build_whitepaper.py --pdf-only
  
  # Build only Markdown
  python build_whitepaper.py --markdown-only
  
  # Build only Jupyter Book
  python build_whitepaper.py --jupyter-only
  
  # Check dependencies
  python build_whitepaper.py --check-deps
        """
    )
    
    parser.add_argument(
        '--tex-file',
        default='apps/docs/docs/whitepaper.tex',
        help='Path to LaTeX source file'
    )
    parser.add_argument(
        '--pdf-output-dir',
        default='public',
        help='Output directory for PDF'
    )
    parser.add_argument(
        '--md-output-file',
        default='apps/docs/docs/whitepaper.md',
        help='Output file for Markdown'
    )
    parser.add_argument(
        '--jupyter-output-dir',
        default='apps/docs/jupyter_book',
        help='Output directory for Jupyter Book'
    )
    parser.add_argument(
        '--pdf-only',
        action='store_true',
        help='Build only PDF'
    )
    parser.add_argument(
        '--markdown-only',
        action='store_true',
        help='Build only Markdown'
    )
    parser.add_argument(
        '--jupyter-only',
        action='store_true',
        help='Build only Jupyter Book'
    )
    parser.add_argument(
        '--check-deps',
        action='store_true',
        help='Check if dependencies are installed'
    )
    
    args = parser.parse_args()
    
    # Create builder
    builder = WhitepaperBuilder(
        tex_file=args.tex_file,
        pdf_output_dir=args.pdf_output_dir,
        md_output_file=args.md_output_file,
        jupyter_output_dir=args.jupyter_output_dir
    )
    
    # Check dependencies only
    if args.check_deps:
        all_ok, missing = builder.check_dependencies()
        if all_ok:
            print("✅ All dependencies are installed")
            return 0
        else:
            print(f"❌ Missing dependencies: {', '.join(missing)}")
            return 1
    
    # Build specific format
    if args.pdf_only:
        success = builder.build_pdf()
    elif args.markdown_only:
        success = builder.build_markdown()
    elif args.jupyter_only:
        success = builder.build_jupyter_book()
    else:
        # Build all formats
        success = builder.build_all()
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
