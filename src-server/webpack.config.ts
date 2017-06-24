import * as webpack from 'webpack';

// sourceMaps is not working when debugging
const enableProduction_sourceMaps = false;

const config: webpack.Configuration = {
    entry: {
        '../_deploy/http-api/bundle.js': `${__dirname}/src/_endpoints/api/_index.ts`,
        '../_deploy/http-static/bundle.js': `${__dirname}/src/_endpoints/static/_index.ts`,
        '../_deploy/timer-updater/bundle.js': `${__dirname}/src/_workers/updater/_index.ts`,
    },
    output: {
        path: `${__dirname}/`,
        filename: '[name]',
        // No Sourcemap
        sourceMapFilename: enableProduction_sourceMaps ? undefined : ''
    },
    plugins: [],
    devtool: enableProduction_sourceMaps ? 'source-map' : undefined,
    target: 'node',
    node: {
        __filename: false,
        __dirname: false,
    },
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

export default config;
