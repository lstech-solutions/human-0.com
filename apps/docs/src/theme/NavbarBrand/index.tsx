import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Custom Navbar Brand component that redirects to main site
export default function NavbarBrand() {
  const handleClick = () => {
    if (!ExecutionEnvironment.canUseDOM) return;

    const urlParams = new URLSearchParams(window.location.search);
    const currentLocale = urlParams.get('locale') || localStorage.getItem('docusaurus-locale') || 'en';
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8081' 
      : 'https://human-0.com';
    
    // Map Docusaurus locale back to web app locale
    const reverseLocaleMap = {
      'en': 'en',
      'es': 'es',
      'de': 'de-DE',
      'fr': 'fr-FR',
      'pt': 'pt-BR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
    };
    
    const webAppLocale = reverseLocaleMap[currentLocale] || 'en';
    const params = new URLSearchParams();
    params.append('locale', webAppLocale);
    params.append('dark', currentTheme === 'dark' ? 'true' : 'false');
    
    const paramString = params.toString();
    const finalUrl = `${baseUrl}${paramString ? '?' + paramString : ''}`;
    
    window.location.href = finalUrl;
  };

  return (
    <div className="navbar__brand" onClick={handleClick}>
      <img 
        className="navbar__logo" 
        src="/documentation/img/logo.svg" 
        alt="HUMΛN-Ø Logo"
      />
      <strong className="navbar__title">HUMΛN-Ø</strong>
    </div>
  );
}
