require('@babel/preset-react');
require('@babel/preset-env');

require('node-sass') ;

const path = require('path');

module.exports = {
    mode: 'development', // development | production
    // set up mode 

    entry: './index.js',// string | object | array
    // Here the application starts executing
    // and webpack starts bundling
    
    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname,'build'), // string
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
                test: /\.js.?$/,

                exclude: [/node_modules/],
                // these are matching conditions, each accepting a regular expression or string
                // test and include have the same behavior, both must be matched
                // exclude must not be matched (takes preferrence over test and include)
                // Best practices:
                // - Use RegExp only in test and for filename matching
                // - Use arrays of absolute paths in include and exclude
                // - Try to avoid exclude and prefer include

                loader: "babel-loader",
                // the loader which should be applied, it'll be resolved relative to the context

                options: {
                    presets: ["@babel/preset-react"]
                },
                // options for the loader
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                exclude: [/node_modules/],
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    devServer: {
        compress: true,
        inline: true,
        contentBase: '.',
        host: '0.0.0.0',
        port: 8080,
    }
}
