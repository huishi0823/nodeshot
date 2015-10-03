var    fs = require('fs'),
    path = require('path'),

    winston = require('winston'),
    config = require('config'),

    kue = require('kue'),
    jobs = kue.createQueue();

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
    , renderDelay: 1000
    , phantomConfig: {
        'ignore-ssl-errors': 'true',
        'local-to-remote-url-access': 'true'
    }
};
var options2 = {
    screenSize: {
        width: 320
        , height: 3080
    }
    , shotSize: {
        width: 320
        , height: 'all'
    }
    , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
    , timeout: 10000
    , renderDelay: 2000
};
var options3 = {
    screenSize: {
        width: 1024
        , height: 3048
    }
    , shotSize: {
        width: 1024
        , height: 'all'
    }
    , errorIfStatusIsNot200: true
    , renderDelay: 2000
};
console.log('start');
// http://mp.weixin.qq.com/s?__biz=MzA5MzI0OTgwNQ==&mid=229729259&idx=1&sn=b481300abc797fffaac5efafaa2cfb52&3rd=MzA3MDU4NTYzMw==&scene=6#rd
webshot('http://mp.weixin.qq.com/s?__biz=MzA5MzI0OTgwNQ==&mid=229729259&idx=1&sn=b481300abc797fffaac5efafaa2cfb52&3rd=MzA3MDU4NTYzMw==&scene=6#rd', 'sogou.jpeg', options2, function(err) {
    winston.info('err "%s"', JSON.stringify(err));
});

winston.info('--- Starting end ---');
