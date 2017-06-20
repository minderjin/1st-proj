$.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:25182/log',
    data: { url: decodeURIComponent(location.href),
        ref: decodeURIComponent(document.referrer),
        ip: ip()
    },
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function(response,opts) {},
    error: function(response,opts) {}
});
