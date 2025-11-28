import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function PrivacyPage() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/privacy?locale=${currentLocale}`);
        const markdown = await response.text();
        
        // Convert markdown to HTML
        let html = markdown
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/gim, '<em>$1</em>')
          .replace(/_(.*?)_/gim, '<em>$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
          .replace(/^- (.*$)/gim, '<li>$1</li>')
          .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
          .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
          .replace(/^---$/gim, '<hr>')
          .replace(/\n\n/gim, '</p><p>')
          .replace(/\n/gim, '<br />');
        
        setContent('<p>' + html + '</p>');
        setError('');
      } catch (err) {
        setError('Error loading privacy policy.');
        setContent('');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentLocale]); // Refetch when locale changes
  
  return (
    <Layout title="Privacy Policy" description="HUMΛN-Ø Privacy Policy">
      <style>{`
        .privacy-content {
          color: #E6ECE8;
          font-size: 16px;
          line-height: 24px;
          max-width: 100%;
        }
        .privacy-content h1 {
          color: #E6ECE8;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 24px;
        }
        .privacy-content h2 {
          color: #E6ECE8;
          font-size: 24px;
          font-weight: bold;
          margin-top: 32px;
          margin-bottom: 16px;
        }
        .privacy-content h3 {
          color: #E6ECE8;
          font-size: 20px;
          font-weight: bold;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .privacy-content p {
          margin-bottom: 16px;
        }
        .privacy-content a {
          color: #00FF9C;
          text-decoration: underline;
        }
        .privacy-content ul, .privacy-content ol {
          margin-bottom: 16px;
          padding-left: 20px;
        }
        .privacy-content li {
          margin-bottom: 8px;
        }
        .privacy-content blockquote {
          border-left: 3px solid #00FF9C;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
        }
        .privacy-content hr {
          border: 1px solid #00FF9C;
          opacity: 0.3;
          margin: 24px 0;
        }
        .privacy-content strong {
          font-weight: bold;
        }
        .privacy-content em {
          font-style: italic;
        }
      `}</style>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            {loading ? (
              <div className="privacy-content">
                <p>Loading privacy policy...</p>
              </div>
            ) : error ? (
              <div className="privacy-content">
                <p>{error}</p>
              </div>
            ) : (
              <div className="privacy-content" dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
