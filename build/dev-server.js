let express = require('express')

let webpack = require('webpack');

let path = require('path')

let webpackconfig = require('../webpack.config.js');

let app = express()

let compiler = webpack(webpackconfig);

let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: 'http://localhost:3000/',
  quiet: true
})

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// 用于解析 body。 
let bodyParser = require("body-parser");

// 基于express实例创建http服务器
let server = require('http').Server(app);

// 创建websocket服务器，以监听http服务器
let io = require('socket.io').listen(server);

// 引入路由
let route = require('../router/index.js');

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)


// 使用使用了body-parser模块，才能通过 req.body 接受到post表单里的内容。
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// node你服务器使用的静态文件
app.use('/', express.static('./www'))

// 使用路由
app.use('/', route);

// 开启node后台服务器
console.log('> Starting dev server...')
let port = '3000';
server.listen(port, function () {
	console.log('The server is listening at localhost：' + port)
});


app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname,  '../www/index.html'))
})


// 引入服务器端websocket处理代码
let Websocket = require('./websocket.js');

// 执行
Websocket(io);
