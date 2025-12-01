#!/usr/bin/env python3
"""
LaTeX to PDF Compiler

Compiles LaTeX source to PDF with proper reference and bibliography resolution.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path
from typing import Optional


def check_latex_installed() -> bool:
    """
    Check if pdflatex and bibtex are installed
    
    Returns:
        True if both are available
    """
    try:
        subprocess.run(['pdflatex', '--version'], 
                      capture_output=True, check=True)
        subprocess.run(['bibtex', '--version'], 
                      capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def run_latex_pass(tex_file: Path, output_dir: Path) -> bool:
    """
    Execute single pdflatex compilation
    
    Args:
        tex_file: Path to .tex file
        output_dir: Directory for output files
        
    Returns:
        True on success
    """
    try:
        # Set environment variables to help LaTeX find input files
        env = os.environ.copy()
        tex_dir = tex_file.parent.absolute()
        
        # Add the tex file directory to TEXINPUTS and BIBINPUTS
        if 'TEXINPUTS' in env:
            env['TEXINPUTS'] = f"{tex_dir}:{env['TEXINPUTS']}"
        else:
            env['TEXINPUTS'] = f"{tex_dir}:"
        
        if 'BIBINPUTS' in env:
            env['BIBINPUTS'] = f"{tex_dir}:{env['BIBINPUTS']}"
        else:
            env['BIBINPUTS'] = f"{tex_dir}:"
        
        result = subprocess.run(
            ['pdflatex', 
             '-interaction=nonstopmode',
             '-output-directory', str(output_dir),
             str(tex_file)],
            capture_output=True,
            text=True,
            check=False,
            env=env
        )
        
        if result.returncode != 0:
            print(f"⚠️  pdflatex warning/error (this may be normal on first pass)")
            # Check for critical errors
            if "Emergency stop" in result.stdout or "Fatal error" in result.stdout:
                print("❌ Critical LaTeX error:")
                print(result.stdout[-1000:])  # Last 1000 chars
                return False
            # Don't fail on first pass - references might not be resolved yet
            return True
        
        return True
    except Exception as e:
        print(f"❌ pdflatex execution failed: {e}")
        return False


def run_bibtex(tex_file: Path, output_dir: Path) -> bool:
    """
    Execute bibtex for bibliography
    
    Args:
        tex_file: Path to .tex file (used to find .aux file)
        output_dir: Directory containing .aux file
        
    Returns:
        True on success
    """
    # BibTeX needs the base name without extension
    base_name = tex_file.stem
    aux_file = output_dir / f"{base_name}.aux"
    
    if not aux_file.exists():
        print("⚠️  No .aux file found, skipping bibtex")
        return True
    
    try:
        # BibTeX needs to run with BIBINPUTS set to find .bib files
        # Set BIBINPUTS to include the directory containing the .tex file
        env = os.environ.copy()
        tex_dir = tex_file.parent.absolute()
        
        # Add the tex file directory to BIBINPUTS
        if 'BIBINPUTS' in env:
            env['BIBINPUTS'] = f"{tex_dir}:{env['BIBINPUTS']}"
        else:
            env['BIBINPUTS'] = f"{tex_dir}:"
        
        # Change to output directory for bibtex
        original_dir = os.getcwd()
        os.chdir(output_dir)
        
        try:
            result = subprocess.run(
                ['bibtex', base_name],
                capture_output=True,
                text=True,
                check=False,
                env=env
            )
            
            if result.returncode != 0:
                # Check if it's just "no citations" warning
                if "I found no" in result.stdout or "I found no" in result.stderr:
                    print("ℹ️  No citations found (this is OK if document has no bibliography)")
                    return True
                print(f"⚠️  bibtex warning:")
                print(result.stdout)
                print(result.stderr)
                # Don't fail - bibliography might be optional
                return True
            
            print("✅ BibTeX processed successfully")
            return True
        finally:
            os.chdir(original_dir)
            
    except Exception as e:
        print(f"❌ bibtex execution failed: {e}")
        return False


def clean_auxiliary_files(tex_file: Path, output_dir: Path) -> None:
    """
    Remove .aux, .log, .out, .toc files
    
    Args:
        tex_file: Path to .tex file
        output_dir: Directory containing auxiliary files
    """
    base_name = tex_file.stem
    extensions = ['.aux', '.log', '.out', '.toc', '.bbl', '.blg']
    
    for ext in extensions:
        aux_file = output_dir / f"{base_name}{ext}"
        if aux_file.exists():
            try:
                aux_file.unlink()
            except Exception as e:
                print(f"⚠️  Could not remove {aux_file}: {e}")


def compile_latex_to_pdf(
    tex_file: str,
    output_dir: str,
    clean_aux: bool = True,
    verbose: bool = False
) -> bool:
    """
    Compile LaTeX to PDF using pdflatex and bibtex
    
    This runs multiple passes to resolve all references:
    1. pdflatex (first pass - generates .aux)
    2. bibtex (processes citations)
    3. pdflatex (second pass - incorporates bibliography)
    4. pdflatex (third pass - resolves all references)
    
    Args:
        tex_file: Path to .tex file
        output_dir: Directory for output PDF
        clean_aux: Whether to remove auxiliary files
        
    Returns:
        True on success
    """
    tex_path = Path(tex_file)
    output_path = Path(output_dir)
    
    if not tex_path.exists():
        print(f"❌ LaTeX file not found: {tex_file}")
        return False
    
    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"🔨 Compiling LaTeX to PDF: {tex_path.name}")
    print(f"📁 Output directory: {output_path}")
    
    # First pass
    print("📝 Running pdflatex (pass 1/3)...")
    if not run_latex_pass(tex_path, output_path):
        print("❌ First pdflatex pass failed")
        return False
    
    # Run bibtex
    print("📚 Running bibtex...")
    if not run_bibtex(tex_path, output_path):
        print("❌ bibtex failed")
        return False
    
    # Second pass
    print("📝 Running pdflatex (pass 2/3)...")
    if not run_latex_pass(tex_path, output_path):
        print("❌ Second pdflatex pass failed")
        return False
    
    # Third pass
    print("📝 Running pdflatex (pass 3/3)...")
    if not run_latex_pass(tex_path, output_path):
        print("❌ Third pdflatex pass failed")
        return False
    
    # Check if PDF was created
    pdf_file = output_path / f"{tex_path.stem}.pdf"
    if not pdf_file.exists():
        print(f"❌ PDF was not generated: {pdf_file}")
        return False
    
    print(f"✅ PDF generated successfully: {pdf_file}")
    
    # Clean up auxiliary files
    if clean_aux:
        print("🧹 Cleaning up auxiliary files...")
        clean_auxiliary_files(tex_path, output_path)
    
    return True


def main():
    """CLI interface for PDF compilation"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Compile LaTeX whitepaper to PDF'
    )
    parser.add_argument(
        '--tex-file',
        default='apps/docs/docs/whitepaper.tex',
        help='Path to LaTeX source file'
    )
    parser.add_argument(
        '--output-dir',
        default='public',
        help='Output directory for PDF'
    )
    parser.add_argument(
        '--no-clean',
        action='store_true',
        help='Keep auxiliary files'
    )
    parser.add_argument(
        '--check-deps',
        action='store_true',
        help='Check if LaTeX tools are installed'
    )
    
    args = parser.parse_args()
    
    if args.check_deps:
        if check_latex_installed():
            print("✅ pdflatex and bibtex are installed")
            return 0
        else:
            print("❌ pdflatex or bibtex not found")
            print("\nInstallation instructions:")
            print("  Ubuntu/Debian: sudo apt-get install texlive-full")
            print("  macOS: brew install mactex")
            print("  Windows: Download MiKTeX from https://miktex.org/")
            return 1
    
    # Check dependencies before compiling
    if not check_latex_installed():
        print("❌ pdflatex or bibtex not found. Run with --check-deps for installation instructions.")
        return 1
    
    # Compile PDF
    success = compile_latex_to_pdf(
        args.tex_file,
        args.output_dir,
        clean_aux=not args.no_clean
    )
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
