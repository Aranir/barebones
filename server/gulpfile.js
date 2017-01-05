var nodeExternals = require('webpack-node-externals');
var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodemon = require('nodemon');

var backendConfig = {
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
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            }
        ]
    }
};

function onBuild(done) {
    return function(err, stats) {
        if(err) {
            console.log('Error', err);
        }
        else {
            console.log(stats.toString());
        }

        if(done) {
            done();
        }
    }
}

gulp.task('backend-build', function(done) {
    webpack(backendConfig).run(onBuild(done));
});

gulp.task('backend-watch', function() {
    webpack(backendConfig).watch(100, function(err, stats) {
        onBuild()(err, stats);
        nodemon.restart();
    });
});
// tasks



gulp.task('build', ['backend-build']);
gulp.task('watch', ['backend-watch']);

gulp.task('run', ['backend-watch'], function() {
    nodemon({
        execMap: {
            js: 'node'
        },
        script: path.join(__dirname, 'dist/bundle'),
        ignore: ['*'],
        watch: ['foo/'],
        ext: 'noop'
    }).on('restart', function() {
        console.log('Restarted!');
    });
});