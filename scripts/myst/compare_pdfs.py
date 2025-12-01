#!/usr/bin/env python3
"""
PDF Quality Comparison Tool

This script compares MyST-generated PDF with LaTeX-generated PDF
to evaluate quality differences in equations, typography, citations, and layout.
"""

import sys
from pathlib import Path
from typing import Dict, List, Tuple
import subprocess


class PDFComparator:
    """Compare two PDFs for quality assessment."""
    
    def __init__(self, latex_pdf: str = "public/whitepaper-latex.pdf",
                 myst_pdf: str = "public/whitepaper-myst.pdf"):
        """
        Initialize comparator with paths to both PDFs.
        
        Args:
            latex_pdf: Path to LaTeX-generated PDF
            myst_pdf: Path to MyST-generated PDF
        """
        self.latex_pdf = Path(latex_pdf)
        self.myst_pdf = Path(myst_pdf)
        self.scores = {}
    
    def validate_pdfs(self) -> bool:
        """
        Check that both PDF files exist.
        
        Returns:
            True if both PDFs are available
        """
        print("📋 Validating PDF files...")
        
        if not self.latex_pdf.exists():
            print(f"  ✗ LaTeX PDF not found: {self.latex_pdf}")
            return False
        
        if not self.myst_pdf.exists():
            print(f"  ✗ MyST PDF not found: {self.myst_pdf}")
            return False
        
        latex_size = self.latex_pdf.stat().st_size / (1024 * 1024)
        myst_size = self.myst_pdf.stat().st_size / (1024 * 1024)
        
        print(f"  ✓ LaTeX PDF: {self.latex_pdf} ({latex_size:.2f} MB)")
        print(f"  ✓ MyST PDF: {self.myst_pdf} ({myst_size:.2f} MB)")
        
        return True
    
    def get_pdf_info(self, pdf_path: Path) -> Dict:
        """
        Extract basic PDF information using pdfinfo.
        
        Args:
            pdf_path: Path to PDF file
        
        Returns:
            Dictionary with PDF metadata
        """
        try:
            result = subprocess.run(
                ['pdfinfo', str(pdf_path)],
                capture_output=True,
                text=True,
                check=False
            )
            
            if result.returncode != 0:
                return {}
            
            info = {}
            for line in result.stdout.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    info[key.strip()] = value.strip()
            
            return info
        
        except FileNotFoundError:
            print("  ⚠ pdfinfo not found (install poppler-utils for detailed analysis)")
            return {}
    
    def compare_page_count(self) -> Tuple[float, str]:
        """
        Compare page counts between PDFs.
        
        Returns:
            Tuple of (score, message)
        """
        print("\n📄 Comparing page counts...")
        
        latex_info = self.get_pdf_info(self.latex_pdf)
        myst_info = self.get_pdf_info(self.myst_pdf)
        
        if not latex_info or not myst_info:
            return 0.5, "Could not extract page information"
        
        latex_pages = int(latex_info.get('Pages', 0))
        myst_pages = int(myst_info.get('Pages', 0))
        
        print(f"  LaTeX PDF: {latex_pages} pages")
        print(f"  MyST PDF: {myst_pages} pages")
        
        if latex_pages == 0 or myst_pages == 0:
            return 0.5, "Invalid page count"
        
        # Score based on page count similarity
        ratio = min(latex_pages, myst_pages) / max(latex_pages, myst_pages)
        
        if ratio > 0.95:
            message = "✓ Page counts are very similar"
            score = 1.0
        elif ratio > 0.85:
            message = "~ Page counts are reasonably similar"
            score = 0.8
        else:
            message = "✗ Significant difference in page counts"
            score = 0.5
        
        print(f"  {message}")
        return score, message
    
    def compare_file_size(self) -> Tuple[float, str]:
        """
        Compare file sizes (can indicate compression/image quality).
        
        Returns:
            Tuple of (score, message)
        """
        print("\n💾 Comparing file sizes...")
        
        latex_size = self.latex_pdf.stat().st_size / (1024 * 1024)
        myst_size = self.myst_pdf.stat().st_size / (1024 * 1024)
        
        print(f"  LaTeX PDF: {latex_size:.2f} MB")
        print(f"  MyST PDF: {myst_size:.2f} MB")
        
        ratio = min(latex_size, myst_size) / max(latex_size, myst_size)
        
        if ratio > 0.7:
            message = "✓ File sizes are comparable"
            score = 1.0
        elif ratio > 0.4:
            message = "~ File sizes differ moderately"
            score = 0.7
        else:
            message = "✗ Significant file size difference"
            score = 0.5
        
        print(f"  {message}")
        return score, message
    
    def extract_text(self, pdf_path: Path) -> str:
        """
        Extract text from PDF using pdftotext.
        
        Args:
            pdf_path: Path to PDF file
        
        Returns:
            Extracted text content
        """
        try:
            result = subprocess.run(
                ['pdftotext', str(pdf_path), '-'],
                capture_output=True,
                text=True,
                check=False
            )
            
            if result.returncode == 0:
                return result.stdout
            return ""
        
        except FileNotFoundError:
            return ""
    
    def compare_equations(self) -> Tuple[float, str]:
        """
        Evaluate equation rendering quality.
        
        Returns:
            Tuple of (score, message)
        """
        print("\n🔢 Comparing equation rendering...")
        
        # Extract text from both PDFs
        latex_text = self.extract_text(self.latex_pdf)
        myst_text = self.extract_text(self.myst_pdf)
        
        if not latex_text or not myst_text:
            print("  ⚠ Could not extract text (install poppler-utils)")
            return 0.5, "Text extraction not available"
        
        # Count mathematical symbols as a proxy for equation presence
        math_symbols = ['∫', '∑', '∏', '√', '≤', '≥', '≠', '∈', '∉', '⊂', '⊃', '∀', '∃']
        
        latex_math_count = sum(latex_text.count(sym) for sym in math_symbols)
        myst_math_count = sum(myst_text.count(sym) for sym in math_symbols)
        
        print(f"  LaTeX PDF: ~{latex_math_count} mathematical symbols detected")
        print(f"  MyST PDF: ~{myst_math_count} mathematical symbols detected")
        
        if latex_math_count == 0 and myst_math_count == 0:
            return 1.0, "No equations detected in either PDF"
        
        if latex_math_count == 0 or myst_math_count == 0:
            return 0.3, "Equations missing in one PDF"
        
        ratio = min(latex_math_count, myst_math_count) / max(latex_math_count, myst_math_count)
        
        if ratio > 0.9:
            message = "✓ Equation rendering appears comparable"
            score = 1.0
        elif ratio > 0.7:
            message = "~ Some differences in equation rendering"
            score = 0.7
        else:
            message = "✗ Significant differences in equation rendering"
            score = 0.4
        
        print(f"  {message}")
        return score, message
    
    def compare_typography(self) -> Tuple[float, str]:
        """
        Evaluate typography and layout quality.
        
        Returns:
            Tuple of (score, message)
        """
        print("\n📝 Comparing typography...")
        
        latex_info = self.get_pdf_info(self.latex_pdf)
        myst_info = self.get_pdf_info(self.myst_pdf)
        
        if not latex_info or not myst_info:
            return 0.5, "Could not analyze typography"
        
        # Compare PDF versions (newer is generally better)
        latex_version = latex_info.get('PDF version', '1.4')
        myst_version = myst_info.get('PDF version', '1.4')
        
        print(f"  LaTeX PDF version: {latex_version}")
        print(f"  MyST PDF version: {myst_version}")
        
        # This is a basic check - manual inspection is needed for real quality assessment
        message = "~ Typography quality requires manual inspection"
        score = 0.7
        
        print(f"  {message}")
        print(f"  💡 Recommendation: Visually compare both PDFs for:")
        print(f"     - Font rendering and clarity")
        print(f"     - Line spacing and margins")
        print(f"     - Section headers and formatting")
        print(f"     - Overall readability")
        
        return score, message
    
    def compare_citations(self) -> Tuple[float, str]:
        """
        Evaluate citation and bibliography formatting.
        
        Returns:
            Tuple of (score, message)
        """
        print("\n📚 Comparing citations...")
        
        latex_text = self.extract_text(self.latex_pdf)
        myst_text = self.extract_text(self.myst_pdf)
        
        if not latex_text or not myst_text:
            return 0.5, "Text extraction not available"
        
        # Look for common citation patterns
        citation_patterns = ['[', ']', '(', ')', 'et al', 'References', 'Bibliography']
        
        latex_has_refs = 'References' in latex_text or 'Bibliography' in latex_text
        myst_has_refs = 'References' in myst_text or 'Bibliography' in myst_text
        
        print(f"  LaTeX PDF: {'✓' if latex_has_refs else '✗'} References section detected")
        print(f"  MyST PDF: {'✓' if myst_has_refs else '✗'} References section detected")
        
        if latex_has_refs and myst_has_refs:
            message = "✓ Both PDFs contain references"
            score = 1.0
        elif not latex_has_refs and not myst_has_refs:
            message = "~ No references detected in either PDF"
            score = 0.7
        else:
            message = "✗ References missing in one PDF"
            score = 0.3
        
        print(f"  {message}")
        return score, message
    
    def compare_structure(self) -> Tuple[float, str]:
        """
        Evaluate overall document structure and layout.
        
        Returns:
            Tuple of (score, message)
        """
        print("\n🏗️  Comparing document structure...")
        
        latex_text = self.extract_text(self.latex_pdf)
        myst_text = self.extract_text(self.myst_pdf)
        
        if not latex_text or not myst_text:
            return 0.5, "Text extraction not available"
        
        # Compare text length as a proxy for content completeness
        latex_len = len(latex_text)
        myst_len = len(myst_text)
        
        print(f"  LaTeX PDF: ~{latex_len:,} characters")
        print(f"  MyST PDF: ~{myst_len:,} characters")
        
        if latex_len == 0 or myst_len == 0:
            return 0.3, "One PDF appears empty"
        
        ratio = min(latex_len, myst_len) / max(latex_len, myst_len)
        
        if ratio > 0.9:
            message = "✓ Content length is very similar"
            score = 1.0
        elif ratio > 0.75:
            message = "~ Content length differs moderately"
            score = 0.7
        else:
            message = "✗ Significant content length difference"
            score = 0.4
        
        print(f"  {message}")
        return score, message
    
    def compare(self) -> Dict[str, float]:
        """
        Run all comparison checks.
        
        Returns:
            Dictionary of comparison scores
        """
        print("=" * 60)
        print("PDF Quality Comparison")
        print("=" * 60)
        
        if not self.validate_pdfs():
            print("\n❌ Cannot proceed without both PDF files")
            return {}
        
        # Run all comparisons
        self.scores['pages'], _ = self.compare_page_count()
        self.scores['file_size'], _ = self.compare_file_size()
        self.scores['equations'], _ = self.compare_equations()
        self.scores['typography'], _ = self.compare_typography()
        self.scores['citations'], _ = self.compare_citations()
        self.scores['structure'], _ = self.compare_structure()
        
        return self.scores
    
    def generate_report(self, scores: Dict[str, float]) -> str:
        """
        Create human-readable comparison report.
        
        Args:
            scores: Dictionary of comparison scores
        
        Returns:
            Formatted report string
        """
        if not scores:
            return "No comparison data available"
        
        # Calculate overall score (weighted average)
        weights = {
            'pages': 0.1,
            'file_size': 0.1,
            'equations': 0.3,
            'typography': 0.2,
            'citations': 0.15,
            'structure': 0.15
        }
        
        overall = sum(scores.get(k, 0) * weights[k] for k in weights)
        
        report = "\n" + "=" * 60 + "\n"
        report += "📊 Comparison Summary\n"
        report += "=" * 60 + "\n\n"
        
        report += "Individual Scores:\n"
        for category, score in scores.items():
            bar = "█" * int(score * 20) + "░" * (20 - int(score * 20))
            report += f"  {category.capitalize():15} [{bar}] {score:.2f}\n"
        
        report += f"\n{'Overall Score':15} [{('█' * int(overall * 20) + '░' * (20 - int(overall * 20)))}] {overall:.2f}\n"
        
        report += "\n" + "=" * 60 + "\n"
        
        if overall >= 0.85:
            report += "✅ MyST PDF quality is EXCELLENT - comparable to LaTeX\n"
            report += "   Recommendation: MyST is suitable for production use\n"
        elif overall >= 0.70:
            report += "✓ MyST PDF quality is GOOD - minor differences from LaTeX\n"
            report += "   Recommendation: MyST is usable with minor adjustments\n"
        elif overall >= 0.50:
            report += "~ MyST PDF quality is ACCEPTABLE - noticeable differences\n"
            report += "   Recommendation: Review specific issues before production\n"
        else:
            report += "✗ MyST PDF quality needs IMPROVEMENT\n"
            report += "   Recommendation: Stick with LaTeX or address major issues\n"
        
        report += "=" * 60 + "\n"
        
        report += "\n💡 Next Steps:\n"
        report += "  1. Visually inspect both PDFs side-by-side\n"
        report += "  2. Check equation rendering quality in detail\n"
        report += "  3. Verify citations and bibliography formatting\n"
        report += "  4. Test with stakeholders/reviewers\n"
        report += "  5. Make decision on single source of truth approach\n"
        
        return report


def main():
    """CLI interface for PDF comparison."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Compare MyST and LaTeX PDF quality'
    )
    parser.add_argument(
        '--latex',
        default='public/whitepaper-latex.pdf',
        help='Path to LaTeX-generated PDF'
    )
    parser.add_argument(
        '--myst',
        default='public/whitepaper-myst.pdf',
        help='Path to MyST-generated PDF'
    )
    parser.add_argument(
        '--output',
        help='Save report to file'
    )
    
    args = parser.parse_args()
    
    comparator = PDFComparator(
        latex_pdf=args.latex,
        myst_pdf=args.myst
    )
    
    scores = comparator.compare()
    
    if not scores:
        return 1
    
    report = comparator.generate_report(scores)
    print(report)
    
    if args.output:
        Path(args.output).write_text(report)
        print(f"\n📄 Report saved to: {args.output}")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
