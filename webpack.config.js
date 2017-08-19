var webpack = require('webpack');

module.exports = {
    entry: ["./src/index.js"],
    output: {
        path: __dirname + "/www/js/",
        filename: "bundle.js",
        publicPath: '/q2-zzw'
    },
    watch: true,
    resolve: {
        // 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: [".js", ".jsx", '.less'],
    },
    module: {
    	loaders: [
    	{
    		test: /\.jsx?$/,
    		loader: 'babel-loader',
    		exclude: /node_modules/,
    		query: {
    			presets: ['es2015', 'react']
    		}
    	},
    	{
    		test: /\.css$/,
    		loader: 'style-loader!css-loader'
    	},
        {
            test: /\.less$/,
            use: [{
                 loader: "style-loader"
             }, {
                 loader: "css-loader"
             }, {
                 loader: "less-loader"
             }]
        },
        {
            test: /\.(jpg|png|svg)$/,
            loader: 'url-loader'
        }
    	]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
                'NODE_ENV': JSON.stringify("develop")
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ],
}