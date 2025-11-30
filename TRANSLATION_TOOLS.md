# Translation Tools for React i18n

This document lists tools that can help automate the translation process for our React application.

## Automated Translation Tools

### 1. **TacoTranslate** (Recommended)
- **Website**: https://tacotranslate.com
- **Features**:
  - Automatically collects and translates strings directly in React code
  - No manual JSON file management needed
  - Supports Next.js integration
  - Works with existing i18n frameworks

### 2. **PolyLingo.ai**
- **Website**: https://polylingoapp.com
- **Features**:
  - AI-powered analysis of JSX, props, and TypeScript types
  - Extracts all text nodes from React components
  - Context-aware translations
  - Exports JSON files compatible with i18next, react-intl, next-intl

### 3. **i18n.now**
- **Website**: https://www.i18n.now
- **Features**:
  - Automates i18next integration
  - Extracts user-facing texts into ready-to-translate JSON files
  - Supports 50+ languages
  - Works with React, Next.js, JavaScript, TypeScript

### 4. **auto-translation** (CLI Tool)
- **Package**: `npm install -g auto-translation`
- **Features**:
  - Automatically extracts translation keys from React components
  - Wraps strings with translation functions
  - Generates complete i18n file structures
  - Reduces manual setup effort

### 5. **react-auto-intl**
- **Package**: `npm install react-auto-intl`
- **Features**:
  - Detects user-facing strings in React components
  - Extracts them into i18n framework format
  - Translates using language models
  - Supports multiple languages

## Translation Management Platforms

### 6. **Crowdin**
- **Website**: https://crowdin.com
- **Features**:
  - Collaborative translation platform
  - Integrates with GitHub/GitLab
  - Auto-extracts strings from code
  - Professional translators available

### 7. **Lokalise**
- **Website**: https://lokalise.com
- **Features**:
  - Visual editor for translations
  - Auto-extraction from code
  - Team collaboration
  - API for automation

### 8. **Phrase**
- **Website**: https://phrase.com
- **Features**:
  - Translation management
  - Context-aware translations
  - Integration with development workflow
  - Quality assurance tools

## Recommended Approach for This Project

1. **Short-term**: Use **PolyLingo.ai** or **i18n.now** to:
   - Extract all hardcoded strings from components
   - Generate translation keys automatically
   - Create initial Thai translations

2. **Long-term**: Consider **Crowdin** or **Lokalise** for:
   - Managing translations as the project grows
   - Collaborating with translators
   - Maintaining translation quality
   - Version control for translations

## Current Implementation

We're using a custom `LanguageContext` with manual translations. To migrate to an automated tool:

1. Run the tool to extract all strings
2. Review and merge with existing translations in `src/contexts/LanguageContext.tsx`
3. Update components to use the extracted translation keys
4. Set up CI/CD to sync translations

## Next Steps

1. Choose a tool (recommend starting with PolyLingo.ai or i18n.now)
2. Run extraction on the codebase
3. Review generated translations
4. Integrate with existing LanguageContext
5. Test with Thai language toggle
