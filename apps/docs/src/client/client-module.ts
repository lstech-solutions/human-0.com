// Simple client module using locale detection
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { initializeSimpleLocale } from './locale';

// Initialize custom language switcher using plain HTML/JS
function initializeCustomLanguageSwitcher() {
  if (!ExecutionEnvironment.canUseDOM) return;
  
  const checkForSwitcherContainer = () => {
    const container = document.getElementById('custom-language-switcher');
    
    if (container) {
      // Create language switcher using plain HTML
      const languages = [
        { code: 'en', label: '🇺🇸 English' },
        { code: 'es', label: '🇪🇸 Español' },
        { code: 'de-DE', label: '🇩🇪 Deutsch' },
        { code: 'fr-FR', label: '🇫🇷 Français' },
        { code: 'pt-BR', label: '🇧🇷 Português' },
        { code: 'zh-CN', label: '🇨🇳 中文' },
        { code: 'ar-SA', label: '🇸🇦 العربية' },
        { code: 'es-CO', label: '🇨🇴 Español (Colombia)' },
        { code: 'es-ES', label: '🇪🇸 Español (España)' },
        { code: 'es-MX', label: '🇲🇽 Español (México)' },
      ];

      // Get current locale from URL
      const getCurrentLocale = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || 'en';
      };

      // Create select element
      const select = document.createElement('select');
      select.className = 'language-select';
      select.style.cssText = `
        background: var(--ifm-background-color);
        border: 1px solid var(--ifm-color-emphasis-300);
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 14px;
        color: var(--ifm-color-emphasis-900);
        cursor: pointer;
      `;

      // Add options
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.label;
        if (lang.code === getCurrentLocale()) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      // Add change handler
      select.addEventListener('change', (e) => {
        const newLocale = (e.target as HTMLSelectElement).value;
        
        // Update URL parameter
        const url = new URL(window.location.href);
        url.searchParams.set('locale', newLocale);
        
        // Update URL without page reload
        window.history.pushState({}, '', url.toString());
        
        // Store preference
        localStorage.setItem('docusaurus-locale', newLocale);
        
        // Trigger locale change event
        const event = new CustomEvent('localeChanged', { 
          detail: { locale: newLocale } 
        });
        window.dispatchEvent(event);
        
        // Reload to apply changes
        window.location.reload();
      });

      // Add hover effect
      select.addEventListener('mouseenter', () => {
        select.style.borderColor = 'var(--ifm-color-primary)';
      });
      
      select.addEventListener('mouseleave', () => {
        select.style.borderColor = 'var(--ifm-color-emphasis-300)';
      });

      // Append to container
      container.appendChild(select);
      console.log('Custom language switcher initialized');
    } else {
      // Try again after a delay if not found yet
      setTimeout(checkForSwitcherContainer, 100);
    }
  };
  
  checkForSwitcherContainer();
}

// Initialize on page load
if (ExecutionEnvironment.canUseDOM) {
  // Use simple locale detection
  initializeSimpleLocale();
  
  // Initialize custom language switcher
  initializeCustomLanguageSwitcher();
}
