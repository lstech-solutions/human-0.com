import React, { useState } from 'react';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('locale') || 'en';
    }
    return 'en';
  });

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    setCurrentLocale(newLocale);
    
    // Update URL parameter
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('locale', newLocale);
      window.history.pushState({}, '', url.toString());
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('localeChanged', {
        detail: { locale: newLocale }
      }));
      
      // Reload page to apply new locale
      window.location.reload();
    }
  };

  return (
    <div className={styles.languageSwitcher}>
      <select
        className={styles.languageSelect}
        value={currentLocale}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="zh">中文</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}