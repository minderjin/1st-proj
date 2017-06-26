/**
 * Created by lenovo on 2017-06-20.
 */
var mysql = require('mysql');

var database = {};

database.init = function(app) {
    console.log('mysql.init() 호출됨.');

    var pool = mysql.createPool({
        connectionLimit : 10,
        host: '210.114.91.91',
        port: '25105',
        user: 'ckj',
        password: '1111',
        database: 'test',
        debug: false
    });

    return pool;
};

module.exports = database;