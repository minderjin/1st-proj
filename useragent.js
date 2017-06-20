/**
 * Created by lenovo on 2017-05-31.
 */
var useragent = {}

useragent.getinfo = function(s) {
    var r = {};

    // 브라우저 체크
    if( s.indexOf('Firefox') > 0 || s.indexOf('FxiOS') > 0 ) {
        r.browser = 'Firefox';
    } else if( s.indexOf('OPR') > 0 ) {
        r.browser = 'Opera';
    } else if( s.indexOf('Chrome') > 0 || s.indexOf('CriOS') > 0 ) {
        r.browser = 'Chrome';
    } else if( s.indexOf('PhantomJS') > 0 ) {
        r.browser = 'PhantomJS';
    } else if( s.indexOf('Safari') > 0 ) {
        r.browser = 'Safari';
    } else {
        r.browser = 'IE'
    }

    // OS 체크
    if( s.indexOf('Windows') > 0 ) {
        r.os = 'Windows';
    } else if( s.indexOf('Mac OS X') > 0 ) {
        r.os = 'Mac OS X';
    } else if( s.indexOf('iPhone OS') > 0 ) {
        r.os = 'iPhone OS';
    } else if( s.indexOf('Linux') > 0 ) {
        r.os = 'Linux';
    } else if( s.indexOf('Android') > 0 ) {
        r.os = 'Android';
    } else {
        r.os = 'NA';
    }

    // 디바이스 체크
    if( s.indexOf('Mobi') > 0 ) {
        r.device = 'Phone';
    } else if( s.indexOf('Tablet') > 0 ) {
        r.device = 'Tablet';
    } else if( s.indexOf('iPad') > 0 ) {
        r.device = 'iPad';
    } else if( s.indexOf('iPod') > 0 ) {
        r.device = 'iPod';
    } else if( s.indexOf('TV') > 0 ) {
        r.device = 'TV';
    } else if( s.indexOf('PhantomJS') > 0 ) {
        r.browser = 'Server';
    } else {
        r.device = 'Desktop';
    }

    return r;
};

module.exports = useragent;