# @human-0/i18n

Internationalization package for HUMΛN-Ø using i18next with Expo/React Native support.

## Features

- **Multi-platform**: Works with Expo, React Native, and Web
- **Smart fallbacks**: Region-specific locales fall back to language, then to English
- **RTL support**: Full right-to-left layout support for Arabic
- **OTA updates**: Ready for Locize cloud sync
- **Dynamic switching**: Change language without app restart

## Supported Locales

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English |
| `es` | Spanish | Español |
| `es-CO` | Spanish (Colombia) | Español (Colombia) |
| `es-MX` | Spanish (Mexico) | Español (México) |
| `es-ES` | Spanish (Spain) | Español (España) |
| `pt-BR` | Portuguese (Brazil) | Português (Brasil) |
| `fr-FR` | French (France) | Français (France) |
| `ar-SA` | Arabic (Saudi Arabia) | العربية |
| `zh-CN` | Chinese (Simplified) | 简体中文 |

## Usage

### Initialize (in root layout)

```tsx
// app/_layout.tsx
import "@human-0/i18n";
```

### Use translations

```tsx
import { useTranslation } from "@human-0/i18n";

function MyComponent() {
  const { t } = useTranslation();
  
  return <Text>{t("welcome.title")}</Text>;
}
```

### Use enhanced hooks

```tsx
import { useTranslation, useLanguagePicker } from "@human-0/i18n/hooks";

function LanguageSelector() {
  const { currentLanguage, languages, setLanguage } = useLanguagePicker();
  
  return (
    <Picker
      selectedValue={currentLanguage}
      onValueChange={(locale) => setLanguage(locale)}
    >
      {languages.map((lang) => (
        <Picker.Item 
          key={lang.code} 
          label={lang.nativeName} 
          value={lang.code} 
        />
      ))}
    </Picker>
  );
}
```

## Locize Integration

### Environment Variables

```bash
LOCIZE_PROJECT_ID=your-project-id
LOCIZE_API_KEY=your-api-key
```

### Manual Sync

```bash
# Download translations from Locize
pnpm --filter @human-0/i18n locize:download

# Upload local translations to Locize
pnpm --filter @human-0/i18n locize:upload
```

### Automated Sync

The CI workflow `sync-translations.yml` runs daily to:
1. Download latest translations from Locize
2. Commit changes to the repository

## Adding New Translations

1. Add keys to `locales/en.json`
2. Run `locize:upload` or wait for CI sync
3. Translate in Locize dashboard
4. Run `locize:download` or wait for CI sync

## Adding New Locales

1. Create `locales/{locale}.json` file
2. Add locale to `SUPPORTED_LOCALES` in `index.ts`
3. Add metadata to `LANGUAGE_META`
4. Import and register in `resources` config
