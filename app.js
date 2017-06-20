// ##########################   모듈 로드       ##########################
var http = require('http');
var express = require('express');
var path = require('path');
var serve_static = require('serve-static');   // 웹서버 (html, 이미지, 외부노출용 javascript, ...)


// ##########################   서버 생성       ##########################
var app = express();

// ##########################   MySQL 설정    ##########################
var pool = require('./mysql').init(app);

// ##########################   웹 경로 설정    ##########################
app.use('/public', serve_static(path.join(__dirname, 'public')));

// ##########################   쿠키 설정       ##########################
require('./cookie').init(app);

// ##########################   로그 (morgan)   ##########################
require('./morgan').init(app);

// ##########################   라우터 설정     ##########################
var router = express.Router();
require('./router_list').init(app, router, pool);
app.use('/', router);

// ##########################   에러 설정       ##########################
app.use(require('./error').init(app));


// ##########################   서버 구동       ##########################
http.createServer(app).listen(8080, function() {   // 내부PORT(8080) => 외부PORT(25182)
    console.log('Server running at http://210.114.91.91:25182/');
    console.log('         (Dev) at http://127.0.0.1:8080/');
});
