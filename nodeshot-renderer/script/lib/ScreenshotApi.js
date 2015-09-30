var winston = require('winston');
var stream = require("stream");
var path = require('path');
var webshot = require('webshot');

var ScreenshotApi = function (config) {
    this.config = config;
    var cwd = process.cwd();
    this.cacheFolder = path.resolve(cwd, this.config.cache.folder);
};

/**
 * This function will make a screenshot.
 *  url : URL to screenshot
 *  options :
 *    width:  viewport-width
 *    height: viewport-height
 *    delay:  delay in ms
 *    format: ["png"]
 *    scrollbar: true/false
 *    page: true/false
 *
 *  callback : function ( error, imageBuffer ) { } 
 *
 */
ScreenshotApi.prototype.screenshot = function (url, options, job, callback) {
    var timeCapture = new Date();
    job.log('Capture');

    webshot(url, path.resolve(this.cacheFolder, job.data.id), options, function (err) {
        winston.info('err "%s"', JSON.stringify(err));
        job.log('Capturing took: %dms', (new Date() ) - timeCapture);
        job.progress(100, 100);
        callback(null, null);
    })

};

module.exports = ScreenshotApi;