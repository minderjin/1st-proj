$.ajax({
    type: 'GET',
    url: 'http://210.114.91.91:25182/banner',
    data: { mid: 'tester1'
    },
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function(response,opts) {
        $('.adsbyckj').html(response.banner);    // banner 리푸레쉬
        $('#ckj_modal').html('./modal.html');
    },
    error: function(response,opts) {
        console.log('error: ' + response + ', ' + opts);
    }
});