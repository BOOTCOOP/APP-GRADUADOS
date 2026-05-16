// // vue.config.js
// module.exports = {
//   // Cuando hagas build en producción, que use como base /APP‑GRADUADOS/
//   publicPath: process.env.NODE_ENV === 'production' ? '/APP-GRADUADOS/' : '/',
// }
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/APP-GRADUADOS/' : '/',
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      })
    ]
  }
};
