/**
 * Created by lenovo on 2017-06-19.
 */
// 로깅 모듈
var path = require('path');
var fs = require('fs');
var rfs = require('rotating-file-stream');
var morgan = require('morgan');

var mg = {};

mg.init = function(app) {
    console.log('morgan.init() 호출됨.')
    var logDirectory = path.join('/tmp', 'log');
    // var logDirectory = path.join(__dirname, 'log');

    // 디렉토리 확인 및 생성
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    // 로그 스트림
    var accessLogStream = rfs('morgan.log', {
        interval: '1d', // rotate daily
        path: logDirectory
    });

    app.use(morgan('combined',{stream:accessLogStream}));
};

module.exports = mg;