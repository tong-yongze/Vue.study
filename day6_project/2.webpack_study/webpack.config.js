const path = require('path')
//导入包
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebpackPlugin({
    //设置生成预览页面的模板文件
    template: "./src/index.html",
    //设置生成的预览页面名称
    filename: "index.html"
})

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',  // development(开发时用 效率高) mode 指定构建模式   produciton(上线阶段用)
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, './dist'),  // 指的是一个目录
        filename: 'bundle.js'  // 注定的是生成的文件名
    },
    plugins: [htmlPlugin, new VueLoaderPlugin()],

    module: {
        rules: [
            {
                test: /\.css$/,  //test设置需要匹配的文件类型，支持正则 不要加引号  是一个正则对象
                //use表示该文件类型需要调用的loader
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
            // 安装node-sass
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2$/,
                use: 'url-loader?limit=16,940'
            },
            {
                test: /\.vue$/, use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                // exclude为排除项，意思是不要处理 node_modules 中的 js 文件
                exclude: /node_modules/
            }
        ]
    }
}