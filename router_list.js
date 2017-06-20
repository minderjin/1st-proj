/**
 * Created by lenovo on 2017-06-19.
 */
// URL 모듈
var url = require('url');
var querystring = require('querystring');
var useragent = require('./useragent');
var winston = require('./logger');

var router_list = {};
var connection_pool;

router_list.init = function(app, router, pool) {
    console.log('init() 호출됨.');
    connection_pool = pool;

    // 로그 수집
    router.route('/log').get(log);

    // 배너 노출
    router.route('/banner').get(banner);

};

var log = function(req, res) {
    console.log('log 호출');

    var curURL = url.parse(req.url);                                // URL 파싱
    var uagent = useragent.getinfo(req.header('User-Agent'));     // 클라이언트 정보 가져오기
    var curQry = querystring.parse(curURL.query);                   // query 문자열 파싱

    // 로깅
    winston.info('%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s',
        curURL.pathname, curQry.ip||'-', req._xuid, uagent.os||'-', uagent.device||'-', uagent.browser||'-', curQry.url, curQry.ref||'-');

    res.send(curQry.callback + '({"msg":"ok"})');
};

var banner = function(req, res) {
    console.log('banner 호출');

    var advert_id = (req.body && req.body.advert_id) || req.query.advert_id || '';

    if(connection_pool) {
        viewBanner(advert_id, function(err, rows) {
            if(err) {
                console.error('배너 호출 중 오류 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>배너 호출 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }

            if(rows) {
                var contents_id = rows[0].contents_id;
                var contents_nm = rows[0].contents_nm;
                var image_url = rows[0].image_url;

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>배너 호출 성공</h1>');
                res.write('<div><p>배너 아이디 : ' + contents_id + '</p></div>');
                res.write('<div><p>배너 한글명 : ' + contents_nm + '</p></div>');
                res.write('<div><p>이미지 : ' + image_url + '</p></div>');
                res.write('<div><p><img style="width:180px;height:180px" src="./public/images/' + image_url + '"></p></div>');
                res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>적합한 배너가 없습니다</h1>');
                res.end();
            }
        });
    }
};


var viewBanner = function(advert_id, callback) {
    console.log('viewBanner 호출됨.');

    // 커넥션 풀에서 연결 객체를 가져옵니다.
    connection_pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release(); // 반드시 해제해야 합니다.
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        var sql = 'select ?? from ?? order by rand() limit 1';
        var columns = ['advertiser_id', 'contents_id', 'contents_nm', 'image_url'];
        var tablename = 'banner';

        var params = [];
        params.push(columns);
        params.push(tablename);
        if(advert_id) {
            params.push(advert_id);
            sql = 'select ?? from ?? where advertiser_id = ? order by rand() limit 1';
        }


        // SQL문을 실행합니다.
        var exec = conn.query(sql, params, function(err, rows) {
            conn.release(); //반드시 해제해야 합니다.
            console.log('실행 대상 SQL : ' + exec.sql);

            if(rows.length > 0) {
                console.log('광고주ID [%s]와 일치하는 배너 찾음.', advert_id);
                callback(null, rows);
            } else {
                console.log('일치하는 배너를 찾지 못함.');
                callback(null, null);
            }
        });
    })
};



// function setRoute(app, config) {
//
//     var routeLen = config.route_info.length;
//     console.log('설정에 정의된 루트의 수 : %d', routeLen);
//
//     for (var i = 0; i < routeLen; i++) {
//         var curItem = config.route_info[i];
//
//         router.route(curItem.path).post(curItem.method);
//         console.log('스키마 이름 [%s], 모델 이름 [%s]이 database 객체의 속성으로 추가됨.', curItem.schemaName, curItem.modelName);
//
//     }
//
//     console.log('라우팅 정보가 세팅됨.');
// }

module.exports = router_list;
