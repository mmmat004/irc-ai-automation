# React-Auto-Intl Setup and Usage

This document explains how to use `react-auto-intl` to automate translation extraction and management.

## ✅ Installation Complete

`react-auto-intl` has been installed as a dev dependency.

## 📋 Configuration

The configuration file is located at: `i18n/auto-intl.config.js`

Current settings:
- **Scan Directories**: `./src/components`, `./src/views`, `./src/app`
- **Base Language**: `en` (English)
- **Target Languages**: `th` (Thai)
- **Messages Directory**: `./i18n/messages`
- **Rewrite Files**: `false` (we adapt manually to work with our LanguageContext)

## 🚀 Usage

### 1. Scan for Strings

Scan your codebase to discover all translatable strings:

```bash
npx react-auto-intl scan
```

This will show you all strings found without modifying files.

### 2. Extract Strings

Extract all user-facing strings and save them to JSON:

```bash
npx react-auto-intl extract
```

This creates/updates `i18n/messages/en.json` with all extracted strings.

### 3. Translate Strings

**Note**: This requires an OpenAI API key. Set it as an environment variable:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Then run:

```bash
npx react-auto-intl translate
```

This will translate all strings in `en.json` to Thai and save to `i18n/messages/th.json`.

### 4. Convert to LanguageContext Format

After extraction/translation, convert the next-intl format to our LanguageContext format:

```bash
node scripts/convert-translations.js
```

This creates `i18n/converted-translations.json` with:
- Flat key format (e.g., `WorkflowHeader.n8n-workflows`)
- Filtered out CSS classes and non-translatable strings
- Summary of translations

### 5. Merge into LanguageContext

Manually review and merge new translations from `i18n/converted-translations.json` into `src/contexts/LanguageContext.tsx`.

## 📊 Current Status

- ✅ Tool installed
- ✅ Configuration created
- ✅ String extraction completed (162 strings found, 132 translatable)
- ✅ Conversion script created
- ⏳ Translation to Thai (requires OpenAI API key)
- ⏳ Manual merge into LanguageContext

## 🔧 Custom Conversion Script

The `scripts/convert-translations.js` script:
- Filters out CSS classes and technical strings
- Converts nested component format to flat keys
- Provides a summary of translations
- Outputs JSON ready for manual review

## 📝 Example Workflow

1. **Make code changes** - Add new components with hardcoded strings
2. **Extract**: `npx react-auto-intl extract`
3. **Translate**: `npx react-auto-intl translate` (with API key)
4. **Convert**: `node scripts/convert-translations.js`
5. **Review**: Check `i18n/converted-translations.json`
6. **Merge**: Add new keys to `LanguageContext.tsx`
7. **Update Components**: Replace hardcoded strings with `t('key')` calls

## ⚠️ Important Notes

1. **Don't use `rewriteSourceFiles: true`** - It's designed for next-intl, not our custom LanguageContext
2. **Manual Integration Required** - We need to manually adapt the output to our format
3. **API Key Needed** - For automatic translation, you need an OpenAI API key
4. **Review Filtered Strings** - The conversion script filters out CSS classes, but review the output

## 🎯 Next Steps

1. **Get OpenAI API Key** (optional, for auto-translation):
   - Sign up at https://platform.openai.com
   - Create an API key
   - Set as environment variable: `export OPENAI_API_KEY="sk-..."`

2. **Run Translation**:
   ```bash
   npx react-auto-intl translate
   ```

3. **Convert and Review**:
   ```bash
   node scripts/convert-translations.js
   cat i18n/converted-translations.json
   ```

4. **Merge New Translations**:
   - Open `i18n/converted-translations.json`
   - Review new keys
   - Add to `src/contexts/LanguageContext.tsx` in the appropriate sections
   - Add Thai translations (or use the translated ones from `th.json`)

## 🔍 What Was Found

The tool found **162 strings** across **38 components**, with **132 translatable strings** after filtering.

Key components with many strings:
- WeeklyCategoriesConfig (19 strings)
- NewsTable (multiple strings)
- VerificationCard (multiple strings)
- WorkflowCard (7 strings)

## 💡 Tips

- Run `extract` regularly as you add new features
- Review the converted output before merging
- Keep existing translations when merging
- Use meaningful key names (the tool generates them automatically)
- Consider grouping related translations by component
