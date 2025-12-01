"""
LaTeX Parser Module

Provides utilities for parsing LaTeX documents and extracting structure, metadata, and content.
"""

import re
from dataclasses import dataclass
from typing import List, Dict, Optional
from pathlib import Path


@dataclass
class WhitepaperMetadata:
    """Metadata extracted from LaTeX document"""
    title: str
    author: str
    date: str
    version: str
    contact: str = ""


@dataclass
class Section:
    """Represents a section in the document"""
    title: str
    level: int  # 1 for section, 2 for subsection, etc.
    content: str
    label: str = ""


@dataclass
class Chapter:
    """Represents a chapter in the document"""
    title: str
    label: str
    content: str
    sections: List[Section]
    is_appendix: bool = False


@dataclass
class Citation:
    """Represents a BibTeX citation"""
    key: str
    entry_type: str  # article, book, etc.
    fields: Dict[str, str]


class LaTeXParser:
    """Parser for LaTeX documents"""
    
    def __init__(self, tex_file_path: str):
        """
        Initialize parser with LaTeX file path
        
        Args:
            tex_file_path: Path to the .tex file
        """
        self.tex_file_path = Path(tex_file_path)
        if not self.tex_file_path.exists():
            raise FileNotFoundError(f"LaTeX file not found: {tex_file_path}")
        
        with open(self.tex_file_path, 'r', encoding='utf-8') as f:
            self.content = f.read()
    
    def extract_metadata(self) -> WhitepaperMetadata:
        """
        Extract title, author, date, version from preamble
        
        Returns:
            WhitepaperMetadata object with extracted information
        """
        # Extract title - handle nested braces
        title_match = re.search(r'\\title\{(.*?)\}(?:\s|\\)', self.content, re.DOTALL)
        if title_match:
            title_raw = title_match.group(1)
            # Handle nested braces by counting
            brace_count = 0
            end_pos = 0
            for i, char in enumerate(title_raw):
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count < 0:
                        end_pos = i
                        break
            if end_pos > 0:
                title_raw = title_raw[:end_pos]
            title = self._clean_latex_text(title_raw)
        else:
            title = "Untitled"
        
        # Extract author
        author_match = re.search(r'\\author\{([^}]+)\}', self.content)
        author = self._clean_latex_text(author_match.group(1)) if author_match else "Unknown"
        
        # Extract date
        date_match = re.search(r'\\date\{([^}]+)\}', self.content)
        if date_match:
            date = self._clean_latex_text(date_match.group(1))
            # Replace \today with actual date placeholder
            if '\\today' in date or 'today' in date.lower():
                from datetime import datetime
                date = datetime.now().strftime('%Y-%m-%d')
        else:
            date = ""
        
        # Extract version from date (format: \date{\today\ \\ {\small Version 1.0.0}})
        version = ""
        if date:
            version_match = re.search(r'Version\s+([\d.]+)', date)
            if version_match:
                version = version_match.group(1)
        
        # Extract contact email
        contact_match = re.search(r'\\texttt\{([^}]+@[^}]+)\}', self.content)
        contact = contact_match.group(1) if contact_match else ""
        
        return WhitepaperMetadata(
            title=title,
            author=author,
            date=date,
            version=version,
            contact=contact
        )
    
    def extract_chapters(self) -> List[Chapter]:
        """
        Extract all chapters with their content
        
        Returns:
            List of Chapter objects
        """
        chapters = []
        
        # Find all chapters (including starred chapters like \chapter*)
        chapter_pattern = r'\\chapter\*?\{([^}]+)\}(.*?)(?=\\chapter|\\appendix|\\bibliography|\\end\{document\})'
        
        # Check if we're in appendix mode
        appendix_start = self.content.find('\\appendix')
        
        for match in re.finditer(chapter_pattern, self.content, re.DOTALL):
            title = match.group(1)
            content = match.group(2)
            
            # Extract label if present
            label_match = re.search(r'\\label\{([^}]+)\}', content)
            label = label_match.group(1) if label_match else ""
            
            # Check if this is an appendix chapter
            is_appendix = appendix_start != -1 and match.start() > appendix_start
            
            # Extract sections from this chapter
            sections = self.extract_sections(content)
            
            chapters.append(Chapter(
                title=self._clean_latex_text(title),
                label=label,
                content=content,
                sections=sections,
                is_appendix=is_appendix
            ))
        
        return chapters
    
    def extract_sections(self, chapter_content: str) -> List[Section]:
        """
        Extract sections from chapter content
        
        Args:
            chapter_content: The content of a chapter
            
        Returns:
            List of Section objects
        """
        sections = []
        
        # Pattern for sections at different levels
        patterns = [
            (r'\\section\{([^}]+)\}', 1),
            (r'\\subsection\{([^}]+)\}', 2),
            (r'\\subsubsection\{([^}]+)\}', 3),
        ]
        
        for pattern, level in patterns:
            for match in re.finditer(pattern, chapter_content):
                title = match.group(1)
                
                # Extract content until next section or end
                start = match.end()
                # Find next section of any level
                next_section = re.search(
                    r'\\(?:sub)*section\{',
                    chapter_content[start:]
                )
                end = start + next_section.start() if next_section else len(chapter_content)
                content = chapter_content[start:end]
                
                # Extract label if present
                label_match = re.search(r'\\label\{([^}]+)\}', content)
                label = label_match.group(1) if label_match else ""
                
                sections.append(Section(
                    title=self._clean_latex_text(title),
                    level=level,
                    content=content,
                    label=label
                ))
        
        return sections
    
    def extract_bibliography_entries(self, bib_file_path: str) -> List[Citation]:
        """
        Parse BibTeX file and return citation entries
        
        Args:
            bib_file_path: Path to .bib file
            
        Returns:
            List of Citation objects
        """
        bib_path = Path(bib_file_path)
        if not bib_path.exists():
            return []
        
        with open(bib_path, 'r', encoding='utf-8') as f:
            bib_content = f.read()
        
        citations = []
        
        # Pattern to match BibTeX entries
        entry_pattern = r'@(\w+)\{([^,]+),\s*(.*?)\n\}'
        
        for match in re.finditer(entry_pattern, bib_content, re.DOTALL):
            entry_type = match.group(1).lower()
            key = match.group(2).strip()
            fields_str = match.group(3)
            
            # Parse fields
            fields = {}
            field_pattern = r'(\w+)\s*=\s*\{([^}]+)\}'
            for field_match in re.finditer(field_pattern, fields_str):
                field_name = field_match.group(1).lower()
                field_value = field_match.group(2)
                fields[field_name] = field_value
            
            citations.append(Citation(
                key=key,
                entry_type=entry_type,
                fields=fields
            ))
        
        return citations
    
    def get_abstract(self) -> str:
        """
        Extract abstract if present
        
        Returns:
            Abstract text or empty string
        """
        abstract_match = re.search(
            r'\\begin\{abstract\}(.*?)\\end\{abstract\}',
            self.content,
            re.DOTALL
        )
        if abstract_match:
            return self._clean_latex_text(abstract_match.group(1))
        return ""
    
    def _clean_latex_text(self, text: str) -> str:
        """
        Remove LaTeX commands and clean up text
        
        Args:
            text: Raw LaTeX text
            
        Returns:
            Cleaned text
        """
        # Remove comments
        text = re.sub(r'%.*$', '', text, flags=re.MULTILINE)
        
        # Remove line breaks and extra whitespace
        text = re.sub(r'\\\\', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common LaTeX commands but keep their content
        text = re.sub(r'\\(?:textbf|textit|emph|texttt)\{([^}]+)\}', r'\1', text)
        text = re.sub(r'\\Large', '', text)
        text = re.sub(r'\\small', '', text)
        text = re.sub(r'\\large', '', text)
        
        # Remove special characters and math mode
        text = re.sub(r'\$([^$]+)\$', r'\1', text)  # Remove inline math delimiters
        text = re.sub(r'\\Lambda', 'Λ', text)
        text = re.sub(r'\\&', '&', text)
        
        return text.strip()
    
    def find_citations(self) -> List[str]:
        """
        Find all citation keys used in the document
        
        Returns:
            List of citation keys
        """
        citations = set()
        
        # Find \cite{key} and \citep{key}
        cite_pattern = r'\\cite[pt]?\{([^}]+)\}'
        for match in re.finditer(cite_pattern, self.content):
            keys = match.group(1).split(',')
            citations.update(k.strip() for k in keys)
        
        return sorted(list(citations))
    
    def get_document_class(self) -> str:
        """
        Extract document class
        
        Returns:
            Document class name
        """
        match = re.search(r'\\documentclass(?:\[[^\]]*\])?\{([^}]+)\}', self.content)
        return match.group(1) if match else "article"
