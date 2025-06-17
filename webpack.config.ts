const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mode: 'development', //개발시: development / 프로덕션일때: production
    devtool: 'eval', //개발시: eval / 프로덕션일때: hidden-source-map
    resolve: {
        extensions: ['.jsx', '.js'],
    },

    entry: {
        //시작하는 파일들
        app: './client',
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                use: ['source-map-loader'],
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: ['> 5% in KR', 'last 2 chrome versions'],
                                },
                                debug: true,
                            },
                        ],
                        '@babel/preset-react',
                    ],
                    plugins: [],
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
        }),
    ],
    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'dist'),
    },
    devServer: {
        proxy: {
            '/': {
                // target: 'http://3.34.210.246:5001',
                changeOrigin: true,
            },
        },
    },
};

export {};
