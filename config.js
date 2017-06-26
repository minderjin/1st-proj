/**
 * Created by lenovo on 2017-06-09.
 */

module.exports = {
    server_port: 8080,
    // db_url: 'mongodb://localhost:27017/local',
    // db_schemas: [
    //     {file:'./user_schema', collection:'users3', schemaName:'UserSchema', modelName:'UserModel'}
    // ],
    route_info: [
        {path:'/log', method:'log', type:'get'},
        {path:'/banner', method:'banner', type:'get'},
        {path:'/banner_test', method:'bannerTest', type:'get'}
    ]
};



