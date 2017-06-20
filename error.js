/**
 * Created by lenovo on 2017-06-19.
 */
var expressErrorHandler = require('express-error-handler');

var error = {};

error.init = function(app) {
    console.log('error.init() 호출됨.');

    var errorHandler = expressErrorHandler({
        static: {
            '404': './public/error/404.html'
        }
    });
    app.use(expressErrorHandler.httpError(404));

    return errorHandler;
}

module.exports = error;
