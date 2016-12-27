'use strict';

var koa = require('koa');
var winston = require('winston');
var route = require('koa-route');
var profileCtrl = require('./controllers/profile');
var app = module.exports = koa();

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            name: 'console-info',
            level:'info'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            level:'info',
            filename: 'info.log'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            level:'error',
            filename: 'error.log'
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'exceptions.log'
        })
    ]
});

app.listen(3000);
logger.log('info', 'Application is started!');


app.use(route.get('/healthCheck', profileCtrl.getHealthCheckMessage));
app.use(route.post('/profiles/', profileCtrl.create));
app.use(route.get('/profiles/', profileCtrl.retrieveAll));