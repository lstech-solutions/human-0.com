#!/usr/bin/env node

// Simple i18n key consistency checker
// Usage:
//   node scripts/check-i18n-locales.js
//
// Treats en.json as the source of truth and reports:
// - Keys missing in each other locale
// - Extra keys present only in a locale
// Writes a detailed report to scripts/i18n-report.txt

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'packages', 'i18n', 'locales');
const SOURCE_LOCALE = 'en.json';
const REPORT_PATH = path.join(__dirname, 'i18n-report.txt');

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading or parsing ${filePath}:`, err.message);
    process.exitCode = 1;
    return null;
  }
}

function collectKeys(obj, prefix = '') {
  const keys = new Set();

  if (obj === null || typeof obj !== 'object') {
    return keys;
  }

  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    keys.add(fullKey);

    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const childKeys = collectKeys(v, fullKey);
      for (const ck of childKeys) keys.add(ck);
    }
  }

  return keys;
}

function diffKeys(sourceKeys, targetKeys) {
  const missing = [];
  const extra = [];

  for (const key of sourceKeys) {
    if (!targetKeys.has(key)) missing.push(key);
  }

  for (const key of targetKeys) {
    if (!sourceKeys.has(key)) extra.push(key);
  }

  missing.sort();
  extra.sort();

  return { missing, extra };
}

function main() {
  const sourcePath = path.join(LOCALES_DIR, SOURCE_LOCALE);
  const sourceJson = loadJson(sourcePath);
  if (!sourceJson) return;

  const sourceKeys = collectKeys(sourceJson);
  const reportLines = [];

  const header = `Source locale: ${SOURCE_LOCALE}\nTotal keys: ${sourceKeys.size}`;
  console.log(header);
  console.log('');
  reportLines.push(header, '');

  let localeFiles;
  try {
    localeFiles = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json'));
  } catch (err) {
    console.error('Error reading locales directory:', err.message);
    process.exitCode = 1;
    return;
  }

  for (const locale of localeFiles) {
    if (locale === SOURCE_LOCALE) continue;

    const localePath = path.join(LOCALES_DIR, locale);
    const localeJson = loadJson(localePath);
    if (!localeJson) continue;

    const localeKeys = collectKeys(localeJson);
    const { missing, extra } = diffKeys(sourceKeys, localeKeys);

    const localeHeader = `=== Locale: ${locale} ===`;
    const totalKeysLine = `Total keys: ${localeKeys.size}`;

    console.log(localeHeader);
    console.log(totalKeysLine);
    reportLines.push(localeHeader, totalKeysLine);

    if (missing.length === 0) {
      console.log('  ✅ No missing keys compared to en.json');
      reportLines.push('  ✅ No missing keys compared to en.json');
    } else {
      console.log(`  ❗ Missing keys (${missing.length}):`);
      reportLines.push(`  ❗ Missing keys (${missing.length}):`);
      for (const key of missing) {
        const line = `    - ${key}`;
        console.log(line);
        reportLines.push(line);
      }
    }

    if (extra.length === 0) {
      console.log('  ✅ No extra keys compared to en.json');
      reportLines.push('  ✅ No extra keys compared to en.json');
    } else {
      console.log(`  ℹ️ Extra keys (${extra.length}):`);
      reportLines.push(`  ℹ️ Extra keys (${extra.length}):`);
      for (const key of extra) {
        const line = `    + ${key}`;
        console.log(line);
        reportLines.push(line);
      }
    }

    console.log('');
    reportLines.push('', '');
  }

  try {
    fs.writeFileSync(REPORT_PATH, reportLines.join('\n'), 'utf8');
    console.log(`i18n report written to: ${REPORT_PATH}`);
  } catch (err) {
    console.error('Error writing i18n report file:', err.message);
    process.exitCode = 1;
  }
}

main();
