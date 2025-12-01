#!/usr/bin/env python3
"""
Frontmatter Parser for MyST PDF Workflow

This module extracts and validates metadata from Markdown frontmatter
and synchronizes it with the myst.yml configuration file.
"""

import re
import yaml
from pathlib import Path
from typing import Dict, Optional, List


class FrontmatterParser:
    """Parser for extracting and managing Markdown frontmatter metadata."""
    
    def __init__(self, md_file: str):
        """
        Initialize parser with Markdown file path.
        
        Args:
            md_file: Path to the Markdown file
        """
        self.md_file = Path(md_file)
        if not self.md_file.exists():
            raise FileNotFoundError(f"Markdown file not found: {md_file}")
        
        self.content = self.md_file.read_text(encoding='utf-8')
        self.metadata = {}
    
    def extract_metadata(self) -> Dict:
        """
        Parse YAML frontmatter from Markdown file.
        
        Returns:
            Dictionary containing metadata fields
        """
        # Match YAML frontmatter between --- delimiters
        pattern = r'^---\s*\n(.*?)\n---\s*\n'
        match = re.match(pattern, self.content, re.DOTALL)
        
        if not match:
            print("Warning: No frontmatter found in Markdown file")
            return {}
        
        frontmatter_text = match.group(1)
        
        try:
            self.metadata = yaml.safe_load(frontmatter_text)
            if self.metadata is None:
                self.metadata = {}
            return self.metadata
        except yaml.YAMLError as e:
            raise ValueError(f"Invalid YAML in frontmatter: {e}")
    
    def validate_required_fields(self, required_fields: Optional[List[str]] = None) -> bool:
        """
        Ensure required metadata fields are present.
        
        Args:
            required_fields: List of required field names. 
                           Defaults to ['title', 'author', 'date']
        
        Returns:
            True if all required fields are present
        """
        if required_fields is None:
            required_fields = ['title', 'author', 'date']
        
        if not self.metadata:
            self.extract_metadata()
        
        missing_fields = [field for field in required_fields 
                         if field not in self.metadata or not self.metadata[field]]
        
        if missing_fields:
            print(f"Warning: Missing required fields: {', '.join(missing_fields)}")
            return False
        
        return True
    
    def sync_to_myst_config(self, myst_yml: str) -> None:
        """
        Update myst.yml with frontmatter metadata.
        
        Args:
            myst_yml: Path to myst.yml configuration file
        """
        myst_path = Path(myst_yml)
        
        if not myst_path.exists():
            raise FileNotFoundError(f"MyST config file not found: {myst_yml}")
        
        # Load existing myst.yml
        with open(myst_path, 'r', encoding='utf-8') as f:
            myst_config = yaml.safe_load(f)
        
        if myst_config is None:
            myst_config = {}
        
        # Ensure project section exists
        if 'project' not in myst_config:
            myst_config['project'] = {}
        
        # Extract metadata if not already done
        if not self.metadata:
            self.extract_metadata()
        
        # Sync title
        if 'title' in self.metadata:
            myst_config['project']['title'] = self.metadata['title']
        
        # Sync authors
        if 'author' in self.metadata:
            # Handle both string and list formats
            if isinstance(self.metadata['author'], str):
                myst_config['project']['authors'] = [
                    {'name': self.metadata['author']}
                ]
            elif isinstance(self.metadata['author'], list):
                myst_config['project']['authors'] = self.metadata['author']
        elif 'authors' in self.metadata:
            myst_config['project']['authors'] = self.metadata['authors']
        
        # Sync date
        if 'date' in self.metadata:
            myst_config['project']['date'] = self.metadata['date']
        
        # Sync version
        if 'version' in self.metadata:
            myst_config['project']['version'] = self.metadata['version']
        
        # Sync keywords
        if 'keywords' in self.metadata:
            myst_config['project']['keywords'] = self.metadata['keywords']
        
        # Sync description/subtitle
        if 'description' in self.metadata:
            myst_config['project']['subtitle'] = self.metadata['description']
        elif 'subtitle' in self.metadata:
            myst_config['project']['subtitle'] = self.metadata['subtitle']
        
        # Write updated config
        with open(myst_path, 'w', encoding='utf-8') as f:
            yaml.dump(myst_config, f, default_flow_style=False, sort_keys=False)
        
        print(f"✓ Synchronized metadata to {myst_yml}")
    
    def get_field(self, field_name: str, default: Optional[str] = None) -> Optional[str]:
        """
        Get a specific metadata field value.
        
        Args:
            field_name: Name of the field to retrieve
            default: Default value if field not found
        
        Returns:
            Field value or default
        """
        if not self.metadata:
            self.extract_metadata()
        
        return self.metadata.get(field_name, default)
    
    def print_metadata(self) -> None:
        """Print all extracted metadata in a readable format."""
        if not self.metadata:
            self.extract_metadata()
        
        print("\n=== Extracted Metadata ===")
        for key, value in self.metadata.items():
            if isinstance(value, list):
                print(f"{key}:")
                for item in value:
                    print(f"  - {item}")
            else:
                print(f"{key}: {value}")
        print("=" * 26 + "\n")


def main():
    """CLI interface for frontmatter parser."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Extract and manage Markdown frontmatter metadata'
    )
    parser.add_argument(
        'markdown_file',
        help='Path to Markdown file'
    )
    parser.add_argument(
        '--sync',
        metavar='MYST_YML',
        help='Sync metadata to myst.yml file'
    )
    parser.add_argument(
        '--validate',
        action='store_true',
        help='Validate required fields are present'
    )
    parser.add_argument(
        '--print',
        action='store_true',
        dest='print_meta',
        help='Print extracted metadata'
    )
    
    args = parser.parse_args()
    
    try:
        fm_parser = FrontmatterParser(args.markdown_file)
        fm_parser.extract_metadata()
        
        if args.print_meta:
            fm_parser.print_metadata()
        
        if args.validate:
            is_valid = fm_parser.validate_required_fields()
            if is_valid:
                print("✓ All required fields are present")
            else:
                print("✗ Some required fields are missing")
                return 1
        
        if args.sync:
            fm_parser.sync_to_myst_config(args.sync)
        
        return 0
    
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == '__main__':
    exit(main())
