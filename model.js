/**
 * Created by lenovo on 2017-06-20.
 */

var viewBanner = function(advert_id, callback) {
    console.log('viewBanner 호출됨.');

    // 커넥션 풀에서 연결 객체를 가져옵니다.
    pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release(); // 반드시 해제해야 합니다.
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        var columns = ['id', 'name', 'age'];
        var tablename = 'users';

        // SQL문을 실행합니다.
        var exec = conn.query('select ?? from ?? where id = ? and password = ?', [columns, tablename, id, password], function(err, rows) {
            conn.release(); //반드시 해제해야 합니다.
            console.log('실행 대상 SQL : ' + exec.sql);

            if(rows.length > 0) {
                console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
                callback(null, rows);
            } else {
                console.log('일치하는 사용자를 찾지 못함.');
                callback(null, null);
            }
        });
    })
}
