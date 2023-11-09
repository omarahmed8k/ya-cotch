const tsImportPluginFactory = require('ts-import-plugin')
const {
    getLoader
} = require("react-app-rewired");
const rewireLess = require('react-app-rewire-less');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    const tsLoader = getLoader(
        config.module.rules,
        rule =>
        rule.loader &&
        typeof rule.loader === 'string' &&
        rule.loader.includes('ts-loader')
    );

    tsLoader.options = {
        getCustomTransformers: () => ({
            before: [tsImportPluginFactory()]
        })
    };

    config = rewireLess.withLoaderOptions({
        javascriptEnabled: true,
        modifyVars: {
            '@primary-color': '#ffce03',
          '@secondary-color': '#777',
          '@link-color': '#1DA57A',
        },
    })(config, env);

    // We must exclude onle the styles folder, and let all other .less files be rewired.
    // The .less files in the styles folder are loaded dynamically in the App.tsx file,
    // based on the selected language.
    if(config.module.rules) {
        const rewireLessRules = config.module.rules.find(function(rule) {
            return rule.oneOf
                && Array.isArray(rule.oneOf)
                && rule.oneOf.length > 0 
                && rule.oneOf.find(function (nastedRule){ 
                    return String(nastedRule.test) === String(/\.less$/); 
                });
        });
        
        if(rewireLessRules) {
            const lessLoaderRule = rewireLessRules.oneOf.find(function (nastedRule){ 
                return String(nastedRule.test) === String(/\.less$/); 
            });
            lessLoaderRule.exclude = [/[\/\\]src[\/\\]styles[\/\\]/];
        }
    }

    if (!config.plugins) {
        config.plugins = [];
    }

    config.plugins.push(
        (process.env.NODE_ENV === 'production') ?
        new CopyWebpackPlugin([{
            from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
            to: 'dist'
        }, {
            from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
            to: 'dist'
        }, {
            from: 'src/lib/abp.js',
            to: 'dist'
        }]) :
        new CopyWebpackPlugin([{
            from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
            to: 'dist'
        }, {
            from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
            to: 'dist'
        }, {
            from: 'src/lib/abp.js',
            to: 'dist'
        }])
    );

    
    return config;
}