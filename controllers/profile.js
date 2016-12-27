'use strict';
var parse = require('co-body');
var mongoose = require('mongoose');
var winston = require('winston');
var db = null;
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            name: 'console-info',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            level: 'info',
            filename: 'info.log'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            level: 'error',
            filename: 'error.log'
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'exceptions.log'
        })
    ]
});
var Profile = mongoose.model('Profile', {
    name: String,
    surname: String,
    gender: String
});

try {
    mongoose.connect('mongodb://localhost/personelDB');
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection is failed '));
    db.once('open', function () {
        logger.log('info', 'DB Connection is successful!');
    });
} catch (ex) {
    logger.log('exception', 'DB Connection is failed!');
}


module.exports.getHealthCheckMessage = function *() {
    logger.log('info', 'Health Check is Called!');
    this.body = 'Application is up and running properly!';
};

module.exports.create = function *() {
    var data = yield parse(this);
    var newProfileData = new Profile(data);
    yield newProfileData.save(function (err) {
        if (err) {
            logger.log('error', 'Profile creation is failed for that profile Data : ' + data);
        } else {
            logger.log('info', 'Profile creation is done!');
        }
    });
    this.body = 'Profile creation is successfull';
};

module.exports.retrieveAll = function *() {
    var allProfiles = {};
    var self=this;
    yield Profile.find({}, function (err, profiles) {
        self.body = profiles;
    });

}

