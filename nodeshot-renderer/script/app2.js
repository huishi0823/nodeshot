var ScreenshotApi = require('./lib/ScreenshotApi.js'),

    fs = require('fs'),
    path = require('path'),

    winston = require('winston'),
    config = require('config'),

    kue = require('kue'),
    jobs = kue.createQueue();
var screenshot = require('node-webkit-screenshot');

var webshot = require('webshot');
var stream        = require("stream");

var cwd = process.cwd();

winston.info('--- Starting Renderer ---');
var options = {
    screenSize: {
        width: 320
        , height: 480
    }
    , shotSize: {
        width: 320
        , height: 'all'
    }
    , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
    , timeout: 10000
};
webshot('http://mp.weixin.qq.com/s?__biz=MzI1NzAxNTI3Mw==&mid=211339224&idx=5&sn=b05e7797b14c26cb7ef7aac65d0c3510&3rd=MzA3MDU4NTYzMw==&scene=6#rd', 'baidu2244.jpeg', options, function(err) {
    winston.info('err "%s"', JSON.stringify(err));
});

winston.info('--- Starting end ---');
var screenshotApi = new ScreenshotApi(config.screenshot);

jobs.process('screenshot', function (job, done) {
    winston.info('Process job "%s"', job.data.title);

    var canceled = false,
        globalTimeout = setTimeout(function () {
            canceled = true;
            done(new Error('Request took longer than ' + config.screenshot.globaltimeout + 'ms'));
        }, config.screenshot.globaltimeout);

    try {

        screenshotApi.screenshot(job.data.title, job.data.options, job, function (err, stream) {
            clearTimeout(globalTimeout);
            if (canceled) return;

            if (err) {

                done('' + err);

            } else {

                job.log('Cache Request ' + job.data.id);
                job.log('Done');

                done();

            }
        });
    } catch (err) {
        done('' + err);
    }
});
