module.exports = {
  createOldCatalogs: false,
  defaultNamespace: 'plugin__olm-console-plugin',
  indentation: 2,
  keepRemoved: false,
  keySeparator: false,
  lexers: {
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer'],
  },
  locales: ['en'],
  namespaceSeparator: '~',
  output: 'locales/$LOCALE/$NAMESPACE.json',
  sort: true,
  useKeysAsDefaultValue: true,
};
