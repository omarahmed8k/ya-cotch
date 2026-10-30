const { when, whenDev, whenProd, whenCI, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#ffce03',
          '@secondary-color': '#777',
          '@link-color': '#c99a00',
          '@border-radius-base': '8px',
          '@font-family': "'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          '@layout-body-background': '#f4f5f7',
          '@layout-header-background': '#ffffff',
          '@layout-sider-background': '#15171c',
          '@menu-dark-bg': '#15171c',
          '@menu-dark-inline-submenu-bg': '#0f1114',
          '@menu-dark-item-active-bg': '#ffce03',
          '@menu-dark-selected-item-text-color': '#15171c',
          '@menu-dark-selected-item-icon-color': '#15171c',
          '@menu-item-height': '44px',
          '@card-radius': '14px',
          '@table-header-bg': '#fafafb',
          '@btn-primary-color': '#15171c',
          '@heading-color': '#15171c',
          '@text-color': '#2b2f36',
        },
      },
    },
  ],
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      if (!webpackConfig.plugins) {
        config.plugins = [];
      }

      webpackConfig.plugins.push(
        process.env.NODE_ENV === 'production'
          ? new CopyWebpackPlugin([
              {
                from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
              },
              {
                from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
              },
              {
                from: 'src/lib/abp.js',
              },
            ])
          : new CopyWebpackPlugin([
              {
                from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
              },
              {
                from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
                to:'dist/abp.signalr-client.js'
              },
              {
                from: 'src/lib/abp.js',
              },
            ])
      );

      return webpackConfig;
    },
  },
};
