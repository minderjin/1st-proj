$.ajax({
    type: 'GET',
    url: 'http://210.114.91.91:25182/log',
    data: { url: decodeURIComponent(location.href),
        ref: decodeURIComponent(document.referrer),
        ip: ip()
    },
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function(response,opts) {},
    error: function(response,opts) {}
});