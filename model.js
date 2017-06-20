/**
 * Created by lenovo on 2017-06-20.
 */
var conn_pool;

var init = function (pool) {
    console.log('model init 호출');
    conn_pool = pool;
};

var viewBanner = function(advert_id, callback) {
    console.log('viewBanner 호출됨.');

    if(conn_pool) {
        // 커넥션 풀에서 연결 객체를 가져옵니다.
        conn_pool.getConnection(function (err, conn) {
            if (err) {
                if (conn) {
                    conn.release(); // 반드시 해제해야 합니다.
                }
                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            var sql = 'select ?? from ?? order by rand() limit 1';
            var columns = ['advertiser_id', 'contents_id', 'contents_nm', 'image_url'];
            var tablename = 'banner';

            var params = [];
            params.push(columns);
            params.push(tablename);
            if (advert_id) {
                params.push(advert_id);
                sql = 'select ?? from ?? where advertiser_id = ? order by rand() limit 1';
            }


            // SQL문을 실행합니다.
            var exec = conn.query(sql, params, function (err, rows) {
                conn.release(); //반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if (rows.length > 0) {
                    console.log('광고주ID [%s]와 일치하는 배너 찾음.', advert_id);
                    callback(null, rows);
                } else {
                    console.log('일치하는 배너를 찾지 못함.');
                    callback(null, null);
                }
            });
        });
    }
    else {
        //TODO
        console.log('conn_pool is not defined.');
    }
};

module.exports.init = init;
module.exports.viewBanner = viewBanner;