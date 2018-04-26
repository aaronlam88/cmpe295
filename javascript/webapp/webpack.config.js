const path = require('path');

module.exports = {
    mode: 'production', // development | production
    // set up mode 

    entry: './index.js',// string | object | array
    // here the application starts executing
    // and webpack starts bundling

    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname, 'build'), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)

        filename: "bundle.js", // string
        // the filename template for entry chunks

        publicPath: "/", // string
        // the url to the output directory resolved relative to the HTML page
    },

    module: {
        // configuration regarding modules
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: "babel-loader", // the loader which should be applied, it'll be resolved relative to the context
                options: {
                    // let webpack know that we are using es6 and react
                    presets: ["es2015", "react"]
                },
                // options for the loader
            },

            // to load css files
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {

                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }
        ]
    },

    // config for server
    devServer: {
        compress: true, // enable gzip compression for everything served
        inline: true, // toggle inline or iframe mode
        contentBase: '.', // tell the server where to serve content from
        host: '0.0.0.0',
        port: 9080,
    }
}
