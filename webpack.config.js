const BundleTracker = require('webpack-bundle-tracker');
const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin')

module.exports = {
    mode: "development",
    devServer: {
        static: './dist',
    },
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: '[name].bundle.[contenthash].js',
        clean: true
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new HtmlWebpackPlugin(),
        new MonacoWebpackPlugin({
            filename: "[name].[contenthash].bundle.js",
            languages: ["cpp", "lua", "typescript"],
            // features: [
            //     "!accessibilityHelp",
            //     "!bracketMatching",
            //     "!caretOperations",
            //     "!clipboard",
            //     "!codeAction",
            //     "!codelens",
            //     "!colorDetector",
            //     "!comment",
            //     "!contextmenu",
            //     "!cursorUndo",
            //     "!dnd",
            //     "!folding",
            //     "!fontZoom",
            //     "!format",
            //     "!gotoError",
            //     "!gotoLine",
            //     "!gotoSymbol",
            //     "!hover",
            //     "!iPadShowKeyboard",
            //     "!inPlaceReplace",
            //     "!inspectTokens",
            //     "!linesOperations",
            //     "!links",
            //     "!multicursor",
            //     "!parameterHints",
            //     "!quickCommand",
            //     "!quickOutline",
            //     "!referenceSearch",
            //     "!rename",
            //     "!smartSelect",
            //     "!snippets",
            //     "!suggest",
            //     "!toggleHighContrast",
            //     "!toggleTabFocusMode",
            //     "!transpose",
            //     "!wordHighlighter",
            //     "!wordOperations",
            //     "!wordPartOperations",
            // ],

        }),
        new AssetsPlugin({
            path: path.resolve(__dirname, "./"),
            removeFullPathAutoPrefix: true
        }),
    ],
    entry: {
        index: path.resolve('./ts/index.tsx')
    },
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: {
            name: "mc-runtime",
        },
        splitChunks: {
            cacheGroups: {
                monaco: {
                    test: /[\\/]node_modules[\\/]monaco-editor/,
                    name: "mc-monaco",
                    chunks: "all",
                    priority: 1,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "mc-vendor",
                    chunks: "all",
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                }],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },

    stats: "minimal",
    resolve: {
        fallback: {
            fs: false,
            constants: false,
            assert: false,
            util: false,
            stream: require.resolve("stream-browserify")
        },
        "alias": {
            "react": "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat",     // Must be below test-utils
            "react/jsx-runtime": "preact/jsx-runtime"
        },
    }
};
