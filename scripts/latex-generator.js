#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class LaTeXGenerator {
  constructor() {
    this.canvasData = this.loadCanvasData();
    this.outputDir = path.join(__dirname, '../output');
    this.texDir = path.join(__dirname, '../latex');
  }

  loadCanvasData() {
    try {
      // Load canvas sections from the main app
      const indexPath = path.join(__dirname, '../apps/web/app/index.tsx');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Extract canvas sections (simplified parsing)
      const sectionsMatch = indexContent.match(/const canvasSections.*?(\[.*?\]);/s);
      if (!sectionsMatch) {
        throw new Error('Could not find canvas sections');
      }
      
      // This is a simplified extraction - in production you'd want proper parsing
      return this.parseCanvasSections(sectionsMatch[1]);
    } catch (error) {
      console.error('Error loading canvas data:', error.message);
      return this.getDefaultCanvasData();
    }
  }

  parseCanvasSections(sectionString) {
    // Fallback to default data if parsing fails
    return this.getDefaultCanvasData();
  }

  getDefaultCanvasData() {
    return [
      {
        title: 'Key Partners',
        subtitle: 'External companies and suppliers that help carry out key activities',
        content: [
          'Environmental NGOs - Collaboration with 15+ leading conservation organizations',
          'Carbon Offset Projects - 50+ projects verified by Verra and Gold Standard',
          'Blockchain Validators - Auditing and certification by 8+ specialized firms',
          'Green Energy Providers - Contracts with 20+ renewable energy generators',
          'Sustainability Consultants - Team of 30+ ESG and carbon neutrality experts',
          'Impact Organizations - Partnerships with 25+ international NGOs'
        ],
        metrics: {
          kpi: '95% partner retention rate',
          growth: '+180% annual growth',
          efficiency: '85% operational cost reduction',
          target: '200+ partners by 2025'
        }
      },
      {
        title: 'Key Activities',
        subtitle: 'Most important activities in executing value proposition',
        content: [
          'Impact Verification - Processing 1000+ monthly verifications with AI',
          'NFT Minting and Trading - Issuing 5000+ verified carbon NFTs',
          'Smart Contract Development - 50+ contracts deployed on Ethereum/Polygon',
          'Community Management - Moderating 10000+ Discord/Telegram members',
          'Carbon Credit Management - Administering 1M+ CO2e tons',
          'Data Analytics - Processing 5TB+ data with ML/AI'
        ],
        metrics: {
          kpi: '99.9% system uptime',
          growth: '+300% transaction processing',
          efficiency: '2.3x speed improvement',
          target: '10M+ transactions/year'
        }
      },
      {
        title: 'Value Propositions',
        subtitle: 'Unique product or service that creates value for customers',
        content: [
          'Transparent Impact Tracking - Immutable blockchain with full traceability',
          'Web3-Based Carbon Credits - Real tokenization with UNFCCC standards',
          'Gamified Sustainability - 85% engagement with level and reward systems',
          'NFT Achievement System - 100+ unlockable achievements with variable rarity',
          'Decentralized Verification - Distributed consensus with Proof-of-Stake',
          'Real-Time Dashboards - Instant updates with WebSockets'
        ],
        metrics: {
          kpi: '4.8/5 user satisfaction',
          growth: '+450% monthly adoption',
          efficiency: '90% fraud reduction',
          target: '1M+ active users'
        }
      },
      {
        title: 'Customer Relationships',
        subtitle: 'Types of relationships established with customer segments',
        content: [
          'Community Building - 50+ monthly events with 500+ attendees',
          'Impact Analysis Dashboard - AI-powered personalization and recommendations',
          'Personalized Recommendations - 95% accuracy with ML algorithms',
          'Achievement System - Gamification with 50+ levels and exclusive badges',
          'Social Sharing Functions - 10K+ daily shares across networks',
          '24/7 Support - <2min response time with chatbots and agents'
        ],
        metrics: {
          kpi: '92% retention rate',
          growth: '+250% NPS score',
          efficiency: '80% automated support',
          target: '95% satisfaction'
        }
      },
      {
        title: 'Customer Segments',
        subtitle: 'Different groups of people or organizations targeted',
        content: [
          'Eco-Conscious Individuals - 45% of market with >$50K annual income',
          'Corporate Sustainability Teams - 200+ Fortune 500 companies',
          'Environmental Organizations - 500+ NGOs with >$1M budgets',
          'Web3 Enthusiasts - 100K+ users with active wallets',
          'Impact Investors - $50M+ assets under management',
          'Educational Projects - 100+ K-12 and university institutions'
        ],
        metrics: {
          kpi: '35% market penetration',
          growth: '+400% new segments',
          efficiency: '$25 average LTV',
          target: '5M+ total users'
        }
      },
      {
        title: 'Key Resources',
        subtitle: 'Main inputs required to carry out key activities',
        content: [
          'Blockchain Infrastructure - 15 global nodes with 99.9% uptime',
          'Smart Contract Codebase - 200K+ lines with complete audits',
          'Carbon Offset Alliances - 50+ verified partners',
          'Community Platform - 100K+ MAU with 45% engagement',
          'Data Analytics Systems - ML/AI pipeline with TensorFlow',
          'Expert Technical Team - 50+ senior developers and blockchain engineers'
        ],
        metrics: {
          kpi: '300% infrastructure ROI',
          growth: '+200% processing capacity',
          efficiency: '95% resource utilization',
          target: '100+ developers'
        }
      },
      {
        title: 'Channels',
        subtitle: 'How value propositions reach customer segments',
        content: [
          'Mobile App (iOS/Android) - 150K+ downloads with 4.5★ rating',
          'Web Platform - 300K+ monthly visitors with 12% conversion',
          'Social Media Campaigns - 1M+ reach with 3.2% engagement',
          'Partner Networks - 50+ active channels with variable commissions',
          'Community Events - 20+ monthly events with 500+ attendees',
          'Content Marketing - 200+ articles with 50K+ readers'
        ],
        metrics: {
          kpi: '12% conversion rate',
          growth: '+350% organic traffic',
          efficiency: '$2.5 average CPA',
          target: '500K+ total users'
        }
      },
      {
        title: 'Cost Structure',
        subtitle: 'All costs involved in operating the business model',
        content: [
          'Blockchain Gas Fees - 15% of total with Layer 2 optimization',
          'Platform Development - 25% of total with 50+ developers',
          'Marketing and Community - 20% of total with 3.2x ROI',
          'Partnership Management - 10% of total with 50+ active alliances',
          'Compliance and Auditing - 8% of total with ISO certifications',
          'Technical Infrastructure - 22% of total with cloud providers'
        ],
        metrics: {
          kpi: '$2.5M annual burn rate',
          growth: '+180% cost optimization',
          efficiency: '30% reduction vs industry',
          target: '$1.8M burn rate'
        }
      },
      {
        title: 'Revenue Streams',
        subtitle: 'Sources from which the company generates money',
        content: [
          'NFT Minting Fees - 35% of revenue with 2.5% fee',
          'Transaction Fees - 25% of revenue with 1% fee',
          'Premium Analytics - 15% of revenue with $49/month subscription',
          'Corporate Partnerships - 15% of revenue with annual contracts',
          'Carbon Credit Trading - 5% of revenue with 0.5% spread',
          'Pro Subscriptions - 5% of revenue with $99/month plan'
        ],
        metrics: {
          kpi: '$5M+ annual ARR',
          growth: '+600% revenue growth',
          efficiency: '75% gross margin',
          target: '$10M+ ARR'
        }
      }
    ];
  }

  generateLaTeX() {
    const latex = this.createLaTeXDocument();
    
    // Ensure directories exist
    if (!fs.existsSync(this.texDir)) fs.mkdirSync(this.texDir, { recursive: true });
    if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
    
    // Write LaTeX file
    const texFile = path.join(this.texDir, 'business-model-canvas.tex');
    fs.writeFileSync(texFile, latex);
    
    console.log(`✅ LaTeX file generated: ${texFile}`);
    return texFile;
  }

  createLaTeXDocument() {
    const currentDate = new Date().toLocaleDateString();
    let content = `\\documentclass[11pt,letterpaper]{article}

% Packages
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{fancyhdr}
\\usepackage{lastpage}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{tcolorbox}
\\usepackage{tikz}
\\usepackage{hyperref}
\\usepackage{array}
\\usepackage{tabularx}
\\usepackage{booktabs}

% Custom colors
\\definecolor{neongreen}{RGB}{0,255,156}
\\definecolor{darkbg}{RGB}{15,23,42}
\\definecolor{lightgray}{RGB}{128,128,128}
\\definecolor{boxgray}{RGB}{245,245,245}

% Page setup
\\geometry{
  left=1in,
  right=1in,
  top=1in,
  bottom=1in
}

% Hyperref setup
\\hypersetup{
  colorlinks=true,
  linkcolor=neongreen,
  urlcolor=neongreen,
  pdftitle={HUMΛN-Ø Business Model Canvas},
  pdfauthor={HUMΛN-Ø Team},
  pdfsubject={Business Model Canvas},
  pdfkeywords={Business Model, Canvas, Sustainability, Web3, Impact}
}

% Header and footer
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textcolor{neongreen}{\\textbf{HUMΛN-Ø}}}
\\fancyhead[C]{\\textcolor{lightgray}{Business Model Canvas}}
\\fancyhead[R]{\\textcolor{lightgray}{\\today}}
\\fancyfoot[C]{\\textcolor{lightgray}{Page \\thepage of \\pageref{LastPage}}}

% Custom commands
\\newcommand{\\sectiontitle}[1]{\\textcolor{neongreen}{\\textbf{#1}}}
\\newcommand{\\metricbox}[4]{{
  \\begin{tcolorbox}[
    colback=boxgray,
    colframe=neongreen,
    width=3.5cm,
    height=2cm,
    valign=center,
    halign=center,
    fonttitle=\\bfseries,
    title=#1
  ]
    \\textbf{#2}\\\\
    \\small #3\\\\
    \\footnotesize #4
  \\end{tcolorbox}
}}

\\begin{document}

% Title page
\\begin{titlepage}
  \\centering
  \\vspace*{2cm}
  
  \\textcolor{neongreen}{\\Huge \\textbf{HUMΛN-Ø}}\\\\[0.5cm]
  \\textcolor{lightgray}{\\Large Business Model Canvas}\\\\[1cm]
  
  \\textcolor{lightgray}{\\large Sustainable Impact Through Web3 Technology}\\\\[1.5cm]
  
  \\begin{tikzpicture}
    \\draw[neongreen, thick] (0,0) -- (8,0);
  \\end{tikzpicture}\\\\[1cm]
  
  \\textcolor{lightgray}{\\normalsize Generated: ${currentDate}}\\\\[0.5cm]
  \\textcolor{lightgray}{\\normalsize Version 1.0.0}\\\\[0.5cm]
  \\textcolor{lightgray}{\\normalsize 🌐 www.human-zero.io}
  
  \\vfill
  
  \\begin{tcolorbox}[
    colback=darkbg,
    colframe=neongreen,
    width=0.8\\textwidth,
    valign=center,
    halign=center
  ]
    \\textcolor{white}{\\textit{Transforming sustainable impact through innovative Web3 technology and blockchain-based carbon credit solutions.}}
  \\end{tcolorbox}
  
  \\vspace*{2cm}
\\end{titlepage}

% Table of contents
\\tableofcontents
\\newpage

% Executive Summary
\\section{Executive Summary}
\\sectiontitle{Overview}

HUMΛN-Ø represents a revolutionary approach to sustainable impact through Web3 technology. Our business model leverages blockchain technology to create transparent, verifiable, and tradable carbon credits, enabling organizations and individuals to participate meaningfully in climate action.

\\sectiontitle{Mission Statement}
To democratize climate action by making carbon credit trading accessible, transparent, and impactful through innovative Web3 solutions.

\\sectiontitle{Core Value Proposition}
\\begin{itemize}
  \\item \\textbf{Transparency}: Immutable blockchain records for full traceability
  \\item \\textbf{Accessibility}: Lowered barriers to carbon credit participation
  \\item \\textbf{Impact}: Measurable and verifiable environmental benefits
  \\item \\textbf{Innovation}: Gamification and NFT integration for engagement
\\end{itemize}

% Business Model Canvas Sections
`;

    // Add each canvas section
    this.canvasData.forEach((section, index) => {
      content += this.generateSection(section, index + 1);
    });

    // Add conclusion and appendices
    content += `
% Conclusion
\\section{Conclusion}
\\sectiontitle{Strategic Outlook}

The HUMΛN-Ø Business Model Canvas demonstrates a comprehensive approach to sustainable impact through Web3 technology. By leveraging blockchain's transparency and gamification's engagement power, we create a unique value proposition in the carbon credit market.

\\sectiontitle{Key Success Factors}
\\begin{enumerate}
  \\item Strong partnerships with environmental organizations
  \\item Robust technological infrastructure
  \\item Clear value proposition for diverse customer segments
  \\item Sustainable revenue streams with multiple sources
  \\item Scalable cost structure optimized for growth
\\end{enumerate}

\\sectiontitle{Next Steps}
\\begin{itemize}
  \\item Expand partner network to 200+ organizations
  \\item Scale user base to 1M+ active participants
  \\item Launch premium analytics platform
  \\item Establish global carbon credit marketplace
  \\item Achieve $10M+ annual recurring revenue
\\end{itemize}

% Appendices
\\appendix
\\section{Technical Specifications}
\\sectiontitle{Blockchain Infrastructure}

\\begin{itemize}
  \\item \\textbf{Platform}: Ethereum Mainnet and Polygon
  \\item \\textbf{Smart Contracts}: 50+ audited contracts
  \\item \\textbf{Nodes}: 15 global distributed nodes
  \\item \\textbf{Uptime}: 99.9\\% availability guarantee
\\end{itemize}

\\sectiontitle{Security Measures}

\\begin{itemize}
  \\item Multi-layer security protocols
  \\item Regular third-party audits
  \\item Enterprise-grade encryption
  \\item Compliance with international standards
\\end{itemize}

% Contact Information
\\section{Contact Information}
\\begin{center}
  \\begin{tcolorbox}[
    colback=boxgray,
    colframe=neongreen,
    width=0.6\\textwidth,
    valign=center,
    halign=center
  ]
    \\textbf{HUMΛN-Ø Team}\\\\[0.5cm]
    📧 info@human-zero.io\\\\
    🌐 www.human-zero.io\\\\
    🐦 @human_zero\\\\
    💼 HUMΛN-Ø
  \\end{tcolorbox}
\\end{center}

\\vspace*{2cm}
\\begin{center}
  \\textcolor{lightgray}{\\small © 2025 HUMΛN-Ø - Sustainable Impact Through Web3 Technology}
\\end{center}

\\end{document}
`;

    return content;
  }

  generateSection(section, sectionNumber) {
    const content = section.content.map(item => 
      `\\item ${this.escapeLaTeX(item)}`
    ).join('\n');

    return `
% Section ${sectionNumber}: ${section.title}
\\section{${section.title}}
\\sectiontitle{${section.subtitle}}

\\subsection{Key Components}
\\begin{itemize}
${content}
\\end{itemize}

\\subsection{Performance Metrics}
\\vspace{0.5cm}
\\begin{center}
  \\metricbox{KPI}{${this.escapeLaTeX(section.metrics.kpi)}}{Performance}{Key Performance}
  \\hspace{0.5cm}
  \\metricbox{Growth}{${this.escapeLaTeX(section.metrics.growth)}}{Growth Rate}{Annual Growth}
  \\hspace{0.5cm}
  \\metricbox{Efficiency}{${this.escapeLaTeX(section.metrics.efficiency)}}{Efficiency}{Operational}
  \\hspace{0.5cm}
  \\metricbox{Target}{${this.escapeLaTeX(section.metrics.target)}}{Target}{Goal}
\\end{center}

\\vspace{1cm}

`;
  }

  escapeLaTeX(text) {
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/\^/g, '\\^')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}');
  }

  compilePDF(texFile) {
    try {
      console.log('🔨 Compiling LaTeX PDF...');
      
      // Change to tex directory
      const originalDir = process.cwd();
      process.chdir(this.texDir);
      
      try {
        // Run pdflatex (multiple times for proper references)
        execSync('pdflatex -interaction=nonstopmode business-model-canvas.tex', { stdio: 'inherit' });
        execSync('pdflatex -interaction=nonstopmode business-model-canvas.tex', { stdio: 'inherit' });
        
        // Move PDF to output directory
        const pdfFile = path.join(this.texDir, 'business-model-canvas.pdf');
        const outputFile = path.join(this.outputDir, 'HUMAN-ZERO-Business-Model-Canvas.pdf');
        
        if (fs.existsSync(pdfFile)) {
          fs.copyFileSync(pdfFile, outputFile);
          console.log(`✅ PDF generated: ${outputFile}`);
          
          // Clean up auxiliary files
          ['aux', 'log', 'out', 'toc'].forEach(ext => {
            const auxFile = path.join(this.texDir, `business-model-canvas.${ext}`);
            if (fs.existsSync(auxFile)) fs.unlinkSync(auxFile);
          });
          
          return outputFile;
        } else {
          throw new Error('PDF generation failed');
        }
      } finally {
        // Always restore original directory
        process.chdir(originalDir);
      }
      
    } catch (error) {
      console.error('❌ LaTeX compilation failed:', error.message);
      return null;
    }
  }

  generate() {
    console.log('🚀 Generating LaTeX Business Model Canvas...');
    
    // Generate LaTeX file
    const texFile = this.generateLaTeX();
    
    // Try to compile PDF
    const pdfFile = this.compilePDF(texFile);
    
    if (pdfFile) {
      console.log(`🎉 Successfully generated comprehensive LaTeX PDF: ${pdfFile}`);
      return pdfFile;
    } else {
      console.log('⚠️  PDF compilation failed. LaTeX file generated but requires manual compilation.');
      console.log('💡 To compile manually:');
      console.log(`   cd ${this.texDir}`);
      console.log('   pdflatex business-model-canvas.tex');
      return texFile;
    }
  }
}

// CLI Interface
if (require.main === module) {
  const generator = new LaTeXGenerator();
  generator.generate();
}

module.exports = LaTeXGenerator;
