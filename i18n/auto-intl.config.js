const config = {
  // Scan our React components and views
  scanDirs: ['./src/components', './src/views', './src/app'],
  baseLanguage: 'en',
  targetLanguages: ['th'], // Thai language
  messagesDir: './i18n/messages',
  allowDuplicateComponentNames: true,

  // Don't rewrite files automatically - we'll adapt the output manually
  // to work with our existing LanguageContext
  rewriteSourceFiles: false,
  lintAfterRewrite: false,

  targetLibrary: 'next-intl', // We'll adapt the output format
};

module.exports = config;
