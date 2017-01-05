var nodeExternals = require('webpack-node-externals');


module.exports = {
    entry: './src/server.ts',
        target: 'node', // in order to ignore built-in modules like path, fs, etc.
        externals: [nodeExternals()],
    output: {
        filename: 'dist/bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    }
}