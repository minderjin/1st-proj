/**
 * Created by lenovo on 2017-06-19.
 */
// URL 모듈
var url = require('url');
var querystring = require('querystring');
var useragent = require('./useragent');
var winston = require('./logger');
var model = require('./model');

var router_list = {};

router_list.init = function(app, router, pool) {
    console.log('init() 호출됨.');
    model.init(pool);

    router.route('/log').get(log);          // 로그 수집
    router.route('/banner').get(banner);    // 배너 노출

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

    model.viewBanner(advert_id, function(err, rows) {
        if(err) {
            console.error('배너 호출 중 오류 발생 : ' + err.stack);
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>배너 호출 중 오류 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();
            return;
        }

        if(rows) {
            var context =
                    {title:'배너 페이지',
                    contents_id: rows[0].contents_id,
                    contents_nm:rows[0].contents_nm,
                    image_url:rows[0].image_url};

            req.app.render('banner', context, function(err, html) {
                if (err) {
                    console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }
                // console.log('rendered : ' + html);
                res.end(html);
            });

        } else {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1>적합한 배너가 없습니다</h1>');
            res.end();
        }
    });
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
