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

router_list.init = function(app, router, pool, config) {
    console.log('router_list.init() 호출됨.');
    model.init(pool);

    // 라우트 설정
    setRoute(app, router, config);
};

/*
    router setting
 */
function setRoute(app, router, config) {
    var routeLen = config.route_info.length;
    console.log('[setRouter][start] 설정에 정의된 루트의 수 : %d', routeLen);

    for (var i = 0; i < routeLen; i++) {
        var curRoute = config.route_info[i];
        if(curRoute.type === 'get') {
            router.route(curRoute.path).get(eval(curRoute.method));
        } else {
            router.route(curRoute.path).post(eval(curRoute.method));
        }
    }
    console.log('[setRouter][end] 라우팅 정보 세팅됨.');
}

/*
    log Controller
 */
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

/*
    banner Controller
 */
var banner = function(req, res) {
    console.log('banner 호출');
    var advert_id = (req.body && req.body.advert_id) || req.query.advert_id || '';

    var curURL = url.parse(req.url);
    var curQry = querystring.parse(curURL.query);                   // query 문자열 파싱

    model.viewBanner(advert_id, function(err, rows) {
        if(err) {
            console.error('배너 호출 중 오류 발생 : ' + err.stack);
            // res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            // res.write('<h2>배너 호출 중 오류 발생</h2>');
            // res.write('<p>' + err.stack + '</p>');
            // res.end();
            res.send(404);
            return;
        }

        if(rows) {
            var context =
                {title:'배너 출력',
                    contents_id: rows[0].contents_id,
                    contents_nm:rows[0].contents_nm,
                    image_url:rows[0].image_url};

            var bannerUrl =
                "<img style='width:180px;height:180px' src='http://210.114.91.91:25182/public/images/"+context.image_url+"'>";
            res.send(curQry.callback + '({"banner":"'+bannerUrl+'"})');

        } else {
            // res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            // res.write('<h1>적합한 배너가 없습니다</h1>');
            // res.end();
            res.send(curQry.callback + '({"banner":""})');
        }
    });
};

/*
    bannerTest Controller
 */
var bannerTest = function(req, res) {
    console.log('bannerTest 호출');
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

            req.app.render('banner_test', context, function(err, html) {
                if (err) {
                    console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }
                res.end(html);
            });

        } else {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1>적합한 배너가 없습니다</h1>');
            res.end();
        }
    });
};

module.exports = router_list;
