#!/usr/bin/env node

/**
 * Script to convert react-auto-intl output (next-intl format) 
 * to our LanguageContext format
 */

const fs = require('fs');
const path = require('path');

// Read the extracted translations
const enJsonPath = path.join(__dirname, '../i18n/messages/en.json');
const thJsonPath = path.join(__dirname, '../i18n/messages/th.json');

if (!fs.existsSync(enJsonPath)) {
  console.error('en.json not found. Run: npx react-auto-intl extract');
  process.exit(1);
}

const enMessages = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const thMessages = fs.existsSync(thJsonPath) 
  ? JSON.parse(fs.readFileSync(thJsonPath, 'utf8'))
  : {};

// Filter out CSS classes and non-translatable strings
function isTranslatable(key, value) {
  // Skip CSS classes, technical strings, and very short strings
  if (value.includes('px-') || value.includes('py-') || value.includes('w-') || value.includes('h-')) {
    return false;
  }
  if (value.includes('rounded-') || value.includes('bg-') || value.includes('text-')) {
    return false;
  }
  if (value.length < 3) {
    return false;
  }
  // Skip if it's mostly CSS classes
  if (value.split(' ').length > 5 && value.includes('-')) {
    return false;
  }
  return true;
}

// Convert next-intl format to flat key format
function convertToFlatFormat(messages, prefix = '') {
  const result = {};
  
  for (const [component, strings] of Object.entries(messages)) {
    for (const [key, value] of Object.entries(strings)) {
      if (typeof value === 'string' && isTranslatable(key, value)) {
        // Create a flat key like: component.key
        const flatKey = prefix ? `${prefix}.${component}.${key}` : `${component}.${key}`;
        result[flatKey] = value;
      } else if (typeof value === 'object') {
        // Recursive for nested objects
        Object.assign(result, convertToFlatFormat({ [key]: value }, component));
      }
    }
  }
  
  return result;
}

// Convert to our format
const enFlat = convertToFlatFormat(enMessages);
const thFlat = convertToFlatFormat(thMessages);

// Read existing LanguageContext
const langContextPath = path.join(__dirname, '../src/contexts/LanguageContext.tsx');
const langContextContent = fs.readFileSync(langContextPath, 'utf8');

// Extract existing translations
const existingEnMatch = langContextContent.match(/en:\s*\{([\s\S]*?)\s*\},/);
const existingThMatch = langContextContent.match(/th:\s*\{([\s\S]*?)\s*\},/);

console.log('📊 Translation Conversion Report:');
console.log(`   Found ${Object.keys(enFlat).length} new translatable strings`);
console.log(`   Found ${Object.keys(thFlat).length} Thai translations`);

// Generate output
const outputPath = path.join(__dirname, '../i18n/converted-translations.json');
const output = {
  en: enFlat,
  th: thFlat,
  summary: {
    totalStrings: Object.keys(enFlat).length,
    translatedStrings: Object.keys(thFlat).length,
    missingTranslations: Object.keys(enFlat).filter(k => !thFlat[k]).length
  }
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\n✅ Converted translations saved to: ${outputPath}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Review the converted translations`);
console.log(`   2. Merge new keys into LanguageContext.tsx`);
console.log(`   3. Add missing Thai translations`);
