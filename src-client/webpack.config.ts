// Added: Split Vendor Code
// Guide: https://medium.com/@adamrackis/vendor-and-code-splitting-in-webpack-2-6376358f1923

// Added: Tree Shaking
// Guide: https://medium.com/modus-create-front-end-development/webpack-2-tree-shaking-configuration-9f1de90f3233
// https://github.com/ModusCreateOrg/budgeting-sample-app-webpack2/blob/v1/webpack.config.js

// Added: Browser Sync
// Added: Browser Sync Compression (For gzip file size simulation)
// https://github.com/Browsersync/recipes/tree/master/recipes/server.gzipped.assets

import * as webpack from 'webpack';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const connect_gzip_static = require('connect-gzip-static');

const enableBundleVisualizer = false;
const enableBrowserSync = true;
const enableBrowserSyncGzip = false; // Doesn't work

const isProduction = true;
const enableProduction_sourceMaps = true;

const enableCodeSplitting = true;
const enablePreact = true;

// const hostPath = __dirname + '/../_deploy/static/app';
// const buildPath = hostPath + '/dist';
const hostPath = __dirname + '/../_deploy';
const buildPath = hostPath + '/static/app/dist';

const plugins = [];

if (enableBundleVisualizer) {
    plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
    );
}

if (enableCodeSplitting) {
    plugins.push(
        // All Node-Modules goes into vendor
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            path: buildPath,
            minChunks(module: any, count: any) {
                var context = module.context;
                return context && context.indexOf('node_modules') >= 0;
            },
        }),
    );
}

if (isProduction) {
    plugins.push(
        // Added according to https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
            // debug: enableProduction_sourceMaps
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: enableProduction_sourceMaps,
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            // output: {
            //     comments: false,
            // },
        })
    );
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

if (enableBrowserSync) {
    if (!enableBrowserSyncGzip) {
        plugins.push(new BrowserSyncPlugin({
            host: 'localhost',
            port: 3100,
            server: {
                baseDir: [hostPath]
            }
        }));
    } else {
        plugins.push(new BrowserSyncPlugin({
            host: 'localhost',
            port: 3100,
            server: {
                baseDir: [hostPath]
            },
            callback: (err: any, bs: any) => {
                bs.addMiddleware('*', connect_gzip_static(buildPath), {
                    override: true
                });
            }
        }));
    }
}

const config: webpack.Configuration = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: buildPath
    },
    plugins,
    // plugins: [
    //     new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    // ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
        ]
    },
};

if (enablePreact) {
    config.resolve.alias = {
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
    };
}

export default config;

// Original:
// import * as webpack from 'webpack';
// 
// const config: webpack.Configuration = {
//     // entry: "./src/index.tsx",
//     output: {
//         filename: 'bundle.js',
//         path: __dirname + '/dist'
//     },

//     // Enable sourcemaps for debugging webpack's output.
//     devtool: 'source-map',

//     resolve: {
//         // Add '.ts' and '.tsx' as resolvable extensions.
//         extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
//     },

//     module: {
//         loaders: [
//             // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
//             { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
//         ]
//     },
// };
// 
// export default config;
