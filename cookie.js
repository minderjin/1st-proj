/**
 * Created by lenovo on 2017-06-19.
 */
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');

var cookie = {};

cookie.init = function(app) {
    app.use(cookieParser('myKey#ckjisbest'));
    app.use(function(request, response, next) {
        var xuid = '';
        if(request.signedCookies._xuid == undefined) {
            xuid = uuid.v4();
            response.cookie('_xuid',xuid,
                { expires: new Date(Date.now() + 1000*60*60*24*365*10), httpOnly: true, signed: true });
        }
        request._xuid = xuid||request.signedCookies._xuid;
        next();
    });
}

module.exports = cookie;