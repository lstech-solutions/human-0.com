#!/usr/bin/env python3
"""
MyST PDF Build Script

This script orchestrates the PDF generation process using MyST CLI,
including dependency checking, validation, and error reporting.
"""

import subprocess
import sys
from pathlib import Path
from typing import Tuple


class MystPDFBuilder:
    """Builder for generating PDFs from Markdown using MyST."""
    
    def __init__(self, source_file: str = "apps/docs/docs/whitepaper.md",
                 config_file: str = "myst.yml"):
        """
        Initialize the PDF builder.
        
        Args:
            source_file: Path to the Markdown source file
            config_file: Path to myst.yml configuration
        """
        self.source_file = Path(source_file)
        self.config_file = Path(config_file)
        self.output_file = Path("public/whitepaper-myst.pdf")
    
    def check_dependencies(self) -> bool:
        """
        Verify MyST CLI and required tools are installed.
        
        Returns:
            True if all dependencies are available
        """
        print("🔍 Checking dependencies...")
        
        # Check for MyST CLI
        try:
            result = subprocess.run(
                ['myst', '--version'],
                capture_output=True,
                text=True,
                check=False
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                print(f"  ✓ MyST CLI found: {version}")
            else:
                print("  ✗ MyST CLI not found")
                print("\nInstallation instructions:")
                print("  npm install -g mystmd")
                print("  or")
                print("  pip install mystmd")
                return False
        except FileNotFoundError:
            print("  ✗ MyST CLI not found")
            print("\nInstallation instructions:")
            print("  npm install -g mystmd")
            print("  or")
            print("  pip install mystmd")
            return False
        
        # Check for pdflatex (used by MyST backend)
        try:
            result = subprocess.run(
                ['pdflatex', '--version'],
                capture_output=True,
                text=True,
                check=False
            )
            if result.returncode == 0:
                print("  ✓ pdflatex found")
            else:
                print("  ⚠ pdflatex not found (may cause PDF generation issues)")
                print("    Install TeX Live or MiKTeX for best results")
        except FileNotFoundError:
            print("  ⚠ pdflatex not found (may cause PDF generation issues)")
            print("    Install TeX Live or MiKTeX for best results")
        
        return True
    
    def validate_markdown(self) -> bool:
        """
        Check Markdown source exists and is valid.
        
        Returns:
            True if source file is valid
        """
        print(f"\n📄 Validating source file: {self.source_file}")
        
        if not self.source_file.exists():
            print(f"  ✗ Source file not found: {self.source_file}")
            return False
        
        # Check file is not empty
        if self.source_file.stat().st_size == 0:
            print(f"  ✗ Source file is empty")
            return False
        
        print(f"  ✓ Source file exists ({self.source_file.stat().st_size} bytes)")
        
        # Check for frontmatter
        content = self.source_file.read_text(encoding='utf-8')
        if not content.startswith('---'):
            print("  ⚠ Warning: No frontmatter found in source file")
        else:
            print("  ✓ Frontmatter detected")
        
        return True
    
    def validate_config(self) -> bool:
        """
        Check MyST configuration file exists.
        
        Returns:
            True if config file is valid
        """
        print(f"\n⚙️  Validating config file: {self.config_file}")
        
        if not self.config_file.exists():
            print(f"  ✗ Config file not found: {self.config_file}")
            return False
        
        print(f"  ✓ Config file exists")
        return True
    
    def build_pdf(self) -> Tuple[bool, str]:
        """
        Execute myst build --pdf command.
        
        Returns:
            Tuple of (success, output_message)
        """
        print(f"\n🔨 Building PDF with MyST...")
        print(f"   Source: {self.source_file}")
        print(f"   Output: {self.output_file}")
        
        try:
            # Run myst build command
            # MyST will use the myst.yml config automatically
            result = subprocess.run(
                ['myst', 'build', str(self.source_file), '--pdf'],
                capture_output=True,
                text=True,
                check=False,
                cwd=Path.cwd()
            )
            
            # Print output for debugging
            if result.stdout:
                print("\n--- MyST Output ---")
                print(result.stdout)
            
            if result.stderr:
                print("\n--- MyST Errors/Warnings ---")
                print(result.stderr)
            
            if result.returncode == 0:
                return True, "PDF build completed successfully"
            else:
                return False, f"PDF build failed with exit code {result.returncode}"
        
        except Exception as e:
            return False, f"Error executing MyST: {str(e)}"
    
    def verify_output(self) -> bool:
        """
        Confirm PDF was generated in correct location.
        
        Returns:
            True if PDF exists
        """
        print(f"\n✅ Verifying output...")
        
        # MyST places the PDF in _build directory with source filename
        source_name = self.source_file.stem  # Get filename without extension
        possible_locations = [
            self.output_file,
            Path(f"_build/exports/{source_name}.pdf"),
            Path("_build/exports/whitepaper.pdf"),
            Path("_build/pdf/whitepaper.pdf"),
        ]
        
        pdf_found = None
        for location in possible_locations:
            if location.exists():
                pdf_found = location
                break
        
        if pdf_found:
            size_mb = pdf_found.stat().st_size / (1024 * 1024)
            print(f"  ✓ PDF generated: {pdf_found} ({size_mb:.2f} MB)")
            
            # Move to expected location if needed
            if pdf_found != self.output_file:
                print(f"  📦 Moving PDF to: {self.output_file}")
                self.output_file.parent.mkdir(parents=True, exist_ok=True)
                pdf_found.rename(self.output_file)
                print(f"  ✓ PDF moved to: {self.output_file}")
            
            return True
        else:
            print(f"  ✗ PDF not found in expected locations")
            print(f"     Checked: {', '.join(str(p) for p in possible_locations)}")
            return False
    
    def build(self) -> int:
        """
        Execute complete build process.
        
        Returns:
            Exit code (0 for success, non-zero for failure)
        """
        print("=" * 60)
        print("MyST PDF Builder")
        print("=" * 60)
        
        # Step 1: Check dependencies
        if not self.check_dependencies():
            print("\n❌ Dependency check failed")
            return 2
        
        # Step 2: Validate source
        if not self.validate_markdown():
            print("\n❌ Source validation failed")
            return 3
        
        # Step 3: Validate config
        if not self.validate_config():
            print("\n❌ Config validation failed")
            return 3
        
        # Step 4: Build PDF
        success, message = self.build_pdf()
        if not success:
            print(f"\n❌ {message}")
            return 4
        
        # Step 5: Verify output
        if not self.verify_output():
            print("\n❌ Output verification failed")
            return 5
        
        print("\n" + "=" * 60)
        print("✅ PDF build completed successfully!")
        print(f"📄 Output: {self.output_file}")
        print("=" * 60)
        
        return 0


def main():
    """CLI interface for PDF builder."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Build PDF from Markdown using MyST'
    )
    parser.add_argument(
        '--source',
        default='apps/docs/docs/whitepaper.md',
        help='Path to Markdown source file'
    )
    parser.add_argument(
        '--config',
        default='myst.yml',
        help='Path to myst.yml configuration'
    )
    parser.add_argument(
        '--check-only',
        action='store_true',
        help='Only check dependencies, do not build'
    )
    
    args = parser.parse_args()
    
    builder = MystPDFBuilder(
        source_file=args.source,
        config_file=args.config
    )
    
    if args.check_only:
        if builder.check_dependencies():
            print("\n✅ All dependencies are available")
            return 0
        else:
            print("\n❌ Some dependencies are missing")
            return 1
    
    return builder.build()


if __name__ == '__main__':
    sys.exit(main())
