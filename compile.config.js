#!/usr/bin/env node

const Webpack = require('webpack');
const File = require('fs');
const Path = require('path');

//-----------------------------------

const webpackConfig = {
    entry: './source/index.ts',
    mode: 'development',
    target: [ 'web', 'es5' ],
    devtool: false,
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [ 'ts-loader' ]
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    optimization: {
        usedExports: true
    },
    watchOptions: {
        ignored: /node_modules/
    },
    output: {
        path: Path.resolve(__dirname, 'output'),
        filename: 'converter.jsfl'
    }
};

//-----------------------------------

const compiler = Webpack(webpackConfig);

compiler.run((err, stats) => {
    console.log('Compilation complete!');

    if (err || stats.hasErrors()) {
        console.error('Error occurred:');
        console.error(err);
        return;
    }

    compiler.close((err) => {
        console.log('Compiler closed!');

        if (err) {
            console.error('Error occurred:');
            console.error(err);
            return;
        }

        // JSFL uses an outdated JavaScript engine with no Object.defineProperty API supported
        // simply removing these lines from the output file

        const file = Path.resolve(webpackConfig.output.path, webpackConfig.output.filename);
        const content = File.readFileSync(file).toString('utf-8');
        const temp = content.replaceAll('Object.defineProperty(exports, "__esModule", ({ value: true }));', '');
        File.writeFileSync(file, temp);

        console.log('Done!');
    });
});
