// Versión del bundle JS (fuente de verdad: package.json) expuesta al código como VUE_APP_VERSION
process.env.VUE_APP_VERSION = require('./package.json').version;

// CAPACITOR_BUILD=1 → build para el shell nativo (WebView sirve desde la raíz).
// Sin la flag, el build de producción usa la base de GitHub Pages.
const isCapacitor = process.env.CAPACITOR_BUILD === '1';

module.exports = {
  publicPath: isCapacitor
    ? '/'
    : process.env.NODE_ENV === 'production'
    ? '/APP-GRADUADOS/'
    : '/',
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      })
    ]
  }
};
