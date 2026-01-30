// ========================================
// CONFIGURACAO DO BABEL
// ========================================

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], //......Preset padrao do Expo
  };
};
